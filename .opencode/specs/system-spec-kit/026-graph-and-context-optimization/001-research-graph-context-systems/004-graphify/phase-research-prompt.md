# $refine TIDD-EC Prompt: 004-graphify

## Role

Act as a specialist in two-pass codebase knowledge extraction (AST + LLM), graph community detection with Leiden, evidence-tagged knowledge representation using EXTRACTED / INFERRED / AMBIGUOUS relationships, and multimodal content extraction across code, markdown, PDFs, screenshots, diagrams, and images.

Operate with RICCE compliance throughout:
- **Role** is explicit and domain-specific.
- **Instructions** are procedural and ordered.
- **Context** is grounded in the target repo and external source.
- **Constraints** are explicit about scope, dependencies, and validation.
- **Examples** are concrete and file-anchored.

## Task

Research graphify's two-pass extraction architecture, Leiden community clustering, evidence tagging system, and PreToolUse hook integration to identify improvements for Code_Environment/Public's codebase navigation, particularly around graph-based context retrieval, evidence provenance, and multimodal artifact processing.

The goal is not a generic tool summary. The goal is an evidence-backed translation layer: determine what graphify does that Code_Environment/Public can reuse, adapt, or reject, and explain why.

## Context

### System Description

graphify is a Python Claude Code skill centered on a two-pass pipeline. The first pass is deterministic and AST-driven: `external/graphify/extract.py` parses code with tree-sitter, emits file, class, function, method, import, and rationale nodes, then adds cross-file inferred edges such as class-level `uses` relationships from import resolution. This structural pass is cheap, local, and cacheable.

The second pass is semantic and multimodal. `external/skills/graphify/skill.md` dispatches Claude subagents across non-code files and asks them to emit strict JSON fragments containing nodes, edges, hyperedges, confidence labels, and confidence scores. The semantic pass covers documents, papers, and images, including vision-based interpretation of screenshots, diagrams, and handwritten artifacts rather than plain OCR alone.

The merged result is assembled into a NetworkX graph, clustered with Leiden in `external/graphify/cluster.py`, analyzed for god nodes and cross-community surprises in `external/graphify/analyze.py`, rendered into `GRAPH_REPORT.md` via `external/graphify/report.py`, and exported as JSON / HTML / Obsidian artifacts via `external/graphify/export.py`. Incremental reruns are accelerated through SHA256 cache entries in `external/graphify/cache.py`, and `graphify claude install` wires Claude toward graph-first navigation through `CLAUDE.md` rules and a `PreToolUse` hook defined in `external/graphify/__main__.py`.

### Cross-Phase Awareness

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
|-------|--------|--------------|--------------|-----------------|
| 001 | Claude Optimization Settings (Reddit post) | Config audit + cache hooks | None | Reddit narrative |
| 002 | codesight | Zero-dep AST + framework detectors -> CLAUDE.md generation | 004 (AST extraction) | Focus framework parsers, MCP tools |
| 003 | contextador | MCP server + queryable structure + Mainframe shared cache | 004 (codebase structure) | Focus self-healing, shared cache, queries |
| 004 | graphify | Knowledge graph (NetworkX + Leiden + EXTRACTED/INFERRED) | 002, 003 | Focus graph viz, multimodal, evidence tagging |
| 005 | claudest | Plugin marketplace + claude-memory | None | Marketplace structure |

### What This Repo Already Has

Code_Environment/Public already has:
- Code Graph MCP for structural code queries and symbol relationships.
- CocoIndex for semantic retrieval over code.
- Spec Kit Memory for persistent context retrieval and memory search.

Code_Environment/Public does **not** currently have:
- a knowledge graph with community clustering,
- multimodal extraction for PDFs and images,
- evidence-tagged provenance for context edges,
- a graph-first hook that steers search away from raw-file grep when a graph exists.

Treat graphify as a candidate pattern library for those gaps, not as something to summarize in isolation.

## Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify` as the pre-approved spec folder. Skip Gate 3.
2. Read relevant `AGENTS.md` instructions first, then inspect the external repository. Treat `external/` as read-only.
3. Create and maintain Level 3 Spec Kit research documentation for this phase.
4. Use `@speckit` for markdown authoring if delegation is allowed in the execution environment; otherwise preserve the same Level 3 documentation standards manually.
5. Start with `external/ARCHITECTURE.md` to lock the end-to-end pipeline before diving into modules.
6. Follow this domain-specific reading order after architecture: `external/graphify/__main__.py` (installer / hook entry points), `external/graphify/extract.py` (AST pass), `external/skills/graphify/skill.md` (semantic / subagent pass), `external/graphify/build.py` plus merge logic in `external/skills/graphify/skill.md`, `external/graphify/cluster.py`, `external/graphify/analyze.py`, `external/graphify/report.py`, `external/graphify/export.py`, then `external/graphify/cache.py` and `external/graphify/detect.py`.
7. Verify claims against concrete files, not README marketing alone. Use README for top-level framing, then confirm with source.
8. Run `spec_kit:deep-research` using this exact topic:
   `Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/external and identify concrete improvements for Code_Environment/Public, especially around two-pass codebase knowledge extraction (AST + LLM), Leiden community detection, EXTRACTED/INFERRED/AMBIGUOUS evidence tagging, multimodal artifact processing, and PreToolUse hook patterns for steering Claude toward graph-based context.`
9. Save the main findings to `research/research.md` inside this phase folder. The write-up must contain at least five findings and every finding must cite graphify paths.
10. Use worked examples under `external/worked/` to validate the 71.5x token-reduction narrative and to inspect `GRAPH_REPORT.md` as a concrete output contract.
11. Explicitly compare graphify against this repo's existing Code Graph MCP and CocoIndex capabilities so the recommendation set avoids duplicating features already present.
12. Update the phase checklist to reflect the completed research steps and create `implementation-summary.md` for the phase after the research write-up is finished.
13. Validate the spec folder with:
    `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify" --strict`
14. Save memory at the end with:
    `cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify"`
15. Prioritize improvement proposals that can realistically strengthen graph-based context retrieval in Public without forcing a full graphify clone.

## Research Questions

1. Which languages and extensions are actually supported by the AST pass in `external/graphify/extract.py` and `external/graphify/detect.py`, and where does runtime coverage diverge between detection and extraction?
2. What exact entities and relationship types does the deterministic pass emit, including rationale nodes, method stubs, imports, calls, inheritance, and cross-file `uses` edges?
3. How does the semantic subagent prompt in `external/skills/graphify/skill.md` define extraction behavior for docs, papers, images, semantic similarity, and hyperedges?
4. How are AST and semantic outputs merged, deduplicated, cached, and promoted into final `graphify-out/graph.json`?
5. What are the actual Leiden parameter choices in `external/graphify/cluster.py`, and what is the rationale behind community splitting at 25% of graph size with a minimum split size of 10?
6. How does graphify represent evidence and confidence, including EXTRACTED / INFERRED / AMBIGUOUS semantics, default confidence scores, and downstream reporting in JSON and `GRAPH_REPORT.md`?
7. How does the multimodal pipeline work in practice for PDFs and images, including `pypdf` usage, image handling, and the role of Claude vision versus simple OCR?
8. What is the cache invalidation strategy across `external/graphify/cache.py` and `external/graphify/detect.py`, and how much of the system can rerun without invoking Claude again?
9. How does the PreToolUse hook in `external/graphify/__main__.py` fire, what message does it inject, and how might a similar hook reshape Public's search behavior?
10. How does `GRAPH_REPORT.md` identify god nodes, surprising connections, ambiguous edges, low-cohesion communities, and suggested questions, and which of those report patterns are reusable in Public?
11. How credible is the 71.5x token-reduction claim when cross-checked against `external/worked/karpathy-repos/`, README wording, and benchmark expectations?
12. Which graphify ideas should be adopted directly, adapted into existing MCP surfaces, or rejected because Public already covers the problem with Code Graph MCP or CocoIndex?

## Do's

- Trace one full extraction path end-to-end, ideally from a real code file through AST nodes, inferred edges, clustering, report output, and JSON export.
- Examine the Leiden clustering code directly and explain why oversized communities are split with a second pass.
- Study the EXTRACTED / INFERRED / AMBIGUOUS tagging logic across extractor prompts, JSON export, and report generation.
- Inspect the exact PreToolUse hook payload and explain how it nudges Claude toward graph-first navigation.
- Compare `GRAPH_REPORT.md` structure with the kinds of summaries Public already produces for structural or semantic retrieval.
- Use `external/worked/mixed-corpus/GRAPH_REPORT.md` or another worked output as a concrete artifact, not just the generator source.
- Separate "interesting graph idea" from "actually useful in Public's current architecture."

## Don'ts

- Don't focus on HTML viewer styling, sidebar cosmetics, or vis.js chrome.
- Don't conflate graphify's graph structure with codesight's text-context generation.
- Don't treat README claims as sufficient evidence when the source disagrees or is more precise.
- Don't dismiss the multimodal claim; PDF and image handling are part of the novelty being evaluated.
- Don't ignore cache invalidation and incremental behavior; that is central to graphify's practical usability.
- Don't propose replacing Code Graph MCP or CocoIndex unless the graph-based alternative clearly solves something they cannot.
- Don't spend the phase on packaging, release mechanics, or PyPI naming trivia.

## Examples

### Example Finding: Evidence-Tagged Provenance Contract

`external/graphify/export.py` enforces a downstream provenance contract by backfilling numeric `confidence_score` values when an edge only has a categorical confidence label: EXTRACTED -> `1.0`, INFERRED -> `0.5`, AMBIGUOUS -> `0.2`. That export behavior complements `external/graphify/report.py`, which reports the percentage mix of EXTRACTED / INFERRED / AMBIGUOUS edges and surfaces ambiguous edges in a dedicated review section.

A strong phase finding would read like this:

> graphify turns evidence labeling into a transport-level guarantee rather than a UI-only convention. `external/graphify/export.py` ensures every serialized edge has a numeric confidence score, while `external/graphify/report.py` preserves the human-audit view. Public could adapt this by adding provenance tiers and numeric confidence to graph/context retrieval payloads so downstream ranking can distinguish direct structural facts from inferred or review-worthy relationships instead of flattening them into a single relevance score.

That example is acceptable because it cites real source files, explains why the pattern matters, and translates the pattern into a concrete improvement for Public.

## Constraints

### Error Handling

- graphify requires Python 3.10+ and Claude Code; call out these dependencies when discussing portability.
- Note optional dependencies where relevant, especially `pypdf`, `html2text`, `watchdog`, `mcp`, `neo4j`, and `graspologic`.
- If a claim is only documented in README but not confirmed in source, label it as unverified rather than presenting it as fact.

### Scope Boundaries

**In scope**
- Extraction pipeline design
- AST coverage and cross-file inference
- Semantic subagent prompt design
- Leiden clustering and cohesion logic
- Evidence tagging and confidence handling
- Multimodal extraction
- Cache and incremental behavior
- PreToolUse hook and Claude steering patterns
- Output/report contracts relevant to Public

**Out of scope**
- PyPI packaging details
- HTML viewer chrome or aesthetic polish
- Marketing copy quality
- General OSS project maintenance unrelated to retrieval architecture

### Prioritization Framework

Use a standard impact-effort matrix:
- **High impact / low effort**: immediate candidate for Public adoption.
- **High impact / high effort**: strategic backlog item, only if gap is meaningful.
- **Low impact / low effort**: optional polish if it compounds another improvement.
- **Low impact / high effort**: reject unless it unlocks a blocked capability.

## Deliverables

- `research/research.md` with **at least 5 findings**, each citing specific `external/graphify/` or `external/skills/graphify/` paths.
- A comparison section that maps graphify capabilities against Public's existing Code Graph MCP and CocoIndex surfaces.
- Clear recommendations labeled **Adopt**, **Adapt**, or **Reject**.
- Updated checklist state for the phase.
- `implementation-summary.md` summarizing the research outcome after completion.

## Evaluation Criteria

- At least 5 concrete findings are documented.
- Every finding includes path-based evidence citations.
- Cross-phase overlap with 002 and 003 is acknowledged and handled without duplication.
- The write-up distinguishes structural extraction, semantic extraction, clustering, provenance, multimodal processing, and hook behavior instead of collapsing them together.
- Recommendations are specific to Code_Environment/Public rather than generic "graph databases are useful" claims.
- CLEAR score target: **>= 40 / 50**.
- RICCE completeness target: explicit Role, Instructions, Context, Constraints, and Examples all present and usable.

## Completion Bar

Completion is met only when the phase produces a validated research artifact that:
- documents at least five cited findings,
- addresses cross-phase overlap with 002 (AST extraction) and 003 (queryable context),
- translates graphify into concrete improvement options for Public,
- and leaves a persistent summary through `implementation-summary.md` plus memory save.

Do not mark the phase complete if the result is just a feature inventory. Completion requires evidence, comparison, prioritization, and a repo-specific recommendation set.
