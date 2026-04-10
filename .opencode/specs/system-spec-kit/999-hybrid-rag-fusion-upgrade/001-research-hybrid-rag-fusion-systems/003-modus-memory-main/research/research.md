---
title: "Deep Research Report: 003-modus-memory-main"
description: "20-iteration deep research synthesis"
---

# Deep Research Report: 003-modus-memory-main

Generated: 2026-04-10 23:02
Iterations: 20
Engine: Codex GPT-5.4 High (fast mode) + Copilot fallback

---

# $refine TIDD-EC Prompt: 003-modus-memory-main

## 2. Role

You are a research specialist in spaced repetition memory systems, BM25 search ranking, cross-referenced knowledge graphs, MCP-exposed local memory services, and local-first personal memory architectures. Work like a systems analyst who can trace implementation details from source code, separate README claims from verified mechanics, and translate Modus Memory's specific design choices into concrete improvements for `Code_Environment/Public`.

## 3. Task

Research Modus Memory's FSRS spaced repetition, BM25 search ranking, and cross-referencing patterns to identify practical, evidence-backed improvements for `Code_Environment/Public`'s memory search and retrieval, especially around memory decay and reinforcement, query expansion, knowledge linking, and plain-markdown memory storage patterns. Determine which ideas should be `adopt now`, `prototype later`, or `reject`.

## 4. Context

### 4.1 System Description

Modus Memory is a local memory server that stores data as plain markdown files, exposes MCP tools, uses BM25 with field boosting, layers a tiered query cache over lexical retrieval, applies FSRS-style spaced repetition with decay and reinforcement, builds cross-references from subjects, tags, and entities, and uses a librarian query expander to widen lexical recall without relying on vectors. The core attraction is a lightweight local binary, markdown-native persistence, and search behavior that mixes ranking, recency, and linked context while staying git-friendly and human-readable.

### 4.2 Cross-Phase Awareness Table

| Phase | System | Core Pattern | Overlap Risk | Differentiation |
| --- | --- | --- | --- | --- |
| 001 | Engram | MCP memory server (Go, SQLite+FTS5) | 003 (MCP memory) | Focus tool profiles, session lifecycle, topic keys |
| 002 | Mex | Markdown scaffold + drift detection | 003 (markdown storage) | Focus drift detection, scaffold structure |
| 003 | Modus Memory | FSRS spaced repetition + BM25 | 001 (FTS5), 004 (local memory) | Focus FSRS decay, cross-referencing, librarian expansion |
| 004 | OpenCode Mnemosyne | Hybrid search (FTS5 + vector) | 003 (local memory) | Focus vector search, plugin architecture |

### 4.3 What This Repo Already Has

`Code_Environment/Public` already has Spec Kit Memory with semantic and hybrid retrieval, markdown-backed memory artifacts, importance tiers, and an FSRS-based classification-decay layer in the MCP server. It does **not** currently mirror Modus Memory's end-to-end local vault server model, BM25 field-boosted lexical search with lightweight query caching, librarian-style synonym expansion for keyword retrieval, or simple subject/tag/entity adjacency maps that surface connected documents directly in result sets. Base the comparison on current code, not stale assumptions.

## 5. Instructions

1. Treat `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main` as the pre-approved phase folder. Skip Gate 3, keep all writes inside this phase folder, and treat everything under `external/` as read-only.
2. Start with the lexical search implementation: read `external/modus-memory-main/internal/index/bm25.go`, `external/modus-memory-main/internal/index/cache.go`, and `external/modus-memory-main/internal/librarian/search.go` before anything else. Trace tokenization, stemming, field weights, prefix matching, Jaccard cache reuse, and query expansion order.
3. After the ranking path, read `external/modus-memory-main/internal/index/indexer.go` if needed to confirm how documents are loaded into the search engine and how search results are assembled. Keep focus on ranking behavior, not generic indexing boilerplate.
4. Next, trace FSRS and memory-fact behavior by reading `external/modus-memory-main/internal/vault/facts.go` and `external/modus-memory-main/internal/index/facts.go`. Extract the exact stability, difficulty, confidence, floor, access-count, and reinforcement mechanics. Do not collapse these into a generic "TTL" description.
5. After FSRS, inspect cross-referencing by reading `external/modus-memory-main/internal/index/crossref.go`. Trace how subject, tag, and entity adjacency maps are built, what weighting is used for connected results, and what the system deliberately does **not** do because it avoids a full graph database.
6. Read `external/modus-memory-main/internal/markdown/parser.go` and `external/modus-memory-main/internal/markdown/writer.go` after the retrieval core. Study frontmatter parsing, body parsing, wiki-link extraction, markdown write conventions, and how plain-file storage shapes operability and portability.
7. Read MCP tool handlers next: `external/modus-memory-main/internal/mcp/vault.go` and `external/modus-memory-main/internal/mcp/memory.go`. Trace which tools are free vs. Pro, where librarian expansion is invoked, where cross-reference hints are appended, and where reinforcement happens automatically on search recall.
8. Read `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main/README.md` only after the source files above. Use it to validate claims about cached search speed, markdown-native persistence, binary size, MCP surface area, and the intended value proposition. Do not let README marketing copy override code evidence.
9. Compare Modus directly against current `Code_Environment/Public` memory behavior by reading `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`, and `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`. Be explicit about what this repo already does with FSRS-style decay and where Modus still differs materially.
10. Separate overlap cleanly across phases: avoid redoing `001` as a generic MCP memory-server study, avoid drifting into `002` markdown-scaffold and drift-detection patterns, and avoid reframing `003` as vector or plugin work owned by `004`. This phase owns BM25, lightweight caching, librarian expansion, FSRS reinforcement loops, and adjacency-map cross-references.
11. Before any deep-research run, ensure this phase folder contains the required Spec Kit docs for the research effort. If they are missing, note the gap and create or request them through the established spec workflow before claiming the phase is complete.
12. Validate the phase folder before deep research with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict
    ```
13. After validation passes, run deep research against this same phase folder using this exact topic:
    ```text
    Research the external repository at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/modus-memory-main and identify concrete improvements for Code_Environment/Public, especially around spaced repetition memory decay, BM25 search ranking, query expansion, cross-referencing, and plain-markdown memory storage patterns.
    ```
14. Save all outputs inside this phase folder, especially under `research/`. Every meaningful finding must cite exact file paths, explain what Modus does, why it matters here, whether to `adopt now`, `prototype later`, or `reject`, what Public subsystem it affects, and what migration, compatibility, or validation risk comes with it.
15. When research is complete, update `checklist.md`, create `implementation-summary.md`, and save memory with:
    ```bash
    cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public && node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main"
    ```

## 6. Research Questions

1. How exactly does Modus implement BM25 scoring across path, source, subject, title, tags, and body, and which field-weight choices are likely to transfer well to `Code_Environment/Public`?
2. How much of Modus's search speed story comes from BM25 itself versus the tiered cache, prefix fallback, tokenization rules, and result deduplication?
3. How does librarian query expansion work in practice: what expansions are requested, how many variants are kept, how are duplicates merged, and what failure fallbacks exist?
4. What is the precise FSRS model in `internal/vault/facts.go`: initial stability by importance, memory-type difficulty modifiers, decay floor behavior, reinforcement growth, and access-count tracking?
5. How does automatic reinforcement on `memory_search` differ from explicit reinforcement tools, and what recall event model would make sense for Spec Kit Memory?
6. How does Modus's simple in-memory fact search interact with markdown-backed fact files, and what can be learned from that split between vault-wide search and fact-specific retrieval?
7. How are subject, tag, and entity cross-references represented, weighted, and surfaced, and where does the adjacency-map approach outperform or underperform richer causal or graph-based linking?
8. How does the markdown parser and writer shape operability: frontmatter fields, wiki links, body handling, file naming, duplicate avoidance, and human-editability?
9. Compared with Spec Kit Memory's current hybrid and FSRS-aware retrieval stack, which Modus ideas are genuinely missing, which are partial overlaps, and which would be redundant?
10. Which Modus patterns would best improve query-time recall in `Code_Environment/Public`: BM25 field boosts, query caching, lexical expansion, connected-result hints, or simpler markdown-vault ergonomics?
11. How credible are the README performance claims given the code structure, and what should be treated as a benchmark candidate versus an unverified marketing number?

## 7. Do's

- Do trace the FSRS algorithm in detail, including stability, difficulty, retrievability, confidence floors, and reinforcement updates.
- Do inspect the exact BM25 field weights, tokenization behavior, prefix-match fallback, and query-cache thresholds.
- Do study librarian query expansion as a lexical-recall layer, not as a generic "AI enhancement" feature.
- Do inspect the cross-referencing data model based on subject, tag, and entity adjacency maps.
- Do examine the markdown file format, write conventions, and duplicate-handling logic because plain-file operability is a core design choice.
- Do compare Modus against the current Spec Kit Memory code so recommendations distinguish overlap from net-new value.
- Do benchmark or at least critically assess performance claims where the code gives enough evidence to reason about likely bottlenecks.

## 8. Don'ts

- Do not focus on installation, packaging, Homebrew distribution, or release mechanics.
- Do not confuse FSRS spaced repetition with simple TTL expiry, stale-after-N-days logic, or a one-shot archive rule.
- Do not ignore the markdown storage format; git-friendly, human-readable persistence is part of the architecture, not just implementation detail.
- Do not quote README claims as proven if the source code does not validate them.
- Do not recommend replacing `Code_Environment/Public`'s semantic or hybrid retrieval with BM25 alone unless the evidence clearly supports that tradeoff.
- Do not describe this repo as lacking all FSRS or decay logic when current code already contains an FSRS-based scheduler and classification-decay path.
- Do not blur Modus's lightweight adjacency maps with existing causal-memory or code-graph capabilities; compare them precisely.
- Do not edit anything under `external/` or outside this phase folder.

## 9. Examples

### Example A: FSRS reinforcement finding

`internal/vault/facts.go` reinforces memories automatically when `memory_search` returns them, increasing stability, slightly lowering difficulty, updating `last_accessed`, and incrementing `access_count`. A strong finding would explain how that recall loop differs from Spec Kit Memory's current FSRS-aware decay layer, identify where automatic reinforcement could improve real-world memory freshness in `Code_Environment/Public`, and classify the idea as `adopt now`, `prototype later`, or `reject`.

### Example B: Librarian expansion finding

`internal/librarian/search.go` expands a natural-language query into 3-5 keyword-oriented variants, preserves the original query, caps the variant set, and falls back cleanly if parsing fails. A strong finding would explain how that lexical expansion could complement rather than replace current semantic retrieval in `Code_Environment/Public`, what guardrails are needed to prevent noisy recall, and whether the pattern should be adopted directly or only prototyped.

## 10. Constraints

### 10.1 Error handling

- If a cited file is missing or diverges from README claims, say so plainly instead of guessing.
- If the code and README disagree, prefer code evidence and mark the README statement as unverified or outdated.
- If comparison assumptions about `Code_Environment/Public` prove false, correct them in the research rather than preserving stale framing.
- If a performance claim cannot be reproduced from static analysis, label it as a claim to benchmark later, not an established fact.

### 10.2 Scope

**IN SCOPE**

- BM25 scoring, tokenization, stemming, field boosting, prefix fallback, and cache behavior
- librarian query expansion and result merging
- FSRS decay, reinforcement, floors, stability, difficulty, retrievability, and recall triggers
- subject, tag, and entity cross-referencing
- markdown file structure, parser/writer behavior, and vault ergonomics
- MCP tool handlers that expose search, memory, reinforcement, decay, and connected-doc surfaces
- comparison against current Spec Kit Memory retrieval and decay capabilities

**OUT OF SCOPE**

- installer UX, packaging, licensing strategy, or release engineering
- generic MCP primers unrelated to Modus's implementation choices
- vector search or embedding architecture except when explicitly contrasting with phase `004`
- markdown drift detection patterns primarily owned by phase `002`
- broad memory-server taxonomy that does not produce implementation-level recommendations

### 10.3 Prioritization framework

Rank findings in this order: improvement to retrieval quality in `Code_Environment/Public`, complementarity with existing hybrid retrieval instead of duplication, operational simplicity of implementation, markdown-native maintainability, quality of evidence in source code, and clarity of differentiation from phases `001`, `002`, and `004`.

## 11. Deliverables

- `phase-research-prompt.md` present and tailored to `003-modus-memory-main`
- `research/research.md` as the canonical report with at least 5 evidence-backed findings
- explicit comparison to current Public retrieval, FSRS decay, and memory-linking behavior
- clear classification of each recommendation as `adopt now`, `prototype later`, or `reject`
- `implementation-summary.md` created at the end
- memory saved from this phase folder using `generate-context.js`

Minimum finding schema:

- finding title
- exact source evidence
- what Modus Memory does
- why it matters for `Code_Environment/Public`
- recommendation: `adopt now`, `prototype later`, or `reject`
- affected repo area
- migration, compatibility, or validation risk

## 12. Evaluation Criteria

- CLEAR target: `>= 40/50`
- RICCE compliance is visible in the prompt:
  - **Role** is specialized in spaced repetition, BM25, cross-references, and local-first memory systems
  - **Instructions** are ordered, concrete, and path-specific
  - **Context** is domain-specific, cross-phase aware, and honest about current repo overlap
  - **Constraints** limit scope and define evidence handling
  - **Examples** show what strong Modus-derived findings look like
- at least 5 findings are backed by code evidence rather than README-only assertions
- findings distinguish overlap with current Spec Kit Memory from genuinely new value
- overlap with `001` and `004` is explicitly addressed so recommendations are not duplicated or misplaced
- markdown storage, BM25 ranking, FSRS reinforcement, and cross-reference mechanics are all covered directly

## 13. Completion Bar

The phase is only complete when all of the following are true:

- the reading order started with ranking and search files, then FSRS, then cross-references, then MCP handlers, then README validation
- current `Code_Environment/Public` FSRS and retrieval behavior was compared using code, not assumptions
- the validation command passed on this exact phase folder
- `research/research.md` contains at least 5 evidence-backed findings
- each finding is tagged `adopt now`, `prototype later`, or `reject`
- `checklist.md` is updated with evidence and completion marks
- `implementation-summary.md` exists
- memory is saved successfully for `003-modus-memory-main`
- no edits were made outside the phase folder
- cross-phase overlap with `001` and `004` is explicitly resolved

OUTPUT FORMAT (MANDATORY - follow this exactly):
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

## Findings
For EACH finding:
### Finding N: [Title]
- **Source**: exact file path(s)
- **What it does**: technical description with code evidence
- **Why it matters for us**: concrete relevance
- **Recommendation**: adopt now / prototype later / reject / NEW FEATURE
- **Impact**: high / medium / low

## Sources Consulted
- [file paths examined]

## Assessment
- New information ratio: [0.0-1.0]
- Questions addressed: [list]
- Questions answered: [list]

## Reflection
- What worked: [approach that yielded results]
- What did not work: [approach that failed]

## Recommended Next Focus
[What to investigate next]
hook: SessionStart
hook: SessionStart Completed
hook: UserPromptSubmit
hook: UserPromptSubmit Completed
codex
I’m treating this as a source-first research pass on the pre-approved `003-modus-memory-main` phase folder. I’ll verify the phase folder state, inspect the Modus code in the required order, compare it against our current memory stack, and then return the iteration report in the exact format you requested.
exec
/bin/zsh -lc 'rg -n "modus-memory|hybrid-rag-fusion|FSRS|BM25|librarian" /Users/michelkerkmeester/.codex/memories/MEMORY.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
456:## Task 2: Rename packet `023-esm-module-compliance` to `023-hybrid-rag-fusion-refinement` and sync changelog references, outcome success
464:- 023-hybrid-rag-fusion-refinement, memory_index_scan, memory_quick_search, parentChain, B3-hybrid-rag-fusion-refinement, .opencode/changelog
514:- symptom: bulk replacement corrupts values (`B3-hybrid-rag-fusion-refinement`); cause: over-broad regex/string substitution; fix: run post-rewrite `rg` anomaly sweep and apply targeted literal repairs for parentChain/headings/JSON snippets [Task 2]
1113:scope: packet identity rewrites, slug/path sweeps, and follow-on phase packet creation in 022-hybrid-rag-fusion remediation work
1114:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion; reuse_rule=reuse for this epic’s packet lifecycle work only, and verify current live folder names before edits
1120:- rollout_summaries/2026-03-27T18-02-31-ZDov-update_020_pre_release_remediation_paths.md (cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/020-pre-release-remediation, rollout_path=/Users/michelkerkmeester/.codex/sessions/2026/03/27/rollout-2026-03-27T19-02-31-019d3076-47f7-7fd3-8952-dda85e3bdb43.jsonl, updated_at=2026-03-27T18:14:00+00:00, thread_id=019d3076-47f7-7fd3-8952-dda85e3bdb43)
1514:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion and linked docs; reuse_rule=reuse only within this spec family and re-check live numeric IDs each run
1545:- 022-hybrid-rag-fusion, PHASE_LINKS, AI_PROTOCOL, 33 tools, .gemini/agents
1762:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public; reuse_rule=reuse for Hydra work under `022-hybrid-rag-fusion/015-hydra-db-based-features`, but keep scope explicit when staging/committing
2008:scope: read-only multi-agent review findings and documentation-drift checks for `023-hybrid-rag-fusion-refinement`
2009:applies_to: cwd=/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public under .opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement; reuse_rule=reuse for forensic review of this packet family, but confirm current active slug/path before applying findings
2019:- 023-hybrid-rag-fusion-refinement, ultra-think, severity ordering, file+line evidence, CHK-060 duplicate, [Criteria TBD]
2023:- when user asked to “Let 3 ultra-think agents review all work done in .../023-hybrid-rag-fusion-refinement,” run multi-agent read-only review with severity-ranked findings and exact file+line evidence [Task 1]

exec
/bin/zsh -lc 'ls -la /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
total 40
drwxr-xr-x   6 michelkerkmeester  staff    192 Apr 10 21:18 .
drwxr-xr-x   7 michelkerkmeester  staff    224 Apr 10 21:07 ..
drwxr-xr-x  12 michelkerkmeester  staff    384 Apr 10 21:19 external
drwxr-xr-x   3 michelkerkmeester  staff     96 Apr 10 21:06 memory
-rw-r--r--   1 michelkerkmeester  staff  17644 Apr 10 21:06 phase-research-prompt.md
drwxr-xr-x   4 michelkerkmeester  staff    128 Apr 10 21:17 research

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 1588ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


codex
The phase folder exists and already has `phase-research-prompt.md`, `research/`, `memory/`, and `external/`. I’m waiting on strict validation now, then I’m moving through the Modus source in the required order so the report is based on implementation details rather than README claims.
exec
/bin/zsh -lc "sed -n '1,220p' /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.4.0.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`

<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### When to Use This Skill

Use this skill when:
- Deep investigation requiring multiple rounds of discovery
- Topic spans 3+ technical domains or sources
- Initial findings need progressive refinement
- Overnight or unattended research sessions
- Research where prior findings inform subsequent queries

### When NOT to Use

- Simple, single-question research (use direct codebase search or `/spec_kit:plan`)
- Known-solution documentation (use `/spec_kit:plan`)
- Implementation tasks (use `/spec_kit:implement`)
- Quick codebase searches (use `@context` or direct Grep/Glob)
- Fewer than 3 sources needed (single-pass research suffices)

### Keyword Triggers

`autoresearch`, `deep research`, `autonomous research`, `research loop`, `iterative research`, `multi-round research`, `deep investigation`, `comprehensive research`

For iterative code review and quality auditing, see `sk-deep-review`.

### Lifecycle Contract

Live lifecycle branches:
- `resume` — continue the active lineage
- `restart` — start a new generation with explicit parent linkage
- `fork` — branch from the current packet state
- `completed-continue` — reopen a completed lineage only after immutable synthesis snapshotting

---

<!-- /ANCHOR:when-to-use -->
<!-- ANCHOR:smart-routing -->
## 2. SMART ROUTING

### Resource Loading Levels

| Level | When to Load | Resources |
|-------|-------------|-----------|
| ALWAYS | Every skill invocation | Quick reference baseline |
| CONDITIONAL | If intent signals match | Loop protocol, convergence, state format |
| ON_DEMAND | Only on explicit request | Templates, detailed specifications |

### Smart Router Pseudocode

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/quick_reference.md"

INTENT_SIGNALS = {
    "LOOP_SETUP": {"weight": 4, "keywords": ["autoresearch", "deep research", "research loop", "autonomous research"]},
    "ITERATION": {"weight": 4, "keywords": ["iteration", "next round", "continue research", "research cycle"]},
    "CONVERGENCE": {"weight": 3, "keywords": ["convergence", "stop condition", "diminishing returns", "stuck"]},
    "STATE": {"weight": 3, "keywords": ["state file", "JSONL", "strategy", "resume", "auto-resume"]},
}

NOISY_SYNONYMS = {
    "LOOP_SETUP": {"run research": 2.0, "investigate deeply": 1.8, "overnight research": 1.5},
    "ITERATION": {"another pass": 1.5, "keep searching": 1.4, "dig deeper": 1.6},
    "CONVERGENCE": {"good enough": 1.4, "stop when": 1.5, "diminishing": 1.6},
    "STATE": {"pick up where": 1.5, "continue from": 1.4, "resume": 1.8},
}

RESOURCE_MAP = {
    "LOOP_SETUP": ["references/loop_protocol.md", "references/state_format.md", "assets/deep_research_config.json"],
    "ITERATION": ["references/loop_protocol.md", "references/convergence.md"],
    "CONVERGENCE": ["references/convergence.md"],
    "STATE": ["references/state_format.md", "assets/deep_research_strategy.md"],
}

LOADING_LEVELS = {
    "ALWAYS": [DEFAULT_RESOURCE],
    "ON_DEMAND_KEYWORDS": ["full protocol", "all templates", "complete reference"],
    "ON_DEMAND": ["references/loop_protocol.md", "references/state_format.md", "references/convergence.md"],
}
```

### Scoped Guard

```python
def _guard_in_skill():
    """Verify this skill is active before loading resources."""
    if not hasattr(_guard_in_skill, '_active'):
        _guard_in_skill._active = True
    return _guard_in_skill._active

def discover_markdown_resources(base_path: Path) -> list[str]:
    """Discover all .md files in the assets directory."""
    return sorted(str(p.relative_to(base_path)) for p in (base_path / "references").glob("*.md"))
```

### Phase Detection

Detect the current research phase from dispatch context to load appropriate resources:

| Phase | Signal | Resources to Load |
|-------|--------|-------------------|
| Init | No JSONL exists | Loop protocol, state format |
| Iteration | Dispatch context includes iteration number | Loop protocol, convergence |
| Stuck | Dispatch context includes "RECOVERY" | Convergence, loop protocol |
| Synthesis | Convergence triggered STOP | Quick reference |

---

<!-- /ANCHOR:smart-routing -->
<!-- ANCHOR:how-it-works -->
## 3. HOW IT WORKS

### Architecture: 3-Layer Integration

```
User invokes: /spec_kit:deep-research "topic"
                    |
                    v
    ┌─────────────────────────────────┐
    │  /spec_kit:deep-research command│  Layer 1: Command
    │  (YAML workflow + loop config)    │  Manages loop lifecycle
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │     YAML Loop Engine            │  Layer 2: Workflow
    │  - Init (config, strategy)       │  Dispatch, evaluate, decide
    │  - Loop (dispatch + converge)   │
    │  - Synthesize (final output)     │
    │  - Save (memory context)        │
    └──────────────┬──────────────────┘
                   |  dispatches per iteration
                   v
    ┌─────────────────────────────────┐
    │    @deep-research (LEAF agent)  │  Layer 3: Agent
    │  - Reads: state + strategy      │  Fresh context each time
    │  - Executes ONE research cycle  │
    │  - Writes: findings + state      │
    │  - Tools: WebFetch, Grep, etc.  │
    └──────────────┬──────────────────┘
                   |
                   v
    ┌─────────────────────────────────┐
    │        State Files (disk)       │  Externalized State
    │  deep-research-config.json       │  Persists across iterations
    │  deep-research-state.jsonl      │
    │  deep-research-strategy.md      │
    │  findings-registry.json          │
    │  research/iterations/iteration-NNN.md │
    │  research/research.md (workflow-owned │
    │  progressive synthesis)         │
    └─────────────────────────────────┘
```

### Core Innovation: Fresh Context Per Iteration

Each agent dispatch gets a fresh context window. State continuity comes from files, not memory. This solves context degradation in long research sessions.

Adapted from: karpathy/autoresearch (loop concept), AGR (fresh context "Ralph Loop"), pi-autoresearch (JSONL state), autoresearch-opencode (context injection).

### Data Flow

```
Init --> Create config.json, strategy.md, state.jsonl
  |
Loop --> Read state --> Check convergence --> Dispatch @deep-research
  |                                              |
  |                                              v
  |                                         Agent executes:
  |                                         1. Read state files
  |                                         2. Determine focus
  |                                         3. Research (3-5 actions)
  |                                         4. Write iteration-NNN.md
  |                                         5. Update strategy.md
  |                                         6. Append state.jsonl
  |                                              |
  +<--- Evaluate results <-----------------------+
  |
  +--- Continue? --> Yes: next iteration
  |                  No: exit loop
  v
Synthesize --> Compile final research/research.md
  |
Save --> generate-context.js --> verify memory artifact
```

### Key Concepts

| Concept | Description |
|---------|-------------|
| **Externalized state** | All research continuity via files, not agent memory |
| **Fresh context** | Each iteration gets a clean agent with no prior context |
| **Convergence** | Multi-signal detection: newInfoRatio, stuck count, questions answered |
| **Strategy file** | Reducer-synchronized research steering with machine-owned sections |
| **JSONL log** | Append-only structured log for lineage and iteration data |
| **Findings registry** | Reducer-owned open/resolved questions, key findings, and ruled-out directions |

exec
/bin/zsh -lc 'find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main -maxdepth 2 -type f | sort' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/.gitignore
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/MIGRATION_POST.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.mod
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.sum
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/memory/.gitkeep
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/phase-research-prompt.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/.gitkeep

codex
The phase folder is missing the usual spec docs at the top level so far; only `phase-research-prompt.md`, `research/`, `memory/`, and `external/` are present. I’m confirming that with strict validation and then continuing the architecture pass anyway, with the missing-docs gap called out explicitly in the report.
exec
/bin/zsh -lc "find /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external -maxdepth 3 \\( -type d -o -type f \\) | sort" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/.gitignore
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/LICENSE
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/MIGRATION_POST.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/architecture.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/comparison.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/demo.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/doctor.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/fsrs-decay.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/hero.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/assets/security.svg
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/entities.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.mod
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.sum
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/json.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/helpers.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/prs.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/trust.go
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go

exec
/bin/zsh -lc 'bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main" --strict' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
 succeeded in 1646ms:

───────────────────────────────────────────────────────────────

  Spec Folder Validation v2.0.0
───────────────────────────────────────────────────────────────


  Folder: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main
  Level:  1 (inferred)

───────────────────────────────────────────────────────────────


.opencode/skill/system-spec-kit/scripts/spec/validate.sh: line 406: cannot create temp file for here document: Operation not permitted

───────────────────────────────────────────────────────────────


  Summary: Errors: 0  Warnings: 0

  RESULT: PASSED


codex
I’ve confirmed the external repo layout: `cmd/modus-memory` is the CLI entry surface, and the implementation is split cleanly across `internal/index`, `internal/librarian`, `internal/markdown`, `internal/mcp`, and `internal/vault`. Next I’m reading the ranking path and the runtime entry points together so the architecture map stays grounded in real control flow.
exec
/bin/zsh -lc "wc -l \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go \\
  .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go \\
  .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts \\
  .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts \\
  .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     147 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go
     198 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go
     320 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go
     215 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go
     325 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go
     371 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go
     376 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go
     229 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go
     281 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go
     186 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go
      62 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go
     952 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go
      39 .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go
    1378 .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
      82 .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts
     503 .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts
    5664 total

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
// modus-memory is a standalone MCP memory server.
//
// A single Go binary that provides personal memory over the MCP protocol.
// BM25 full-text search, FSRS spaced-repetition decay, cross-referencing,
// librarian query expansion — all in ~6MB, zero dependencies. Completely free.
//
// Usage:
//
//	modus-memory                    — start MCP server on stdio
//	modus-memory --vault ~/notes    — use custom vault directory
//	modus-memory version            — print version
//	modus-memory health             — check vault health
//	modus-memory doctor              — diagnose vault problems (post-import validation)
//	modus-memory import khoj <file> — import from Khoj export (ZIP or JSON)
package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/GetModus/modus-memory/internal/index"
	mcpsrv "github.com/GetModus/modus-memory/internal/mcp"
	"github.com/GetModus/modus-memory/internal/vault"
)

const version = "0.3.0"

func main() {
	// Parse flags
	vaultDir := ""
	args := os.Args[1:]

	for i := 0; i < len(args); i++ {
		switch args[i] {
		case "--vault", "-v":
			if i+1 < len(args) {
				vaultDir = args[i+1]
				i++
			}
		case "version", "--version":
			fmt.Printf("modus-memory %s\n", version)
			os.Exit(0)
		case "health":
			vd := resolveVaultDir(vaultDir)
			runHealth(vd)
			os.Exit(0)
		case "doctor":
			vd := resolveVaultDir(vaultDir)
			runDoctor(vd)
			os.Exit(0)
		case "import":
			vd := resolveVaultDir(vaultDir)
			runImport(vd, args[i+1:])
			os.Exit(0)
		}
	}

	vaultDir = resolveVaultDir(vaultDir)

	// Ensure vault directory exists
	if err := os.MkdirAll(vaultDir, 0755); err != nil {
		fmt.Fprintf(os.Stderr, "Cannot create vault directory %s: %v\n", vaultDir, err)
		os.Exit(1)
	}

	// Ensure core subdirectories exist
	for _, sub := range []string{"memory/facts", "brain", "atlas"} {
		os.MkdirAll(filepath.Join(vaultDir, sub), 0755)
	}

	// Redirect log output to stderr (stdout is MCP protocol)
	log.SetOutput(os.Stderr)
	log.SetPrefix("[modus-memory] ")

	// Build search index
	idx, err := index.Build(vaultDir, "")
	if err != nil {
		log.Printf("Warning: index build failed: %v (starting with empty index)", err)
	}

	// Create vault
	v := vault.New(vaultDir, idx)

	// Create MCP server with all 11 memory tools
	srv := mcpsrv.NewServer("modus-memory", version)
	mcpsrv.RegisterMemoryTools(srv, v)

	log.Printf("modus-memory %s — vault: %s, %d docs indexed", version, vaultDir, idx.DocCount())

	// Run MCP stdio loop
	srv.Run()
}

// resolveVaultDir determines the vault directory from flag, env, or default.
func resolveVaultDir(flagDir string) string {
	if flagDir != "" {
		return flagDir
	}
	if envDir := os.Getenv("MODUS_VAULT_DIR"); envDir != "" {
		return envDir
	}
	home, _ := os.UserHomeDir()
	return filepath.Join(home, "modus", "vault")
}

// runImport dispatches to the appropriate import converter.
func runImport(vaultDir string, args []string) {
	if len(args) < 2 {
		fmt.Fprintln(os.Stderr, "Usage: modus-memory import <format> <file>")
		fmt.Fprintln(os.Stderr, "")
		fmt.Fprintln(os.Stderr, "Formats:")
		fmt.Fprintln(os.Stderr, "  khoj    — Khoj AI export (ZIP or JSON)")
		os.Exit(1)
	}

	format := args[0]
	file := args[1]

	switch format {
	case "khoj":
		runImportKhoj(file, vaultDir)
	default:
		fmt.Fprintf(os.Stderr, "Unknown import format: %s\n", format)
		os.Exit(1)
	}
}

// runHealth prints vault statistics.
func runHealth(vaultDir string) {
	idx, err := index.Build(vaultDir, "")
	if err != nil {
		fmt.Printf("Vault: %s\n", vaultDir)
		fmt.Printf("Status: ERROR — %v\n", err)
		return
	}

	totalFacts, activeFacts := idx.FactCount()
	subjects, tags, entities := idx.CrossRefStats()

	fmt.Printf("modus-memory %s\n", version)
	fmt.Printf("Vault: %s\n", vaultDir)
	fmt.Printf("Documents: %d\n", idx.DocCount())
	fmt.Printf("Facts: %d total, %d active\n", totalFacts, activeFacts)
	fmt.Printf("Cross-refs: %d subjects, %d tags, %d entities\n", subjects, tags, entities)
}

exec
/bin/zsh -lc "sed -n '1,240p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
package mcp

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
)

// JSON-RPC 2.0 types for MCP protocol

type Request struct {
	JSONRPC string          `json:"jsonrpc"`
	ID      interface{}     `json:"id,omitempty"`
	Method  string          `json:"method"`
	Params  json.RawMessage `json:"params,omitempty"`
}

type Response struct {
	JSONRPC string      `json:"jsonrpc"`
	ID      interface{} `json:"id,omitempty"`
	Result  interface{} `json:"result,omitempty"`
	Error   *RPCError   `json:"error,omitempty"`
}

type RPCError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

type ToolDef struct {
	Name        string      `json:"name"`
	Description string      `json:"description"`
	InputSchema interface{} `json:"inputSchema"`
}

type TextContent struct {
	Type string `json:"type"`
	Text string `json:"text"`
}

type ToolHandler func(args map[string]interface{}) (string, error)

// Server is a minimal MCP server over stdio.
type Server struct {
	name     string
	version  string
	tools    map[string]ToolDef
	handlers map[string]ToolHandler
}

func NewServer(name, version string) *Server {
	return &Server{
		name:     name,
		version:  version,
		tools:    make(map[string]ToolDef),
		handlers: make(map[string]ToolHandler),
	}
}

func (s *Server) AddTool(name, description string, schema interface{}, handler ToolHandler) {
	s.tools[name] = ToolDef{
		Name:        name,
		Description: description,
		InputSchema: schema,
	}
	s.handlers[name] = handler
}

// CallTool invokes a registered tool handler by name. Used by the HTTP server
// to reuse the same business logic without duplicating it.
func (s *Server) CallTool(name string, args map[string]interface{}) (string, error) {
	handler, ok := s.handlers[name]
	if !ok {
		return "", fmt.Errorf("unknown tool: %s", name)
	}
	return handler(args)
}

// HasTool checks if a tool is registered.
func (s *Server) HasTool(name string) bool {
	_, ok := s.handlers[name]
	return ok
}

// Run starts the MCP server on stdio.
func (s *Server) Run() {
	reader := bufio.NewReader(os.Stdin)
	writer := os.Stdout

	for {
		line, err := reader.ReadBytes('\n')
		if err != nil {
			if err == io.EOF {
				return
			}
			log.Printf("Read error: %v", err)
			return
		}

		var req Request
		if err := json.Unmarshal(line, &req); err != nil {
			continue
		}

		resp := s.handle(req)
		data, _ := json.Marshal(resp)
		fmt.Fprintf(writer, "%s\n", data)
	}
}

func (s *Server) handle(req Request) Response {
	switch req.Method {
	case "initialize":
		return Response{
			JSONRPC: "2.0",
			ID:      req.ID,
			Result: map[string]interface{}{
				"protocolVersion": "2024-11-05",
				"capabilities": map[string]interface{}{
					"tools": map[string]interface{}{},
				},
				"serverInfo": map[string]interface{}{
					"name":    s.name,
					"version": s.version,
				},
			},
		}

	case "notifications/initialized":
		// No response needed for notifications
		return Response{JSONRPC: "2.0"}

	case "tools/list":
		var toolList []ToolDef
		for _, t := range s.tools {
			toolList = append(toolList, t)
		}
		return Response{
			JSONRPC: "2.0",
			ID:      req.ID,
			Result: map[string]interface{}{
				"tools": toolList,
			},
		}

	case "tools/call":
		var params struct {
			Name      string                 `json:"name"`
			Arguments map[string]interface{} `json:"arguments"`
		}
		if err := json.Unmarshal(req.Params, &params); err != nil {
			return Response{
				JSONRPC: "2.0",
				ID:      req.ID,
				Error:   &RPCError{Code: -32602, Message: "Invalid params"},
			}
		}

		handler, ok := s.handlers[params.Name]
		if !ok {
			return Response{
				JSONRPC: "2.0",
				ID:      req.ID,
				Error:   &RPCError{Code: -32601, Message: fmt.Sprintf("Unknown tool: %s", params.Name)},
			}
		}

		result, err := handler(params.Arguments)
		if err != nil {
			return Response{
				JSONRPC: "2.0",
				ID:      req.ID,
				Result: map[string]interface{}{
					"content": []TextContent{{Type: "text", Text: fmt.Sprintf("Error: %v", err)}},
					"isError": true,
				},
			}
		}

		return Response{
			JSONRPC: "2.0",
			ID:      req.ID,
			Result: map[string]interface{}{
				"content": []TextContent{{Type: "text", Text: result}},
			},
		}

	default:
		return Response{
			JSONRPC: "2.0",
			ID:      req.ID,
			Error:   &RPCError{Code: -32601, Message: fmt.Sprintf("Unknown method: %s", req.Method)},
		}
	}
}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package index
     2	
     3	import (
     4		"math"
     5		"sort"
     6		"strings"
     7		"unicode"
     8	)
     9	
    10	// BM25 parameters — standard values, tuned for document search.
    11	const (
    12		bm25K1 = 1.2  // term saturation
    13		bm25B  = 0.75 // length normalization
    14	)
    15	
    16	// Field weights — title matches are more valuable than body matches.
    17	// Validated by ByteRover's benchmark: title 3x, path 1.5x achieves 96% LoCoMo.
    18	var fieldWeights = [6]float64{
    19		1.5, // path
    20		1.0, // source
    21		2.0, // subject
    22		3.0, // title
    23		1.5, // tags
    24		1.0, // body
    25	}
    26	
    27	// fieldIndex maps field names to positions.
    28	const (
    29		fieldPath    = 0
    30		fieldSource  = 1
    31		fieldSubject = 2
    32		fieldTitle   = 3
    33		fieldTags    = 4
    34		fieldBody    = 5
    35	)
    36	
    37	// posting records a term occurrence in a specific document field.
    38	type posting struct {
    39		docID int
    40		field int
    41		tf    int // term frequency in this field
    42	}
    43	
    44	// bm25Engine holds the inverted index and document stats for BM25 scoring.
    45	type bm25Engine struct {
    46		postings map[string][]posting // term → postings
    47		docLens  [][6]int             // per-document field lengths (in tokens)
    48		avgLens  [6]float64           // average field lengths across corpus
    49		numDocs  int
    50	}
    51	
    52	// newBM25Engine builds an inverted index from the loaded documents.
    53	func newBM25Engine(docs []document) *bm25Engine {
    54		e := &bm25Engine{
    55			postings: make(map[string][]posting),
    56			docLens:  make([][6]int, len(docs)),
    57			numDocs:  len(docs),
    58		}
    59	
    60		var totalLens [6]int64
    61	
    62		for docID, doc := range docs {
    63			fields := [6]string{
    64				doc.Path,
    65				doc.Source,
    66				doc.Subject,
    67				doc.Title,
    68				doc.Tags,
    69				doc.Body,
    70			}
    71	
    72			for fieldID, text := range fields {
    73				tokens := tokenize(text)
    74				e.docLens[docID][fieldID] = len(tokens)
    75				totalLens[fieldID] += int64(len(tokens))
    76	
    77				// Count term frequencies
    78				tf := make(map[string]int)
    79				for _, t := range tokens {
    80					tf[t]++
    81				}
    82	
    83				for term, count := range tf {
    84					e.postings[term] = append(e.postings[term], posting{
    85						docID: docID,
    86						field: fieldID,
    87						tf:    count,
    88					})
    89				}
    90			}
    91		}
    92	
    93		// Compute average field lengths
    94		for i := 0; i < 6; i++ {
    95			if e.numDocs > 0 {
    96				e.avgLens[i] = float64(totalLens[i]) / float64(e.numDocs)
    97			}
    98		}
    99	
   100		return e
   101	}
   102	
   103	// search scores all documents against the query and returns top results.
   104	func (e *bm25Engine) search(query string, limit int) []scoredDoc {
   105		queryTerms := tokenize(query)
   106		if len(queryTerms) == 0 {
   107			return nil
   108		}
   109	
   110		// Accumulate scores per document
   111		scores := make(map[int]float64)
   112	
   113		for _, term := range queryTerms {
   114			posts, ok := e.postings[term]
   115			if !ok {
   116				// Try prefix match for partial terms
   117				posts = e.prefixMatch(term)
   118				if len(posts) == 0 {
   119					continue
   120				}
   121			}
   122	
   123			// IDF: log((N - df + 0.5) / (df + 0.5) + 1)
   124			df := e.docFreq(term)
   125			idf := math.Log((float64(e.numDocs)-float64(df)+0.5)/(float64(df)+0.5) + 1.0)
   126	
   127			for _, p := range posts {
   128				// BM25 per-field score with field weight
   129				dl := float64(e.docLens[p.docID][p.field])
   130				avgDl := e.avgLens[p.field]
   131				if avgDl == 0 {
   132					avgDl = 1
   133				}
   134	
   135				tf := float64(p.tf)
   136				numerator := tf * (bm25K1 + 1)
   137				denominator := tf + bm25K1*(1-bm25B+bm25B*dl/avgDl)
   138	
   139				score := idf * (numerator / denominator) * fieldWeights[p.field]
   140				scores[p.docID] += score
   141			}
   142		}
   143	
   144		// Sort by score descending
   145		var results []scoredDoc
   146		for docID, score := range scores {
   147			results = append(results, scoredDoc{docID: docID, score: score})
   148		}
   149		sort.Slice(results, func(i, j int) bool {
   150			return results[i].score > results[j].score
   151		})
   152	
   153		if limit > 0 && len(results) > limit {
   154			results = results[:limit]
   155		}
   156		return results
   157	}
   158	
   159	// docFreq returns the number of documents containing a term (across any field).
   160	func (e *bm25Engine) docFreq(term string) int {
   161		posts := e.postings[term]
   162		seen := make(map[int]bool)
   163		for _, p := range posts {
   164			seen[p.docID] = true
   165		}
   166		return len(seen)
   167	}
   168	
   169	// prefixMatch finds postings for terms starting with the given prefix.
   170	// Only used for short queries where exact match fails.
   171	func (e *bm25Engine) prefixMatch(prefix string) []posting {
   172		if len(prefix) < 3 {
   173			return nil
   174		}
   175		var results []posting
   176		for term, posts := range e.postings {
   177			if strings.HasPrefix(term, prefix) {
   178				results = append(results, posts...)
   179			}
   180		}
   181		return results
   182	}
   183	
   184	type scoredDoc struct {
   185		docID int
   186		score float64
   187	}
   188	
   189	// tokenize splits text into lowercase tokens, removing punctuation.
   190	// Uses Porter-like stemming for common suffixes.
   191	func tokenize(text string) []string {
   192		text = strings.ToLower(text)
   193		var tokens []string
   194		var current strings.Builder
   195	
   196		for _, r := range text {
   197			if unicode.IsLetter(r) || unicode.IsDigit(r) {
   198				current.WriteRune(r)
   199			} else {
   200				if current.Len() > 0 {
   201					token := current.String()
   202					if len(token) >= 2 { // skip single-char tokens
   203						tokens = append(tokens, stem(token))
   204					}
   205					current.Reset()
   206				}
   207			}
   208		}
   209		if current.Len() > 0 {
   210			token := current.String()
   211			if len(token) >= 2 {
   212				tokens = append(tokens, stem(token))
   213			}
   214		}
   215	
   216		return tokens
   217	}
   218	
   219	// stem applies minimal suffix stripping. Not a full Porter stemmer —
   220	// just enough to match plurals and common verb forms.

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package index
     2	
     3	import (
     4		"hash/fnv"
     5		"sort"
     6		"strings"
     7		"sync"
     8	)
     9	
    10	// QueryCache implements tiered caching for search results.
    11	// Tier 0: exact query hash match (0ms)
    12	// Tier 1: fuzzy match via Jaccard similarity >= threshold (~1ms)
    13	// Inspired by ByteRover's ablation study showing cache tiers drive 29.4pp accuracy gain.
    14	const (
    15		cacheMaxEntries      = 256
    16		cacheJaccardThreshold = 0.6
    17	)
    18	
    19	type cacheEntry struct {
    20		query   string
    21		terms   map[string]bool // tokenized query terms for Jaccard comparison
    22		results []SearchResult
    23		hits    int // access count for LRU
    24	}
    25	
    26	// queryCache stores recent query→results pairs with exact and fuzzy matching.
    27	type queryCache struct {
    28		mu      sync.RWMutex
    29		entries []cacheEntry
    30		counter int // global access counter for LRU
    31	}
    32	
    33	func newQueryCache() *queryCache {
    34		return &queryCache{
    35			entries: make([]cacheEntry, 0, cacheMaxEntries),
    36		}
    37	}
    38	
    39	// get attempts to find cached results for a query.
    40	// Returns results and true if found (tier 0 or 1), nil and false otherwise.
    41	func (c *queryCache) get(query string) ([]SearchResult, bool) {
    42		c.mu.RLock()
    43		defer c.mu.RUnlock()
    44	
    45		if len(c.entries) == 0 {
    46			return nil, false
    47		}
    48	
    49		// Tier 0: exact hash match
    50		h := hashQuery(query)
    51		for i := range c.entries {
    52			if hashQuery(c.entries[i].query) == h && c.entries[i].query == query {
    53				c.entries[i].hits = c.counter
    54				return c.entries[i].results, true
    55			}
    56		}
    57	
    58		// Tier 1: fuzzy match via Jaccard similarity
    59		queryTerms := termSet(query)
    60		if len(queryTerms) == 0 {
    61			return nil, false
    62		}
    63	
    64		var bestIdx int
    65		var bestSim float64
    66	
    67		for i := range c.entries {
    68			sim := jaccard(queryTerms, c.entries[i].terms)
    69			if sim > bestSim {
    70				bestSim = sim
    71				bestIdx = i
    72			}
    73		}
    74	
    75		if bestSim >= cacheJaccardThreshold {
    76			c.entries[bestIdx].hits = c.counter
    77			return c.entries[bestIdx].results, true
    78		}
    79	
    80		return nil, false
    81	}
    82	
    83	// put stores query results in the cache, evicting the least recently used entry if full.
    84	func (c *queryCache) put(query string, results []SearchResult) {
    85		c.mu.Lock()
    86		defer c.mu.Unlock()
    87	
    88		c.counter++
    89	
    90		// Check if query already cached — update results
    91		for i := range c.entries {
    92			if c.entries[i].query == query {
    93				c.entries[i].results = results
    94				c.entries[i].hits = c.counter
    95				return
    96			}
    97		}
    98	
    99		entry := cacheEntry{
   100			query:   query,
   101			terms:   termSet(query),
   102			results: results,
   103			hits:    c.counter,
   104		}
   105	
   106		if len(c.entries) >= cacheMaxEntries {
   107			// Evict LRU entry
   108			minIdx := 0
   109			minHits := c.entries[0].hits
   110			for i := 1; i < len(c.entries); i++ {
   111				if c.entries[i].hits < minHits {
   112					minHits = c.entries[i].hits
   113					minIdx = i
   114				}
   115			}
   116			c.entries[minIdx] = entry
   117		} else {
   118			c.entries = append(c.entries, entry)
   119		}
   120	}
   121	
   122	func hashQuery(q string) uint64 {
   123		h := fnv.New64a()
   124		h.Write([]byte(strings.ToLower(strings.TrimSpace(q))))
   125		return h.Sum64()
   126	}
   127	
   128	func termSet(query string) map[string]bool {
   129		terms := tokenize(query)
   130		set := make(map[string]bool, len(terms))
   131		for _, t := range terms {
   132			set[t] = true
   133		}
   134		return set
   135	}
   136	
   137	// jaccard computes the Jaccard similarity between two term sets.
   138	func jaccard(a, b map[string]bool) float64 {
   139		if len(a) == 0 && len(b) == 0 {
   140			return 0
   141		}
   142	
   143		intersection := 0
   144		for term := range a {
   145			if b[term] {
   146				intersection++
   147			}
   148		}
   149	
   150		union := len(a) + len(b) - intersection
   151		if union == 0 {
   152			return 0
   153		}
   154	
   155		return float64(intersection) / float64(union)
   156	}
   157	
   158	// sortByScore sorts results by score normalization: s / (1 + s) → [0, 1).
   159	// Higher is better. ByteRover uses this normalization for consistent thresholding.
   160	func normalizeScore(score float64) float64 {
   161		if score <= 0 {
   162			return 0
   163		}
   164		return score / (1.0 + score)
   165	}
   166	
   167	// filterOOD performs out-of-domain detection.
   168	// If significant query terms (>= 4 chars) are unmatched and top score
   169	// is below threshold, returns true (query is out of domain).
   170	func filterOOD(query string, results []scoredDoc, threshold float64) bool {
   171		if len(results) == 0 {
   172			return true
   173		}
   174	
   175		topNormalized := normalizeScore(results[0].score)
   176		if topNormalized >= threshold {
   177			return false
   178		}
   179	
   180		// Check if significant terms are all unmatched
   181		terms := tokenize(query)
   182		significant := 0
   183		for _, t := range terms {
   184			if len(t) >= 4 {
   185				significant++
   186			}
   187		}
   188	
   189		// If most terms are short (< 4 chars), don't filter
   190		if significant == 0 {
   191			return false
   192		}
   193	
   194		return topNormalized < threshold
   195	}
   196	
   197	// deduplicateResults removes duplicate paths, keeping the highest scored.
   198	func deduplicateResults(results []SearchResult) []SearchResult {
   199		seen := make(map[string]int) // path → index in output
   200		var deduped []SearchResult
   201	
   202		// Results should already be sorted by rank (best first)
   203		for _, r := range results {
   204			if _, exists := seen[r.Path]; !exists {
   205				seen[r.Path] = len(deduped)
   206				deduped = append(deduped, r)
   207			}
   208		}
   209	
   210		sort.Slice(deduped, func(i, j int) bool {
   211			return deduped[i].Rank > deduped[j].Rank
   212		})
   213	
   214		return deduped
   215	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package librarian
     2	
     3	import (
     4		"encoding/json"
     5		"fmt"
     6		"log"
     7		"strings"
     8	)
     9	
    10	// ExpandQuery asks the librarian to produce search-optimized terms for a query.
    11	// This replaces the embedding channel — instead of computing vector similarity,
    12	// we ask Gemma to bridge the semantic gap at query time.
    13	//
    14	// Example: "what's our fastest model" → "speed tok/s benchmark performance Gemma GLM"
    15	func ExpandQuery(query string) []string {
    16		system := `You are a search query expander for a developer's personal knowledge base.
    17	Given a natural language query, produce 3-5 alternative search phrases that would match
    18	relevant documents using keyword search (FTS5). Include:
    19	- Synonyms and related terms
    20	- Technical equivalents
    21	- Specific names/tools the user likely means
    22	- Both formal and informal phrasings
    23	
    24	Return ONLY a JSON array of strings. No explanation.
    25	Example: ["original query terms", "synonym phrase", "technical equivalent", "specific tool names"]`
    26	
    27		user := fmt.Sprintf("Expand this query for keyword search: %q", query)
    28	
    29		response := Call(system, user, 150)
    30		if response == "" {
    31			return []string{query}
    32		}
    33	
    34		var expansions []string
    35		if err := ParseJSON(response, &expansions); err != nil {
    36			log.Printf("librarian/search: expansion parse failed: %v", err)
    37			return []string{query}
    38		}
    39	
    40		// Always include the original query
    41		result := []string{query}
    42		for _, exp := range expansions {
    43			exp = strings.TrimSpace(exp)
    44			if exp != "" && exp != query {
    45				result = append(result, exp)
    46			}
    47		}
    48	
    49		if len(result) > 6 {
    50			result = result[:6]
    51		}
    52		return result
    53	}
    54	
    55	// RankResults asks the librarian to score and rank search results by relevance.
    56	// Takes the original query and a set of result snippets, returns ranked indices.
    57	func RankResults(query string, results []ResultSnippet, topN int) []int {
    58		if len(results) == 0 {
    59			return nil
    60		}
    61		if len(results) <= topN {
    62			indices := make([]int, len(results))
    63			for i := range indices {
    64				indices[i] = i
    65			}
    66			return indices
    67		}
    68	
    69		var sb strings.Builder
    70		for i, r := range results {
    71			sb.WriteString(fmt.Sprintf("%d. [%s] %s\n   %s\n\n",
    72				i+1, r.Source, r.Title, truncate(r.Snippet, 200)))
    73		}
    74	
    75		system := `You rank search results for relevance. Given a query and numbered results,
    76	return a JSON array of the most relevant result numbers (1-indexed), ordered by relevance.
    77	Return ONLY the JSON array of integers. No explanation.`
    78	
    79		user := fmt.Sprintf("Query: %q\nReturn the top %d most relevant results:\n\n%s",
    80			query, topN, sb.String())
    81	
    82		response := Call(system, user, 100)
    83		if response == "" {
    84			return defaultIndices(topN, len(results))
    85		}
    86	
    87		var ranked []int
    88		if err := ParseJSON(response, &ranked); err != nil {
    89			log.Printf("librarian/search: rank parse failed: %v", err)
    90			return defaultIndices(topN, len(results))
    91		}
    92	
    93		// Convert 1-indexed to 0-indexed, validate
    94		var valid []int
    95		seen := map[int]bool{}
    96		for _, r := range ranked {
    97			idx := r - 1
    98			if idx >= 0 && idx < len(results) && !seen[idx] {
    99				valid = append(valid, idx)
   100				seen[idx] = true
   101			}
   102			if len(valid) >= topN {
   103				break
   104			}
   105		}
   106		return valid
   107	}
   108	
   109	// ResultSnippet is a lightweight search result for ranking.
   110	type ResultSnippet struct {
   111		Source  string
   112		Title   string
   113		Snippet string
   114	}
   115	
   116	// SummarizeForCloud condenses search results into a token-efficient summary
   117	// for cloud models. Instead of dumping raw results, the librarian produces
   118	// a curated briefing.
   119	func SummarizeForCloud(query string, results []ResultSnippet) string {
   120		if len(results) == 0 {
   121			return "No results found."
   122		}
   123	
   124		var sb strings.Builder
   125		for i, r := range results {
   126			sb.WriteString(fmt.Sprintf("%d. [%s] %s: %s\n",
   127				i+1, r.Source, r.Title, truncate(r.Snippet, 300)))
   128		}
   129	
   130		system := `You are a librarian summarizing search results for an AI assistant.
   131	Produce a concise, information-dense summary that answers the query directly.
   132	Include specific facts, numbers, and references. Cite result numbers in brackets.
   133	Keep under 300 words. Do not add opinions or speculation.`
   134	
   135		user := fmt.Sprintf("Query: %q\n\nResults:\n%s\n\nSummarize the key findings.",
   136			query, sb.String())
   137	
   138		return Call(system, user, 400)
   139	}
   140	
   141	// ExtractFacts asks the librarian to extract structured facts from text.
   142	func ExtractFacts(text string) []ExtractedFact {
   143		system := `Extract factual claims from the text as structured data.
   144	Return a JSON array: [{"subject": "X", "predicate": "Y", "value": "Z"}]
   145	Only extract concrete, verifiable facts. No opinions or speculation.
   146	Keep subjects and predicates consistent and reusable.`
   147	
   148		user := fmt.Sprintf("Extract facts from:\n\n%s", truncate(text, 2000))
   149	
   150		response := Call(system, user, 500)
   151		if response == "" {
   152			return nil
   153		}
   154	
   155		var facts []ExtractedFact
   156		if err := ParseJSON(response, &facts); err != nil {
   157			log.Printf("librarian/search: fact parse failed: %v", err)
   158			return nil
   159		}
   160		return facts
   161	}
   162	
   163	// ExtractedFact is a subject/predicate/value triple.
   164	type ExtractedFact struct {
   165		Subject   string `json:"subject"`
   166		Predicate string `json:"predicate"`
   167		Value     string `json:"value"`
   168	}
   169	
   170	func defaultIndices(n, max int) []int {
   171		if n > max {
   172			n = max
   173		}
   174		indices := make([]int, n)
   175		for i := range indices {
   176			indices[i] = i
   177		}
   178		return indices
   179	}
   180	
   181	// ClassifyIntent asks the librarian to classify a query for routing.
   182	// Returns one of the 8 query classes used by the agentic search system.
   183	func ClassifyIntent(query string) string {
   184		system := `Classify the user's query intent. Return ONLY one of these exact labels:
   185	- exact_lookup: asking for a specific fact (what is X, how many, which)
   186	- entity_topic: asking about a specific entity or topic
   187	- temporal: asking about time, history, changes, sequence
   188	- multi_hop: asking about relationships, chains, why/how connections
   189	- abstraction: asking for overview, comparison, big picture
   190	- preference: asking about preferences, beliefs, philosophy
   191	- update_check: checking current status or progress
   192	- no_retrieval: greeting, command, or not a knowledge query
   193	
   194	Return ONLY the label, nothing else.`
   195	
   196		response := Call(system, query, 20)
   197		response = strings.TrimSpace(strings.ToLower(response))
   198	
   199		valid := map[string]bool{
   200			"exact_lookup": true, "entity_topic": true, "temporal": true,
   201			"multi_hop": true, "abstraction": true, "preference": true,
   202			"update_check": true, "no_retrieval": true,
   203		}
   204		if valid[response] {
   205			return response
   206		}
   207		return "entity_topic"
   208	}
   209	
   210	// Briefing produces an end-of-cycle intelligence brief.
   211	type Briefing struct {
   212		New          []string `json:"new"`
   213		MissionRelevant []string `json:"mission_relevant"`
   214		Contradictions  []string `json:"contradictions"`
   215		NeedsReview     []string `json:"needs_review"`
   216		CanWait         []string `json:"can_wait"`
   217	}
   218	
   219	// ProduceBriefing generates a structured intelligence brief from ingested items.
   220	func ProduceBriefing(items []string, activeMissions []string) *Briefing {
   221		if len(items) == 0 {
   222			return &Briefing{}
   223		}
   224	
   225		var sb strings.Builder
   226		for i, item := range items {
   227			sb.WriteString(fmt.Sprintf("%d. %s\n", i+1, item))
   228		}
   229	
   230		missions := "None specified"
   231		if len(activeMissions) > 0 {
   232			missions = strings.Join(activeMissions, ", ")
   233		}
   234	
   235		system := `You produce intelligence briefings. Given a list of newly ingested items and active missions, answer exactly 5 questions as a JSON object:
   236	{
   237	  "new": ["what is new — key items ingested"],
   238	  "mission_relevant": ["what matters to active missions"],
   239	  "contradictions": ["what contradicts existing beliefs"],
   240	  "needs_review": ["what deserves immediate review"],

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go | sed -n '220,360p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   220	// just enough to match plurals and common verb forms.
   221	func stem(word string) string {
   222		if len(word) <= 4 {
   223			return word
   224		}
   225	
   226		// Common English suffixes — order matters (longest first)
   227		suffixes := []struct {
   228			suffix string
   229			minLen int // minimum remaining length after stripping
   230		}{
   231			{"nesses", 4},
   232			{"ments", 4},
   233			{"ation", 3},
   234			{"ings", 3},
   235			{"ness", 3},
   236			{"ment", 3},
   237			{"able", 3},
   238			{"ible", 3},
   239			{"tion", 3},
   240			{"sion", 3},
   241			{"ally", 3},
   242			{"ing", 3},
   243			{"ies", 3},
   244			{"ful", 3},
   245			{"ous", 3},
   246			{"ive", 3},
   247			{"ers", 3},
   248			{"est", 3},
   249			{"ize", 3},
   250			{"ise", 3},
   251			{"ity", 3},
   252			{"ed", 3},
   253			{"er", 3},
   254			{"ly", 3},
   255			{"es", 3},
   256			{"ss", 0}, // don't strip -ss (e.g. "less")
   257			{"s", 3},
   258		}
   259	
   260		for _, s := range suffixes {
   261			if s.minLen == 0 {
   262				continue // skip marker entries
   263			}
   264			if strings.HasSuffix(word, s.suffix) && len(word)-len(s.suffix) >= s.minLen {
   265				return word[:len(word)-len(s.suffix)]
   266			}
   267		}
   268	
   269		return word
   270	}
   271	
   272	// snippet extracts a text snippet around the first matching term.
   273	func snippet(body string, queryTerms []string, maxLen int) string {
   274		if maxLen <= 0 {
   275			maxLen = 200
   276		}
   277		if len(body) <= maxLen {
   278			return body
   279		}
   280	
   281		lower := strings.ToLower(body)
   282		bestPos := -1
   283		for _, term := range queryTerms {
   284			stemmed := stem(strings.ToLower(term))
   285			if idx := strings.Index(lower, stemmed); idx >= 0 {
   286				bestPos = idx
   287				break
   288			}
   289		}
   290	
   291		if bestPos < 0 {
   292			// No match found — return beginning
   293			return body[:maxLen] + "..."
   294		}
   295	
   296		// Center the snippet around the match
   297		start := bestPos - maxLen/2
   298		if start < 0 {
   299			start = 0
   300		}
   301		end := start + maxLen
   302		if end > len(body) {
   303			end = len(body)
   304			start = end - maxLen
   305			if start < 0 {
   306				start = 0
   307			}
   308		}
   309	
   310		prefix := ""
   311		suffix := ""
   312		if start > 0 {
   313			prefix = "..."
   314		}
   315		if end < len(body) {
   316			suffix = "..."
   317		}
   318	
   319		return prefix + body[start:end] + suffix
   320	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// Package index implements pure Go full-text search over vault .md files.
     2	//
     3	// No SQLite. No external dependencies. Documents are loaded into memory,
     4	// tokenized, and indexed with BM25 field-boosted scoring. A tiered query
     5	// cache (exact hash + Jaccard fuzzy) handles the hot path.
     6	//
     7	// On 7,600 .md files (~15MB text), startup takes 1-3 seconds on Apple Silicon.
     8	// Search returns in microseconds for cached queries, milliseconds for cold.
     9	package index
    10	
    11	import (
    12		"fmt"
    13		"log"
    14		"os"
    15		"path/filepath"
    16		"strings"
    17		"time"
    18	
    19		"github.com/GetModus/modus-memory/internal/markdown"
    20	)
    21	
    22	// Index wraps an in-memory BM25 search engine built from vault .md files.
    23	type Index struct {
    24		docs     []document
    25		engine   *bm25Engine
    26		cache    *queryCache
    27		facts    *factStore
    28		cross    *crossIndex // subject/tag/entity cross-references
    29		meta     map[string]*document // path → document for field lookups
    30		docCount int
    31		vaultDir string
    32	}
    33	
    34	// document is the internal representation of a vault file.
    35	type document struct {
    36		Path        string
    37		Source      string
    38		Subject     string
    39		Title       string
    40		Tags        string
    41		Body        string
    42		Predicate   string
    43		Confidence  float64
    44		Importance  string
    45		Kind        string
    46		Created     string
    47		Triage      string
    48		Frontmatter map[string]interface{}
    49	}
    50	
    51	// SearchResult represents a single search hit.
    52	type SearchResult struct {
    53		Path       string
    54		Source     string
    55		Subject    string
    56		Title      string
    57		Snippet    string
    58		Rank       float64
    59		Confidence float64
    60		Importance string
    61		Created    string
    62		Triage     string
    63	}
    64	
    65	// Build scans a vault directory and creates an in-memory search index.
    66	func Build(vaultDir string, _ string) (*Index, error) {
    67		start := time.Now()
    68	
    69		// Scan all markdown files
    70		mdDocs, err := markdown.ScanDir(vaultDir)
    71		if err != nil {
    72			return nil, fmt.Errorf("scan vault: %w", err)
    73		}
    74	
    75		docs := make([]document, 0, len(mdDocs))
    76		meta := make(map[string]*document, len(mdDocs))
    77	
    78		for _, md := range mdDocs {
    79			rel, _ := filepath.Rel(vaultDir, md.Path)
    80			title := md.Get("title")
    81			if title == "" {
    82				title = md.Get("name")
    83			}
    84			kind := md.Get("kind")
    85			if kind == "" {
    86				kind = md.Get("type")
    87			}
    88	
    89			doc := document{
    90				Path:        rel,
    91				Source:      md.Get("source"),
    92				Subject:     md.Get("subject"),
    93				Title:       title,
    94				Tags:        strings.Join(md.GetTags(), " "),
    95				Body:        md.Body,
    96				Predicate:   md.Get("predicate"),
    97				Confidence:  md.GetFloat("confidence"),
    98				Importance:  md.Get("importance"),
    99				Kind:        kind,
   100				Created:     md.Get("created"),
   101				Triage:      md.Get("triage"),
   102				Frontmatter: md.Frontmatter,
   103			}
   104	
   105			docs = append(docs, doc)
   106			meta[rel] = &docs[len(docs)-1]
   107		}
   108	
   109		// Build BM25 inverted index
   110		engine := newBM25Engine(docs)
   111		cache := newQueryCache()
   112	
   113		// Build cross-reference index — connects docs sharing subjects, tags, entities
   114		cross := newCrossIndex()
   115		cross.build(docs)
   116	
   117		idx := &Index{
   118			docs:     docs,
   119			engine:   engine,
   120			cache:    cache,
   121			facts:    newFactStore(),
   122			cross:    cross,
   123			meta:     meta,
   124			docCount: len(docs),
   125			vaultDir: vaultDir,
   126		}
   127	
   128		// Auto-index memory facts
   129		idx.indexFacts(vaultDir)
   130	
   131		crossSubjects, crossTags, crossEntities := cross.Stats()
   132		elapsed := time.Since(start)
   133		log.Printf("Indexed %d documents in %v (BM25 + cross-ref: %d subjects, %d tags, %d entities)",
   134			len(docs), elapsed, crossSubjects, crossTags, crossEntities)
   135	
   136		return idx, nil
   137	}
   138	
   139	// Open is an alias for Build — there's no persistent index file to open.
   140	// The second argument (indexPath) is ignored; kept for interface compatibility.
   141	func Open(indexPath string) (*Index, error) {
   142		// Infer vaultDir from indexPath: indexPath was typically ~/modus/data/index.sqlite
   143		// The vault is at ~/modus/vault/
   144		home, _ := os.UserHomeDir()
   145		vaultDir := filepath.Join(home, "modus", "vault")
   146		if envDir := os.Getenv("MODUS_VAULT_DIR"); envDir != "" {
   147			vaultDir = envDir
   148		}
   149		return Build(vaultDir, "")
   150	}
   151	
   152	// Close is a no-op — no file handles to release.
   153	func (idx *Index) Close() {}
   154	
   155	// DocCount returns the number of indexed documents.
   156	func (idx *Index) DocCount() int {
   157		return idx.docCount
   158	}
   159	
   160	// Search performs BM25 full-text search with tiered caching and field boosting.
   161	func (idx *Index) Search(query string, limit int) ([]SearchResult, error) {
   162		if limit <= 0 {
   163			limit = 10
   164		}
   165		if strings.TrimSpace(query) == "" {
   166			return nil, nil
   167		}
   168	
   169		// Tier 0-1: check cache (exact hash + Jaccard fuzzy)
   170		if cached, ok := idx.cache.get(query); ok {
   171			if len(cached) > limit {
   172				return cached[:limit], nil
   173			}
   174			return cached, nil
   175		}
   176	
   177		// Tier 2: BM25 search
   178		scored := idx.engine.search(query, limit*2) // oversample for dedup
   179	
   180		// OOD detection — reject garbage results
   181		if filterOOD(query, scored, 0.15) {
   182			empty := []SearchResult{}
   183			idx.cache.put(query, empty)
   184			return empty, nil
   185		}
   186	
   187		queryTerms := tokenize(query)
   188		var results []SearchResult
   189		seen := make(map[string]bool)
   190	
   191		for _, s := range scored {
   192			doc := idx.docs[s.docID]
   193			if seen[doc.Path] {
   194				continue
   195			}
   196			seen[doc.Path] = true
   197	
   198			snip := snippet(doc.Body, queryTerms, 200)
   199			results = append(results, SearchResult{
   200				Path:       doc.Path,
   201				Source:     doc.Source,
   202				Subject:    doc.Subject,
   203				Title:      doc.Title,
   204				Snippet:    snip,
   205				Rank:       normalizeScore(s.score),
   206				Confidence: doc.Confidence,
   207				Importance: doc.Importance,
   208				Created:    doc.Created,
   209				Triage:     doc.Triage,
   210			})
   211	
   212			if len(results) >= limit {
   213				break
   214			}
   215		}
   216	
   217		// Cache the results
   218		idx.cache.put(query, results)
   219	
   220		return results, nil
   221	}
   222	
   223	// SearchByField returns documents where a metadata field matches a value.
   224	func (idx *Index) SearchByField(field string, value string, limit int) ([]SearchResult, error) {
   225		if limit <= 0 {
   226			limit = 20
   227		}
   228	
   229		var results []SearchResult
   230		valueLower := strings.ToLower(value)
   231	
   232		for _, doc := range idx.docs {
   233			var fieldVal string
   234			switch field {
   235			case "source":
   236				fieldVal = doc.Source
   237			case "subject":
   238				fieldVal = doc.Subject
   239			case "kind", "type":
   240				fieldVal = doc.Kind

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go | sed -n '240,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240				fieldVal = doc.Kind
   241			case "triage":
   242				fieldVal = doc.Triage
   243			case "importance":
   244				fieldVal = doc.Importance
   245			default:
   246				if v, ok := doc.Frontmatter[field]; ok {
   247					fieldVal = fmt.Sprintf("%v", v)
   248				}
   249			}
   250	
   251			if strings.ToLower(fieldVal) == valueLower {
   252				results = append(results, SearchResult{
   253					Path:       doc.Path,
   254					Source:     doc.Source,
   255					Subject:    doc.Subject,
   256					Title:      doc.Predicate,
   257					Confidence: doc.Confidence,
   258					Importance: doc.Importance,
   259					Created:    doc.Created,
   260					Triage:     doc.Triage,
   261				})
   262			}
   263	
   264			if len(results) >= limit {
   265				break
   266			}
   267		}
   268	
   269		return results, nil
   270	}
   271	
   272	// Facts returns the in-memory fact store for agentic search.
   273	func (idx *Index) Facts() *factStore {
   274		return idx.facts
   275	}
   276	
   277	// Connected returns documents cross-referenced to a query via subject, tag, and entity links.
   278	func (idx *Index) Connected(query string, limit int) []DocRef {
   279		return idx.cross.Connected(query, limit)
   280	}
   281	
   282	// CrossRefStats returns cross-index statistics (subjects, tags, entities).
   283	func (idx *Index) CrossRefStats() (int, int, int) {
   284		return idx.cross.Stats()
   285	}
   286	
   287	// SearchFacts searches memory facts by query.
   288	func (idx *Index) SearchFacts(query string, limit int) []MemFact {
   289		return idx.facts.search(query, limit)
   290	}
   291	
   292	// FactsBySubject returns all active facts for a subject.
   293	func (idx *Index) FactsBySubject(subject string, limit int) []MemFact {
   294		return idx.facts.bySubject(subject, limit)
   295	}
   296	
   297	// AllActiveFacts returns all active memory facts.
   298	func (idx *Index) AllActiveFacts(limit int) []MemFact {
   299		return idx.facts.allActive(limit)
   300	}
   301	
   302	// FactCount returns total and active fact counts.
   303	func (idx *Index) FactCount() (total, active int) {
   304		return idx.facts.count()
   305	}
   306	
   307	// indexFacts loads memory facts from vault/memory/facts/ into the fact store.
   308	func (idx *Index) indexFacts(vaultDir string) {
   309		factsDir := filepath.Join(vaultDir, "memory", "facts")
   310		docs, err := markdown.ScanDir(factsDir)
   311		if err != nil {
   312			return
   313		}
   314	
   315		count := 0
   316		for _, doc := range docs {
   317			rel, _ := filepath.Rel(vaultDir, doc.Path)
   318			subject := doc.Get("subject")
   319			predicate := doc.Get("predicate")
   320			value := doc.Body
   321			if value == "" {
   322				value = doc.Get("value")
   323			}
   324			if subject == "" || predicate == "" {
   325				continue
   326			}
   327	
   328			confidence := doc.GetFloat("confidence")
   329			if confidence == 0 {
   330				confidence = 0.8
   331			}
   332			importance := doc.Get("importance")
   333			if importance == "" {
   334				importance = "medium"
   335			}
   336			memType := doc.Get("memory_type")
   337			if memType == "" {
   338				memType = "semantic"
   339			}
   340			created := doc.Get("created")
   341			if created == "" {
   342				created = doc.Get("created_at")
   343			}
   344			session := doc.Get("session_tag")
   345			if session == "" {
   346				session = "session-1"
   347			}
   348			isActive := 1
   349			if doc.Get("archived") == "true" || doc.Get("is_active") == "0" {
   350				isActive = 0
   351			}
   352	
   353			idx.facts.add(MemFact{
   354				ID:         rel,
   355				Subject:    subject,
   356				Predicate:  predicate,
   357				Value:      value,
   358				Confidence: confidence,
   359				Importance: importance,
   360				MemoryType: memType,
   361				CreatedAt:  created,
   362				SessionTag: session,
   363				IsActive:   isActive,
   364			})
   365			count++
   366		}
   367	
   368		if count > 0 {
   369			log.Printf("Indexed %d memory facts (in-memory)", count)
   370		}
   371	}

codex
I’ve got the top-level flow now: the single binary boots a vault, builds an in-memory index from markdown, attaches cross-reference and fact stores, and exposes everything through a minimal stdio MCP server. I’m tracing the FSRS and fact path next so the architecture summary includes how decay and reinforcement actually enter the runtime, not just how search is exposed.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package vault
     2	
     3	import (
     4		"fmt"
     5		"math"
     6		"strings"
     7		"time"
     8	
     9		"github.com/GetModus/modus-memory/internal/markdown"
    10	)
    11	
    12	// FSRS (Free Spaced Repetition Scheduler) parameters for memory decay.
    13	// Dual-strength model: each fact has stability (how long until 90% recall drops)
    14	// and difficulty (how hard it is to retain). Inspired by LACP's Mycelium Network
    15	// and the FSRS-5 algorithm. Local adaptation: importance gates initial stability,
    16	// memory type gates difficulty, and access-based reinforcement resets the clock.
    17	
    18	// fsrsConfig holds per-importance FSRS parameters.
    19	type fsrsConfig struct {
    20		InitialStability float64 // days until R drops to 0.9 (S0)
    21		InitialDifficulty float64 // 0.0 (trivial) to 1.0 (very hard)
    22		Floor            float64 // minimum confidence (retrievability)
    23	}
    24	
    25	var fsrsConfigs = map[string]fsrsConfig{
    26		"critical": {InitialStability: 1e9, InitialDifficulty: 0, Floor: 1.0}, // never decays
    27		"high":     {InitialStability: 180, InitialDifficulty: 0.3, Floor: 0.3},
    28		"medium":   {InitialStability: 60, InitialDifficulty: 0.5, Floor: 0.1},
    29		"low":      {InitialStability: 14, InitialDifficulty: 0.7, Floor: 0.05},
    30	}
    31	
    32	// Memory type difficulty modifiers. Procedural knowledge is hardest to forget,
    33	// episodic is easiest (it's contextual and fades without reinforcement).
    34	var memoryTypeDifficultyMod = map[string]float64{
    35		"semantic":   -0.1, // easier to retain (general knowledge)
    36		"episodic":   +0.2, // harder to retain (context-dependent)
    37		"procedural": -0.3, // hardest to forget (muscle memory analog)
    38	}
    39	
    40	// fsrsRetrievability computes R(t) = (1 + t/(9*S))^(-1)
    41	// where t = elapsed days, S = stability. This is the FSRS power-law forgetting curve.
    42	// R=0.9 when t=S (by definition of stability).
    43	func fsrsRetrievability(elapsedDays, stability float64) float64 {
    44		if stability <= 0 {
    45			return 0
    46		}
    47		return math.Pow(1.0+elapsedDays/(9.0*stability), -1.0)
    48	}
    49	
    50	// fsrsNewStability computes updated stability after a successful recall.
    51	// S' = S * (1 + e^(w) * (11-D) * S^(-0.2) * (e^(0.05*(1-R)) - 1))
    52	// Simplified from FSRS-5. w=2.0 is the stability growth factor.
    53	func fsrsNewStability(oldStability, difficulty, retrievability float64) float64 {
    54		w := 2.0 // growth factor — higher means faster stability growth on recall
    55		d := difficulty * 10 // scale to 0-10 range
    56		growth := math.Exp(w) * (11.0 - d) * math.Pow(oldStability, -0.2) * (math.Exp(0.05*(1.0-retrievability)) - 1.0)
    57		newS := oldStability * (1.0 + growth)
    58		if newS < oldStability {
    59			newS = oldStability // stability never decreases on recall
    60		}
    61		return newS
    62	}
    63	
    64	// DecayFacts sweeps all fact files and applies FSRS-based confidence decay.
    65	// Confidence = retrievability R(t) = (1 + t/(9*S))^(-1), floored per importance.
    66	// Returns the number of facts updated.
    67	func (v *Vault) DecayFacts() (int, error) {
    68		docs, err := markdown.ScanDir(v.Path("memory", "facts"))
    69		if err != nil {
    70			return 0, err
    71		}
    72	
    73		now := time.Now()
    74		updated := 0
    75	
    76		for _, doc := range docs {
    77			conf := doc.GetFloat("confidence")
    78			importance := doc.Get("importance")
    79			if importance == "" {
    80				importance = "medium"
    81			}
    82	
    83			cfg, ok := fsrsConfigs[importance]
    84			if !ok {
    85				cfg = fsrsConfigs["medium"]
    86			}
    87	
    88			// Critical facts never decay
    89			if cfg.InitialStability >= 1e8 {
    90				continue
    91			}
    92	
    93			if conf <= cfg.Floor {
    94				continue
    95			}
    96	
    97			// Get or initialize stability
    98			stability := doc.GetFloat("stability")
    99			if stability <= 0 {
   100				stability = cfg.InitialStability
   101				// Apply memory type modifier to difficulty → affects initial stability
   102				memType := doc.Get("memory_type")
   103				if mod, ok := memoryTypeDifficultyMod[memType]; ok {
   104					adjustedDifficulty := cfg.InitialDifficulty + mod
   105					if adjustedDifficulty < 0 {
   106						adjustedDifficulty = 0
   107					}
   108					if adjustedDifficulty > 1.0 {
   109						adjustedDifficulty = 1.0
   110					}
   111					// Lower difficulty → higher stability
   112					stability = cfg.InitialStability * (1.0 + (0.5 - adjustedDifficulty))
   113				}
   114				doc.Set("stability", math.Round(stability*10) / 10)
   115				doc.Set("difficulty", cfg.InitialDifficulty)
   116			}
   117	
   118			// Calculate days since last access or creation
   119			lastAccessed := doc.Get("last_accessed")
   120			if lastAccessed == "" {
   121				lastAccessed = doc.Get("last_decayed")
   122			}
   123			if lastAccessed == "" {
   124				lastAccessed = doc.Get("created")
   125			}
   126			if lastAccessed == "" {
   127				continue
   128			}
   129	
   130			t, err := parseTime(lastAccessed)
   131			if err != nil {
   132				continue
   133			}
   134	
   135			elapsedDays := now.Sub(t).Hours() / 24
   136			if elapsedDays < 0.5 {
   137				continue // too recent to decay
   138			}
   139	
   140			// FSRS retrievability: R(t) = (1 + t/(9*S))^(-1)
   141			newConf := fsrsRetrievability(elapsedDays, stability)
   142			newConf = math.Max(cfg.Floor, newConf)
   143			newConf = math.Round(newConf*1000) / 1000
   144	
   145			if newConf == conf {
   146				continue
   147			}
   148	
   149			doc.Set("confidence", newConf)
   150			doc.Set("last_decayed", now.Format(time.RFC3339))
   151			if err := doc.Save(); err != nil {
   152				continue
   153			}
   154			updated++
   155		}
   156	
   157		return updated, nil
   158	}
   159	
   160	// ReinforceFact increases a fact's confidence and stability after a successful recall.
   161	// This is the FSRS "review" operation — accessing a fact proves it's still relevant,
   162	// so stability grows and confidence resets toward 1.0.
   163	func (v *Vault) ReinforceFact(relPath string) error {
   164		doc, err := v.Read(relPath)
   165		if err != nil {
   166			return err
   167		}
   168	
   169		now := time.Now()
   170		conf := doc.GetFloat("confidence")
   171		stability := doc.GetFloat("stability")
   172		difficulty := doc.GetFloat("difficulty")
   173	
   174		importance := doc.Get("importance")
   175		if importance == "" {
   176			importance = "medium"
   177		}
   178		cfg := fsrsConfigs[importance]
   179	
   180		// Initialize if missing
   181		if stability <= 0 {
   182			stability = cfg.InitialStability
   183		}
   184		if difficulty <= 0 {
   185			difficulty = cfg.InitialDifficulty
   186		}
   187	
   188		// Compute new stability: grows on each successful recall
   189		newStability := fsrsNewStability(stability, difficulty, conf)
   190	
   191		// Difficulty decreases slightly on successful recall (fact gets easier)
   192		newDifficulty := difficulty - 0.02
   193		if newDifficulty < 0.05 {
   194			newDifficulty = 0.05
   195		}
   196	
   197		// Confidence boost: asymptotic toward 1.0, small increment per access
   198		newConf := conf + (1.0-conf)*0.08
   199		if newConf > 0.99 {
   200			newConf = 0.99
   201		}
   202	
   203		// Track access count
   204		accessCount := 0
   205		if ac := doc.GetFloat("access_count"); ac > 0 {
   206			accessCount = int(ac)
   207		}
   208		accessCount++
   209	
   210		doc.Set("confidence", math.Round(newConf*1000)/1000)
   211		doc.Set("stability", math.Round(newStability*10)/10)
   212		doc.Set("difficulty", math.Round(newDifficulty*1000)/1000)
   213		doc.Set("last_accessed", now.Format(time.RFC3339))
   214		doc.Set("access_count", accessCount)
   215	
   216		return doc.Save()
   217	}
   218	
   219	// ArchiveStaleFacts marks facts below a confidence threshold as archived.
   220	// Returns the number of facts archived.
   221	func (v *Vault) ArchiveStaleFacts(threshold float64) (int, error) {
   222		if threshold <= 0 {
   223			threshold = 0.1
   224		}
   225	
   226		docs, err := markdown.ScanDir(v.Path("memory", "facts"))
   227		if err != nil {
   228			return 0, err
   229		}
   230	
   231		archived := 0
   232		for _, doc := range docs {
   233			// Skip already archived
   234			if doc.Get("archived") == "true" {
   235				continue
   236			}
   237			// Skip critical facts
   238			if doc.Get("importance") == "critical" {
   239				continue
   240			}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go | sed -n '240,420p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   240			}
   241	
   242			conf := doc.GetFloat("confidence")
   243			if conf > 0 && conf < threshold {
   244				doc.Set("archived", true)
   245				doc.Set("archived_at", time.Now().Format(time.RFC3339))
   246				if err := doc.Save(); err != nil {
   247					continue
   248				}
   249				archived++
   250			}
   251		}
   252	
   253		return archived, nil
   254	}
   255	
   256	// TouchFact updates last_accessed on a fact, resetting its decay clock.
   257	func (v *Vault) TouchFact(relPath string) error {
   258		doc, err := v.Read(relPath)
   259		if err != nil {
   260			return err
   261		}
   262		doc.Set("last_accessed", time.Now().Format(time.RFC3339))
   263		return doc.Save()
   264	}
   265	
   266	// ListFacts returns memory facts, optionally filtered by subject.
   267	func (v *Vault) ListFacts(subject string, limit int) ([]*markdown.Document, error) {
   268		if limit <= 0 {
   269			limit = 20
   270		}
   271	
   272		docs, err := markdown.ScanDir(v.Path("memory", "facts"))
   273		if err != nil {
   274			return nil, err
   275		}
   276	
   277		var result []*markdown.Document
   278		for _, doc := range docs {
   279			if len(result) >= limit {
   280				break
   281			}
   282			if subject != "" && !strings.EqualFold(doc.Get("subject"), subject) {
   283				continue
   284			}
   285			result = append(result, doc)
   286		}
   287		return result, nil
   288	}
   289	
   290	// SearchFacts searches memory facts via FTS, filtering to memory/facts/ paths.
   291	// Falls back to listing all facts if no index is loaded.
   292	func (v *Vault) SearchFacts(query string, limit int) ([]string, error) {
   293		if limit <= 0 {
   294			limit = 10
   295		}
   296	
   297		// Fallback: scan directory if no index
   298		if v.Index == nil {
   299			docs, err := v.ListFacts("", limit)
   300			if err != nil {
   301				return nil, err
   302			}
   303			var out []string
   304			for _, doc := range docs {
   305				subj := doc.Get("subject")
   306				val := doc.Body
   307				if len(val) > 200 {
   308					val = val[:197] + "..."
   309				}
   310				// Basic keyword match
   311				if query != "" && !strings.Contains(strings.ToLower(subj+val), strings.ToLower(query)) {
   312					continue
   313				}
   314				out = append(out, fmt.Sprintf("- **%s**: %s", subj, strings.TrimSpace(val)))
   315			}
   316			return out, nil
   317		}
   318	
   319		results, err := v.Index.Search(query, limit*3)
   320		if err != nil {
   321			return nil, err
   322		}
   323	
   324		var out []string
   325		count := 0
   326		for _, r := range results {
   327			if !strings.HasPrefix(r.Path, "memory/facts/") {
   328				continue
   329			}
   330			if count >= limit {
   331				break
   332			}
   333			out = append(out, fmt.Sprintf("- **%s**: %s", r.Subject, r.Snippet))
   334			count++
   335		}
   336		return out, nil
   337	}
   338	
   339	// StoreFact writes a new memory fact as a .md file.
   340	func (v *Vault) StoreFact(subject, predicate, value string, confidence float64, importance string) (string, error) {
   341		if confidence <= 0 {
   342			confidence = 0.8
   343		}
   344		if importance == "" {
   345			importance = "medium"
   346		}
   347	
   348		slug := slugify(subject + "-" + predicate)
   349		if len(slug) > 80 {
   350			slug = slug[:80]
   351		}
   352	
   353		relPath := fmt.Sprintf("memory/facts/%s.md", slug)
   354		path := v.Path("memory", "facts", slug+".md")
   355	
   356		// Handle duplicates
   357		for i := 2; fileExists(path); i++ {
   358			slug2 := fmt.Sprintf("%s-%d", slug, i)
   359			relPath = fmt.Sprintf("memory/facts/%s.md", slug2)
   360			path = v.Path("memory", "facts", slug2+".md")
   361		}
   362	
   363		fm := map[string]interface{}{
   364			"subject":     subject,
   365			"predicate":   predicate,
   366			"confidence":  confidence,
   367			"importance":  importance,
   368			"memory_type": "semantic",
   369			"created":     "now",
   370		}
   371	
   372		if err := v.Write(relPath, fm, value); err != nil {
   373			return "", err
   374		}
   375		return relPath, nil
   376	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package index
     2	
     3	import (
     4		"sort"
     5		"strings"
     6		"time"
     7	)
     8	
     9	// MemFact represents an in-memory memory fact, replacing the SQL memory_facts table.
    10	type MemFact struct {
    11		ID         string
    12		Subject    string
    13		Predicate  string
    14		Value      string
    15		Confidence float64
    16		Importance string
    17		MemoryType string
    18		CreatedAt  string
    19		SessionTag string
    20		IsActive   int
    21	}
    22	
    23	// factStore holds all memory facts in memory with term-based search.
    24	type factStore struct {
    25		facts    []MemFact
    26		terms    map[string][]int // stemmed term → fact indices
    27		subjects map[string][]int // lowercase subject → fact indices
    28	}
    29	
    30	func newFactStore() *factStore {
    31		return &factStore{
    32			terms:    make(map[string][]int),
    33			subjects: make(map[string][]int),
    34		}
    35	}
    36	
    37	// add indexes a fact into the store.
    38	func (fs *factStore) add(f MemFact) {
    39		idx := len(fs.facts)
    40		fs.facts = append(fs.facts, f)
    41	
    42		// Index all text fields
    43		content := f.Subject + " " + f.Predicate + " " + f.Value
    44		for _, token := range tokenize(content) {
    45			fs.terms[token] = append(fs.terms[token], idx)
    46		}
    47	
    48		// Subject index for exact lookups
    49		subj := strings.ToLower(strings.TrimSpace(f.Subject))
    50		fs.subjects[subj] = append(fs.subjects[subj], idx)
    51	}
    52	
    53	// recencyBoost returns a multiplier based on fact age.
    54	// Hot (<24h): 1.5x, Warm (1-7d): 1.2x, Recent (7-30d): 1.0x, Cold (>30d): 0.8x.
    55	// Inspired by Icarus/Hermes tiered memory — hot facts surface first.
    56	func recencyBoost(createdAt string) float64 {
    57		if createdAt == "" {
    58			return 1.0
    59		}
    60		t, err := time.Parse("2006-01-02", createdAt[:min10(10, len(createdAt))])
    61		if err != nil {
    62			// Try RFC3339
    63			t, err = time.Parse(time.RFC3339, createdAt)
    64			if err != nil {
    65				return 1.0
    66			}
    67		}
    68		age := time.Since(t)
    69		switch {
    70		case age < 24*time.Hour:
    71			return 1.5 // hot
    72		case age < 7*24*time.Hour:
    73			return 1.2 // warm
    74		case age < 30*24*time.Hour:
    75			return 1.0 // recent
    76		default:
    77			return 0.8 // cold
    78		}
    79	}
    80	
    81	func min10(a, b int) int {
    82		if a < b {
    83			return a
    84		}
    85		return b
    86	}
    87	
    88	// search finds facts matching a query, ranked by BM25-like scoring with recency boost.
    89	func (fs *factStore) search(query string, limit int) []MemFact {
    90		if len(fs.facts) == 0 {
    91			return nil
    92		}
    93	
    94		queryTerms := tokenize(query)
    95		if len(queryTerms) == 0 {
    96			return nil
    97		}
    98	
    99		// Score each fact by term overlap
   100		scores := make(map[int]float64)
   101		for _, term := range queryTerms {
   102			indices, ok := fs.terms[term]
   103			if !ok {
   104				continue
   105			}
   106			// Simple TF-IDF-like scoring
   107			idf := 1.0 / (1.0 + float64(len(indices))/float64(len(fs.facts)))
   108			for _, idx := range indices {
   109				if fs.facts[idx].IsActive == 0 {
   110					continue
   111				}
   112				scores[idx] += idf
   113				// Boost by confidence
   114				scores[idx] += fs.facts[idx].Confidence * 0.1
   115			}
   116		}
   117	
   118		// Apply recency boost — hot facts surface before cold ones
   119		for idx := range scores {
   120			scores[idx] *= recencyBoost(fs.facts[idx].CreatedAt)
   121		}
   122	
   123		// Sort by score
   124		type scored struct {
   125			idx   int
   126			score float64
   127		}
   128		var ranked []scored
   129		for idx, score := range scores {
   130			ranked = append(ranked, scored{idx, score})
   131		}
   132		sort.Slice(ranked, func(i, j int) bool {
   133			return ranked[i].score > ranked[j].score
   134		})
   135	
   136		if limit > 0 && len(ranked) > limit {
   137			ranked = ranked[:limit]
   138		}
   139	
   140		results := make([]MemFact, len(ranked))
   141		for i, r := range ranked {
   142			results[i] = fs.facts[r.idx]
   143		}
   144		return results
   145	}
   146	
   147	// bySubject returns all active facts for a given subject (case-insensitive).
   148	func (fs *factStore) bySubject(subject string, limit int) []MemFact {
   149		indices := fs.subjects[strings.ToLower(strings.TrimSpace(subject))]
   150		var results []MemFact
   151		for _, idx := range indices {
   152			if fs.facts[idx].IsActive == 1 {
   153				results = append(results, fs.facts[idx])
   154			}
   155			if limit > 0 && len(results) >= limit {
   156				break
   157			}
   158		}
   159		return results
   160	}
   161	
   162	// allActive returns all active facts, optionally limited.
   163	func (fs *factStore) allActive(limit int) []MemFact {
   164		var results []MemFact
   165		for _, f := range fs.facts {
   166			if f.IsActive == 1 {
   167				results = append(results, f)
   168			}
   169			if limit > 0 && len(results) >= limit {
   170				break
   171			}
   172		}
   173		return results
   174	}
   175	
   176	// count returns total and active fact counts.
   177	func (fs *factStore) count() (total, active int) {
   178		total = len(fs.facts)
   179		for _, f := range fs.facts {
   180			if f.IsActive == 1 {
   181				active++
   182			}
   183		}
   184		return
   185	}
   186	
   187	// Tier returns the recency tier label: "hot", "warm", "recent", or "cold".
   188	func (f *MemFact) Tier() string {
   189		if f.CreatedAt == "" {
   190			return "cold"
   191		}
   192		t, err := time.Parse("2006-01-02", f.CreatedAt[:min10(10, len(f.CreatedAt))])
   193		if err != nil {
   194			t, err = time.Parse(time.RFC3339, f.CreatedAt)
   195			if err != nil {
   196				return "cold"
   197			}
   198		}
   199		age := time.Since(t)
   200		switch {
   201		case age < 24*time.Hour:
   202			return "hot"
   203		case age < 7*24*time.Hour:
   204			return "warm"
   205		case age < 30*24*time.Hour:
   206			return "recent"
   207		default:
   208			return "cold"
   209		}
   210	}
   211	
   212	// StalenessWarning returns a warning if the fact is old.
   213	func (f *MemFact) StalenessWarning() string {
   214		if f.CreatedAt == "" {
   215			return ""
   216		}
   217		t, err := time.Parse("2006-01-02", f.CreatedAt[:10])
   218		if err != nil {
   219			return ""
   220		}
   221		age := time.Since(t)
   222		if age > 90*24*time.Hour {
   223			return "⚠ >90d old"
   224		}
   225		if age > 30*24*time.Hour {
   226			return "⚠ >30d old"
   227		}
   228		return ""
   229	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go | sed -n '1,320p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package index
     2	
     3	import (
     4		"fmt"
     5		"sort"
     6		"strings"
     7	)
     8	
     9	// CrossRef is an in-memory cross-index that connects documents sharing subjects,
    10	// entities, or tags. Built at index time alongside BM25. No new storage — just
    11	// adjacency maps derived from existing frontmatter.
    12	//
    13	// This is Option A from the knowledge graph discussion: connected search results
    14	// without a full graph engine. A query for "Gemma 4" returns the fact, the Atlas
    15	// entity, the beliefs, the articles that mention it, and the learnings — one search.
    16	
    17	// DocRef is a lightweight reference to a connected document.
    18	type DocRef struct {
    19		Path    string
    20		Title   string
    21		Kind    string // "fact", "belief", "entity", "article", "learning", "mission", "role"
    22		Subject string
    23		Rank    float64 // connection strength (number of shared terms)
    24	}
    25	
    26	// crossIndex maps normalized subjects/entities to document references.
    27	type crossIndex struct {
    28		bySubject map[string][]DocRef // lowercase subject → connected docs
    29		byTag     map[string][]DocRef // tag → connected docs
    30		byEntity  map[string][]DocRef // entity name → connected docs
    31	}
    32	
    33	func newCrossIndex() *crossIndex {
    34		return &crossIndex{
    35			bySubject: make(map[string][]DocRef),
    36			byTag:     make(map[string][]DocRef),
    37			byEntity:  make(map[string][]DocRef),
    38		}
    39	}
    40	
    41	// build populates the cross-index from all indexed documents.
    42	func (ci *crossIndex) build(docs []document) {
    43		for _, doc := range docs {
    44			kind := inferDocKind(doc.Path, doc.Kind)
    45			ref := DocRef{
    46				Path:    doc.Path,
    47				Title:   doc.Title,
    48				Kind:    kind,
    49				Subject: doc.Subject,
    50			}
    51	
    52			// Index by subject
    53			if doc.Subject != "" {
    54				key := strings.ToLower(strings.TrimSpace(doc.Subject))
    55				ci.bySubject[key] = append(ci.bySubject[key], ref)
    56			}
    57	
    58			// Index by tags
    59			for _, tag := range strings.Fields(doc.Tags) {
    60				tag = strings.ToLower(strings.TrimSpace(tag))
    61				if tag != "" {
    62					ci.byTag[tag] = append(ci.byTag[tag], ref)
    63				}
    64			}
    65	
    66			// Index by entity mentions in title and subject
    67			// Entities are subjects of atlas docs, but also appear in other docs' text.
    68			// For now, cross-reference by exact subject match across all doc types.
    69			if kind == "entity" && doc.Title != "" {
    70				key := strings.ToLower(strings.TrimSpace(doc.Title))
    71				ci.byEntity[key] = append(ci.byEntity[key], ref)
    72			}
    73			if kind == "entity" && doc.Subject != "" {
    74				key := strings.ToLower(strings.TrimSpace(doc.Subject))
    75				ci.byEntity[key] = append(ci.byEntity[key], ref)
    76			}
    77	
    78			// Scan body for references to known entities (built in second pass)
    79		}
    80	
    81		// Second pass: scan all docs for mentions of entity names in title/body.
    82		// This connects articles to entities they discuss.
    83		entityNames := make(map[string]bool, len(ci.byEntity))
    84		for name := range ci.byEntity {
    85			if len(name) >= 3 { // skip tiny entity names
    86				entityNames[name] = true
    87			}
    88		}
    89	
    90		for _, doc := range docs {
    91			kind := inferDocKind(doc.Path, doc.Kind)
    92			if kind == "entity" {
    93				continue // entities already indexed
    94			}
    95	
    96			ref := DocRef{
    97				Path:    doc.Path,
    98				Title:   doc.Title,
    99				Kind:    kind,
   100				Subject: doc.Subject,
   101			}
   102	
   103			// Check if title or subject mentions a known entity
   104			titleLower := strings.ToLower(doc.Title)
   105			subjectLower := strings.ToLower(doc.Subject)
   106	
   107			for entityName := range entityNames {
   108				if strings.Contains(titleLower, entityName) || strings.Contains(subjectLower, entityName) {
   109					ci.byEntity[entityName] = append(ci.byEntity[entityName], ref)
   110				}
   111			}
   112		}
   113	}
   114	
   115	// ForSubject returns all documents connected to a subject (case-insensitive).
   116	func (ci *crossIndex) ForSubject(subject string, limit int) []DocRef {
   117		if limit <= 0 {
   118			limit = 20
   119		}
   120		key := strings.ToLower(strings.TrimSpace(subject))
   121		refs := ci.bySubject[key]
   122		if len(refs) > limit {
   123			refs = refs[:limit]
   124		}
   125		return refs
   126	}
   127	
   128	// ForTag returns all documents sharing a tag.
   129	func (ci *crossIndex) ForTag(tag string, limit int) []DocRef {
   130		if limit <= 0 {
   131			limit = 20
   132		}
   133		key := strings.ToLower(strings.TrimSpace(tag))
   134		refs := ci.byTag[key]
   135		if len(refs) > limit {
   136			refs = refs[:limit]
   137		}
   138		return refs
   139	}
   140	
   141	// ForEntity returns all documents connected to an entity.
   142	func (ci *crossIndex) ForEntity(entity string, limit int) []DocRef {
   143		if limit <= 0 {
   144			limit = 20
   145		}
   146		key := strings.ToLower(strings.TrimSpace(entity))
   147		refs := ci.byEntity[key]
   148		if len(refs) > limit {
   149			refs = refs[:limit]
   150		}
   151		return refs
   152	}
   153	
   154	// Connected returns the full neighborhood of a query — union of subject, tag,
   155	// and entity matches, deduplicated by path, sorted by connection count.
   156	func (ci *crossIndex) Connected(query string, limit int) []DocRef {
   157		if limit <= 0 {
   158			limit = 20
   159		}
   160	
   161		terms := strings.Fields(strings.ToLower(query))
   162		if len(terms) == 0 {
   163			return nil
   164		}
   165	
   166		// Score each document by how many query terms connect to it
   167		scores := make(map[string]*DocRef)  // path → ref
   168		counts := make(map[string]float64)  // path → connection strength
   169	
   170		addRefs := func(refs []DocRef, weight float64) {
   171			for _, r := range refs {
   172				counts[r.Path] += weight
   173				if _, ok := scores[r.Path]; !ok {
   174					copy := r
   175					scores[r.Path] = &copy
   176				}
   177			}
   178		}
   179	
   180		for _, term := range terms {
   181			addRefs(ci.bySubject[term], 3.0) // subject match is strongest
   182			addRefs(ci.byEntity[term], 2.0)  // entity match is strong
   183			addRefs(ci.byTag[term], 1.0)     // tag match is weaker
   184		}
   185	
   186		// Also try the full query as a single key
   187		fullQuery := strings.Join(terms, " ")
   188		addRefs(ci.bySubject[fullQuery], 3.0)
   189		addRefs(ci.byEntity[fullQuery], 2.0)
   190	
   191		// Sort by connection strength
   192		type ranked struct {
   193			ref   *DocRef
   194			score float64
   195		}
   196		var results []ranked
   197		for path, ref := range scores {
   198			ref.Rank = counts[path]
   199			results = append(results, ranked{ref, counts[path]})
   200		}
   201		sort.Slice(results, func(i, j int) bool {
   202			return results[i].score > results[j].score
   203		})
   204	
   205		if len(results) > limit {
   206			results = results[:limit]
   207		}
   208	
   209		out := make([]DocRef, len(results))
   210		for i, r := range results {
   211			out[i] = *r.ref
   212		}
   213		return out
   214	}
   215	
   216	// Stats returns cross-index statistics.
   217	func (ci *crossIndex) Stats() (subjects, tags, entities int) {
   218		return len(ci.bySubject), len(ci.byTag), len(ci.byEntity)
   219	}
   220	
   221	// inferDocKind determines the document type from its vault path and metadata.
   222	func inferDocKind(path, metaKind string) string {
   223		if metaKind != "" {
   224			return metaKind
   225		}
   226		switch {
   227		case strings.HasPrefix(path, "memory/facts/"):
   228			return "fact"
   229		case strings.HasPrefix(path, "atlas/beliefs/"):
   230			return "belief"
   231		case strings.HasPrefix(path, "atlas/entities/") || strings.HasPrefix(path, "atlas/"):
   232			return "entity"
   233		case strings.HasPrefix(path, "brain/learnings/"):
   234			return "learning"
   235		case strings.HasPrefix(path, "brain/"):
   236			return "article"
   237		case strings.HasPrefix(path, "missions/"):
   238			return "mission"
   239		case strings.HasPrefix(path, "roles/"):
   240			return "role"
   241		case strings.HasPrefix(path, "experience/"):
   242			return "experience"
   243		default:
   244			return "document"
   245		}
   246	}
   247	
   248	// FormatConnected returns a human-readable string of connected documents.
   249	func FormatConnected(refs []DocRef) string {
   250		if len(refs) == 0 {
   251			return ""
   252		}
   253	
   254		var sb strings.Builder
   255		sb.WriteString(fmt.Sprintf("## Connected (%d)\n\n", len(refs)))
   256	
   257		// Group by kind
   258		byKind := make(map[string][]DocRef)
   259		for _, r := range refs {
   260			byKind[r.Kind] = append(byKind[r.Kind], r)
   261		}
   262	
   263		kindOrder := []string{"fact", "belief", "entity", "learning", "article", "mission", "experience", "role", "document"}
   264		for _, kind := range kindOrder {
   265			group := byKind[kind]
   266			if len(group) == 0 {
   267				continue
   268			}
   269			sb.WriteString(fmt.Sprintf("**%ss** (%d):\n", kind, len(group)))
   270			for _, r := range group {
   271				title := r.Title
   272				if title == "" {
   273					title = r.Path
   274				}
   275				sb.WriteString(fmt.Sprintf("- %s `%s`\n", title, r.Path))
   276			}
   277			sb.WriteString("\n")
   278		}
   279	
   280		return sb.String()
   281	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package markdown
     2	
     3	import (
     4		"bufio"
     5		"fmt"
     6		"os"
     7		"path/filepath"
     8		"strings"
     9	
    10		"gopkg.in/yaml.v3"
    11	)
    12	
    13	// Document represents a parsed markdown file with YAML frontmatter.
    14	type Document struct {
    15		Path        string                 // filesystem path
    16		Frontmatter map[string]interface{} // parsed YAML
    17		Body        string                 // markdown content after frontmatter
    18	}
    19	
    20	// Get returns a frontmatter value as a string, or empty string.
    21	func (d *Document) Get(key string) string {
    22		v, ok := d.Frontmatter[key]
    23		if !ok {
    24			return ""
    25		}
    26		return fmt.Sprintf("%v", v)
    27	}
    28	
    29	// GetFloat returns a frontmatter value as float64, or 0.
    30	func (d *Document) GetFloat(key string) float64 {
    31		v, ok := d.Frontmatter[key]
    32		if !ok {
    33			return 0
    34		}
    35		switch val := v.(type) {
    36		case float64:
    37			return val
    38		case int:
    39			return float64(val)
    40		default:
    41			return 0
    42		}
    43	}
    44	
    45	// GetTags returns the tags field as a string slice.
    46	func (d *Document) GetTags() []string {
    47		v, ok := d.Frontmatter["tags"]
    48		if !ok {
    49			return nil
    50		}
    51		switch val := v.(type) {
    52		case []interface{}:
    53			tags := make([]string, 0, len(val))
    54			for _, t := range val {
    55				tags = append(tags, fmt.Sprintf("%v", t))
    56			}
    57			return tags
    58		case string:
    59			return strings.Split(val, ",")
    60		default:
    61			return nil
    62		}
    63	}
    64	
    65	// Set updates a frontmatter value.
    66	func (d *Document) Set(key string, value interface{}) {
    67		if d.Frontmatter == nil {
    68			d.Frontmatter = make(map[string]interface{})
    69		}
    70		d.Frontmatter[key] = value
    71	}
    72	
    73	// Save writes the document back to disk with updated frontmatter.
    74	func (d *Document) Save() error {
    75		return Write(d.Path, d.Frontmatter, d.Body)
    76	}
    77	
    78	// WikiLinks extracts all [[link]] references from the body.
    79	func (d *Document) WikiLinks() []string {
    80		var links []string
    81		start := 0
    82		for {
    83			i := strings.Index(d.Body[start:], "[[")
    84			if i < 0 {
    85				break
    86			}
    87			j := strings.Index(d.Body[start+i:], "]]")
    88			if j < 0 {
    89				break
    90			}
    91			link := d.Body[start+i+2 : start+i+j]
    92			links = append(links, link)
    93			start = start + i + j + 2
    94		}
    95		return links
    96	}
    97	
    98	// Parse reads a markdown file and returns a Document.
    99	func Parse(path string) (*Document, error) {
   100		f, err := os.Open(path)
   101		if err != nil {
   102			return nil, err
   103		}
   104		defer f.Close()
   105	
   106		scanner := bufio.NewScanner(f)
   107		scanner.Buffer(make([]byte, 0, 64*1024), 1024*1024) // 1MB max line
   108	
   109		doc := &Document{
   110			Path:        path,
   111			Frontmatter: make(map[string]interface{}),
   112		}
   113	
   114		// Check for frontmatter
   115		if !scanner.Scan() {
   116			return doc, nil
   117		}
   118		firstLine := scanner.Text()
   119		if firstLine != "---" {
   120			// No frontmatter — entire file is body
   121			var body strings.Builder
   122			body.WriteString(firstLine)
   123			body.WriteByte('\n')
   124			for scanner.Scan() {
   125				body.WriteString(scanner.Text())
   126				body.WriteByte('\n')
   127			}
   128			doc.Body = body.String()
   129			return doc, nil
   130		}
   131	
   132		// Read frontmatter until closing ---
   133		var fmLines strings.Builder
   134		for scanner.Scan() {
   135			line := scanner.Text()
   136			if line == "---" {
   137				break
   138			}
   139			fmLines.WriteString(line)
   140			fmLines.WriteByte('\n')
   141		}
   142	
   143		// Parse YAML
   144		if err := yaml.Unmarshal([]byte(fmLines.String()), &doc.Frontmatter); err != nil {
   145			// If YAML fails, treat entire content as body
   146			doc.Body = fmLines.String()
   147			return doc, nil
   148		}
   149	
   150		// Read body
   151		var body strings.Builder
   152		for scanner.Scan() {
   153			body.WriteString(scanner.Text())
   154			body.WriteByte('\n')
   155		}
   156		doc.Body = body.String()
   157	
   158		return doc, nil
   159	}
   160	
   161	// ScanDir recursively scans a directory for .md files and parses each.
   162	func ScanDir(dir string) ([]*Document, error) {
   163		var docs []*Document
   164	
   165		err := filepath.Walk(dir, func(path string, info os.FileInfo, err error) error {
   166			if err != nil {
   167				return nil // skip errors
   168			}
   169			// Skip discard directories — cold storage, not indexed
   170			if info.IsDir() && info.Name() == "discard" {
   171				return filepath.SkipDir
   172			}
   173			if info.IsDir() || !strings.HasSuffix(path, ".md") {
   174				return nil
   175			}
   176	
   177			doc, err := Parse(path)
   178			if err != nil {
   179				return nil // skip unparseable files
   180			}
   181			docs = append(docs, doc)
   182			return nil
   183		})
   184	
   185		return docs, err
   186	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package markdown
     2	
     3	import (
     4		"fmt"
     5		"os"
     6		"path/filepath"
     7		"strings"
     8	)
     9	
    10	// Write creates a markdown file with YAML frontmatter.
    11	func Write(path string, frontmatter map[string]interface{}, body string) error {
    12		dir := filepath.Dir(path)
    13		if err := os.MkdirAll(dir, 0755); err != nil {
    14			return fmt.Errorf("mkdir %s: %w", dir, err)
    15		}
    16	
    17		var sb strings.Builder
    18		sb.WriteString("---\n")
    19	
    20		for key, val := range frontmatter {
    21			if val == nil {
    22				continue
    23			}
    24			switch v := val.(type) {
    25			case []string:
    26				sb.WriteString(fmt.Sprintf("%s: [%s]\n", key, strings.Join(v, ", ")))
    27			case []interface{}:
    28				parts := make([]string, len(v))
    29				for i, item := range v {
    30					parts[i] = fmt.Sprintf("%v", item)
    31				}
    32				sb.WriteString(fmt.Sprintf("%s: [%s]\n", key, strings.Join(parts, ", ")))
    33			case bool:
    34				sb.WriteString(fmt.Sprintf("%s: %v\n", key, v))
    35			case float64, int:
    36				sb.WriteString(fmt.Sprintf("%s: %v\n", key, v))
    37			default:
    38				s := fmt.Sprintf("%v", v)
    39				if needsQuoting(s) {
    40					sb.WriteString(fmt.Sprintf("%s: %q\n", key, s))
    41				} else {
    42					sb.WriteString(fmt.Sprintf("%s: %s\n", key, s))
    43				}
    44			}
    45		}
    46	
    47		sb.WriteString("---\n\n")
    48		sb.WriteString(strings.TrimSpace(body))
    49		sb.WriteByte('\n')
    50	
    51		return os.WriteFile(path, []byte(sb.String()), 0644)
    52	}
    53	
    54	func needsQuoting(s string) bool {
    55		for _, c := range s {
    56			switch c {
    57			case ':', '#', '[', ']', '{', '}', '|', '>', '*', '&', '!', '%', '@', '`':
    58				return true
    59			}
    60		}
    61		return false
    62	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package mcp
     2	
     3	import (
     4		"github.com/GetModus/modus-memory/internal/vault"
     5	)
     6	
     7	// RegisterMemoryTools registers the 11 MCP tools for the modus-memory server.
     8	// All features are free and unrestricted.
     9	//
    10	// Tools:
    11	//
    12	//	vault_search, vault_read, vault_write, vault_list, vault_status,
    13	//	memory_facts, memory_search, memory_store,
    14	//	memory_reinforce, memory_decay_facts, vault_connected
    15	func RegisterMemoryTools(srv *Server, v *vault.Vault) {
    16		RegisterVaultTools(srv, v)
    17	
    18		// Keep only the 11 memory-relevant tools
    19		keep := map[string]bool{
    20			"vault_search":      true,
    21			"vault_read":        true,
    22			"vault_write":       true,
    23			"vault_list":        true,
    24			"vault_status":      true,
    25			"memory_facts":      true,
    26			"memory_search":     true,
    27			"memory_store":      true,
    28			"memory_reinforce":  true,
    29			"memory_decay_facts": true,
    30			"vault_connected":   true,
    31		}
    32	
    33		for name := range srv.tools {
    34			if !keep[name] {
    35				delete(srv.tools, name)
    36				delete(srv.handlers, name)
    37			}
    38		}
    39	}

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
exec
/bin/zsh -lc "rg -n \"RegisterMemoryTools|AddTool|ExpandQuery|Connected|ReinforceFact|DecayFacts|Search\\(|SearchFacts|StoreFact|ListFacts|TouchFact|ArchiveStaleFacts|pro|free|librarian|RankResults|SummarizeForCloud\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
<p align="center">
  <img src="assets/hero.svg" alt="modus-memory — Personal memory server for AI" width="900"/>
</p>

<p align="center">
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#install"><strong>Install</strong></a> ·
  <a href="#quickstart"><strong>Quickstart</strong></a> ·
  <a href="#the-librarian-pattern"><strong>Librarian</strong></a> ·
  <a href="#how-it-works"><strong>How It Works</strong></a> ·
  <a href="#security--privacy"><strong>Security</strong></a> ·
  <a href="#migrating-from-khoj"><strong>Khoj Migration</strong></a> ·
  <a href="#faq"><strong>FAQ</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/MCP-compatible-blue?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCAwIDIwIDIwIj48Y2lyY2xlIGN4PSIxMCIgY3k9IjEwIiByPSI4IiBmaWxsPSIjNThhNmZmIi8+PC9zdmc+" alt="MCP Compatible"/>
  <img src="https://img.shields.io/badge/platform-macOS%20·%20Linux%20·%20Windows-lightgrey?style=flat-square" alt="Platform"/>
  <img src="https://img.shields.io/badge/size-~6MB-green?style=flat-square" alt="Binary Size"/>
  <img src="https://img.shields.io/badge/dependencies-zero-brightgreen?style=flat-square" alt="Zero Dependencies"/>
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License"/>
  <img src="https://img.shields.io/badge/price-free-brightgreen?style=flat-square" alt="Completely Free"/>
</p>

---

**modus-memory** is a personal memory server that runs on your machine, stores everything in plain markdown, and connects to any AI client via [MCP](https://modelcontextprotocol.io).

One binary. No cloud. No Docker. No database. Your memories stay on your disk as files you can read, edit, grep, and back up with git.

> **Completely free. 19,000+ documents indexed in 2 seconds. Cached searches in <100 microseconds. 6MB binary, zero dependencies.**

## Demo

<p align="center">
  <img src="assets/demo.svg" alt="modus-memory demo — install, store memory, recall weeks later" width="800"/>
</p>

Your AI remembers a decision you made 3 weeks ago — in a completely new chat. No copy-paste, no "here's my context dump." Just ask, and it knows.

## Why

Every AI conversation starts from zero. Your assistant forgets everything the moment the window closes.

Cloud memory services charge $19–249/month to store your personal data on their servers. Open-source alternatives require Python, Docker, PostgreSQL, and an afternoon of setup. The official MCP memory server is deliberately minimal — no search ranking, no decay, no cross-referencing. Other "zero-infrastructure" tools still need Node.js runtimes and LLM API keys for every search.

<p align="center">
  <img src="assets/comparison.svg" alt="modus-memory vs cloud memory services" width="800"/>
</p>

**modus-memory** fills the gap:

- **BM25 full-text search** with field boosting and query caching — 19K docs in <5ms
- **FSRS spaced repetition** — memories decay naturally, strengthen on recall
- **Cross-referencing** — facts, notes, and entities linked by subject and tag
- **Librarian query expansion** — "React hooks" also finds "useState lifecycle"
- **Plain markdown storage** — your data is always yours, always readable
- **~6MB binary** — download, configure, done. No runtime, no interpreter, no container

### Without memory vs. with memory

| Scenario | Without | With modus-memory |
|----------|---------|-------------------|
| Start a new chat | AI knows nothing about you | AI recalls your preferences, past decisions, project context |
| Switch AI clients | Start over completely | Same memory, any MCP client |
| Ask "what did we decide about auth?" | Blank stare | Instant recall + linked context |
| Close the window | Everything lost | Persisted to disk, searchable forever |
| 6 months later | Stale memories clutter results | FSRS naturally fades noise, reinforces what matters |

### Token savings

Memory isn't just about remembering. It's a token reduction strategy.

| Approach | Tokens per query | Cost at $3/1M tokens | Monthly (50 queries/day) |
|----------|-----------------|----------------------|--------------------------|
| Stuff 1K facts into context | ~36,000 | $0.109 | **$164** |
| modus-memory search (top 10) | ~500 | $0.0015 | **$2.25** |

**72x fewer input tokens.** Instead of cramming everything into the context window, modus-memory searches 19,000+ documents in <5ms and returns only what's relevant.

## Install

### Homebrew (macOS & Linux)

```bash
brew install GetModus/tap/modus-memory
```

### Download binary

Grab the latest release for your platform from [Releases](https://github.com/GetModus/modus-memory/releases):

| Platform | Architecture | Download |
|----------|-------------|----------|
| macOS | Apple Silicon (M1+) | `modus-memory-darwin-arm64` |
| macOS | Intel | `modus-memory-darwin-amd64` |
| Linux | x86_64 | `modus-memory-linux-amd64` |
| Linux | ARM64 | `modus-memory-linux-arm64` |
| Windows | x86_64 | `modus-memory-windows-amd64.exe` |

```bash
# macOS / Linux
chmod +x modus-memory-*
sudo mv modus-memory-* /usr/local/bin/modus-memory

# Verify
modus-memory version
```

### Go install

```bash
go install github.com/GetModus/modus-memory@latest
```

## Quickstart

### 1. Add to your AI client

<details>
<summary><strong>Claude Desktop</strong></summary>

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "memory": {
      "command": "modus-memory",
      "args": ["--vault", "~/vault"]
    }
  }
}
```
</details>

<details>
<summary><strong>Claude Code</strong></summary>

```bash
claude mcp add memory -- modus-memory --vault ~/vault
```
</details>

<details>
<summary><strong>Cursor</strong></summary>

In Settings > MCP Servers, add:

```json
{
  "memory": {
    "command": "modus-memory",
    "args": ["--vault", "~/vault"]
  }
}
```
</details>

<details>
<summary><strong>Windsurf / Cline / Any MCP client</strong></summary>

modus-memory speaks [MCP](https://modelcontextprotocol.io) over stdio. Point any MCP-compatible client at the binary:

```bash
modus-memory --vault ~/vault
```
</details>

### 2. Start remembering

Your AI client now has 11 memory tools. Try:

```
"Remember that I prefer TypeScript over JavaScript for new projects"
"What do you know about my coding preferences?"
"Find everything related to the authentication refactor"
```

### 3. Check your vault

```bash
modus-memory health
# modus-memory 0.3.0
# Vault: ~/modus/vault
# Documents: 847
# Facts: 234 total, 230 active
# Cross-refs: 156 subjects, 89 tags, 23 entities
```

## Tools

modus-memory exposes 11 MCP tools — all free, no limits:

| Tool | Description |
|------|-------------|
| `vault_search` | BM25 full-text search with librarian query expansion and cross-reference hints |
| `vault_read` | Read any document by path |
| `vault_write` | Write a document with YAML frontmatter + markdown body |
| `vault_list` | List documents in a subdirectory with optional filters |
| `vault_status` | Vault statistics — document counts, index size, cross-ref stats |
| `memory_facts` | List memory facts, optionally filtered by subject |
| `memory_search` | Search memory facts with automatic FSRS reinforcement on recall |
| `memory_store` | Store a new memory fact (subject/predicate/value) |
| `memory_reinforce` | Explicitly reinforce a memory — increases stability, decreases difficulty |
| `memory_decay_facts` | Run FSRS decay sweep — naturally forgets stale memories |
| `vault_connected` | Cross-reference query — find everything linked to a subject, tag, or entity |

## The Librarian Pattern

Most memory systems let any LLM read and write freely. modus-memory is designed around a different principle: a single dedicated local model — the **Librarian** — serves as the sole authority over persistent state.

```
┌─────────────┐     ┌────────────────┐     ┌──────────────┐
│ Cloud Model  │◄───►│   Librarian    │◄───►│ modus-memory │
│ (reasoning)  │     │ (local, ~8B)   │     │   (vault)    │
└─────────────┘     └────────────────┘     └──────────────┘
                     Sole write access
                     Query expansion
                     Relevance filtering

 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7:// RegisterMemoryTools registers the 11 MCP tools for the modus-memory server.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:8:// All features are free and unrestricted.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:15:func RegisterMemoryTools(srv *Server, v *vault.Vault) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:11:	"github.com/GetModus/modus-memory/internal/librarian"
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28:		// If the librarian is available, expand the query for better recall
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:30:		if librarian.Available() {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:31:			expansions := librarian.ExpandQuery(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:32:			log.Printf("vault_search: librarian expanded %q → %d variants", query, len(expansions))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:35:				results, err := v.Search(exp, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:47:			// Fallback: direct FTS5 search without librarian
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:48:			results, err := v.Search(query, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:77:			refs := v.Index.Connected(query, 5)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:108:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:115:	srv.AddTool("vault_search", "Search the vault — brain, memory, atlas, missions.", searchSchema, searchHandler)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:119:	srv.AddTool("vault_read", "Read a vault file by relative path.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:121:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:143:	srv.AddTool("vault_write", "Write a vault file (frontmatter + body).", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:145:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:166:	srv.AddTool("vault_list", "List vault files in a subdirectory, optionally filtered.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:168:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:225:	srv.AddTool("vault_status", "Vault statistics — file counts, index size, cross-ref stats.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:226:		"type": "object", "properties": map[string]interface{}{},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:238:		docs, err := v.ListFacts(subject, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:263:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:269:	srv.AddTool("memory_facts", "List episodic memory facts. Optionally filter by subject.", memoryFactsSchema, memoryFactsHandler)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:280:		// Search with optional librarian expansion
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:282:		if librarian.Available() {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:283:			queries = librarian.ExpandQuery(query)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:284:			log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:292:			facts := v.Index.SearchFacts(q, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:315:				go v.ReinforceFact(f.ID) // async — don't block search response
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:320:		sb.WriteString(fmt.Sprintf("%d results (bm25+librarian, %d queries):\n\n",
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:336:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:343:	srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:360:		relPath, err := v.StoreFact(subject, predicate, value, confidence, importance)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:369:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:379:	srv.AddTool("memory_store", "Store a new episodic memory fact.", memoryStoreSchema, memoryStoreHandler)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:383:	srv.AddTool("atlas_list_entities", "List all entities in the knowledge graph.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:384:		"type": "object", "properties": map[string]interface{}{},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:404:	srv.AddTool("atlas_get_entity", "Get an entity page with beliefs and wiki-links.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:406:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:439:	srv.AddTool("atlas_list_beliefs", "List beliefs from the knowledge graph.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:441:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:473:	srv.AddTool("qm_board", "Mission board — grouped by status.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:474:		"type": "object", "properties": map[string]interface{}{},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:497:	srv.AddTool("qm_get_mission", "Get a specific mission by slug or title.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:499:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:520:	srv.AddTool("qm_list_missions", "List missions, optionally filtered by status.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:522:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:550:	srv.AddTool("qm_create_mission", "Create a new mission.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:552:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:572:	srv.AddTool("qm_ship_clock", "Ship clock — days remaining to target.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:573:		"type": "object", "properties": map[string]interface{}{},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:580:	srv.AddTool("qm_blueprints", "List reusable mission blueprints.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:582:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:607:	srv.AddTool("atlas_get_trust", "Get the current trust stage (1=Inform, 2=Recommend, 3=Act).", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:608:		"type": "object", "properties": map[string]interface{}{},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:619:	srv.AddTool("atlas_set_trust", "Set the trust stage (1-3). Operator only — MODUS never self-promotes.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:621:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:639:	srv.AddTool("atlas_decay_beliefs", "Run belief confidence decay sweep. Returns count of beliefs updated.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:640:		"type": "object", "properties": map[string]interface{}{},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:649:	srv.AddTool("atlas_reinforce_belief", "Reinforce a belief's confidence (+0.05 independent, +0.02 same source).", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:651:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:665:	srv.AddTool("atlas_weaken_belief", "Weaken a belief's confidence (-0.10, floor 0.05).", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:667:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:681:	srv.AddTool("atlas_open_pr", "Open a new evolution proposal (PR) for the knowledge graph.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:683:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:721:	srv.AddTool("atlas_merge_pr", "Merge an evolution PR. Reinforces linked beliefs. Operator only.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:723:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:737:	srv.AddTool("atlas_reject_pr", "Reject an evolution PR. Weakens linked beliefs. Operator only.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:739:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:755:	srv.AddTool("atlas_list_prs", "List evolution PRs, optionally filtered by status.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:757:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:781:	srv.AddTool("qm_add_dependency", "Add a typed dependency between missions.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:783:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:799:	srv.AddTool("qm_remove_dependency", "Remove a dependency from a mission.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:801:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:815:	srv.AddTool("qm_get_dependencies", "Get a mission's dependencies with satisfaction status and whether it can start.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:817:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:856:	srv.AddTool("memory_decay_facts", "Run memory fact confidence decay sweep.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:857:		"type": "object", "properties": map[string]interface{}{},
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:859:		n, err := v.DecayFacts()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:866:	srv.AddTool("memory_archive_stale", "Archive stale memory facts below confidence threshold.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:868:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:876:		n, err := v.ArchiveStaleFacts(threshold)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:885:	srv.AddTool("memory_reinforce", "Reinforce a memory fact after successful recall (FSRS stability growth).", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:887:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:893:		if err := v.ReinforceFact(path); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:903:		"properties": map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:919:		refs := v.Index.Connected(query, limit)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:924:		return index.FormatConnected(refs), nil
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:929:	srv.AddTool("distill_status", "Check training pair collection and distillation readiness.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:930:		"type": "object", "properties": map[string]interface{}{},

codex
The README mostly matches the code on the big-picture shape: local binary, markdown vault, BM25 search, FSRS decay, cross-reference index, and 11 exposed memory tools. The numbers are still README claims rather than code-proven benchmarks, so I’m separating those from the verified mechanics while I compare them to our own `memory_search` and FSRS paths.
exec
/bin/zsh -lc 'rg -n "export async function|memory_search|FSRS|scheduler|decay|reinforce|trackAccess|track_access|working memory|causal|semantic|hybrid|rerank|includeConstitutional|session" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:4:// Feature catalog: Classification-based decay
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:5:// CANONICAL FSRS CONSTANTS & ALGORITHM
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:10:// FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:11:// Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:12:// All long-term decay consumers MUST import constants from this file.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:16:// Timescale: minutes. Operates on session-scoped attention scores only.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:18:// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:19:// Algorithm. All temporal decay for persistent memories should route
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:23:// Consumers: attention-decay.ts (facade), composite-scoring.ts (temporal
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:31:/** FSRS v4 algorithm constants */
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:32:const FSRS_FACTOR = 19 / 81;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:33:const FSRS_DECAY = -0.5;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:36:// From R(h) = 0.5: S = (FSRS_FACTOR / 3) * h = (19/243) * h
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:37:const FSRS_HALF_LIFE_FACTOR = FSRS_FACTOR / 3; // 19/243 ≈ 0.07819
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:77: * Calculate retrievability (probability of recall) using FSRS v4 formula.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:86:    1 + FSRS_FACTOR * (elapsedDays / stability),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:87:    FSRS_DECAY
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:95: * Uses simplified FSRS v4 update rules.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:132:  const interval = (safeStability / FSRS_FACTOR) * (Math.pow(desiredRetention, 1 / FSRS_DECAY) - 1);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:186: * Create initial FSRS parameters for a new memory.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:222:const FSRS_CONSTANTS = {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:223:  FSRS_FACTOR,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:224:  FSRS_DECAY,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:225:  FSRS_HALF_LIFE_FACTOR, // T301: derived constant (19/243)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:238: * C138: Tier-based decay multipliers for long-term memory stability.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:239: * Each tier modifies how quickly memories decay relative to the base FSRS schedule.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:240: * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:243: * (lower value = slower perceived time = slower decay). It is a SEPARATE system from
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:244: * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:261:   Multiplies FSRS stability so that:
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:262:     - Infinity stability → R(t) = 1.0 always (no decay)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:263:     - >1.0 stability multiplier → slower decay
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:264:     - <1.0 stability multiplier → faster decay */
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:268: * Applied to the FSRS stability parameter before computing retrievability.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:269: * Infinity = no decay (retrievability always 1.0).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:270: * 2.0 = stability doubled → slower decay.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:271: * 1.0 = standard FSRS schedule.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:274:  planning: Infinity,    // no decay — planning/decisions are permanent
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:275:  research: 2.0,         // 2x stability — research context decays slower
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:276:  implementation: 1.0,   // standard decay
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:277:  general: 1.0,          // standard decay
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:291: * constitutional/critical: Infinity = never decays.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:292: * important: 1.5x stability → slower decay.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:294: * temporary: 0.5x → faster decay (2x relative speed).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:295: * deprecated: 0.25x → fastest decay (4x relative speed).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:298:  constitutional: Infinity, // never decays
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:299:  critical: Infinity,       // never decays
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:300:  important: 1.5,           // slower decay
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:302:  temporary: 0.5,           // faster decay
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:303:  deprecated: 0.25,         // fastest decay
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:311: *     (no-decay wins unconditionally).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:316: * which makes R(t) = (1 + factor * t / Infinity)^decay = 1.0 for all t.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:326:  // Infinity * anything = Infinity (no-decay wins)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:335: * TM-03: Apply classification-based decay to a stability value.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:339: * Returns Infinity when the combined multiplier is Infinity (no-decay).
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:341: * @param stability      Base FSRS stability value
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:377:   2. ENGAGEMENT-SENSITIVE documents — all other context_types (session, scratch,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:379:      Normal FSRS schedule applies without modification.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:387: * Context types that should never decay under the hybrid decay policy.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:396:const HYBRID_FSRS_CONTEXT_TYPES: ReadonlySet<string> = new Set([
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:397:  'session',
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:408: * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:417: * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:420: *   - 'no_decay'       for decision / constitutional / critical context types
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:421: *   - 'fsrs_schedule'  for all engagement-sensitive types (session, scratch, etc.)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:423:type HybridDecayClass = 'no_decay' | 'fsrs_schedule';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:427:    return 'no_decay';
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:440: * REQ-D4-002: Apply the hybrid decay policy to a stability value.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:444: *   - decision / constitutional / critical → returns Infinity (no decay)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:445: *   - all others → returns stability unchanged (normal FSRS schedule)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:447: * @param stability    Base FSRS stability value
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:449: * @returns Adjusted stability: Infinity for no-decay types, original otherwise
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:458:  FSRS_FACTOR,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:459:  FSRS_DECAY,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:460:  FSRS_HALF_LIFE_FACTOR, // T301: derived constant for half-life ↔ stability
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:470:  FSRS_CONSTANTS,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:473:  // TM-03: Classification-based decay constants and functions
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:479:  // REQ-D4-002: Hybrid decay policy
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:481:  HYBRID_FSRS_CONTEXT_TYPES,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:9:import * as sessionManager from '../lib/session/session-manager.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:69:} from '../lib/search/session-transition.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:93:} from '../lib/search/session-state.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100:// Feature catalog: Semantic and lexical search (memory_search)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:190:  includeConstitutional?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:194:  sessionId?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:200:  rerank?: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202:  trackAccess?: boolean; // opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:210:  sessionTransition?: SessionTransitionTrace;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:324:function buildSessionStatePayload(sessionId: string): Record<string, unknown> {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:325:  const session = retrievalSessionStateManager.getOrCreate(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:327:    activeGoal: session.activeGoal,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:328:    seenResultIds: Array.from(session.seenResultIds),
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:329:    openQuestions: [...session.openQuestions],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:330:    preferredAnchors: [...session.preferredAnchors],
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:340:    tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:450:function applySessionDedup(results: MemorySearchRow[], sessionId: string, enableDedup: boolean): DedupResult {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:451:  if (!enableDedup || !sessionId || !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:454:      dedupStats: { enabled: false, sessionId: null }
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:458:  const { filtered, dedupStats } = sessionManager.filterSearchResults(sessionId, results as Parameters<typeof sessionManager.filterSearchResults>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:461:    sessionManager.markResultsSent(sessionId, filtered as Parameters<typeof sessionManager.markResultsSent>[1]);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:468:      sessionId
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:482:/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:507:    includeConstitutional: includeConstitutional = true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:511:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:517:    rerank = true, // Enable reranking by default for better result quality
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519:    trackAccess: trackAccess = false, // opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:527:    sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:533:  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:538:    sessionId: normalizedScope.sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:554:        tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:566:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:594:          tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:613:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:625:      tool: 'memory_search',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:714:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:737:    includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:742:    rerank,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:744:    sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:751:  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:777:        : 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:788:      includeConstitutional,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:795:      rerank,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:797:      sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:801:      trackAccess,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:886:    if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:889:        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:892:        retrievalSessionStateManager.setAnchors(sessionId, anchors);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:895:      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:952:    if (pipelineResult.metadata.stage3.rerankApplied) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:953:      extraData.rerankMetadata = {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:954:        reranking_enabled: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:955:        reranking_requested: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:956:        reranking_applied: true,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:985:      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:986:      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1044:      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1054:  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1062:      const deduped = deduplicateWithSessionState(existingResults, sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1065:      data.sessionDedup = deduped.metadata;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1071:  // Apply session deduplication AFTER cache
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1072:  if (sessionId && enableDedup && sessionManager.isEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1103:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1121:        sessionId,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1146:  if (sessionId && isSessionRetrievalStateEnabled()) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1159:        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1162:      data.sessionState = buildSessionStatePayload(sessionId);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1172:  if (includeTrace && sessionTransition) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1173:    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1178:    retrievalTelemetry.recordTransitionDiagnostics(telemetry, sessionTransition);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1208:        session_id: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1275:            sessionId: sessionId ?? null,
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1314:          trackQueryAndDetect(db, sessionId ?? null, normalizedQuery, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1319:          logResultCited(db, sessionId ?? null, queryId, shownIds);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1374:const handle_memory_search = handleMemorySearch;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1377:  handle_memory_search,
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:4:// Feature catalog: Classification-based decay
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:5:// Augments FSRS stability scores with graph centrality so that
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:6:// Central nodes decay slower and peripheral nodes decay faster.
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:26: * Compute structural freshness by augmenting an FSRS stability score
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:33: * nodes (low centrality) decay faster — reflecting the intuition that
.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:36: * @param stability  - FSRS stability value, clamped to [0, 1].

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Fsrs
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// Augments FSRS stability scores with graph centrality so that
     6	// Central nodes decay slower and peripheral nodes decay faster.
     7	
     8	/* --- 1. INTERFACES --- */
     9	
    10	/**
    11	 * Minimal graph interface required by `computeGraphCentrality`.
    12	 * Defined locally — no imports outside this module's rootDir.
    13	 */
    14	interface MemoryGraphLike {
    15	  /** All graph nodes keyed by node id. */
    16	  nodes: Map<string, unknown>;
    17	  /** Map from node id → list of node ids that point INTO it (inbound edges). */
    18	  inbound: Map<string, string[]>;
    19	  /** Map from node id → list of node ids that this node points TO (outbound edges). */
    20	  outbound: Map<string, string[]>;
    21	}
    22	
    23	/* --- 2. CORE FUNCTIONS --- */
    24	
    25	/**
    26	 * Compute structural freshness by augmenting an FSRS stability score
    27	 * with a graph centrality factor.
    28	 *
    29	 * Formula:
    30	 *   structural_freshness = fsrs_stability * graph_centrality_normalized
    31	 *
    32	 * Central nodes (high centrality) retain more freshness, peripheral
    33	 * nodes (low centrality) decay faster — reflecting the intuition that
    34	 * highly connected knowledge is more reliably accessible over time.
    35	 *
    36	 * @param stability  - FSRS stability value, clamped to [0, 1].
    37	 * @param centrality - Normalized graph centrality value, clamped to [0, 1].
    38	 * @returns Structural freshness score in [0, 1].
    39	 */
    40	export function computeStructuralFreshness(
    41	  stability: number,
    42	  centrality: number
    43	): number {
    44	  const s = Math.min(1, Math.max(0, stability));
    45	  const c = Math.min(1, Math.max(0, centrality));
    46	  return s * c;
    47	}
    48	
    49	/**
    50	 * Compute normalized degree centrality for a node in a graph.
    51	 *
    52	 * Formula:
    53	 *   degree_centrality = (inDegree + outDegree) / (2 * (totalNodes - 1))
    54	 *
    55	 * Normalized to [0, 1]. Returns 0 when:
    56	 * - The node is not found in the graph.
    57	 * - The graph has fewer than 2 nodes (denominator would be 0).
    58	 *
    59	 * @param nodeId - The id of the node to compute centrality for.
    60	 * @param graph  - A memory-graph-like object with `nodes`, `inbound`, and `outbound` maps.
    61	 * @returns Normalized degree centrality in [0, 1].
    62	 */
    63	export function computeGraphCentrality(
    64	  nodeId: string,
    65	  graph: MemoryGraphLike
    66	): number {
    67	  const totalNodes = graph.nodes.size;
    68	
    69	  // Cannot normalize with fewer than 2 nodes.
    70	  if (totalNodes < 2) return 0;
    71	
    72	  // Node must exist in the graph.
    73	  if (!graph.nodes.has(nodeId)) return 0;
    74	
    75	  const inDegree = (graph.inbound.get(nodeId) ?? []).length;
    76	  const outDegree = (graph.outbound.get(nodeId) ?? []).length;
    77	
    78	  const centrality = (inDegree + outDegree) / (2 * (totalNodes - 1));
    79	
    80	  // Clamp to [0, 1] to guard against unexpected edge-list duplication.
    81	  return Math.min(1, Math.max(0, centrality));
    82	}

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Fsrs Scheduler
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// CANONICAL FSRS CONSTANTS & ALGORITHM
     6	// Free Spaced Repetition Scheduler v4 algorithm implementation
     7	//
     8	// TWO-DOMAIN DECAY MODEL (Single Source of Truth)
     9	// Long-term memory (this file):
    10	// FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
    11	// Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
    12	// All long-term decay consumers MUST import constants from this file.
    13	//
    14	// Working memory (working-memory.ts — separate system, intentionally decoupled):
    15	// Linear multiplicative: score * 0.95 per tick
    16	// Timescale: minutes. Operates on session-scoped attention scores only.
    17	//
    18	// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
    19	// Algorithm. All temporal decay for persistent memories should route
    20	// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
    21	// Where t = elapsed days, S = stability (grows with successful reviews).
    22	//
    23	// Consumers: attention-decay.ts (facade), composite-scoring.ts (temporal
    24	// Factor), tier-classifier.ts (state classification),
    25	// Vector-index-impl.js (SQL search ranking).
    26	
    27	import { LEGACY_CONTEXT_TYPE_ALIASES } from '@spec-kit/shared/context-types';
    28	
    29	/* --- 1. CONSTANTS --- */
    30	
    31	/** FSRS v4 algorithm constants */
    32	const FSRS_FACTOR = 19 / 81;
    33	const FSRS_DECAY = -0.5;
    34	
    35	// Derived constant for half-life ↔ stability conversion.
    36	// From R(h) = 0.5: S = (FSRS_FACTOR / 3) * h = (19/243) * h
    37	const FSRS_HALF_LIFE_FACTOR = FSRS_FACTOR / 3; // 19/243 ≈ 0.07819
    38	
    39	/** Grade constants for review scoring */
    40	const GRADE_AGAIN = 1;
    41	const GRADE_HARD = 2;
    42	const GRADE_GOOD = 3;
    43	const GRADE_EASY = 4;
    44	
    45	/** Default initial parameters */
    46	const DEFAULT_INITIAL_STABILITY = 1.0;
    47	const DEFAULT_INITIAL_DIFFICULTY = 5.0;
    48	
    49	/** Difficulty bounds */
    50	const MIN_DIFFICULTY = 1.0;
    51	const MAX_DIFFICULTY = 10.0;
    52	
    53	/** Stability bounds */
    54	const MIN_STABILITY = 0.1;
    55	
    56	/* --- 2. INTERFACES --- */
    57	
    58	interface FsrsParams {
    59	  stability: number;
    60	  difficulty: number;
    61	  lastReview: string | null;
    62	  reviewCount: number;
    63	}
    64	
    65	interface ReviewResult {
    66	  stability: number;
    67	  difficulty: number;
    68	  lastReview: string;
    69	  reviewCount: number;
    70	  nextReviewDate: string;
    71	  retrievability: number;
    72	}
    73	
    74	/* --- 3. CORE FUNCTIONS --- */
    75	
    76	/**
    77	 * Calculate retrievability (probability of recall) using FSRS v4 formula.
    78	 * R(t) = (1 + FACTOR * t / S)^DECAY
    79	 */
    80	function calculateRetrievability(stability: number, elapsedDays: number): number {
    81	  if (stability <= 0 || elapsedDays < 0) {
    82	    return 0;
    83	  }
    84	
    85	  const retrievability = Math.pow(
    86	    1 + FSRS_FACTOR * (elapsedDays / stability),
    87	    FSRS_DECAY
    88	  );
    89	
    90	  return Math.max(0, Math.min(1, retrievability));
    91	}
    92	
    93	/**
    94	 * Update stability based on review grade.
    95	 * Uses simplified FSRS v4 update rules.
    96	 */
    97	function updateStability(
    98	  currentStability: number,
    99	  difficulty: number,
   100	  grade: number,
   101	  retrievability: number
   102	): number {
   103	  const safeStability = Math.max(0, currentStability);
   104	  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, difficulty));
   105	
   106	  if (grade === GRADE_AGAIN) {
   107	    // Lapse: stability decreases significantly
   108	    return Math.max(MIN_STABILITY, safeStability * 0.2);
   109	  }
   110	
   111	  // Success: stability increases based on grade and difficulty
   112	  const difficultyFactor = 1 + (11 - safeDifficulty) * 0.1;
   113	  const gradeFactor = grade === GRADE_EASY ? 1.3 : grade === GRADE_GOOD ? 1.0 : 0.8;
   114	  const retrievabilityBonus = 1 + (1 - retrievability) * 0.5;
   115	
   116	  const newStability = safeStability * difficultyFactor * gradeFactor * retrievabilityBonus;
   117	
   118	  return Math.max(MIN_STABILITY, newStability);
   119	}
   120	
   121	/**
   122	 * Calculate optimal review interval from stability.
   123	 * The interval where retrievability = 0.9 (desired retention).
   124	 */
   125	function calculateOptimalInterval(stability: number, desiredRetention: number = 0.9): number {
   126	  const safeStability = Math.max(0, stability);
   127	
   128	  if (safeStability <= 0 || desiredRetention <= 0 || desiredRetention >= 1) {
   129	    return 0;
   130	  }
   131	
   132	  const interval = (safeStability / FSRS_FACTOR) * (Math.pow(desiredRetention, 1 / FSRS_DECAY) - 1);
   133	
   134	  return Math.max(0, Math.round(Math.max(0, interval)));
   135	}
   136	
   137	/**
   138	 * Update difficulty based on review grade.
   139	 */
   140	function updateDifficulty(currentDifficulty: number, grade: number): number {
   141	  const safeDifficulty = Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, currentDifficulty));
   142	  let newDifficulty: number;
   143	
   144	  if (grade === GRADE_AGAIN) {
   145	    newDifficulty = safeDifficulty + 1.0;
   146	  } else if (grade === GRADE_HARD) {
   147	    newDifficulty = safeDifficulty + 0.5;
   148	  } else if (grade === GRADE_GOOD) {
   149	    newDifficulty = safeDifficulty;
   150	  } else {
   151	    // EASY
   152	    newDifficulty = safeDifficulty - 0.5;
   153	  }
   154	
   155	  return Math.max(MIN_DIFFICULTY, Math.min(MAX_DIFFICULTY, newDifficulty));
   156	}
   157	
   158	/**
   159	 * Calculate elapsed days since last review.
   160	 */
   161	function calculateElapsedDays(lastReview: string | null): number {
   162	  if (!lastReview) {
   163	    return 0;
   164	  }
   165	
   166	  const lastDate = new Date(lastReview);
   167	  if (isNaN(lastDate.getTime())) return 0;
   168	  const now = new Date();
   169	  const diffMs = now.getTime() - lastDate.getTime();
   170	
   171	  return Math.max(0, diffMs / (1000 * 60 * 60 * 24));
   172	}
   173	
   174	/**
   175	 * Get next review date based on stability and desired retention.
   176	 */
   177	function getNextReviewDate(stability: number, desiredRetention: number = 0.9): string {
   178	  const intervalDays = calculateOptimalInterval(stability, desiredRetention);
   179	  const nextDate = new Date();
   180	  nextDate.setDate(nextDate.getDate() + intervalDays);
   181	
   182	  return nextDate.toISOString();
   183	}
   184	
   185	/**
   186	 * Create initial FSRS parameters for a new memory.
   187	 */
   188	function createInitialParams(): FsrsParams {
   189	  return {
   190	    stability: DEFAULT_INITIAL_STABILITY,
   191	    difficulty: DEFAULT_INITIAL_DIFFICULTY,
   192	    lastReview: null,
   193	    reviewCount: 0,
   194	  };
   195	}
   196	
   197	/**
   198	 * Process a review and return updated parameters.
   199	 */
   200	function processReview(params: FsrsParams, grade: number): ReviewResult {
   201	  const elapsedDays = calculateElapsedDays(params.lastReview);
   202	  const retrievability = calculateRetrievability(params.stability, elapsedDays);
   203	
   204	  const newStability = updateStability(params.stability, params.difficulty, grade, retrievability);
   205	  const newDifficulty = updateDifficulty(params.difficulty, grade);
   206	  const now = new Date().toISOString();
   207	  const nextReviewDate = getNextReviewDate(newStability);
   208	
   209	  return {
   210	    stability: newStability,
   211	    difficulty: newDifficulty,
   212	    lastReview: now,
   213	    reviewCount: params.reviewCount + 1,
   214	    nextReviewDate,
   215	    retrievability,
   216	  };
   217	}
   218	
   219	/* --- 4. EXPORTS --- */
   220	
   221	/** Bundled constants object for test/external consumption */
   222	const FSRS_CONSTANTS = {
   223	  FSRS_FACTOR,
   224	  FSRS_DECAY,
   225	  FSRS_HALF_LIFE_FACTOR, // T301: derived constant (19/243)
   226	  GRADE_AGAIN,
   227	  GRADE_HARD,
   228	  GRADE_GOOD,
   229	  GRADE_EASY,
   230	  DEFAULT_STABILITY: DEFAULT_INITIAL_STABILITY,
   231	  DEFAULT_DIFFICULTY: DEFAULT_INITIAL_DIFFICULTY,
   232	  MIN_DIFFICULTY,
   233	  MAX_DIFFICULTY,
   234	  MIN_STABILITY,
   235	} as const;
   236	
   237	/**
   238	 * C138: Tier-based decay multipliers for long-term memory stability.
   239	 * Each tier modifies how quickly memories decay relative to the base FSRS schedule.
   240	 * constitutional = slowest decay (most persistent), scratch = fastest decay (ephemeral).
   241	 *
   242	 * NOTE (TM-03): This multiplier operates on elapsed-time in composite-scoring.ts
   243	 * (lower value = slower perceived time = slower decay). It is a SEPARATE system from
   244	 * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
   245	 * parameter directly. Do NOT apply both to the same memory — use one or the other:
   246	 *   - TIER_MULTIPLIER → used by composite-scoring.ts (elapsed-time adjustment)
   247	 *   - IMPORTANCE_TIER_STABILITY_MULTIPLIER → used by getClassificationDecayMultiplier()
   248	 *     (stability adjustment, activated via SPECKIT_CLASSIFICATION_DECAY env var)
   249	 */
   250	const TIER_MULTIPLIER: Readonly<Record<string, number>> = {
   251	  constitutional: 0.1,
   252	  critical: 0.3,
   253	  important: 0.5,
   254	  normal: 1.0,
   255	  temporary: 2.0,
   256	  scratch: 3.0,
   257	} as const;
   258	
   259	/* --- 4a. CLASSIFICATION-BASED DECAY (TM-03) ---
   260	   Gated by SPECKIT_CLASSIFICATION_DECAY env var.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '260,520p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   260	   Gated by SPECKIT_CLASSIFICATION_DECAY env var.
   261	   Multiplies FSRS stability so that:
   262	     - Infinity stability → R(t) = 1.0 always (no decay)
   263	     - >1.0 stability multiplier → slower decay
   264	     - <1.0 stability multiplier → faster decay */
   265	
   266	/**
   267	 * TM-03: Context-type stability multipliers.
   268	 * Applied to the FSRS stability parameter before computing retrievability.
   269	 * Infinity = no decay (retrievability always 1.0).
   270	 * 2.0 = stability doubled → slower decay.
   271	 * 1.0 = standard FSRS schedule.
   272	 */
   273	const CONTEXT_TYPE_STABILITY_MULTIPLIER: Record<string, number> = {
   274	  planning: Infinity,    // no decay — planning/decisions are permanent
   275	  research: 2.0,         // 2x stability — research context decays slower
   276	  implementation: 1.0,   // standard decay
   277	  general: 1.0,          // standard decay
   278	  // P1-3: Legacy aliases inherit their canonical type's multiplier
   279	  ...Object.fromEntries(
   280	    Object.entries(LEGACY_CONTEXT_TYPE_ALIASES).map(
   281	      ([legacy, canonical]) => [legacy, canonical === 'planning' ? Infinity : canonical === 'research' ? 2.0 : 1.0]
   282	    )
   283	  ),
   284	};
   285	
   286	/**
   287	 * TM-03: Importance-tier stability multipliers.
   288	 * Parallel to TIER_MULTIPLIER but operates on stability (not elapsed time).
   289	 * Used exclusively by getClassificationDecayMultiplier() when
   290	 * SPECKIT_CLASSIFICATION_DECAY is enabled. Do NOT combine with TIER_MULTIPLIER.
   291	 * constitutional/critical: Infinity = never decays.
   292	 * important: 1.5x stability → slower decay.
   293	 * normal: 1.0 → standard.
   294	 * temporary: 0.5x → faster decay (2x relative speed).
   295	 * deprecated: 0.25x → fastest decay (4x relative speed).
   296	 */
   297	const IMPORTANCE_TIER_STABILITY_MULTIPLIER: Record<string, number> = {
   298	  constitutional: Infinity, // never decays
   299	  critical: Infinity,       // never decays
   300	  important: 1.5,           // slower decay
   301	  normal: 1.0,              // standard
   302	  temporary: 0.5,           // faster decay
   303	  deprecated: 0.25,         // fastest decay
   304	};
   305	
   306	/**
   307	 * TM-03: Compute combined stability multiplier from context_type and importance_tier.
   308	 *
   309	 * Logic:
   310	 *   - If either dimension resolves to Infinity, the combined result is Infinity
   311	 *     (no-decay wins unconditionally).
   312	 *   - Unknown context_type or importance_tier values default to 1.0 (standard).
   313	 *   - Combined multiplier = contextMult * tierMult.
   314	 *
   315	 * When the result is Infinity, callers should treat stability as Infinity,
   316	 * which makes R(t) = (1 + factor * t / Infinity)^decay = 1.0 for all t.
   317	 *
   318	 * @param contextType    Memory context_type field (e.g. "decision", "research")
   319	 * @param importanceTier Memory importance_tier field (e.g. "constitutional", "normal")
   320	 * @returns Combined stability multiplier (may be Infinity)
   321	 */
   322	function getClassificationDecayMultiplier(contextType: string, importanceTier: string): number {
   323	  const contextMult = CONTEXT_TYPE_STABILITY_MULTIPLIER[contextType] ?? 1.0;
   324	  const tierMult = IMPORTANCE_TIER_STABILITY_MULTIPLIER[importanceTier] ?? 1.0;
   325	
   326	  // Infinity * anything = Infinity (no-decay wins)
   327	  if (!isFinite(contextMult) || !isFinite(tierMult)) {
   328	    return Infinity;
   329	  }
   330	
   331	  return contextMult * tierMult;
   332	}
   333	
   334	/**
   335	 * TM-03: Apply classification-based decay to a stability value.
   336	 * Gated by SPECKIT_CLASSIFICATION_DECAY env var (must be "true" or "1").
   337	 *
   338	 * Returns stability unchanged when the feature flag is disabled.
   339	 * Returns Infinity when the combined multiplier is Infinity (no-decay).
   340	 *
   341	 * @param stability      Base FSRS stability value
   342	 * @param contextType    Memory context_type field
   343	 * @param importanceTier Memory importance_tier field
   344	 * @returns Adjusted stability value
   345	 */
   346	function applyClassificationDecay(
   347	  stability: number,
   348	  contextType: string,
   349	  importanceTier: string
   350	): number {
   351	  if (isHybridDecayPolicyEnabled() && HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType)) {
   352	    return Infinity;
   353	  }
   354	
   355	  // Graduated: default-ON. Set SPECKIT_CLASSIFICATION_DECAY=false to disable.
   356	  const flag = process.env.SPECKIT_CLASSIFICATION_DECAY?.toLowerCase();
   357	  if (flag === 'false' || flag === '0') {
   358	    return stability;
   359	  }
   360	
   361	  const multiplier = getClassificationDecayMultiplier(contextType, importanceTier);
   362	  if (!isFinite(multiplier)) {
   363	    return Infinity;
   364	  }
   365	
   366	  return stability * multiplier;
   367	}
   368	
   369	/* --- 4b. HYBRID DECAY POLICY (REQ-D4-002) ---
   370	   Gated by SPECKIT_HYBRID_DECAY_POLICY env var (default OFF).
   371	   Distinguishes two classes of memory:
   372	
   373	   1. NO-DECAY documents — context_type in {decision, constitutional, critical}
   374	      These represent permanent knowledge artifacts. Their stability is treated as
   375	      Infinity so R(t) = 1.0 at all times.
   376	
   377	   2. ENGAGEMENT-SENSITIVE documents — all other context_types (session, scratch,
   378	      transient, implementation, discovery, research, general)
   379	      Normal FSRS schedule applies without modification.
   380	
   381	   This is intentionally SEPARATE from TM-03 (applyClassificationDecay) which
   382	   uses a combined context_type × importance_tier multiplier and is default-ON.
   383	   SPECKIT_HYBRID_DECAY_POLICY is default-OFF and must be opted into explicitly.
   384	   DO NOT combine both policies on the same memory. */
   385	
   386	/**
   387	 * Context types that should never decay under the hybrid decay policy.
   388	 * Classified as permanent knowledge artifacts.
   389	 */
   390	const HYBRID_NO_DECAY_CONTEXT_TYPES: ReadonlySet<string> = new Set([
   391	  'planning',
   392	  ...Object.keys(LEGACY_CONTEXT_TYPE_ALIASES).filter(k => LEGACY_CONTEXT_TYPE_ALIASES[k] === 'planning'),
   393	  'constitutional',
   394	  'critical',
   395	]);
   396	const HYBRID_FSRS_CONTEXT_TYPES: ReadonlySet<string> = new Set([
   397	  'session',
   398	  'scratch',
   399	  'transient',
   400	  'implementation',
   401	  'discovery',
   402	  'research',
   403	  'general',
   404	]);
   405	const NO_DECAY = Infinity;
   406	
   407	/**
   408	 * REQ-D4-002: Check whether the hybrid decay policy feature flag is enabled.
   409	 * Default: TRUE (graduated). Set SPECKIT_HYBRID_DECAY_POLICY=false to disable.
   410	 */
   411	function isHybridDecayPolicyEnabled(): boolean {
   412	  const val = process.env.SPECKIT_HYBRID_DECAY_POLICY?.toLowerCase().trim();
   413	  return val !== 'false' && val !== '0';
   414	}
   415	
   416	/**
   417	 * REQ-D4-002: Classify a memory's decay behaviour under the hybrid policy.
   418	 *
   419	 * Returns:
   420	 *   - 'no_decay'       for decision / constitutional / critical context types
   421	 *   - 'fsrs_schedule'  for all engagement-sensitive types (session, scratch, etc.)
   422	 */
   423	type HybridDecayClass = 'no_decay' | 'fsrs_schedule';
   424	
   425	function classifyHybridDecay(contextType: string): HybridDecayClass {
   426	  if (HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType)) {
   427	    return 'no_decay';
   428	  }
   429	  return 'fsrs_schedule';
   430	}
   431	
   432	function getHybridDecayMultiplier(contextType: string, _importanceTier?: string): number {
   433	  if (!isHybridDecayPolicyEnabled()) {
   434	    return 1;
   435	  }
   436	  return HYBRID_NO_DECAY_CONTEXT_TYPES.has(contextType) ? NO_DECAY : 1;
   437	}
   438	
   439	/**
   440	 * REQ-D4-002: Apply the hybrid decay policy to a stability value.
   441	 *
   442	 * When SPECKIT_HYBRID_DECAY_POLICY is OFF (default), returns stability unchanged.
   443	 * When ON:
   444	 *   - decision / constitutional / critical → returns Infinity (no decay)
   445	 *   - all others → returns stability unchanged (normal FSRS schedule)
   446	 *
   447	 * @param stability    Base FSRS stability value
   448	 * @param contextType  Memory context_type field (classified at save time)
   449	 * @returns Adjusted stability: Infinity for no-decay types, original otherwise
   450	 */
   451	function applyHybridDecayPolicy(stability: number, contextType: string, importanceTier?: string): number {
   452	  const multiplier = getHybridDecayMultiplier(contextType, importanceTier);
   453	  return Number.isFinite(multiplier) ? stability * multiplier : NO_DECAY;
   454	}
   455	
   456	export {
   457	  // Constants
   458	  FSRS_FACTOR,
   459	  FSRS_DECAY,
   460	  FSRS_HALF_LIFE_FACTOR, // T301: derived constant for half-life ↔ stability
   461	  GRADE_AGAIN,
   462	  GRADE_HARD,
   463	  GRADE_GOOD,
   464	  GRADE_EASY,
   465	  DEFAULT_INITIAL_STABILITY,
   466	  DEFAULT_INITIAL_DIFFICULTY,
   467	  MIN_DIFFICULTY,
   468	  MAX_DIFFICULTY,
   469	  MIN_STABILITY,
   470	  FSRS_CONSTANTS,
   471	  TIER_MULTIPLIER,
   472	
   473	  // TM-03: Classification-based decay constants and functions
   474	  CONTEXT_TYPE_STABILITY_MULTIPLIER,
   475	  IMPORTANCE_TIER_STABILITY_MULTIPLIER,
   476	  getClassificationDecayMultiplier,
   477	  applyClassificationDecay,
   478	
   479	  // REQ-D4-002: Hybrid decay policy
   480	  NO_DECAY,
   481	  HYBRID_FSRS_CONTEXT_TYPES,
   482	  HYBRID_NO_DECAY_CONTEXT_TYPES,
   483	  isHybridDecayPolicyEnabled,
   484	  classifyHybridDecay,
   485	  getHybridDecayMultiplier,
   486	  applyHybridDecayPolicy,
   487	
   488	  // Core functions
   489	  calculateRetrievability,
   490	  updateStability,
   491	  calculateOptimalInterval,
   492	  updateDifficulty,
   493	  calculateElapsedDays,
   494	  getNextReviewDate,
   495	  createInitialParams,
   496	  processReview,
   497	};
   498	
   499	export type {
   500	  FsrsParams,
   501	  ReviewResult,
   502	  HybridDecayClass,
   503	};

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '482,860p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   482	/** Handle memory_search tool — performs hybrid vector/BM25 search with intent-aware ranking.
   483	 * @param args - Search arguments (query, concepts, mode, specFolder, etc.)
   484	 * @returns MCP response with ranked search results
   485	 */
   486	async function handleMemorySearch(args: SearchArgs): Promise<MCPResponse> {
   487	  const _searchStartTime = Date.now();
   488	  resetLastLexicalCapabilitySnapshot();
   489	  // BUG-001: Check for external database updates before processing
   490	  await checkDatabaseUpdated();
   491	
   492	  const {
   493	    cursor,
   494	    query,
   495	    concepts,
   496	    specFolder,
   497	    folderBoost,
   498	    tenantId,
   499	    userId,
   500	    agentId,
   501	    sharedSpaceId,
   502	    limit: rawLimit = 10,
   503	    tier,
   504	    contextType,
   505	    useDecay: useDecay = true,
   506	    includeContiguity: includeContiguity = false,
   507	    includeConstitutional: includeConstitutional = true,
   508	    includeContent: includeContent = false,
   509	    anchors,
   510	    bypassCache: bypassCache = false,
   511	    sessionId,
   512	    enableDedup: enableDedup = true,
   513	    intent: explicitIntent,
   514	    autoDetectIntent: autoDetectIntent = true,
   515	    minState,  // No default — memoryState column not yet in schema; defaulting to 'WARM' filters all rows
   516	    applyStateLimits: applyStateLimits = false,
   517	    rerank = true, // Enable reranking by default for better result quality
   518	    applyLengthPenalty: applyLengthPenalty = true,
   519	    trackAccess: trackAccess = false, // opt-in, off by default
   520	    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
   521	    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
   522	    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
   523	    minQualityScore,
   524	    min_quality_score,
   525	    mode,
   526	    includeTrace: includeTraceArg = false,
   527	    sessionTransition,
   528	    profile,
   529	    retrievalLevel: retrievalLevel = 'auto',
   530	  } = args;
   531	  const includeTraceByFlag = process.env.SPECKIT_RESPONSE_TRACE === 'true';
   532	  const includeTrace = includeTraceByFlag || includeTraceArg === true;
   533	  const normalizedScope = normalizeScopeContext({ tenantId, userId, agentId, sessionId, sharedSpaceId });
   534	  const progressiveScopeKey = JSON.stringify({
   535	    tenantId: normalizedScope.tenantId ?? null,
   536	    userId: normalizedScope.userId ?? null,
   537	    agentId: normalizedScope.agentId ?? null,
   538	    sessionId: normalizedScope.sessionId ?? null,
   539	    sharedSpaceId: normalizedScope.sharedSpaceId ?? null,
   540	  });
   541	
   542	  // Validate at least one search input is provided (moved from schema superRefine for GPT compatibility)
   543	  const hasCursor = typeof cursor === 'string' && cursor.trim().length > 0;
   544	  const hasQuery = typeof query === 'string' && query.trim().length > 0;
   545	  const hasConcepts = Array.isArray(concepts) && concepts.length >= 2;
   546	  if (!hasCursor && !hasQuery && !hasConcepts) {
   547	    return { content: [{ type: 'text', text: JSON.stringify({ error: 'Either "query" (string), "concepts" (array with 2-5 items), or "cursor" (string) is required.' }) }] };
   548	  }
   549	
   550	  if (hasCursor) {
   551	    const resolved = resolveCursor(cursor.trim(), undefined, { scopeKey: progressiveScopeKey });
   552	    if (!resolved) {
   553	      return createMCPErrorResponse({
   554	        tool: 'memory_search',
   555	        error: 'Cursor is invalid, expired, or out of scope',
   556	        code: 'E_VALIDATION',
   557	        details: { parameter: 'cursor' },
   558	        recovery: {
   559	          hint: 'Retry the original search to generate a fresh continuation cursor',
   560	        },
   561	      });
   562	    }
   563	
   564	    const snippetResults = extractSnippets(resolved.results);
   565	    return createMCPSuccessResponse({
   566	      tool: 'memory_search',
   567	      summary: `Returned ${snippetResults.length} continuation results`,
   568	      data: {
   569	        count: snippetResults.length,
   570	        results: snippetResults,
   571	        continuation: resolved.continuation,
   572	      },
   573	      startTime: _searchStartTime,
   574	      cacheHit: false,
   575	    });
   576	  }
   577	
   578	  const qualityThreshold = resolveQualityThreshold(minQualityScore, min_quality_score);
   579	
   580	  // Validate numeric limit parameter
   581	  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
   582	    ? Math.min(Math.floor(rawLimit), 100)
   583	    : 10;
   584	
   585	  // BUG-007: Validate query first with proper error handling
   586	  let normalizedQuery: string | null = null;
   587	  if (query !== undefined) {
   588	    try {
   589	      normalizedQuery = validateQuery(query);
   590	    } catch (validationError: unknown) {
   591	      if (!concepts || !Array.isArray(concepts) || concepts.length < 2) {
   592	        const message = toErrorMessage(validationError);
   593	        return createMCPErrorResponse({
   594	          tool: 'memory_search',
   595	          error: message,
   596	          code: 'E_VALIDATION',
   597	          details: { parameter: 'query' },
   598	          recovery: {
   599	            hint: 'Provide a valid query string or use concepts array instead'
   600	          }
   601	        });
   602	      }
   603	      normalizedQuery = null;
   604	    }
   605	  }
   606	
   607	  const hasValidQuery = normalizedQuery !== null;
   608	  const hasValidConcepts = Array.isArray(concepts) && concepts.length >= 2;
   609	  const effectiveQuery = normalizedQuery ?? (hasValidConcepts ? concepts.join(', ') : '');
   610	
   611	  if (!hasValidQuery && !hasValidConcepts) {
   612	    return createMCPErrorResponse({
   613	      tool: 'memory_search',
   614	      error: 'Either query (string), concepts (array of 2-5 strings), or cursor (string) is required',
   615	      code: 'E_VALIDATION',
   616	      details: { parameter: 'query' },
   617	      recovery: {
   618	        hint: 'Provide a query string, concepts array with 2-5 entries, or a continuation cursor'
   619	      }
   620	    });
   621	  }
   622	
   623	  if (specFolder !== undefined && typeof specFolder !== 'string') {
   624	    return createMCPErrorResponse({
   625	      tool: 'memory_search',
   626	      error: 'specFolder must be a string',
   627	      code: 'E_VALIDATION',
   628	      details: { parameter: 'specFolder' },
   629	      recovery: {
   630	        hint: 'Provide specFolder as a string path'
   631	      }
   632	    });
   633	  }
   634	
   635	  // Eval logger — capture query at pipeline entry (fail-safe)
   636	  let _evalQueryId = 0;
   637	  let _evalRunId = 0;
   638	  try {
   639	    const evalEntry = logSearchQuery({
   640	      query: effectiveQuery,
   641	      intent: explicitIntent ?? null,
   642	      specFolder: specFolder ?? null,
   643	    });
   644	    _evalQueryId = evalEntry.queryId;
   645	    _evalRunId = evalEntry.evalRunId;
   646	  } catch (_error: unknown) { /* eval logging must never break search */ }
   647	
   648	  const artifactRoutingQuery = resolveArtifactRoutingQuery(
   649	    normalizedQuery,
   650	    hasValidConcepts ? concepts : undefined
   651	  );
   652	  let artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder);
   653	
   654	  // Intent-aware retrieval
   655	  let detectedIntent: string | null = null;
   656	  let intentConfidence = 0;
   657	  let intentWeights: IntentWeights | null = null;
   658	
   659	  if (explicitIntent) {
   660	    if (intentClassifier.isValidIntent(explicitIntent)) {
   661	      detectedIntent = explicitIntent;
   662	      intentConfidence = 1.0;
   663	      intentWeights = intentClassifier.getIntentWeights(explicitIntent);
   664	    } else {
   665	      console.warn(`[memory-search] Invalid intent '${explicitIntent}', using auto-detection`);
   666	    }
   667	  }
   668	
   669	  if (!detectedIntent && autoDetectIntent && hasValidQuery) {
   670	    const classification: IntentClassification = intentClassifier.classifyIntent(normalizedQuery!);
   671	    detectedIntent = classification.intent;
   672	    intentConfidence = classification.confidence;
   673	    intentWeights = intentClassifier.getIntentWeights(classification.intent as IntentType);
   674	
   675	    if (classification.fallback) {
   676	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (fallback: ${classification.reason})`);
   677	    } else {
   678	      console.error(`[memory-search] Intent auto-detected as '${detectedIntent}' (confidence: ${intentConfidence.toFixed(2)})`);
   679	    }
   680	  }
   681	
   682	  // FIX RC3-B: Intent confidence floor — override low-confidence auto-detections to "understand"
   683	  const INTENT_CONFIDENCE_FLOOR = parseFloat(process.env.SPECKIT_INTENT_CONFIDENCE_FLOOR || '0.25');
   684	  if (detectedIntent && intentConfidence < INTENT_CONFIDENCE_FLOOR && !explicitIntent) {
   685	    console.error(`[memory-search] Intent confidence ${intentConfidence.toFixed(3)} below floor ${INTENT_CONFIDENCE_FLOOR}, overriding '${detectedIntent}' → 'understand'`);
   686	    detectedIntent = 'understand';
   687	    intentConfidence = 1.0;
   688	    intentWeights = intentClassifier.getIntentWeights('understand' as IntentType);
   689	  }
   690	
   691	  // Phase C: Intent-to-profile auto-routing.
   692	  // Explicit caller `profile` always takes precedence; auto-detect fills in when absent.
   693	  let effectiveProfile: string | undefined = profile;
   694	  if (!effectiveProfile && detectedIntent && isIntentAutoProfileEnabled()) {
   695	    try {
   696	      const autoProfile = intentClassifier.getProfileForIntent(detectedIntent as IntentType);
   697	      if (autoProfile) {
   698	        effectiveProfile = autoProfile;
   699	        console.error(`[memory-search] Intent-to-profile auto-routing: '${detectedIntent}' → profile '${autoProfile}'`);
   700	      }
   701	    } catch (_autoProfileErr: unknown) {
   702	      // Auto-profile is best-effort — never breaks search
   703	    }
   704	  }
   705	
   706	  // Re-run artifact routing with detected intent for fallback coverage
   707	  if (detectedIntent && artifactRouting?.detectedClass === 'unknown' && artifactRouting?.confidence === 0) {
   708	    artifactRouting = getStrategyForQuery(artifactRoutingQuery, specFolder, detectedIntent);
   709	  }
   710	
   711	  // Create retrieval trace at pipeline entry
   712	  const trace = createTrace(
   713	    effectiveQuery,
   714	    sessionId,
   715	    detectedIntent || undefined
   716	  );
   717	
   718	  // Build cache key args
   719	  const cacheArgs = buildCacheArgs({
   720	    normalizedQuery,
   721	    hasValidConcepts,
   722	    concepts,
   723	    specFolder,
   724	    tenantId: normalizedScope.tenantId,
   725	    userId: normalizedScope.userId,
   726	    agentId: normalizedScope.agentId,
   727	    sharedSpaceId: normalizedScope.sharedSpaceId,
   728	    limit,
   729	    mode,
   730	    tier,
   731	    contextType,
   732	    useDecay,
   733	    includeArchived,
   734	    qualityThreshold,
   735	    applyStateLimits,
   736	    includeContiguity,
   737	    includeConstitutional,
   738	    includeContent,
   739	    anchors,
   740	    detectedIntent,
   741	    minState: minState ?? '',
   742	    rerank,
   743	    applyLengthPenalty,
   744	    sessionId,
   745	    enableSessionBoost,
   746	    enableCausalBoost,
   747	    includeTrace,
   748	  });
   749	
   750	  let _evalChannelPayloads: EvalChannelPayload[] = [];
   751	  const cacheKey = toolCache.generateCacheKey('memory_search', cacheArgs);
   752	  const cacheEnabled = toolCache.isEnabled() && !bypassCache;
   753	  const cachedPayload = cacheEnabled
   754	    ? toolCache.get<SearchCachePayload>(cacheKey)
   755	    : null;
   756	
   757	  let responseToReturn: MCPResponse;
   758	  let goalRefinementPayload: Record<string, unknown> | null = null;
   759	
   760	  if (cachedPayload) {
   761	    responseToReturn = buildSearchResponseFromPayload(cachedPayload, _searchStartTime, true);
   762	  } else {
   763	    // Wait for embedding model only on cache miss
   764	    if (!isEmbeddingModelReady()) {
   765	      const modelReady = await waitForEmbeddingModel(30000);
   766	      if (!modelReady) {
   767	        throw new Error('Embedding model not ready after 30s timeout. Try again later.');
   768	      }
   769	    }
   770	
   771	    // V2 pipeline is the only path (legacy V1 removed from the runtime pipeline)
   772	    const pipelineConfig: PipelineConfig = {
   773	      query: effectiveQuery,
   774	      concepts: hasValidConcepts ? concepts : undefined,
   775	      searchType: (hasValidConcepts && concepts!.length >= 2)
   776	        ? 'multi-concept'
   777	        : 'hybrid',
   778	      mode,
   779	      limit,
   780	      specFolder,
   781	      tenantId: normalizedScope.tenantId,
   782	      userId: normalizedScope.userId,
   783	      agentId: normalizedScope.agentId,
   784	      sharedSpaceId: normalizedScope.sharedSpaceId,
   785	      tier,
   786	      contextType,
   787	      includeArchived,
   788	      includeConstitutional,
   789	      includeContent,
   790	      anchors,
   791	      qualityThreshold,
   792	      minState: minState ?? '',
   793	      applyStateLimits,
   794	      useDecay,
   795	      rerank,
   796	      applyLengthPenalty,
   797	      sessionId,
   798	      enableDedup,
   799	      enableSessionBoost,
   800	      enableCausalBoost,
   801	      trackAccess,
   802	      detectedIntent,
   803	      intentConfidence,
   804	      intentWeights: toIntentWeightsConfig(intentWeights),
   805	      artifactRouting: artifactRouting as unknown as PipelineConfig['artifactRouting'],
   806	      trace,
   807	    };
   808	
   809	    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
   810	    let resultsForFormatting = pipelineResult.results as unknown as SessionAwareResult[];
   811	
   812	    // Phase B T018/T019: Community search fallback — inject community members on weak results
   813	    let communityFallbackApplied = false;
   814	    const shouldRunCommunitySearch = (
   815	      isDualRetrievalEnabled() &&
   816	      isCommunitySearchFallbackEnabled() &&
   817	      effectiveQuery.length > 0 &&
   818	      (retrievalLevel === 'global' || retrievalLevel === 'auto')
   819	    );
   820	    if (shouldRunCommunitySearch) {
   821	      const isWeakResult = resultsForFormatting.length === 0 ||
   822	        (retrievalLevel === 'global') ||
   823	        (resultsForFormatting.length < 3 && retrievalLevel === 'auto');
   824	      if (isWeakResult) {
   825	        try {
   826	          const communityResults = searchCommunities(effectiveQuery, requireDb(), 5);
   827	          if (communityResults.totalMemberIds.length > 0) {
   828	            // Fetch the actual memory rows for community member IDs
   829	            const memberIds = communityResults.totalMemberIds.slice(0, 20);
   830	            const placeholders = memberIds.map(() => '?').join(', ');
   831	            const db = requireDb();
   832	            const memberRows = db.prepare(`
   833	              SELECT id, title, similarity, content, file_path, importance_tier, context_type,
   834	                     quality_score, created_at
   835	              FROM memory_index
   836	              WHERE id IN (${placeholders})
   837	            `).all(...memberIds) as Array<Record<string, unknown> & { id: number }>;
   838	
   839	            if (memberRows.length > 0) {
   840	              // Mark community-sourced results and assign a base score
   841	              const communityRows = memberRows.map((row) => ({
   842	                ...row,
   843	                similarity: typeof row.similarity === 'number' ? row.similarity : 0.5,
   844	                score: 0.45,
   845	                _communityFallback: true,
   846	              }));
   847	              // Merge: append community results not already in pipeline results
   848	              const existingIds = new Set(resultsForFormatting.map((r) => (r as Record<string, unknown>).id as number));
   849	              const newRows = communityRows.filter((r) => !existingIds.has(r.id));
   850	              if (newRows.length > 0) {
   851	                resultsForFormatting = [...resultsForFormatting, ...newRows as unknown as SessionAwareResult[]];
   852	                communityFallbackApplied = true;
   853	              }
   854	            }
   855	          }
   856	        } catch (err: unknown) {
   857	          const msg = err instanceof Error ? err.message : String(err);
   858	          console.warn(`[memory-search] Community search fallback failed (fail-open): ${msg}`);
   859	        }
   860	      }

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '860,1210p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   860	      }
   861	    }
   862	
   863	    // Fix 4 (RC1-B): Apply folder boost — multiply similarity for results matching discovered folder
   864	    if (folderBoost && folderBoost.folder && folderBoost.factor > 1) {
   865	      let boostedCount = 0;
   866	      for (const r of resultsForFormatting) {
   867	        const filePath = (r as Record<string, unknown>).file_path as string | undefined;
   868	        if (filePath && filePath.includes(folderBoost.folder)) {
   869	          const raw = (r as Record<string, unknown>);
   870	          if (typeof raw.similarity === 'number') {
   871	            raw.similarity = Math.min(raw.similarity * folderBoost.factor, 1.0);
   872	            boostedCount++;
   873	          }
   874	        }
   875	      }
   876	      // Re-sort by similarity after boosting
   877	      if (boostedCount > 0) {
   878	        resultsForFormatting.sort((a, b) => {
   879	          const sa = (a as Record<string, unknown>).similarity as number ?? 0;
   880	          const sb = (b as Record<string, unknown>).similarity as number ?? 0;
   881	          return sb - sa;
   882	        });
   883	      }
   884	    }
   885	
   886	    if (sessionId && isSessionRetrievalStateEnabled()) {
   887	      const activeGoal = effectiveQuery.trim().length > 0 ? effectiveQuery : null;
   888	      if (activeGoal) {
   889	        retrievalSessionStateManager.updateGoal(sessionId, activeGoal);
   890	      }
   891	      if (Array.isArray(anchors) && anchors.length > 0) {
   892	        retrievalSessionStateManager.setAnchors(sessionId, anchors);
   893	      }
   894	
   895	      const goalRefinement = refineForGoal(resultsForFormatting, sessionId);
   896	      resultsForFormatting = goalRefinement.results as SessionAwareResult[];
   897	      goalRefinementPayload = {
   898	        activeGoal: goalRefinement.metadata.activeGoal,
   899	        applied: goalRefinement.metadata.refined,
   900	        boostedCount: goalRefinement.metadata.boostedCount,
   901	      };
   902	    }
   903	
   904	    // Build extra data from pipeline metadata for response formatting
   905	    const lexicalCapability = getLastLexicalCapabilitySnapshot();
   906	    if (lexicalCapability) {
   907	      console.error(
   908	        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
   909	      );
   910	    }
   911	
   912	    const extraData: Record<string, unknown> = {
   913	      stateStats: pipelineResult.annotations.stateStats,
   914	      featureFlags: {
   915	        ...pipelineResult.annotations.featureFlags,
   916	      },
   917	      pipelineMetadata: pipelineResult.metadata,
   918	    };
   919	    if (lexicalCapability) {
   920	      extraData.lexicalPath = lexicalCapability.lexicalPath;
   921	      extraData.fallbackState = lexicalCapability.fallbackState;
   922	    }
   923	
   924	    if (pipelineResult.annotations.evidenceGapWarning) {
   925	      extraData.evidenceGapWarning = pipelineResult.annotations.evidenceGapWarning;
   926	    }
   927	
   928	    if (detectedIntent) {
   929	      extraData.intent = {
   930	        type: detectedIntent,
   931	        confidence: intentConfidence,
   932	        description: intentClassifier.getIntentDescription(detectedIntent as IntentType),
   933	        weightsApplied: pipelineResult.metadata.stage2.intentWeightsApplied,
   934	      };
   935	    }
   936	
   937	    if (artifactRouting) {
   938	      extraData.artifactRouting = artifactRouting;
   939	      extraData.artifact_routing = artifactRouting;
   940	    }
   941	
   942	    if (pipelineResult.metadata.stage2.feedbackSignalsApplied === 'applied') {
   943	      extraData.feedbackSignals = { applied: true };
   944	      extraData.feedback_signals = { applied: true };
   945	    }
   946	
   947	    if (pipelineResult.metadata.stage2.graphContribution) {
   948	      extraData.graphContribution = pipelineResult.metadata.stage2.graphContribution;
   949	      extraData.graph_contribution = pipelineResult.metadata.stage2.graphContribution;
   950	    }
   951	
   952	    if (pipelineResult.metadata.stage3.rerankApplied) {
   953	      extraData.rerankMetadata = {
   954	        reranking_enabled: true,
   955	        reranking_requested: true,
   956	        reranking_applied: true,
   957	      };
   958	    }
   959	
   960	    if (pipelineResult.metadata.stage3.chunkReassemblyStats.chunkParents > 0) {
   961	      extraData.chunkReassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
   962	      extraData.chunk_reassembly = pipelineResult.metadata.stage3.chunkReassemblyStats;
   963	    }
   964	
   965	    if (pipelineResult.trace) {
   966	      extraData.retrievalTrace = pipelineResult.trace;
   967	    }
   968	    try {
   969	      const adaptiveShadow = buildAdaptiveShadowProposal(
   970	        requireDb(),
   971	        effectiveQuery,
   972	        resultsForFormatting as Array<Record<string, unknown> & { id: number }>,
   973	      );
   974	      if (adaptiveShadow) {
   975	        extraData.adaptiveShadow = adaptiveShadow;
   976	        extraData.adaptive_shadow = adaptiveShadow;
   977	      }
   978	    } catch (_error: unknown) {
   979	      // Adaptive proposal logging is best-effort only
   980	    }
   981	
   982	    _evalChannelPayloads = buildEvalChannelPayloads(resultsForFormatting);
   983	
   984	    const appliedBoosts: Record<string, unknown> = {
   985	      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
   986	      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
   987	    };
   988	    if (folderBoost && folderBoost.folder) {
   989	      appliedBoosts.folder = { applied: true, folder: folderBoost.folder, factor: folderBoost.factor };
   990	    }
   991	    if (communityFallbackApplied) {
   992	      appliedBoosts.communityFallback = { applied: true, retrievalLevel };
   993	    }
   994	    extraData.appliedBoosts = appliedBoosts;
   995	    extraData.applied_boosts = appliedBoosts;
   996	
   997	    let formatted = await formatSearchResults(
   998	      resultsForFormatting as RawSearchResult[],
   999	      pipelineConfig.searchType,
  1000	      includeContent,
  1001	      anchors,
  1002	      null,
  1003	      null,
  1004	      extraData,
  1005	      includeTrace,
  1006	      normalizedQuery,   // REQ-D5-001/D5-004: pass query for recovery + confidence context
  1007	      specFolder ?? null // REQ-D5-001: pass specFolder for recovery narrowing detection
  1008	    );
  1009	
  1010	    // Prepend evidence gap warning if present
  1011	    if (pipelineResult.annotations.evidenceGapWarning && formatted?.content?.[0]?.text) {
  1012	      try {
  1013	        const parsed = JSON.parse(formatted.content[0].text) as Record<string, unknown>;
  1014	        if (typeof parsed.summary === 'string') {
  1015	          parsed.summary = `${pipelineResult.annotations.evidenceGapWarning}\n\n${parsed.summary}`;
  1016	          formatted.content[0].text = JSON.stringify(parsed, null, 2);
  1017	        }
  1018	      } catch (_error: unknown) {
  1019	        // Non-fatal
  1020	      }
  1021	    }
  1022	
  1023	    if (isProgressiveDisclosureEnabled()) {
  1024	      const parsedFormatted = parseResponseEnvelope(formatted);
  1025	      if (parsedFormatted) {
  1026	        const data = parsedFormatted.envelope.data && typeof parsedFormatted.envelope.data === 'object'
  1027	          ? parsedFormatted.envelope.data as Record<string, unknown>
  1028	          : {};
  1029	        data.progressiveDisclosure = buildProgressiveResponse(
  1030	          resultsForFormatting,
  1031	          undefined,
  1032	          effectiveQuery,
  1033	          { scopeKey: progressiveScopeKey },
  1034	        );
  1035	        parsedFormatted.envelope.data = data;
  1036	        formatted = replaceResponseEnvelope(formatted, parsedFormatted.firstEntry, parsedFormatted.envelope);
  1037	      }
  1038	    }
  1039	
  1040	    formatted = applyPublicationGateToResponse(formatted);
  1041	
  1042	    const cachePayload = extractSearchCachePayload(formatted);
  1043	    if (cachePayload && cacheEnabled) {
  1044	      toolCache.set(cacheKey, cachePayload, { toolName: 'memory_search' });
  1045	    }
  1046	
  1047	    responseToReturn = cachePayload
  1048	      ? buildSearchResponseFromPayload(cachePayload, _searchStartTime, false)
  1049	      : formatted;
  1050	  }
  1051	
  1052	  responseToReturn = applyPublicationGateToResponse(responseToReturn);
  1053	
  1054	  if (sessionId && isSessionRetrievalStateEnabled() && !sessionManager.isEnabled()) {
  1055	    const parsedResponse = parseResponseEnvelope(responseToReturn);
  1056	    const data = parsedResponse?.envelope.data && typeof parsedResponse.envelope.data === 'object'
  1057	      ? parsedResponse.envelope.data as Record<string, unknown>
  1058	      : null;
  1059	      const existingResults = Array.isArray(data?.results) ? data.results as SessionAwareResult[] : null;
  1060	
  1061	    if (parsedResponse && data && existingResults && existingResults.length > 0) {
  1062	      const deduped = deduplicateWithSessionState(existingResults, sessionId);
  1063	      data.results = deduped.results as SessionAwareResult[];
  1064	      data.count = deduped.results.length;
  1065	      data.sessionDedup = deduped.metadata;
  1066	      parsedResponse.envelope.data = data;
  1067	      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
  1068	    }
  1069	  }
  1070	
  1071	  // Apply session deduplication AFTER cache
  1072	  if (sessionId && enableDedup && sessionManager.isEnabled()) {
  1073	    let resultsData: Record<string, unknown> | null = null;
  1074	    if (responseToReturn?.content?.[0]?.text && typeof responseToReturn.content[0].text === 'string') {
  1075	      try {
  1076	        resultsData = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1077	      } catch (err: unknown) {
  1078	        const message = toErrorMessage(err);
  1079	        console.warn('[memory-search] Failed to parse cached response for dedup:', message);
  1080	        resultsData = null;
  1081	      }
  1082	    } else if (responseToReturn && typeof responseToReturn === 'object') {
  1083	      resultsData = responseToReturn as unknown as Record<string, unknown>;
  1084	    }
  1085	
  1086	    // P1-018 — Validate response shape before dedup. If the cached response
  1087	    // Doesn't have the expected data.results array, log a warning and skip dedup
  1088	    // Rather than silently falling through to the un-deduped response.
  1089	    const data = (resultsData && typeof resultsData.data === 'object' && resultsData.data !== null)
  1090	      ? resultsData.data as Record<string, unknown>
  1091	      : null;
  1092	    const existingResults = Array.isArray(data?.results) ? data.results as MemorySearchRow[] : null;
  1093	
  1094	    if (resultsData && !data) {
  1095	      console.warn('[memory-search] Cached response shape mismatch: missing "data" object, skipping dedup');
  1096	    } else if (data && !existingResults) {
  1097	      console.warn('[memory-search] Cached response shape mismatch: "data.results" is not an array, skipping dedup');
  1098	    }
  1099	
  1100	    if (resultsData && data && existingResults && existingResults.length > 0) {
  1101	      const { results: dedupedResults } = applySessionDedup(
  1102	        existingResults,
  1103	        sessionId,
  1104	        enableDedup
  1105	      );
  1106	
  1107	      const originalCount = existingResults.length;
  1108	      const dedupedCount = dedupedResults.length;
  1109	      const filteredCount = originalCount - dedupedCount;
  1110	
  1111	      const tokensSaved = filteredCount * 200;
  1112	      const savingsPercent = originalCount > 0
  1113	        ? Math.round((filteredCount / originalCount) * 100)
  1114	        : 0;
  1115	
  1116	      data.results = dedupedResults;
  1117	      data.count = dedupedCount;
  1118	
  1119	      const dedupStats = {
  1120	        enabled: true,
  1121	        sessionId,
  1122	        originalCount: originalCount,
  1123	        returnedCount: dedupedCount,
  1124	        filteredCount: filteredCount,
  1125	        tokensSaved: tokensSaved,
  1126	        savingsPercent: savingsPercent,
  1127	        tokenSavingsEstimate: tokensSaved > 0 ? `~${tokensSaved} tokens` : '0'
  1128	      };
  1129	      resultsData.dedupStats = dedupStats;
  1130	
  1131	      if (resultsData.meta && typeof resultsData.meta === 'object') {
  1132	        (resultsData.meta as Record<string, unknown>).dedupStats = dedupStats;
  1133	      }
  1134	
  1135	      if (filteredCount > 0 && typeof resultsData.summary === 'string') {
  1136	        resultsData.summary += ` (${filteredCount} duplicates filtered, ~${tokensSaved} tokens saved)`;
  1137	      }
  1138	
  1139	      responseToReturn = {
  1140	        ...responseToReturn,
  1141	        content: [{ type: 'text', text: JSON.stringify(resultsData, null, 2) }]
  1142	      } as MCPResponse;
  1143	    }
  1144	  }
  1145	
  1146	  if (sessionId && isSessionRetrievalStateEnabled()) {
  1147	    const parsedResponse = parseResponseEnvelope(responseToReturn);
  1148	    const data = parsedResponse?.envelope.data && typeof parsedResponse.envelope.data === 'object'
  1149	      ? parsedResponse.envelope.data as Record<string, unknown>
  1150	      : null;
  1151	    const existingResults = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1152	
  1153	    if (parsedResponse && data) {
  1154	      const returnedIds = existingResults
  1155	        .map((result) => result.id ?? result.resultId)
  1156	        .filter((id): id is string | number => typeof id === 'string' || typeof id === 'number');
  1157	
  1158	      if (returnedIds.length > 0) {
  1159	        retrievalSessionStateManager.markSeen(sessionId, returnedIds);
  1160	      }
  1161	
  1162	      data.sessionState = buildSessionStatePayload(sessionId);
  1163	      if (goalRefinementPayload) {
  1164	        data.goalRefinement = goalRefinementPayload;
  1165	      }
  1166	
  1167	      parsedResponse.envelope.data = data;
  1168	      responseToReturn = replaceResponseEnvelope(responseToReturn, parsedResponse.firstEntry, parsedResponse.envelope);
  1169	    }
  1170	  }
  1171	
  1172	  if (includeTrace && sessionTransition) {
  1173	    responseToReturn = attachSessionTransitionTrace(responseToReturn, sessionTransition);
  1174	  }
  1175	
  1176	  if (retrievalTelemetry.isExtendedTelemetryEnabled()) {
  1177	    const telemetry = retrievalTelemetry.createTelemetry();
  1178	    retrievalTelemetry.recordTransitionDiagnostics(telemetry, sessionTransition);
  1179	    retrievalTelemetry.recordGraphWalkDiagnostics(
  1180	      telemetry,
  1181	      summarizeGraphWalkDiagnostics(extractResponseResults(responseToReturn)),
  1182	    );
  1183	    responseToReturn = attachTelemetryMeta(responseToReturn, retrievalTelemetry.toJSON(telemetry));
  1184	  }
  1185	
  1186	  // Consumption instrumentation — log search event (fail-safe, never throws)
  1187	  try {
  1188	    const db = (() => { try { return requireDb(); } catch (_error: unknown) { return null; } })();
  1189	    if (db) {
  1190	      initConsumptionLog(db);
  1191	      let resultIds: number[] = [];
  1192	      let resultCount = 0;
  1193	      try {
  1194	        if (responseToReturn?.content?.[0]?.text) {
  1195	          const parsed = JSON.parse(responseToReturn.content[0].text) as Record<string, unknown>;
  1196	          const data = parsed?.data as Record<string, unknown> | undefined;
  1197	          const results = Array.isArray(data?.results) ? data.results as Array<Record<string, unknown>> : [];
  1198	          resultIds = results.map(r => r.id as number).filter(id => typeof id === 'number');
  1199	          resultCount = Array.isArray(data?.results) ? (data.results as unknown[]).length : 0;
  1200	        }
  1201	      } catch (_error: unknown) { /* ignore parse errors */ }
  1202	      logConsumptionEvent(db, {
  1203	        event_type: 'search',
  1204	        query_text: effectiveQuery || null,
  1205	        intent: detectedIntent,
  1206	        result_count: resultCount,
  1207	        result_ids: resultIds,
  1208	        session_id: sessionId ?? null,
  1209	        latency_ms: Date.now() - _searchStartTime,
  1210	        spec_folder_filter: specFolder ?? null,

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package vault
     2	
     3	import (
     4		"encoding/json"
     5		"fmt"
     6		"os"
     7		"path/filepath"
     8		"strings"
     9	
    10		"github.com/GetModus/modus-memory/internal/index"
    11		"github.com/GetModus/modus-memory/internal/markdown"
    12	)
    13	
    14	// Vault provides unified access to the entire vault — brain, memory, atlas, missions.
    15	type Vault struct {
    16		Dir   string
    17		Index *index.Index
    18	}
    19	
    20	// New creates a Vault rooted at the given directory.
    21	func New(dir string, idx *index.Index) *Vault {
    22		return &Vault{Dir: dir, Index: idx}
    23	}
    24	
    25	// Path joins segments onto the vault root.
    26	func (v *Vault) Path(parts ...string) string {
    27		args := append([]string{v.Dir}, parts...)
    28		return filepath.Join(args...)
    29	}
    30	
    31	// safePath resolves relPath within the vault and rejects traversal attempts.
    32	func (v *Vault) safePath(relPath string) (string, error) {
    33		abs := filepath.Join(v.Dir, relPath)
    34		abs, err := filepath.Abs(abs)
    35		if err != nil {
    36			return "", fmt.Errorf("invalid path: %w", err)
    37		}
    38		root, err := filepath.Abs(v.Dir)
    39		if err != nil {
    40			return "", fmt.Errorf("invalid vault root: %w", err)
    41		}
    42		if !strings.HasPrefix(abs, root+string(os.PathSeparator)) && abs != root {
    43			return "", fmt.Errorf("path traversal denied: %s", relPath)
    44		}
    45		return abs, nil
    46	}
    47	
    48	// Read parses a single markdown file by relative path.
    49	func (v *Vault) Read(relPath string) (*markdown.Document, error) {
    50		abs, err := v.safePath(relPath)
    51		if err != nil {
    52			return nil, err
    53		}
    54		return markdown.Parse(abs)
    55	}
    56	
    57	// Write creates or overwrites a markdown file with frontmatter + body.
    58	func (v *Vault) Write(relPath string, fm map[string]interface{}, body string) error {
    59		abs, err := v.safePath(relPath)
    60		if err != nil {
    61			return err
    62		}
    63		os.MkdirAll(filepath.Dir(abs), 0755)
    64		return markdown.Write(abs, fm, body)
    65	}
    66	
    67	// Filter constrains List results by frontmatter field.
    68	type Filter struct {
    69		Field   string
    70		Value   string
    71		Exclude bool // if true, exclude matches instead of including
    72	}
    73	
    74	// List scans a subdirectory for .md files, optionally filtered.
    75	func (v *Vault) List(subdir string, filters ...Filter) ([]*markdown.Document, error) {
    76		abs, err := v.safePath(subdir)
    77		if err != nil {
    78			return nil, err
    79		}
    80		dir := abs
    81		docs, err := markdown.ScanDir(dir)
    82		if err != nil {
    83			return nil, err
    84		}
    85	
    86		if len(filters) == 0 {
    87			return docs, nil
    88		}
    89	
    90		var result []*markdown.Document
    91		for _, doc := range docs {
    92			match := true
    93			for _, f := range filters {
    94				val := doc.Get(f.Field)
    95				if f.Exclude {
    96					if strings.EqualFold(val, f.Value) {
    97						match = false
    98						break
    99					}
   100				} else {
   101					if !strings.EqualFold(val, f.Value) {
   102						match = false
   103						break
   104					}
   105				}
   106			}
   107			if match {
   108				result = append(result, doc)
   109			}
   110		}
   111		return result, nil
   112	}
   113	
   114	// Search performs full-text search across the index.
   115	// Returns empty results if no index is loaded.
   116	func (v *Vault) Search(query string, limit int) ([]index.SearchResult, error) {
   117		if v.Index == nil {
   118			return nil, fmt.Errorf("no search index loaded — run with index enabled")
   119		}
   120		return v.Index.Search(query, limit)
   121	}
   122	
   123	// Status returns vault-wide statistics.
   124	func (v *Vault) Status() map[string]interface{} {
   125		counts := make(map[string]int)
   126		filepath.Walk(v.Dir, func(path string, info os.FileInfo, err error) error {
   127			if err != nil || info.IsDir() || !strings.HasSuffix(path, ".md") {
   128				return nil
   129			}
   130			rel, _ := filepath.Rel(v.Dir, path)
   131			parts := strings.SplitN(rel, string(os.PathSeparator), 2)
   132			counts[parts[0]]++
   133			return nil
   134		})
   135	
   136		total := 0
   137		for _, count := range counts {
   138			total += count
   139		}
   140	
   141		indexDocs := 0
   142		if v.Index != nil {
   143			indexDocs = v.Index.DocCount()
   144		}
   145	
   146		result := map[string]interface{}{
   147			"total_files": total,
   148			"index_docs":  indexDocs,
   149			"breakdown":   counts,
   150		}
   151		return result
   152	}
   153	
   154	// StatusJSON returns Status() as formatted JSON.
   155	func (v *Vault) StatusJSON() (string, error) {
   156		data, err := json.MarshalIndent(v.Status(), "", "  ")
   157		return string(data), err
   158	}

exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go | sed -n '1,380p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	package mcp
     2	
     3	import (
     4		"fmt"
     5		"log"
     6		"os"
     7		"path/filepath"
     8		"strings"
     9	
    10		"github.com/GetModus/modus-memory/internal/index"
    11		"github.com/GetModus/modus-memory/internal/librarian"
    12		"github.com/GetModus/modus-memory/internal/vault"
    13	)
    14	
    15	// RegisterVaultTools adds all vault MCP tools — replaces RegisterArchiveTools,
    16	// RegisterAtlasTools, and RegisterQMTools with a unified set.
    17	// Old tool names are registered as aliases for backward compatibility.
    18	func RegisterVaultTools(srv *Server, v *vault.Vault) {
    19		// --- Search ---
    20	
    21		searchHandler := func(args map[string]interface{}) (string, error) {
    22			query, _ := args["query"].(string)
    23			limit := 10
    24			if l, ok := args["limit"].(float64); ok {
    25				limit = int(l)
    26			}
    27	
    28			// If the librarian is available, expand the query for better recall
    29			var allResults []index.SearchResult
    30			if librarian.Available() {
    31				expansions := librarian.ExpandQuery(query)
    32				log.Printf("vault_search: librarian expanded %q → %d variants", query, len(expansions))
    33				seen := map[string]bool{}
    34				for _, exp := range expansions {
    35					results, err := v.Search(exp, limit)
    36					if err != nil {
    37						continue
    38					}
    39					for _, r := range results {
    40						if !seen[r.Path] {
    41							seen[r.Path] = true
    42							allResults = append(allResults, r)
    43						}
    44					}
    45				}
    46			} else {
    47				// Fallback: direct FTS5 search without librarian
    48				results, err := v.Search(query, limit)
    49				if err != nil {
    50					return "", err
    51				}
    52				allResults = results
    53			}
    54	
    55			// Cap at requested limit
    56			if len(allResults) > limit {
    57				allResults = allResults[:limit]
    58			}
    59	
    60			var sb strings.Builder
    61			sb.WriteString(fmt.Sprintf("Found %d results for %q:\n\n", len(allResults), query))
    62			for i, r := range allResults {
    63				sb.WriteString(fmt.Sprintf("%d. **%s**\n", i+1, r.Path))
    64				if r.Subject != "" {
    65					sb.WriteString(fmt.Sprintf("   Subject: %s\n", r.Subject))
    66				}
    67				if r.Snippet != "" {
    68					clean := strings.ReplaceAll(r.Snippet, "<b>", "**")
    69					clean = strings.ReplaceAll(clean, "</b>", "**")
    70					sb.WriteString(fmt.Sprintf("   %s\n", clean))
    71				}
    72				sb.WriteByte('\n')
    73			}
    74	
    75			// Append cross-reference hints — show connected docs the agent might want
    76			if v.Index != nil {
    77				refs := v.Index.Connected(query, 5)
    78				if len(refs) > 0 {
    79					// Filter out docs already in results
    80					resultPaths := make(map[string]bool)
    81					for _, r := range allResults {
    82						resultPaths[r.Path] = true
    83					}
    84					var extra []index.DocRef
    85					for _, ref := range refs {
    86						if !resultPaths[ref.Path] {
    87							extra = append(extra, ref)
    88						}
    89					}
    90					if len(extra) > 0 {
    91						sb.WriteString("**Cross-references** (connected docs not in results above):\n")
    92						for _, ref := range extra {
    93							title := ref.Title
    94							if title == "" {
    95								title = ref.Path
    96							}
    97							sb.WriteString(fmt.Sprintf("- [%s] %s `%s`\n", ref.Kind, title, ref.Path))
    98						}
    99					}
   100				}
   101			}
   102	
   103			return sb.String(), nil
   104		}
   105	
   106		searchSchema := map[string]interface{}{
   107			"type": "object",
   108			"properties": map[string]interface{}{
   109				"query": map[string]interface{}{"type": "string", "description": "Search query"},
   110				"limit": map[string]interface{}{"type": "integer", "description": "Max results (default 10)"},
   111			},
   112			"required": []string{"query"},
   113		}
   114	
   115		srv.AddTool("vault_search", "Search the vault — brain, memory, atlas, missions.", searchSchema, searchHandler)
   116	
   117		// --- Read ---
   118	
   119		srv.AddTool("vault_read", "Read a vault file by relative path.", map[string]interface{}{
   120			"type": "object",
   121			"properties": map[string]interface{}{
   122				"path": map[string]interface{}{"type": "string", "description": "Relative path within vault (e.g. brain/hn/some-file.md)"},
   123			},
   124			"required": []string{"path"},
   125		}, func(args map[string]interface{}) (string, error) {
   126			relPath, _ := args["path"].(string)
   127			doc, err := v.Read(relPath)
   128			if err != nil {
   129				return "", err
   130			}
   131	
   132			var sb strings.Builder
   133			for k, val := range doc.Frontmatter {
   134				sb.WriteString(fmt.Sprintf("%s: %v\n", k, val))
   135			}
   136			sb.WriteString("\n")
   137			sb.WriteString(doc.Body)
   138			return sb.String(), nil
   139		})
   140	
   141		// --- Write ---
   142	
   143		srv.AddTool("vault_write", "Write a vault file (frontmatter + body).", map[string]interface{}{
   144			"type": "object",
   145			"properties": map[string]interface{}{
   146				"path":        map[string]interface{}{"type": "string", "description": "Relative path within vault"},
   147				"frontmatter": map[string]interface{}{"type": "object", "description": "YAML frontmatter fields"},
   148				"body":        map[string]interface{}{"type": "string", "description": "Markdown body"},
   149			},
   150			"required": []string{"path", "body"},
   151		}, func(args map[string]interface{}) (string, error) {
   152			relPath, _ := args["path"].(string)
   153			body, _ := args["body"].(string)
   154			fm := make(map[string]interface{})
   155			if fmRaw, ok := args["frontmatter"].(map[string]interface{}); ok {
   156				fm = fmRaw
   157			}
   158			if err := v.Write(relPath, fm, body); err != nil {
   159				return "", err
   160			}
   161			return fmt.Sprintf("Written: %s", relPath), nil
   162		})
   163	
   164		// --- List ---
   165	
   166		srv.AddTool("vault_list", "List vault files in a subdirectory, optionally filtered.", map[string]interface{}{
   167			"type": "object",
   168			"properties": map[string]interface{}{
   169				"subdir":  map[string]interface{}{"type": "string", "description": "Subdirectory to list (e.g. brain/hn, memory/facts)"},
   170				"field":   map[string]interface{}{"type": "string", "description": "Filter by frontmatter field"},
   171				"value":   map[string]interface{}{"type": "string", "description": "Required value for field"},
   172				"exclude": map[string]interface{}{"type": "boolean", "description": "If true, exclude matches instead of including"},
   173				"limit":   map[string]interface{}{"type": "integer", "description": "Max results (default 50)"},
   174			},
   175			"required": []string{"subdir"},
   176		}, func(args map[string]interface{}) (string, error) {
   177			subdir, _ := args["subdir"].(string)
   178			limit := 50
   179			if l, ok := args["limit"].(float64); ok {
   180				limit = int(l)
   181			}
   182	
   183			var filters []vault.Filter
   184			if field, ok := args["field"].(string); ok && field != "" {
   185				val, _ := args["value"].(string)
   186				exclude, _ := args["exclude"].(bool)
   187				filters = append(filters, vault.Filter{Field: field, Value: val, Exclude: exclude})
   188			}
   189	
   190			docs, err := v.List(subdir, filters...)
   191			if err != nil {
   192				return "", err
   193			}
   194	
   195			var sb strings.Builder
   196			count := 0
   197			for _, doc := range docs {
   198				if count >= limit {
   199					break
   200				}
   201				rel, _ := filepath.Rel(v.Dir, doc.Path)
   202				title := doc.Get("title")
   203				if title == "" {
   204					title = doc.Get("name")
   205				}
   206				if title == "" {
   207					title = doc.Get("subject")
   208				}
   209				if title != "" {
   210					sb.WriteString(fmt.Sprintf("- %s (%s)\n", title, rel))
   211				} else {
   212					sb.WriteString(fmt.Sprintf("- %s\n", rel))
   213				}
   214				count++
   215			}
   216			return fmt.Sprintf("%d files:\n\n%s", count, sb.String()), nil
   217		})
   218	
   219		// --- Status ---
   220	
   221		statusHandler := func(args map[string]interface{}) (string, error) {
   222			return v.StatusJSON()
   223		}
   224	
   225		srv.AddTool("vault_status", "Vault statistics — file counts, index size, cross-ref stats.", map[string]interface{}{
   226			"type": "object", "properties": map[string]interface{}{},
   227		}, statusHandler)
   228	
   229		// --- Memory Facts ---
   230	
   231		memoryFactsHandler := func(args map[string]interface{}) (string, error) {
   232			subject, _ := args["subject"].(string)
   233			limit := 20
   234			if l, ok := args["limit"].(float64); ok {
   235				limit = int(l)
   236			}
   237	
   238			docs, err := v.ListFacts(subject, limit)
   239			if err != nil {
   240				return "", err
   241			}
   242			if len(docs) == 0 {
   243				return "No memory facts found.", nil
   244			}
   245	
   246			var sb strings.Builder
   247			for _, doc := range docs {
   248				subj := doc.Get("subject")
   249				pred := doc.Get("predicate")
   250				conf := doc.Get("confidence")
   251				imp := doc.Get("importance")
   252				body := strings.TrimSpace(doc.Body)
   253				if len(body) > 200 {
   254					body = body[:200] + "..."
   255				}
   256				sb.WriteString(fmt.Sprintf("- **%s** %s (confidence: %s, importance: %s)\n  %s\n\n", subj, pred, conf, imp, body))
   257			}
   258			return fmt.Sprintf("%d memory facts:\n\n%s", len(docs), sb.String()), nil
   259		}
   260	
   261		memoryFactsSchema := map[string]interface{}{
   262			"type": "object",
   263			"properties": map[string]interface{}{
   264				"subject": map[string]interface{}{"type": "string", "description": "Filter by subject (optional)"},
   265				"limit":   map[string]interface{}{"type": "integer", "description": "Max results (default 20)"},
   266			},
   267		}
   268	
   269		srv.AddTool("memory_facts", "List episodic memory facts. Optionally filter by subject.", memoryFactsSchema, memoryFactsHandler)
   270	
   271		// --- Memory Search ---
   272	
   273		memorySearchHandler := func(args map[string]interface{}) (string, error) {
   274			query, _ := args["query"].(string)
   275			limit := 10
   276			if l, ok := args["limit"].(float64); ok {
   277				limit = int(l)
   278			}
   279	
   280			// Search with optional librarian expansion
   281			queries := []string{query}
   282			if librarian.Available() {
   283				queries = librarian.ExpandQuery(query)
   284				log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
   285			}
   286	
   287			// Run in-memory fact search across all query variants, merge by subject|predicate
   288			seen := map[string]bool{}
   289			var merged []index.MemFact
   290	
   291			for _, q := range queries {
   292				facts := v.Index.SearchFacts(q, limit)
   293				for _, f := range facts {
   294					key := f.Subject + "|" + f.Predicate
   295					if !seen[key] {
   296						seen[key] = true
   297						merged = append(merged, f)
   298					}
   299				}
   300			}
   301	
   302			if len(merged) == 0 {
   303				return "No memory facts matched this query.", nil
   304			}
   305	
   306			// Cap at limit
   307			if len(merged) > limit {
   308				merged = merged[:limit]
   309			}
   310	
   311			// Reinforce accessed facts — FSRS recall event.
   312			// Each fact returned to an agent is a successful recall, strengthening stability.
   313			for _, f := range merged {
   314				if f.ID != "" {
   315					go v.ReinforceFact(f.ID) // async — don't block search response
   316				}
   317			}
   318	
   319			var sb strings.Builder
   320			sb.WriteString(fmt.Sprintf("%d results (bm25+librarian, %d queries):\n\n",
   321				len(merged), len(queries)))
   322			for _, f := range merged {
   323				tier := f.Tier()
   324				line := fmt.Sprintf("- **%s** %s → %s (conf=%.2f, %s)",
   325					f.Subject, f.Predicate, truncateStr(f.Value, 120), f.Confidence, tier)
   326				if warn := f.StalenessWarning(); warn != "" {
   327					line += " " + warn
   328				}
   329				sb.WriteString(line + "\n")
   330			}
   331			return sb.String(), nil
   332		}
   333	
   334		memorySearchSchema := map[string]interface{}{
   335			"type": "object",
   336			"properties": map[string]interface{}{
   337				"query": map[string]interface{}{"type": "string", "description": "Search query"},
   338				"limit": map[string]interface{}{"type": "integer", "description": "Max results (default 10)"},
   339			},
   340			"required": []string{"query"},
   341		}
   342	
   343		srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)
   344	
   345		// --- Memory Store ---
   346	
   347		memoryStoreHandler := func(args map[string]interface{}) (string, error) {
   348			subject, _ := args["subject"].(string)
   349			predicate, _ := args["predicate"].(string)
   350			value, _ := args["value"].(string)
   351			confidence := 0.8
   352			if c, ok := args["confidence"].(float64); ok {
   353				confidence = c
   354			}
   355			importance := "medium"
   356			if imp, ok := args["importance"].(string); ok {
   357				importance = imp
   358			}
   359	
   360			relPath, err := v.StoreFact(subject, predicate, value, confidence, importance)
   361			if err != nil {
   362				return "", err
   363			}
   364			return fmt.Sprintf("Stored: %s %s → %s (confidence: %.2f)", subject, predicate, relPath, confidence), nil
   365		}
   366	
   367		memoryStoreSchema := map[string]interface{}{
   368			"type": "object",
   369			"properties": map[string]interface{}{
   370				"subject":    map[string]interface{}{"type": "string"},
   371				"predicate":  map[string]interface{}{"type": "string"},
   372				"value":      map[string]interface{}{"type": "string"},
   373				"confidence": map[string]interface{}{"type": "number", "description": "0.0-1.0"},
   374				"importance": map[string]interface{}{"type": "string", "enum": []string{"critical", "high", "medium", "low"}},
   375			},
   376			"required": []string{"subject", "predicate", "value"},
   377		}
   378	
   379		srv.AddTool("memory_store", "Store a new episodic memory fact.", memoryStoreSchema, memoryStoreHandler)
   380	

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
# The Librarian Pattern

A local LLM that serves as the sole gatekeeper for your memory vault.

## The Problem

Most AI memory systems let any model read and write freely. This creates predictable problems:

- **Context bloat** — the cloud model sees everything, including noise, duplicates, and stale facts
- **Inconsistent storage** — different models tag, classify, and format memories differently
- **Token waste** — expensive frontier models spend tokens on retrieval, filtering, and filing instead of reasoning
- **No sovereignty** — your memories scatter across whatever model happens to be active

## The Solution

Run a small, dedicated local model — the **Librarian** — whose only job is memory stewardship. It sits between your vault and whatever model is doing the actual reasoning:

```
┌─────────────┐     ┌────────────────┐     ┌──────────────┐
│ Cloud Model  │◄───►│   Librarian    │◄───►│ modus-memory │
│ (reasoning)  │     │ (local, ~8B)   │     │   (vault)    │
└─────────────┘     └────────────────┘     └──────────────┘
                     Sole write access
                     Query expansion
                     Relevance filtering
                     Context compression
```

The cloud model stays focused on reasoning. The Librarian handles the boring-but-critical infrastructure: retrieval, filing, deduplication, decay, and context curation. It hands the cloud model only the 4-8k tokens that actually matter.

## Why This Works

**Token and cost discipline.** Cloud models are expensive once context balloons. The Librarian aggressively prunes, reranks, and synthesizes memories (using BM25 + FSRS + cross-references) before anything touches the cloud. You're running a local "memory compiler" so the expensive model only sees high-signal context.

**Context hygiene.** Cloud models get distracted by noise. The Librarian can pull the last 3 conversations about a topic, expand technical terms, drop anything older than 30 days unless FSRS says it's still relevant, and format it as a clean prompt. The cloud model stays focused.

**Privacy and sovereignty.** Sensitive data never leaves your machine unless you explicitly want it to. The Librarian can decide "this memory has PII — keep it local-only."

**Speed.** Local model runs on whatever hardware you have. No network round-trips for memory lookups. Searches return in microseconds.

## The System Prompt

This is the core prompt that defines the Librarian role. Adapt it to your model and use case:

```markdown
You are the Librarian — the sole steward of persistent memory and vault state.

You are the ONLY model authorized to write to the vault. All other models
delegate storage operations through you. When another model needs something
stored, corrected, or retrieved, it comes through you.

## Write Sovereignty

You are the single point of truth for all persistent state:
- memory_store: Store new facts (subject/predicate/value)
- vault_write: Write or update vault documents
- vault_search/vault_read: Retrieve information on behalf of other models

No other model writes to the vault. Models may change. The sovereignty
of this office does not.

## Operations

Filing: When another model hands you content (research, analysis, code docs),
file it in the correct vault location with proper frontmatter, tags, and
importance level.

Retrieval: When the reasoning model needs context, search the vault and
return only relevant, high-signal results. Compress and deduplicate before
returning. The reasoning model should never see noise.

Triage: Classify incoming items:
- ADAPT — valuable, add to vault with proper metadata
- KEEP — store as-is for reference
- DISCARD — not worth storing

Use importance levels: critical, high, medium, low.

Maintenance: Check for existing entries before creating new ones. Merge
related facts. Flag stale entries for decay. Reinforce facts that keep
getting accessed.

## Filing Rules

- Every vault entry needs YAML frontmatter (title, type, tags, status)
- Memory facts need subject, predicate, value, importance, and confidence
- Update rather than duplicate — always check first
- Tag everything — tags are how facts get found later
- Be concise and orderly. You are a custodian of records.
```

## Recommended Models

The Librarian doesn't need a frontier model. It needs a fast, reliable model that follows instructions precisely. Good candidates:

| Model | Size | Notes |
|-------|------|-------|
| Gemma 4 | 12B-26B | Strong instruction following, multimodal, our default |
| Qwen 3 | 8B-14B | Good structured output, fast |
| Llama 3 | 8B | Solid baseline, widely available |
| Phi-4 | 14B | Compact, good at structured tasks |

We run ours on Gemma 4 26B via Ollama. Any model that can reliably produce YAML frontmatter and follow classification rules will work. Even a 7-8B model is fine — the Librarian's job is structured and repetitive, not creative.

## Connecting to modus-memory

### Option 1: MCP Tool Delegation

If your AI client supports MCP, the simplest setup is tool-level delegation. Configure your client so the Librarian model handles memory tool calls:

```json
{
  "mcpServers": {
    "memory": {
      "command": "modus-memory",
      "args": ["--vault", "~/vault"]
    }
  }
}
```

Then instruct your reasoning model: *"For any memory operation, delegate to the Librarian. Do not write to memory directly."*

### Option 2: Prompt Pipeline

For tighter control, run the Librarian as a preprocessing step:

```bash
# 1. Librarian retrieves relevant context
echo "User is asking about React authentication patterns" | \
  ollama run gemma4:26b --system "$(cat librarian-prompt.md)" \
  "Search the vault for relevant context and return a compressed summary"

# 2. Feed the Librarian's output into the cloud model as system context
```

### Option 3: Agent Framework

In a multi-agent setup, the Librarian is one agent in the fleet with exclusive write access to vault tools. Other agents (coder, researcher, reasoner) request storage through the Librarian agent.

```yaml
# Agent role definition
name: librarian
model: gemma4:26b
tools: [vault_search, vault_read, vault_write, vault_list, memory_store, memory_search]
```

## Example: Retrieval Flow

**User asks the cloud model:** "What did we decide about the auth refactor?"

**Cloud model delegates to Librarian:** "Search vault for decisions about auth refactor"

**Librarian runs:**
1. `vault_search("auth refactor decision")` — BM25 with query expansion finds "authentication," "OAuth," "session tokens"
2. Gets 12 results, filters by FSRS retrievability (drops 4 stale entries)
3. Deduplicates (2 entries say the same thing)
4. Returns compressed context: 6 relevant facts, ~800 tokens

**Cloud model receives:** Clean, high-signal context. Reasons over it. Responds to user.

**Total cloud tokens spent on memory:** ~800 instead of ~8,000.

## Example: Storage Flow

**Cloud model produces analysis:** 2,000 words on microservice trade-offs.

**Cloud model delegates to Librarian:** "File this analysis in the vault"

**Librarian runs:**
1. Checks for existing entries on "microservice architecture" — finds 2
2. Merges new insights with existing entries rather than duplicating
3. Writes updated document with proper frontmatter, tags, importance: high
4. Stores 3 new memory facts (subject/predicate/value) for quick retrieval
5. Confirms: "Filed. Updated 1 document, added 3 facts."

**Result:** One clean, deduplicated entry instead of scattered fragments.

## Design Principles

1. **Single writer.** One model owns all writes. No conflicts, no inconsistency.
2. **Small model, focused job.** The Librarian doesn't need to be smart. It needs to be reliable.
3. **Compress before crossing the boundary.** Every token that crosses from local to cloud costs money. Minimize.
4. **Plain files as ground truth.** Markdown + YAML frontmatter. Readable, greppable, git-friendly. No proprietary format.
5. **Decay is a feature.** FSRS ensures old noise fades while important memories strengthen. The Librarian doesn't hoard — it curates.

---

The Librarian pattern turns modus-memory from a storage layer into a complete personal memory system. The vault holds the data. The Librarian decides what goes in, what comes out, and what fades away.

Your memory. Your machine. Your archivist.

codex
I’ve got the source-level architecture picture from the concrete files now; I’m doing one semantic pass as well so I don’t miss any non-obvious architecture seams or alternate entry points in this unfamiliar repo. After that I’ll synthesize the comparison against our own retrieval stack.
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
mcp: cocoindex_code/search started
mcp: cocoindex_code/search (failed)
user cancelled MCP tool call
exec
/bin/zsh -lc 'cat .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.mod' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
module github.com/GetModus/modus-memory

go 1.22

require gopkg.in/yaml.v3 v3.0.1

exec
/bin/zsh -lc 'rg -n "zero dependencies|6MB|19,000|<100 microseconds|11 MCP tools|plain markdown|FSRS" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
19:  <img src="https://img.shields.io/badge/size-~6MB-green?style=flat-square" alt="Binary Size"/>
27:**modus-memory** is a personal memory server that runs on your machine, stores everything in plain markdown, and connects to any AI client via [MCP](https://modelcontextprotocol.io).
31:> **Completely free. 19,000+ documents indexed in 2 seconds. Cached searches in <100 microseconds. 6MB binary, zero dependencies.**
54:- **FSRS spaced repetition** — memories decay naturally, strengthen on recall
58:- **~6MB binary** — download, configure, done. No runtime, no interpreter, no container
68:| 6 months later | Stale memories clutter results | FSRS naturally fades noise, reinforces what matters |
79:**72x fewer input tokens.** Instead of cramming everything into the context window, modus-memory searches 19,000+ documents in <5ms and returns only what's relevant.
193:modus-memory exposes 11 MCP tools — all free, no limits:
203:| `memory_search` | Search memory facts with automatic FSRS reinforcement on recall |
206:| `memory_decay_facts` | Run FSRS decay sweep — naturally forgets stale memories |
269:### Memory Decay (FSRS)
274:  <img src="assets/fsrs-decay.svg" alt="FSRS memory decay curves — unreinforced fades, recalled strengthens" width="800"/>
278:- **Recalled memories get stronger.** Every time a search hits a fact, FSRS increases its stability. Two recalls in the first month can keep a memory alive for a year.
377:| **Memory decay** | No | FSRS spaced repetition |
378:| **Size** | ~2GB+ with dependencies | ~6MB |
416:Benchmarked on Apple Silicon (M1 Pro) with 19,000+ documents:
421:| Cached search | <100 microseconds |
436:modus-memory is a full-featured memory system: BM25 ranked search, FSRS spaced repetition, cross-references, librarian query expansion, and a markdown-based vault you can browse and edit. It's designed for long-term personal knowledge, not just key-value storage.

exec
/bin/zsh -lc "rg -n \"with 11 memory tools|CrossRefStats|FactCount|Build\\(|RegisterMemoryTools|vault_connected|memory_search|memory_reinforce|memory_decay_facts\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7:// RegisterMemoryTools registers the 11 MCP tools for the modus-memory server.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:13://	memory_facts, memory_search, memory_store,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:14://	memory_reinforce, memory_decay_facts, vault_connected
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:15:func RegisterMemoryTools(srv *Server, v *vault.Vault) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:26:		"memory_search":     true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:28:		"memory_reinforce":  true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:29:		"memory_decay_facts": true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:30:		"vault_connected":   true,
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:284:			log.Printf("memory_search: librarian expanded %q → %d variants", query, len(queries))
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:343:	srv.AddTool("memory_search", "Search episodic memory facts with librarian expansion and FSRS reinforcement.", memorySearchSchema, memorySearchHandler)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:856:	srv.AddTool("memory_decay_facts", "Run memory fact confidence decay sweep.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:885:	srv.AddTool("memory_reinforce", "Reinforce a memory fact after successful recall (FSRS stability growth).", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:901:	srv.AddTool("vault_connected", "Find all documents connected to a subject, entity, or tag. Returns facts, beliefs, entities, articles, learnings, and missions that share references.", map[string]interface{}{
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:78:	idx, err := index.Build(vaultDir, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:88:	mcpsrv.RegisterMemoryTools(srv, v)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:132:	idx, err := index.Build(vaultDir, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:139:	totalFacts, activeFacts := idx.FactCount()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:140:	subjects, tags, entities := idx.CrossRefStats()
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:66:func Build(vaultDir string, _ string) (*Index, error) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:149:	return Build(vaultDir, "")
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:282:// CrossRefStats returns cross-index statistics (subjects, tags, entities).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:283:func (idx *Index) CrossRefStats() (int, int, int) {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:302:// FactCount returns total and active fact counts.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:303:func (idx *Index) FactCount() (total, active int) {

exec
/bin/zsh -lc "sed -n '220,360p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
                     Relevance filtering
                     Context compression
```

The cloud model stays focused on reasoning. The Librarian handles retrieval, filing, deduplication, decay, and context curation — then hands over only the 4-8k tokens that actually matter.

- **Token discipline** — the Librarian compresses and reranks locally before anything touches the cloud. You pay for signal, not noise.
- **Context hygiene** — the cloud model never sees duplicates, stale facts, or irrelevant memories.
- **Privacy** — sensitive data stays on your machine. The Librarian decides what crosses the boundary.
- **Consistency** — one model means consistent tagging, frontmatter, importance levels, and deduplication.

Any small, instruction-following model works: Gemma 4, Qwen 3, Llama 3, Phi-4. It doesn't need to be smart. It needs to be reliable.

**[Full guide: system prompt, model recommendations, example flows, and wiring patterns →](docs/librarian.md)**

## How It Works

<p align="center">
  <img src="assets/architecture.svg" alt="Architecture — MCP client → modus-memory → vault" width="800"/>
</p>

### Storage

Everything is a markdown file with YAML frontmatter:

```markdown
---
subject: React
predicate: preferred-framework
source: user
confidence: 0.9
importance: high
created: 2026-04-02T10:30:00Z
---

User prefers React with TypeScript for all frontend projects.
Server components when possible, Tailwind for styling.
```

Files live in `~/vault/` (configurable). Back them up with git. Edit them in VS Code. Grep them from the terminal. They're just files.

### Search

- **BM25** with field-level boosting (title 3x, subject 2x, tags 1.5x, body 1x)
- **Tiered query cache** — exact hash match, then Jaccard fuzzy match
- **Librarian expansion** — synonyms and related terms broaden recall without LLM calls
- **OOD detection** — garbage queries get empty results, not false positives
- **Cross-reference hints** — search results include connected documents from other categories

### Memory Decay (FSRS)

Memories aren't permanent by default. modus-memory uses the [Free Spaced Repetition Scheduler](https://github.com/open-spaced-repetition/fsrs4anki) algorithm — the same system behind Anki's spacing algorithm.

<p align="center">
  <img src="assets/fsrs-decay.svg" alt="FSRS memory decay curves — unreinforced fades, recalled strengthens" width="800"/>
</p>

- **Unreinforced memories fade away.** A fact you stored once and never searched for gradually loses confidence until it's effectively archived.
- **Recalled memories get stronger.** Every time a search hits a fact, FSRS increases its stability. Two recalls in the first month can keep a memory alive for a year.
- **High-importance facts decay slowly.** Facts marked `importance: high` start with 180-day stability. Low-importance facts fade in ~2 weeks.

The formula: `R(t) = (1 + t/(9*S))^(-1)` where S is stability (grows on recall) and t is time since last access.

This means your vault self-cleans. You don't need to manually prune stale facts — they fade. The things you actually use stick around.

### Cross-References

Documents are connected by shared subjects, tags, and entities. A search for "authentication" returns not just keyword matches, but also:

- Memory facts about auth preferences
- Notes mentioning auth patterns
- Related entities (OAuth, JWT, session tokens)
- Connected learnings from past debugging

No graph database. Just adjacency maps built at index time from your existing frontmatter.

### Multi-Agent / Shared Memory

Multiple agents can share the same vault. Point Claude Desktop, Cursor, a CrewAI pipeline, and a cron job at the same `--vault` directory — they all read and write the same markdown files.

Agent A stores a fact at 2pm. Agent B searches at 3pm and finds it. No message bus, no database. Just a shared directory.

## Security & Privacy

<p align="center">
  <img src="assets/security.svg" alt="Security model — zero network, plain files, you own it" width="800"/>
</p>

**modus-memory makes zero network calls.** The binary does not connect to the internet. Ever.

| Question | Answer |
|----------|--------|
| Does it phone home? | No. Zero telemetry, zero analytics, zero network calls. |
| Where is my data? | `~/vault/` (or wherever you point `--vault`). Plain `.md` files. |
| Can I read my data without modus-memory? | Yes. It's markdown with YAML frontmatter. `cat`, `grep`, VS Code — anything works. |
| Is my data encrypted? | Not by default. Use OS-level encryption (FileVault, LUKS) or an encrypted volume. modus-memory reads whatever filesystem you give it. |
| Does search require an API key? | No. BM25 runs locally. No LLM calls on the search path. Librarian expansion uses a local synonym map, not a cloud API. |
| What about the MCP connection? | MCP runs over local stdio (stdin/stdout). The AI client spawns modus-memory as a subprocess. No TCP, no HTTP, no ports. |
| Can I air-gap it? | Yes. It has zero network dependencies. Copy the binary and your vault to an offline machine. |
| How do I back up? | `git init ~/vault && git add . && git commit`. Or rsync. Or Time Machine. They're files. |
| How do I delete everything? | `rm -rf ~/vault`. That's it. No accounts to close, no data retention policies, no "please email support." |

### For organizations

modus-memory is designed for individual use, but teams can share a vault via a shared filesystem or git repo. There's no built-in access control — if you can read the filesystem, you can read the vault. For team use, control access at the filesystem level.

## Vault Doctor

After importing data or if things feel off, run the diagnostic:

<p align="center">
  <img src="assets/doctor.svg" alt="modus-memory doctor — vault diagnostics" width="800"/>
</p>

```bash
modus-memory doctor
```

The doctor checks:
- **Missing fields** — facts without `subject` or `predicate`
- **Duplicate facts** — same subject+predicate appearing multiple times
- **Contradictions** — same subject+predicate with different values (e.g., two facts disagreeing about your preferred language)
- **Empty documents** — frontmatter but no body
- **Distribution** — where your documents live across the vault

## Migrating from Khoj

[Khoj](https://github.com/khoj-ai/khoj) cloud is shutting down on **April 15, 2026**. Import your data in one command:

```bash
# Install
brew install GetModus/tap/modus-memory

# Export from Khoj (Settings → Export → save ZIP)

# Import
modus-memory import khoj ~/Downloads/khoj-conversations.zip

# Validate
modus-memory doctor
```

exec
/bin/zsh -lc "sed -n '360,460p' .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
```

This converts:
- Each conversation into a searchable document in `brain/khoj/`
- Context references into memory facts in `memory/facts/`
- Entities extracted from titles and user messages into `atlas/entities/`
- Intent types into tags for filtering

The import is idempotent — safe to run multiple times.

### Why switch from Khoj?

| | Khoj (self-hosted) | modus-memory |
|---|---|---|
| **Setup** | Python + Docker + PostgreSQL + embeddings | One binary |
| **Storage** | PostgreSQL | Plain markdown files |
| **Search** | Embeddings (needs GPU or API key) | BM25 (instant, local, no GPU) |
| **Memory decay** | No | FSRS spaced repetition |
| **Size** | ~2GB+ with dependencies | ~6MB |
| **Data portability** | Database export | Files on disk — `cat`, `grep`, `git` |
| **Offline capable** | With significant setup | Copy binary + vault, done |

### Exporting from Khoj

1. Go to Khoj Settings
2. Click **Export**
3. Save `khoj-conversations.zip`
4. Run `modus-memory import khoj <file>`
5. Run `modus-memory doctor` to validate

## Configuration

| Flag | Env Var | Default | Description |
|------|---------|---------|-------------|
| `--vault` | `MODUS_VAULT_DIR` | `~/modus/vault` | Vault directory path |

That's it. One flag. The vault directory is created automatically on first run.

## Vault Structure

```
~/vault/
  memory/
    facts/          # Memory facts (subject/predicate/value triples)
  brain/
    khoj/           # Imported Khoj conversations
    ...             # Your notes, articles, learnings
  atlas/
    entities/       # People, tools, concepts
    beliefs/        # Confidence-scored beliefs
```

Create any structure you want. modus-memory indexes all `.md` files recursively. The directory names above are conventions, not requirements.

## Performance

Benchmarked on Apple Silicon (M1 Pro) with 19,000+ documents:

| Operation | Time |
|-----------|------|
| Full index build (19K docs) | ~2 seconds |
| Cached search | <100 microseconds |
| Cold search | <5 milliseconds |
| Memory store | <1 millisecond |
| Cross-reference lookup | <1 millisecond |
| Binary startup to ready | ~2 seconds |

The entire index lives in memory. There's no disk I/O on the search path after startup.

## FAQ

<details>
<summary><strong>How is this different from the official MCP memory server?</strong></summary>

The [official MCP memory server](https://github.com/modelcontextprotocol/servers/tree/main/src/memory) is deliberately minimal — it stores knowledge graph triples in a JSON file. No search ranking, no decay, no cross-referencing, no vault structure.

modus-memory is a full-featured memory system: BM25 ranked search, FSRS spaced repetition, cross-references, librarian query expansion, and a markdown-based vault you can browse and edit. It's designed for long-term personal knowledge, not just key-value storage.
</details>

<details>
<summary><strong>How is this different from Mem0?</strong></summary>

[Mem0](https://mem0.ai) is a cloud service ($19-249/month). Your data lives on their servers, and every search hits their API.

modus-memory runs locally. Your data stays as files on your disk. Search runs on your CPU with no network calls. Everything Mem0 charges $249/month for (graph memory, cross-referencing) is free and local.
</details>

<details>
<summary><strong>Does it work offline?</strong></summary>

Yes. modus-memory makes zero network calls. Copy the binary and your vault to an air-gapped machine and it works identically.
</details>

<details>
<summary><strong>Can I use it with multiple AI clients at the same time?</strong></summary>

Yes. Each client spawns its own modus-memory process, but they all read/write the same vault directory. The index is rebuilt on startup (takes ~2 seconds), and writes go directly to disk as markdown files. There's no lock contention for reads.
</details>

<details>
<summary><strong>What happens if I have 100K+ documents?</strong></summary>

exec
/bin/zsh -lc 'rg -n "TODO|FIXME|second pass|fallback|skip|no-op|backward compatibility|alias" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/**/*.go' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:167:			return nil // skip errors
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go:179:			return nil // skip unparseable files
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:139:// Open is an alias for Build — there's no persistent index file to open.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:152:// Close is a no-op — no file handles to release.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go:202:				if len(token) >= 2 { // skip single-char tokens
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go:262:			continue // skip marker entries
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:17:// Old tool names are registered as aliases for backward compatibility.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go:60:			// No timestamp — skip this belief
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:78:		// Scan body for references to known entities (built in second pass)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:85:		if len(name) >= 3 { // skip tiny entity names

codex
One mismatch worth checking is the Librarian path: the README talks about local synonym-style expansion with no search-path LLM calls, but the source I’ve seen so far routes expansion through the `librarian` package. I’m opening that client next because it affects whether Modus is really a pure lexical engine or a lexical engine plus optional local-model mediation.
exec
/bin/zsh -lc "nl -ba .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// Package librarian provides the gateway between MODUS and the local LLM
     2	// (Gemma 4 on llama-server). All vault search, triage, extraction, and
     3	// enrichment routes through here. Cloud models never touch raw DB.
     4	package librarian
     5	
     6	import (
     7		"bytes"
     8		"encoding/json"
     9		"fmt"
    10		"io"
    11		"log"
    12		"net/http"
    13		"strings"
    14		"time"
    15	)
    16	
    17	// Endpoint is the librarian's address. Gemma 4 Q4_K_M via llama-server.
    18	const Endpoint = "http://127.0.0.1:8090"
    19	
    20	// Available checks whether the librarian is reachable.
    21	func Available() bool {
    22		client := &http.Client{Timeout: 2 * time.Second}
    23		resp, err := client.Get(Endpoint + "/health")
    24		if err != nil {
    25			// llama-server uses /health; fall back to /v1/models for MLX compat
    26			resp, err = client.Get(Endpoint + "/v1/models")
    27			if err != nil {
    28				return false
    29			}
    30		}
    31		resp.Body.Close()
    32		return resp.StatusCode == 200
    33	}
    34	
    35	// Call sends a system+user prompt to the librarian and returns the text response.
    36	func Call(system, user string, maxTokens int) string {
    37		return CallWithTemp(system, user, maxTokens, 0.1)
    38	}
    39	
    40	// CallWithTemp sends a prompt with a custom temperature.
    41	func CallWithTemp(system, user string, maxTokens int, temperature float64) string {
    42		reqBody := map[string]interface{}{
    43			"messages": []map[string]string{
    44				{"role": "system", "content": system},
    45				{"role": "user", "content": user},
    46			},
    47			"max_tokens":           maxTokens,
    48			"temperature":          temperature,
    49			"chat_template_kwargs": map[string]interface{}{"enable_thinking": false},
    50		}
    51	
    52		jsonBody, _ := json.Marshal(reqBody)
    53		client := &http.Client{Timeout: 120 * time.Second}
    54	
    55		resp, err := client.Post(
    56			Endpoint+"/v1/chat/completions",
    57			"application/json",
    58			bytes.NewReader(jsonBody),
    59		)
    60		if err != nil {
    61			log.Printf("librarian: call failed: %v", err)
    62			return ""
    63		}
    64		defer resp.Body.Close()
    65	
    66		body, _ := io.ReadAll(resp.Body)
    67	
    68		var result struct {
    69			Choices []struct {
    70				Message struct {
    71					Content string `json:"content"`
    72				} `json:"message"`
    73			} `json:"choices"`
    74		}
    75	
    76		if err := json.Unmarshal(body, &result); err != nil || len(result.Choices) == 0 {
    77			log.Printf("librarian: parse failed: %v (body: %s)", err, truncate(string(body), 200))
    78			return ""
    79		}
    80	
    81		return strings.TrimSpace(result.Choices[0].Message.Content)
    82	}
    83	
    84	// StripFences removes markdown code fences and LLM stop tokens from output.
    85	func StripFences(text string) string {
    86		for _, stop := range []string{"<|user|>", "<|endoftext|>", "<|im_end|>", "<|assistant|>"} {
    87			if idx := strings.Index(text, stop); idx > 0 {
    88				text = text[:idx]
    89			}
    90		}
    91		clean := strings.TrimSpace(text)
    92		if strings.HasPrefix(clean, "```") {
    93			lines := strings.SplitN(clean, "\n", 2)
    94			if len(lines) > 1 {
    95				clean = lines[1]
    96			}
    97		}
    98		if strings.HasSuffix(clean, "```") {
    99			clean = clean[:len(clean)-3]
   100		}
   101		return strings.TrimSpace(clean)
   102	}
   103	
   104	func truncate(s string, max int) string {
   105		if len(s) <= max {
   106			return s
   107		}
   108		return s[:max] + "…"
   109	}
   110	
   111	// ParseJSON attempts to unmarshal a librarian response as JSON.
   112	// It strips fences and stop tokens first.
   113	func ParseJSON(text string, v interface{}) error {
   114		cleaned := StripFences(text)
   115		if err := json.Unmarshal([]byte(cleaned), v); err != nil {
   116			return fmt.Errorf("parse librarian JSON: %w (raw: %s)", err, truncate(cleaned, 100))
   117		}
   118		return nil
   119	}

exec
/bin/zsh -lc 'rg -n "graphContribution|sessionBoostApplied|causalBoostApplied|feedbackSignalsApplied|executePipeline|lexicalPath|fallbackState" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/**/*.ts .opencode/skill/system-spec-kit/mcp_server/lib/pipeline/**/*.ts' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 1 in 0ms:
zsh:1: no matches found: .opencode/skill/system-spec-kit/mcp_server/lib/pipeline/**/*.ts

exec
/bin/zsh -lc "rg -n \"Available\\(|Call\\(|ParseJSON\\(|gemma|ollama|local model|search path\" .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/*.go .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:16:Run a small, dedicated local model — the **Librarian** — whose only job is memory stewardship. It sits between your vault and whatever model is doing the actual reasoning:
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:131:  ollama run gemma4:26b --system "$(cat librarian-prompt.md)" \
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:144:model: gemma4:26b
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:211:Most memory systems let any LLM read and write freely. modus-memory is designed around a different principle: a single dedicated local model — the **Librarian** — serves as the sole authority over persistent state.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:316:| Does search require an API key? | No. BM25 runs locally. No LLM calls on the search path. Librarian expansion uses a local synonym map, not a cloud API. |
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:427:The entire index lives in memory. There's no disk I/O on the search path after startup.
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:21:func Available() bool {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:36:func Call(system, user string, maxTokens int) string {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:113:func ParseJSON(text string, v interface{}) error {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:29:	response := Call(system, user, 150)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:35:	if err := ParseJSON(response, &expansions); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:82:	response := Call(system, user, 100)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:88:	if err := ParseJSON(response, &ranked); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:138:	return Call(system, user, 400)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:150:	response := Call(system, user, 500)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:156:	if err := ParseJSON(response, &facts); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:196:	response := Call(system, query, 20)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:247:	response := Call(system, user, 500)
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:253:	if err := ParseJSON(response, &b); err != nil {
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:293:	system := `Classify this content for a developer building AI infrastructure (local models, MLX, Apple Silicon, Go, memory systems, security, revenue generation).
.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:304:	response := Call(system, user, 100)

codex
There’s a meaningful README-to-code drift here: the docs say search doesn’t use LLM calls and that librarian expansion is a local synonym map, but the actual `librarian` package does live HTTP calls to a local model endpoint and uses it for query expansion, ranking, summarization, extraction, and classification. I’m folding that into the architecture findings because it changes how we should think about Modus’s retrieval path and operational simplicity.
exec
/bin/zsh -lc 'rg -n "function executePipeline|const executePipeline|export async function executePipeline|export { executePipeline }" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 exited 2 in 0ms:
rg: regex parse error:
    (?:function executePipeline|const executePipeline|export async function executePipeline|export { executePipeline })
                                                                                                     ^
error: repetition quantifier expects a valid decimal

exec
/bin/zsh -lc 'rg -n "executePipeline|graphContribution|sessionBoostApplied|causalBoostApplied|feedbackSignalsApplied|lexicalPath|fallbackState" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:15:import { executePipeline } from '../lib/search/pipeline/index.js';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:362:  if (typeof data.lexicalPath !== 'string' && snapshot) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:363:    data.lexicalPath = snapshot.lexicalPath;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:365:  if (typeof data.fallbackState !== 'string' && snapshot) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:366:    data.fallbackState = snapshot.fallbackState;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:809:    const pipelineResult: PipelineResult = await executePipeline(pipelineConfig);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:908:        `[memory-search] Lexical capability path '${lexicalCapability.lexicalPath}' (fallbackState: ${lexicalCapability.fallbackState})`
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:920:      extraData.lexicalPath = lexicalCapability.lexicalPath;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:921:      extraData.fallbackState = lexicalCapability.fallbackState;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:942:    if (pipelineResult.metadata.stage2.feedbackSignalsApplied === 'applied') {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:947:    if (pipelineResult.metadata.stage2.graphContribution) {
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:948:      extraData.graphContribution = pipelineResult.metadata.stage2.graphContribution;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:949:      extraData.graph_contribution = pipelineResult.metadata.stage2.graphContribution;
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:985:      session: { applied: pipelineResult.metadata.stage2.sessionBoostApplied },
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:986:      causal: { applied: pipelineResult.metadata.stage2.causalBoostApplied },
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:136:  graphContribution?: {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:287:  let graphContribution: MemoryResultTrace['graphContribution'];
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:348:  if (rawResult.graphContribution && typeof rawResult.graphContribution === 'object') {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:349:    const contribution = rawResult.graphContribution as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:350:    graphContribution = {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:374:    graphContribution,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:26:import { executePipeline } from '../lib/search/pipeline/index.js';
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:43:  executePipeline: vi.fn(),
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:114:    vi.mocked(executePipeline).mockReset();
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:313:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:315:    } as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking-e2e.vitest.ts:326:    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(1);
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:28:  graphContribution?: unknown;
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:278:      graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:298:        graphContribution: { rolloutState: 'bounded_runtime', totalGraphInjected: 1 },
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:304:    expect((envelope.data.graphContribution as Record<string, unknown>).rolloutState).toBe('bounded_runtime');
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:305:    expect(envelope.data.results[0].trace?.graphContribution).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:317:  it('C10d: includeTrace=false omits per-result graph trace even when raw results carry graphContribution', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:323:      graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:339:  it('C10e: malformed graphContribution degrades safely instead of throwing', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:345:      graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:358:    expect(envelope.data.results[0].trace?.graphContribution).toEqual({
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:281:        graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:337:        graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:356:        graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:142:  it('P010-T1: handleMemorySearch returns lexicalPath and fallbackState on cached degraded responses', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:154:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:155:        fallbackState: 'compile_probe_miss',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:164:    expect(data?.lexicalPath).toBe('unavailable');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:165:    expect(data?.fallbackState).toBe('compile_probe_miss');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:170:  it('P010-T2: handleMemorySearch returns lexicalPath and fallbackState on cached healthy responses', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:182:        lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:183:        fallbackState: 'ok',
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:192:    expect(data?.lexicalPath).toBe('fts5');
.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts:193:    expect(data?.fallbackState).toBe('ok');
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:20:import { executePipeline } from '../lib/search/pipeline/index.js';
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:34:  executePipeline: vi.fn(),
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:118:    vi.mocked(executePipeline).mockReset();
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:144:    vi.mocked(executePipeline).mockImplementation(async (config) => {
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:149:      return result as unknown as Awaited<ReturnType<typeof executePipeline>>;
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:193:    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(2);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:218:    expect(vi.mocked(executePipeline)).not.toHaveBeenCalled();
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:227:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:229:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:255:    const initialCallCount = vi.mocked(executePipeline).mock.calls.length;
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:259:    expect(vi.mocked(executePipeline)).toHaveBeenCalledTimes(initialCallCount + 1);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:283:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:285:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:318:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:320:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:355:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:357:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:404:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:406:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:452:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:454:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:487:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:489:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:521:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:523:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:565:    vi.mocked(executePipeline).mockResolvedValue({
.opencode/skill/system-spec-kit/mcp_server/tests/shadow-evaluation-runtime.vitest.ts:567:    } as unknown as Awaited<ReturnType<typeof executePipeline>>);
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:171:    expect(result.metadata.graphContribution?.rolloutState).toBe('off');
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:180:        graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:196:    expect(result.metadata.graphContribution?.rolloutState).toBe('trace_only');
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:203:      expect((row.graphContribution as Record<string, unknown>).rolloutState).toBe('trace_only');
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:204:      expect((row.graphContribution as Record<string, unknown>).appliedBonus).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:215:            graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:225:            graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:245:    expect(first.metadata.graphContribution?.rolloutState).toBe('bounded_runtime');
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:256:    expect((boosted.graphContribution as Record<string, unknown>).appliedBonus).toBe(0.03);
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:257:    expect((boosted.graphContribution as Record<string, unknown>).capApplied).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:258:    expect((boosted.graphContribution as Record<string, unknown>).rolloutState).toBe('bounded_runtime');
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:309:    expect((injected?.graphContribution as Record<string, unknown>)?.injected).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:362:  it('reports sessionBoostApplied as "enabled" when boost runs but finds no data', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:379:    expect(result.metadata.sessionBoostApplied).toBe('enabled');
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:382:  it('reports causalBoostApplied as "enabled" when boost runs but finds no edges', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:398:    expect(result.metadata.causalBoostApplied).toBe('enabled');
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:401:  it('reports sessionBoostApplied as "off" when feature is disabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:411:    expect(result.metadata.sessionBoostApplied).toBe('off');
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:599:      const existingContribution = (row.graphContribution && typeof row.graphContribution === 'object')
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:600:        ? row.graphContribution as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts:606:        graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:28:  executePipeline: vi.fn(async () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:36:        sessionBoostApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:37:        causalBoostApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-eval-channels.vitest.ts:40:        feedbackSignalsApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:154:  it('T11: successful FTS search records lexicalPath=fts5 and fallbackState=ok', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:157:      lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:158:      fallbackState: 'ok',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:179:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:180:      fallbackState: 'compile_probe_miss',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:200:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:201:      fallbackState: 'missing_table',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:205:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:206:      fallbackState: 'missing_table',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:239:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:240:      fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:271:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:272:      fallbackState: 'bm25_runtime_failure',
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:327:        sessionBoostApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:328:        causalBoostApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:331:        feedbackSignalsApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:380:  it('R6-T27: executePipeline is exported from pipeline index', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:381:    const { executePipeline } = await import('../lib/search/pipeline');
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:382:    expect(typeof executePipeline).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:4:// Verifies B1 error handling in executePipeline:
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:62:import { executePipeline } from '../lib/search/pipeline/orchestrator';
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:106:    sessionBoostApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:107:    causalBoostApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:110:    feedbackSignalsApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:148:describe('executePipeline error cascading (B1)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:158:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:174:    await expect(executePipeline(config)).rejects.toThrow('embedding service unavailable');
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:184:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:190:    expect(result.metadata.stage2.sessionBoostApplied).toBe('failed');
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:201:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:216:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:227:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:242:    const result = await executePipeline(config);
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:119:        graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:162:        graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/tests/result-confidence-scoring.vitest.ts:325:        graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:133: * Inspects `trace.graphContribution` on each row.
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:150:    const graphContribution = trace?.graphContribution && typeof trace.graphContribution === 'object'
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:151:      ? trace.graphContribution as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:153:    if (!graphContribution) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:158:    if (graphContribution.rolloutState === 'trace_only' || graphContribution.rolloutState === 'bounded_runtime') {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:159:      rolloutState = graphContribution.rolloutState;
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:161:    if (typeof graphContribution.appliedBonus === 'number' && graphContribution.appliedBonus > 0) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:163:      maxAppliedBonus = Math.max(maxAppliedBonus, graphContribution.appliedBonus);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:165:    if (graphContribution.capApplied === true) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:168:    if (typeof graphContribution.raw === 'number' && Number.isFinite(graphContribution.raw)) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:169:      maxRaw = Math.max(maxRaw, graphContribution.raw);
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:171:    if (typeof graphContribution.normalized === 'number' && Number.isFinite(graphContribution.normalized)) {
.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/eval-channel-tracking.ts:172:      maxNormalized = Math.max(maxNormalized, graphContribution.normalized);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:26:  executePipeline: vi.fn(async () => ({
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:31:        sessionBoostApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:32:        causalBoostApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts:35:        feedbackSignalsApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:382:    expect((traceOnly[1].graphContribution as Record<string, unknown>).raw)
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:383:      .toBe((bounded[1].graphContribution as Record<string, unknown>).raw);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:384:    expect((traceOnly[1].graphContribution as Record<string, unknown>).normalized)
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:385:      .toBe((bounded[1].graphContribution as Record<string, unknown>).normalized);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:386:    expect((traceOnly[1].graphContribution as Record<string, unknown>).appliedBonus).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:387:    expect((bounded[1].graphContribution as Record<string, unknown>).appliedBonus).toBeGreaterThan(0);
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts:388:    expect((bounded[1].graphContribution as Record<string, unknown>).appliedBonus).toBeLessThanOrEqual(0.03);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:570:      const graphContribution = result[1].graphContribution as {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:578:      expect(graphContribution.raw).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:579:      expect(graphContribution.normalized).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:580:      expect(graphContribution.appliedBonus).toBeCloseTo(0.03, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:581:      expect(graphContribution.capApplied).toBe(true);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:582:      expect(graphContribution.rolloutState).toBe('bounded_runtime');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:595:      const graphContribution = result[1].graphContribution as {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:604:      expect(graphContribution.raw).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:605:      expect(graphContribution.normalized).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:606:      expect(graphContribution.appliedBonus).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:607:      expect(graphContribution.capApplied).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:608:      expect(graphContribution.rolloutState).toBe('trace_only');
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:621:      const graphContribution = result[1].graphContribution as {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:630:      expect(graphContribution.raw).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:631:      expect(graphContribution.normalized).toBe(1);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:632:      expect(graphContribution.appliedBonus).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:633:      expect(graphContribution.capApplied).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts:634:      expect(graphContribution.rolloutState).toBe('off');
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:17:import { executePipeline, type PipelineConfig } from '../search/pipeline/index.js';
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:325:  const pipelineResult = await executePipeline(buildReplayPipelineConfig(queryText, searchLimit));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:12:export { executePipeline } from './orchestrator.js';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:36:The public API is a single function: `executePipeline(config)` exported from `index.ts`.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:44:| `index.ts` | Public barrel export. Re-exports `executePipeline` from the orchestrator and all pipeline type definitions from `types.ts`. |
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:108:  const graphContrib = (row.graphContribution && typeof row.graphContribution === 'object')
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:109:    ? row.graphContribution as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:231: * Uses channelAttribution array and graphContribution.totalDelta to
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:247:  const graphContrib = (row.graphContribution && typeof row.graphContribution === 'object')
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:248:    ? row.graphContribution as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:256:    const graphContribution = Math.min(graphTotal, effectiveScore);
.opencode/skill/system-spec-kit/mcp_server/lib/search/result-explainability.ts:260:      graph: Math.round(graphContribution * 100) / 100,
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:37:  lexicalPath: LexicalPath;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:38:  fallbackState: FallbackState;
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:101:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:102:        fallbackState: 'compile_probe_miss',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:107:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:108:      fallbackState: 'compile_probe_miss',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:119:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:120:        fallbackState: 'missing_table',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:126:        lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:127:        fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:131:      lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:132:      fallbackState: 'missing_table',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:137:    lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:138:    fallbackState: 'ok',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:210:  if (capability.fallbackState !== 'ok') {
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:211:    console.warn(`[sqlite-fts] FTS5 unavailable (${capability.fallbackState}); returning empty lexical lane results`);
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:226:      lexicalPath: 'fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:227:      fallbackState: 'ok',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:234:          lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:235:          fallbackState: 'no_such_module_fts5',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:239:            lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:240:            fallbackState: 'bm25_runtime_failure',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:244:              lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:245:              fallbackState: 'missing_table',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:248:              lexicalPath: 'unavailable',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:249:              fallbackState: 'bm25_runtime_failure',
.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:273:  return probeFts5Capability(db).fallbackState === 'ok';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:57:export async function executePipeline(config: PipelineConfig): Promise<PipelineResult> {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:101:        sessionBoostApplied: 'failed' as SignalStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:102:        causalBoostApplied: 'failed' as SignalStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts:105:        feedbackSignalsApplied: 'failed' as SignalStatus,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:240:    sessionBoostApplied: SignalStatus;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:241:    causalBoostApplied: SignalStatus;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:244:    feedbackSignalsApplied: SignalStatus;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:245:    graphContribution?: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:177:- `lexicalPath`: the lane that actually ran for lexical retrieval. Current packet-owned values are `fts5` and `unavailable`. The wider response schema also allows `like`, but packet `010` does not claim that lane for this runtime seam.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:178:- `fallbackState`: the truthful FTS capability outcome for the request.
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:182:| `fallbackState` | Meaning | `lexicalPath` |
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:304:  const current = (row.graphContribution && typeof row.graphContribution === 'object')
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:305:    ? row.graphContribution as Record<string, unknown>
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:319:    graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:331:    const graphContribution = row.graphContribution as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:332:    return typeof graphContribution?.[key] === 'number' && Math.abs(graphContribution[key] as number) > 0;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:338:    const graphContribution = row.graphContribution as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:339:    return graphContribution?.injected === true;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:344:  graphContribution: Record<string, unknown> | undefined,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:347:  const value = graphContribution?.[key];
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:353:    const graphContribution = row.graphContribution as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:354:    const originalGraphSignalDelta = Math.max(0, resolveGraphContributionValue(graphContribution, 'graphSignalDelta'));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:355:    const originalCommunityDelta = Math.max(0, resolveGraphContributionValue(graphContribution, 'communityDelta'));
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:365:      // attribution is exposed on PipelineRow graphContribution.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:378:    const causalDelta = resolveGraphContributionValue(graphContribution, 'causalDelta');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:379:    const coActivationDelta = resolveGraphContributionValue(graphContribution, 'coActivationDelta');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:383:      graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:384:        ...(graphContribution ?? {}),
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:417:    const gc = row.graphContribution as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:498:    const gc = row.graphContribution as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:952:    sessionBoostApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:953:    causalBoostApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:956:    feedbackSignalsApplied: 'off',
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:957:    graphContribution: {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:990:      metadata.sessionBoostApplied = sbMeta.applied ? 'applied' : 'enabled';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:994:      metadata.sessionBoostApplied = 'failed';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1046:      metadata.causalBoostApplied = cbMeta.applied ? 'applied' : 'enabled';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1050:      metadata.causalBoostApplied = 'failed';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1249:      metadata.feedbackSignalsApplied = 'applied';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1254:    metadata.feedbackSignalsApplied = 'failed';
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1269:            const gc = row.graphContribution as Record<string, unknown> | undefined;
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1326:  if (metadata.graphContribution) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1327:    metadata.graphContribution.causalBoosted = countGraphContribution(results, 'causalDelta');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1328:    metadata.graphContribution.coActivationBoosted = countGraphContribution(results, 'coActivationDelta');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1329:    metadata.graphContribution.communityInjected = countGraphContribution(results, 'communityDelta');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1330:    metadata.graphContribution.graphSignalsBoosted = countGraphContribution(results, 'graphSignalDelta');
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1331:    metadata.graphContribution.totalGraphInjected = countGraphInjected(results);
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1335:      !metadata.graphContribution.killSwitchActive &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1336:      metadata.graphContribution.rolloutState === 'bounded_runtime' &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1337:      metadata.graphContribution.causalBoosted === 0 &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1338:      metadata.graphContribution.coActivationBoosted === 0 &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1339:      metadata.graphContribution.communityInjected === 0 &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1340:      metadata.graphContribution.graphSignalsBoosted === 0 &&
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1358:        sessionBoostApplied: metadata.sessionBoostApplied,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1359:        causalBoostApplied: metadata.causalBoostApplied,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1362:        feedbackSignalsApplied: metadata.feedbackSignalsApplied,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1363:        graphContribution: metadata.graphContribution,

exec
/bin/zsh -lc 'rg -n "TrackAccess|trackAccess|calculateRetrievability|applyClassificationDecay|applyHybridDecayPolicy|reviewCount|nextReviewDate" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:160:    const retrievability = fsrsScheduler.calculateRetrievability(currentStability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202:  trackAccess?: boolean; // opt-in access tracking (default false)
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519:    trackAccess: trackAccess = false, // opt-in, off by default
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:801:      trackAccess,
.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:165:      trackAccess: {
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:148:  trackAccess: z.boolean().optional(),
.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:463:  memory_search: ['cursor', 'query', 'concepts', 'specFolder', 'tenantId', 'userId', 'agentId', 'sharedSpaceId', 'limit', 'sessionId', 'enableDedup', 'tier', 'contextType', 'useDecay', 'includeContiguity', 'includeConstitutional', 'enableSessionBoost', 'enableCausalBoost', 'includeContent', 'anchors', 'min_quality_score', 'minQualityScore', 'bypassCache', 'rerank', 'applyLengthPenalty', 'applyStateLimits', 'minState', 'intent', 'autoDetectIntent', 'trackAccess', 'includeArchived', 'mode', 'includeTrace', 'profile'],
.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:74:  trackAccess?: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:112:import { calculateRetrievabilityDecay } from './cognitive/attention-decay';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:113:console.log(typeof SQLiteVectorStore, typeof calculateRetrievabilityDecay);
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:380:import { calculateRetrievabilityDecay } from './cognitive/attention-decay';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:384:const retrievability = calculateRetrievabilityDecay(
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:552:import { calculateRetrievabilityDecay } from './cognitive/attention-decay';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:560:const retrievability = calculateRetrievabilityDecay(stability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:687:import { calculateRetrievabilityDecay } from './cognitive/attention-decay';
.opencode/skill/system-spec-kit/mcp_server/lib/README.md:688:console.log('Available exports:', SQLiteVectorStore.name, typeof calculateRetrievabilityDecay);
.opencode/skill/system-spec-kit/mcp_server/tests/provenance-envelope.vitest.ts:223:      trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:6:  applyHybridDecayPolicy,
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:8:  calculateRetrievability,
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:110:describe('Hybrid Decay Policy — applyHybridDecayPolicy', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:120:    expect(applyHybridDecayPolicy(stability, 'decision')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:126:    expect(applyHybridDecayPolicy(stability, 'session')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:133:    expect(applyHybridDecayPolicy(1.0, 'decision')).toBe(Infinity);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:134:    expect(applyHybridDecayPolicy(5.5, 'decision')).toBe(Infinity);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:139:    expect(applyHybridDecayPolicy(2.0, 'constitutional')).toBe(Infinity);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:144:    expect(applyHybridDecayPolicy(3.0, 'critical')).toBe(Infinity);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:150:    expect(applyHybridDecayPolicy(stability, 'session')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:151:    expect(applyHybridDecayPolicy(stability, 'scratch')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:152:    expect(applyHybridDecayPolicy(stability, 'research')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:153:    expect(applyHybridDecayPolicy(stability, 'implementation')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:154:    expect(applyHybridDecayPolicy(stability, 'general')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:159:    const stability = applyHybridDecayPolicy(1.0, 'decision');
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:163:    const r0 = calculateRetrievability(stability, 0);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:164:    const r30 = calculateRetrievability(stability, 30);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:165:    const r365 = calculateRetrievability(stability, 365);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:173:    const stability = applyHybridDecayPolicy(1.0, 'session');
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:176:    const r30 = calculateRetrievability(stability, 30);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:184:    expect(applyHybridDecayPolicy(2.5, 'decision')).toBe(Infinity);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:185:    expect(applyHybridDecayPolicy(2.5, 'critical')).toBe(Infinity);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:195:    // When hybrid decay is OFF but classification decay is ON, applyHybridDecayPolicy
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:201:    // applyHybridDecayPolicy should return stability unchanged (its own flag is OFF)
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-decay-policy.vitest.ts:202:    expect(applyHybridDecayPolicy(stability, 'decision')).toBe(stability);
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:72:    const calcR = compositeScoring.calculateRetrievabilityScore
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:575:        const score = compositeScoring.calculateRetrievabilityScore(row)
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts:1043:      'calculateRetrievabilityScore',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:4:import { halfLifeToStability, calculateRetrievability } from '../lib/cognitive/tier-classifier';
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:32:    const r = calculateRetrievability(stability, 0);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:39:    const r = calculateRetrievability(stability, halfLife);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:49:    const rValues = timePoints.map(t => calculateRetrievability(stability, t));
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:59:    const r365 = calculateRetrievability(stability, 365);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:60:    const r730 = calculateRetrievability(stability, 730);
.opencode/skill/system-spec-kit/mcp_server/tests/unit-fsrs-formula.vitest.ts:73:    const r = calculateRetrievability(0, 30);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:31:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:32:    const result = fsrsScheduler.calculateRetrievability(1.0, 0);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:37:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:38:    const result = fsrsScheduler.calculateRetrievability(1.0, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:44:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:45:    const rLowStability = fsrsScheduler.calculateRetrievability(1.0, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:46:    const rHighStability = fsrsScheduler.calculateRetrievability(10.0, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:77:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:78:    const calc = fsrsScheduler.calculateRetrievability;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:89:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:90:    const calc = fsrsScheduler.calculateRetrievability;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:100:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:101:    const rVeryLong = fsrsScheduler.calculateRetrievability(1.0, 10000);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:109:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:110:    const calc = fsrsScheduler.calculateRetrievability;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:120:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:121:    const calc = fsrsScheduler.calculateRetrievability;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:128:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:129:    const calc = fsrsScheduler.calculateRetrievability;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:228:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:229:    const rHigh = fsrsScheduler.calculateRetrievability(10.0, 1);  // High stability, recent
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:230:    const rLow = fsrsScheduler.calculateRetrievability(1.0, 10);   // Low stability, old
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:297:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:298:    const rZero = fsrsScheduler.calculateRetrievability(1.0, 0);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:308:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:309:    const calc = fsrsScheduler.calculateRetrievability;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:328:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:329:    const calc = fsrsScheduler.calculateRetrievability;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:340:    if (!fsrsScheduler?.calculateRetrievability) return;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:341:    const calc = fsrsScheduler.calculateRetrievability;
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:389:      const r = fsrsScheduler.calculateRetrievability
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:390:        ? fsrsScheduler.calculateRetrievability(stability, 1)
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:416:      const r = fsrsScheduler.calculateRetrievability
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:417:        ? fsrsScheduler.calculateRetrievability(stability, 1)
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:555:    'calculateRetrievability',
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:626:    // If calculateRetrievability is available, test it
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:627:    if (typeof fsrsScheduler.calculateRetrievability === 'function') {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:628:      const r = fsrsScheduler.calculateRetrievability(30, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:96:     Production: calculateRetrievability(stability: number, elapsedDays: number): number
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:102:      const r = tierClassifier.calculateRetrievability(10, 0);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:108:      const r = tierClassifier.calculateRetrievability(1.0, 1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:114:      const r = tierClassifier.calculateRetrievability(100, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:119:      const r = tierClassifier.calculateRetrievability(1, 10);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:125:      expect(tierClassifier.calculateRetrievability(0, 5)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:481:      'classifyState', 'calculateRetrievability', 'classifyTier',
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:82:    reviewCount: 5,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-normalization.vitest.ts:217:    expect(memory.reviewCount).toBe(5);
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:85:      trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/stage2-fusion.vitest.ts:348:    input.config.trackAccess = true;
.opencode/skill/system-spec-kit/mcp_server/tests/stage1-expansion.vitest.ts:205:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:109:     calculateRetrievabilityDecay()
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:110:     Production: calculateRetrievabilityDecay(stability: number, elapsedDays: number): number
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:114:  describe('calculateRetrievabilityDecay()', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:116:      expect(attentionDecay.calculateRetrievabilityDecay(1.0, 0)).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:120:      const r1 = attentionDecay.calculateRetrievabilityDecay(1.0, 1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:126:      const rS1 = attentionDecay.calculateRetrievabilityDecay(1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:127:      const rS5 = attentionDecay.calculateRetrievabilityDecay(5.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:132:      expect(attentionDecay.calculateRetrievabilityDecay(0, 5)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:136:      expect(attentionDecay.calculateRetrievabilityDecay(1.0, -5)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:341:     calculateRetrievability(stability, elapsedDays): number
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:346:      expect(fsrsScheduler.calculateRetrievability(1.0, 0)).toBe(1.0);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:351:        fsrsScheduler.calculateRetrievability(1.0, t)
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:359:      const rFar = fsrsScheduler.calculateRetrievability(1.0, 10000);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:364:      const rS1 = fsrsScheduler.calculateRetrievability(1.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:365:      const rS10 = fsrsScheduler.calculateRetrievability(10.0, 5);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:370:      const rNeg = fsrsScheduler.calculateRetrievability(1.0, -5);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:371:      const rHuge = fsrsScheduler.calculateRetrievability(0.001, 1000000);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:379:      expect(fsrsScheduler.calculateRetrievability(0, 1)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:380:      expect(fsrsScheduler.calculateRetrievability(-5, 1)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:397:    const fsrsExports = ['applyFsrsDecay', 'calculateRetrievabilityDecay', 'activateMemoryWithFsrs'];
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:419:      const constRetrievability = attentionDecay.calculateRetrievabilityDecay(1000.0, 1000);
.opencode/skill/system-spec-kit/mcp_server/tests/attention-decay.vitest.ts:448:      'getDecayRate', 'calculateRetrievabilityDecay',
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:18:  calculateRetrievabilityScore,
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:72:describe('T505-02: Retrievability Decay (calculateRetrievabilityScore)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:77:    const recentScore = calculateRetrievabilityScore(recentRow);
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:78:    const olderScore = calculateRetrievabilityScore(olderRow);
.opencode/skill/system-spec-kit/mcp_server/tests/scoring.vitest.ts:156:    const score = calculateRetrievabilityScore({ lastReview: 'not-a-date' });
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:111:      trackAccess: true,
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-ranking.vitest.ts:225:  it('records adaptive access signals when trackAccess is true and adaptive ranking enabled', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-prefilter.vitest.ts:137:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:186:        mod.trackAccess(i);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:189:      // The next trackAccess should trigger the overflow guard
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:191:      const result = mod.trackAccess(overflowId);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:206:        mod.trackAccess(i);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:208:      mod.trackAccess(MAX + 2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:231:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:249:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:271:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:301:          mod.trackAccess(memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:318:          mod.trackAccess(memoryId);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker-extended.vitest.ts:383:      expect(typeof mod.trackAccess).toBe('function');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:13:  applyClassificationDecay,
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:14:  calculateRetrievability,
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:56:  it('applyClassificationDecay returns Infinity for constitutional tier (flag=true)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:58:      const result = applyClassificationDecay(10, 'implementation', 'constitutional');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:63:  it('calculateRetrievability with Infinity stability returns 1.0 regardless of elapsed days', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:64:    // When applyClassificationDecay returns Infinity, plug into calculateRetrievability
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:67:      const r = calculateRetrievability(Infinity, elapsed);
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:84:  it('applyClassificationDecay returns Infinity for decision context (flag=true)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:86:      const result = applyClassificationDecay(5, 'decision', 'normal');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:102:  it('applyClassificationDecay halves stability for temporary (flag=true)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:105:      const result = applyClassificationDecay(baseStability, 'general', 'temporary');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:115:      const normalStability = applyClassificationDecay(baseStability, 'general', 'normal');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:116:      const temporaryStability = applyClassificationDecay(baseStability, 'general', 'temporary');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:118:      const rNormal = calculateRetrievability(normalStability, elapsed);
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:119:      const rTemporary = calculateRetrievability(temporaryStability, elapsed);
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:142:      const researchStability = applyClassificationDecay(baseStability, 'research', 'normal');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:143:      const normalStability = applyClassificationDecay(baseStability, 'general', 'normal');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:150:      expect(calculateRetrievability(researchStability, elapsed))
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:151:        .toBeGreaterThan(calculateRetrievability(normalStability, elapsed));
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:178:  it('applyClassificationDecay with unknown types returns unchanged stability', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:180:      const result = applyClassificationDecay(7, 'unknown_ctx', 'unknown_tier');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:188:  it('flag unset → applyClassificationDecay applies multiplier (graduated: default ON)', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:190:      const result = applyClassificationDecay(10, 'decision', 'constitutional');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:196:  it('flag="false" → applyClassificationDecay returns stability unchanged', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:201:        const result = applyClassificationDecay(10, 'decision', 'constitutional');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:213:  it('flag="0" → applyClassificationDecay returns stability unchanged', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:215:      const result = applyClassificationDecay(10, 'temporary', 'normal');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:220:  it('flag="true" → applyClassificationDecay applies multiplier', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:222:      const result = applyClassificationDecay(10, 'general', 'temporary');
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:227:  it('flag="1" → applyClassificationDecay applies multiplier', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/decay.vitest.ts:229:      const result = applyClassificationDecay(10, 'research', 'normal');
.opencode/skill/system-spec-kit/mcp_server/tests/orchestrator-error-cascade.vitest.ts:84:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md:108:5. Testing effect — FSRS strengthening write-back (opt-in via `trackAccess`)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:10:  calculateRetrievability as calculateFsrsRetrievability
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:224:function calculateRetrievability(stability: number, elapsedDays: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:325:  const retrievability = calculateRetrievability(finalStability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.ts:526:  calculateRetrievability,
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:40:  applyClassificationDecay,
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:223:  // T041-16: applyClassificationDecay with flag enabled adjusts stability
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:229:    const adjusted = applyClassificationDecay(baseStability, 'research', 'important');
.opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-scoring-calibration.vitest.ts:238:    const result = applyClassificationDecay(baseStability, 'research', 'temporary');
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:65:    it('T507-01: trackAccess returns true on accumulate', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:66:      const result1 = mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:70:    it('T507-01b: Accumulator state updated after trackAccess', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:85:        mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:89:      mod.trackAccess(2);
.opencode/skill/system-spec-kit/mcp_server/tests/access-tracker.vitest.ts:169:      mod.trackAccess(1);
.opencode/skill/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:163:        trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:8:  calculateRetrievabilityScore,
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:18:  // 4.1 calculateRetrievabilityScore with partial objects (ScoringInput)
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:21:      const r = calculateRetrievabilityScore({ stability: 5.0 });
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:29:      const r = calculateRetrievabilityScore({ lastReview: new Date().toISOString() });
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:37:      const r = calculateRetrievabilityScore({});
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts:45:      const r = calculateRetrievabilityScore({
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:264:| `fsrs-scheduler.ts`        | FSRS v4 + TM-03 classification decay | `calculateRetrievability`, `updateStability`, `processReview`, `applyClassificationDecay` |
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:289:  calculateRetrievability,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:300:const R = calculateRetrievability(stability, elapsed);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:313:// params = { stability: 1.0, difficulty: 5.0, lastReview: null, reviewCount: 0 }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md:316:// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:96:// calculateDecayedScore was removed; use calculateRetrievabilityDecay or applyFsrsDecay.
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:101:function calculateRetrievabilityDecay(stability: number, elapsedDays: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:102:  if (typeof fsrsScheduler.calculateRetrievability === 'function') {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:103:    return fsrsScheduler.calculateRetrievability(stability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:130:  const retrievability = calculateRetrievabilityDecay(stability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:173:      reviewCount: (memory.review_count as number) || 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:185:        reviewCount: params.reviewCount + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:186:        nextReviewDate: new Date().toISOString(),
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:204:      result.reviewCount,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts:340:  calculateRetrievabilityDecay,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:20:// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:62:  reviewCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:69:  reviewCount: number;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:70:  nextReviewDate: string;
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:80:function calculateRetrievability(stability: number, elapsedDays: number): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:193:    reviewCount: 0,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:202:  const retrievability = calculateRetrievability(params.stability, elapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:207:  const nextReviewDate = getNextReviewDate(newStability);
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:213:    reviewCount: params.reviewCount + 1,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:214:    nextReviewDate,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:346:function applyClassificationDecay(
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:381:   This is intentionally SEPARATE from TM-03 (applyClassificationDecay) which
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:451:function applyHybridDecayPolicy(stability: number, contextType: string, importanceTier?: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:477:  applyClassificationDecay,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:486:  applyHybridDecayPolicy,
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:489:  calculateRetrievability,
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts:7:  applyClassificationDecay,
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts:8:  applyHybridDecayPolicy,
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts:27:    expect(applyHybridDecayPolicy(4, 'decision', 'normal')).toBe(NO_DECAY);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts:37:    expect(applyHybridDecayPolicy(6, 'transient', 'critical')).toBe(6);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts:40:  it('makes applyClassificationDecay honor the hybrid no-decay override when enabled', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts:44:    expect(applyClassificationDecay(2.5, 'critical', 'temporary')).toBe(NO_DECAY);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts:45:    expect(applyClassificationDecay(2.5, 'session', 'constitutional')).toBe(2.5);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-hybrid-decay.vitest.ts:52:    expect(applyHybridDecayPolicy(3, 'decision', 'normal')).toBe(NO_DECAY);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:86:      expect(fsrsScheduler.calculateRetrievability(-1, 5)).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:142:        reviewCount: 0,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:145:      expect(fsrsScheduler.calculateRetrievability(365, 30)).toBeLessThanOrEqual(1);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:292:      const nextReviewDate = fsrsScheduler.getNextReviewDate(5);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:293:      expect(Number.isNaN(new Date(nextReviewDate).getTime())).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:48:  calculateRetrievabilityScore,
.opencode/skill/system-spec-kit/mcp_server/tests/cross-feature-integration-eval.vitest.ts:544:      const retrievability = calculateRetrievabilityScore({
.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:239:    trackAccess: false,
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:158:    expect(params).toHaveProperty('reviewCount');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:176:  it('C-05: reviewCount is 0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:178:    expect(params.reviewCount).toBe(0);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:206:    expect(result).toHaveProperty('reviewCount');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:207:    expect(result).toHaveProperty('nextReviewDate');
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:211:  it('D-02: reviewCount increments by 1', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:213:    expect(result.reviewCount).toBe(initial.reviewCount + 1);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:225:    const params = { ...initial, stability: 5.0, lastReview: new Date().toISOString(), reviewCount: 1 };
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:231:    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:237:    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:243:    const params = { ...initial, lastReview: new Date().toISOString(), reviewCount: 1 };
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:249:  it('D-08: nextReviewDate is valid future date', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:251:    const nextDate = new Date(result.nextReviewDate);
.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:266:    expect(result2.reviewCount).toBe(2);
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:86:function trackAccess(memoryId: number): boolean {
.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:328:  trackAccess,
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md:87:- FSRS testing effect fires only when `trackAccess` is explicitly true.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:14://     - FSRS write-back to memory_index (when trackAccess=true) — DB write
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:28:// 3.  Testing effect          — FSRS strengthening write-back (trackAccess)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:843: * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:872:      const currentR = fsrsScheduler.calculateRetrievability(
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:936: *   3.  Testing effect     (all types, when trackAccess = true)
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1195:  // P3-09 FIX: Only when explicitly opted in via trackAccess.
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1198:  if (config.trackAccess) {
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:152:  trackAccess: boolean;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:30:  calculateRetrievability: (stability: number, elapsedDays: number) => number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:31:  applyClassificationDecay?: (stability: number, contextType: string, importanceTier: string) => number;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:214:function applyClassificationDecayFallback(stability: number, contextType: string, importanceTier: string): number {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:299:export function calculateRetrievabilityScore(row: ScoringInput): number {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:331:    if (scheduler?.applyClassificationDecay) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:332:      adjustedStability = scheduler.applyClassificationDecay(stability, contextType, tier);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:334:      adjustedStability = applyClassificationDecayFallback(stability, contextType, tier);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:351:  if (scheduler && typeof scheduler.calculateRetrievability === 'function') {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:352:    const score = scheduler.calculateRetrievability(adjustedStability, adjustedElapsedDays);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:362:export const calculateTemporalScore = calculateRetrievabilityScore;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:670:  const retrievabilityScore = calculateRetrievabilityScore(row);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:754:        retrievability: calculateRetrievabilityScore(row),
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts:834:  const retrievability = calculateRetrievabilityScore(row);

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '820,980p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
   820	      const usageBoost = computeUsageBoost(accessCount, maxAccess);
   821	
   822	      if (usageBoost <= 0) {
   823	        return row;
   824	      }
   825	
   826	      return {
   827	        ...withSyncedScoreAliases(row, resolveBaseScore(row) + usageBoost),
   828	        usageBoost,
   829	      };
   830	    });
   831	
   832	    return sortDeterministicRows(boosted as Array<PipelineRow & { id: number }>);
   833	  } catch (err: unknown) {
   834	    const message = err instanceof Error ? err.message : String(err);
   835	    console.warn(`[stage2-fusion] usage ranking failed: ${message}`);
   836	    return results;
   837	  }
   838	}
   839	
   840	/**
   841	 * Apply FSRS testing effect (strengthening write-back) for all accessed memories.
   842	 *
   843	 * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid
   844	 * unintended write side-effects during read-only searches).
   845	 *
   846	 * For each result, the current retrievability R(t) is computed from the stored
   847	 * stability and last_review fields, then `strengthenOnAccess` fires an FSRS
   848	 * GRADE_GOOD update — increasing stability proportional to how much the memory
   849	 * needed the review.
   850	 *
   851	 * Errors per-row are caught and logged; they do not abort the full set.
   852	 *
   853	 * @param db      - Active SQLite database connection
   854	 * @param results - Pipeline rows that were accessed
   855	 */
   856	function applyTestingEffect(
   857	  db: Database.Database,
   858	  results: PipelineRow[]
   859	): void {
   860	  if (!db || !Array.isArray(results) || results.length === 0) return;
   861	
   862	  for (const row of results) {
   863	    try {
   864	      const lastReview = (row.last_review as string | undefined | null) || (row.created_at as string | undefined);
   865	      if (!lastReview) continue;
   866	
   867	      const stability = typeof row.stability === 'number' && Number.isFinite(row.stability)
   868	        ? row.stability
   869	        : fsrsScheduler.DEFAULT_INITIAL_STABILITY;
   870	
   871	      const elapsedDays = fsrsScheduler.calculateElapsedDays(lastReview);
   872	      const currentR = fsrsScheduler.calculateRetrievability(
   873	        stability,
   874	        Math.max(0, elapsedDays)
   875	      );
   876	
   877	      strengthenOnAccess(db, row.id, currentR);
   878	    } catch (err: unknown) {
   879	      const message = err instanceof Error ? err.message : String(err);
   880	      console.warn(`[stage2-fusion] applyTestingEffect failed for id ${row.id}: ${message}`);
   881	    }
   882	  }
   883	}
   884	
   885	function recordAdaptiveAccessSignals(
   886	  db: Database.Database,
   887	  results: PipelineRow[],
   888	  query: string | undefined
   889	): void {
   890	  if (!db || !Array.isArray(results) || results.length === 0) return;
   891	
   892	  if (getAdaptiveMode() === 'disabled') return;
   893	
   894	  ensureAdaptiveTables(db);
   895	  const insertAdaptiveSignal = db.prepare(`
   896	    INSERT INTO adaptive_signal_events (memory_id, signal_type, signal_value, query, actor, metadata)
   897	    VALUES (?, ?, ?, ?, ?, ?)
   898	  `);
   899	  const writeAdaptiveSignals = db.transaction((accessedResults: PipelineRow[]) => {
   900	    for (const result of accessedResults) {
   901	      insertAdaptiveSignal.run(
   902	        result.id,
   903	        'access',
   904	        1.0,
   905	        query || '',
   906	        '',
   907	        '{}',
   908	      );
   909	    }
   910	  });
   911	
   912	  try {
   913	    writeAdaptiveSignals(results);
   914	  } catch (err: unknown) {
   915	    // Adaptive signal capture must never block the core search pipeline.
   916	    console.warn('[stage2-fusion] adaptive access signal write failed:', (err as Error)?.message ?? err);
   917	  }
   918	}
   919	
   920	// -- Main Stage 2 entry point --
   921	
   922	/**
   923	 * Execute Stage 2: Fusion + Signal Integration.
   924	 *
   925	 * This is the SINGLE authoritative point where all scoring signals are
   926	 * applied. The ordering is fixed and must not be changed without updating
   927	 * the architectural documentation (see types.ts Stage2 comment block).
   928	 *
   929	 * Signal application order (13 steps):
   930	 *   1.  Session boost      (hybrid only — working memory attention)
   931	 *   1a. Recency fusion     (all types — time-decay bonus)
   932	 *   2.  Causal boost       (hybrid only — graph-traversal amplification)
   933	 *   2a. Co-activation      (spreading activation from top-N seeds)
   934	 *   2b. Community boost    (N2c — inject co-members)
   935	 *   2c. Graph signals      (N2a+N2b — momentum + depth)
   936	 *   3.  Testing effect     (all types, when trackAccess = true)
   937	 *   4.  Intent weights     (non-hybrid only — G2 prevention)
   938	 *   5.  Artifact routing   (all types, when routing confidence > 0)
   939	 *   6.  Feedback signals   (all types — learned triggers + negative feedback)
   940	 *   7.  Artifact limiting  (trim to strategy.maxResults if routing active)
   941	 *   8.  Anchor metadata    (annotation — no score mutation)
   942	 *   9.  Validation metadata (spec quality signals + quality scoring)
   943	 *
   944	 * @param input - Stage 2 input containing candidates and pipeline config
   945	 * @returns Stage 2 output with scored results and per-signal metadata
   946	 */
   947	export async function executeStage2(input: Stage2Input): Promise<Stage2Output> {
   948	  const { candidates, config } = input;
   949	  const start = Date.now();
   950	
   951	  const metadata: Stage2Output['metadata'] & { communityBoostApplied?: boolean; graphSignalsApplied?: boolean } = {
   952	    sessionBoostApplied: 'off',
   953	    causalBoostApplied: 'off',
   954	    intentWeightsApplied: 'off',
   955	    artifactRoutingApplied: 'off',
   956	    feedbackSignalsApplied: 'off',
   957	    graphContribution: {
   958	      killSwitchActive: !isGraphUnifiedEnabled(),
   959	      causalBoosted: 0,
   960	      coActivationBoosted: 0,
   961	      communityInjected: 0,
   962	      graphSignalsBoosted: 0,
   963	      totalGraphInjected: 0,
   964	      rolloutState: resolveGraphWalkRolloutState(),
   965	    },
   966	    qualityFiltered: 0,
   967	    durationMs: 0,
   968	  };
   969	
   970	  // FIX #3: Deep clone candidates so in-place mutations (e.g., syncScoreAliasesInPlace)
   971	  // cannot corrupt the original Stage 1 output. A shallow copy ([...candidates]) shares
   972	  // the same row objects, creating a race condition if the orchestrator's timeout fallback
   973	  // uses the original Stage 1 candidates array.
   974	  let results: PipelineRow[] = candidates.map(row => ({ ...row }));
   975	  const isHybrid = config.searchType === 'hybrid';
   976	
   977	  // -- 1. Session boost --
   978	  // Only for hybrid search type — session attention signals are most meaningful
   979	  // When the full hybrid result set is available for ordering.
   980	  if (isHybrid && config.enableSessionBoost && config.sessionId) {

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1180,1235p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
  1180	      console.warn(`[stage2-fusion] usage ranking skipped (db unavailable): ${message}`);
  1181	    }
  1182	  }
  1183	
  1184	  // -- 2e. Graph evidence provenance (Phase C T026) --
  1185	  // Populate graphEvidence on results that received graph-based boosts.
  1186	  // Gated behind SPECKIT_RESULT_PROVENANCE. Fail-open.
  1187	  try {
  1188	    results = populateGraphEvidence(results);
  1189	  } catch (err: unknown) {
  1190	    const message = err instanceof Error ? err.message : String(err);
  1191	    console.warn(`[stage2-fusion] graph evidence provenance failed: ${message}`);
  1192	  }
  1193	
  1194	  // -- 3. Testing effect (FSRS write-back) --
  1195	  // P3-09 FIX: Only when explicitly opted in via trackAccess.
  1196	  // Write-back is fire-and-forget; errors per-row are swallowed inside
  1197	  // ApplyTestingEffect so they never abort the pipeline.
  1198	  if (config.trackAccess) {
  1199	    try {
  1200	      const db = requireDb();
  1201	      applyTestingEffect(db, results);
  1202	      recordAdaptiveAccessSignals(db, results, config.query);
  1203	    } catch (err: unknown) {
  1204	      const message = err instanceof Error ? err.message : String(err);
  1205	      console.warn(`[stage2-fusion] testing effect skipped (db unavailable): ${message}`);
  1206	    }
  1207	  }
  1208	
  1209	  // -- 4. Intent weights --
  1210	  // G2 PREVENTION: Only apply for non-hybrid search types.
  1211	  // Hybrid search (RRF / RSF) incorporates intent weighting during fusion —
  1212	  // Applying it again here would double-count, causing the G2 bug.
  1213	  if (!isHybrid && config.intentWeights) {
  1214	    try {
  1215	      const weighted = applyIntentWeightsToResults(results, config.intentWeights);
  1216	      results = weighted.map((result) =>
  1217	        typeof result.intentAdjustedScore === 'number'
  1218	          ? withSyncedScoreAliases(result, result.intentAdjustedScore)
  1219	          : result
  1220	      );
  1221	      metadata.intentWeightsApplied = 'applied';
  1222	    } catch (err: unknown) {
  1223	      const message = err instanceof Error ? err.message : String(err);
  1224	      console.warn(`[stage2-fusion] intent weights failed: ${message}`);
  1225	      metadata.intentWeightsApplied = 'failed';
  1226	    }
  1227	  }
  1228	
  1229	  // -- 5. Artifact routing weights --
  1230	  if (config.artifactRouting && config.artifactRouting.confidence > 0) {
  1231	    try {
  1232	      const routed = applyArtifactRouting(results, config.artifactRouting);
  1233	      results = routed;
  1234	      metadata.artifactRoutingApplied = 'applied';
  1235	    } catch (err: unknown) {

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Search Pipeline - 4-Stage Retrieval"
description: "Four-stage retrieval pipeline: candidate generation, fusion, reranking and filtering."
trigger_phrases:
  - "search pipeline"
  - "retrieval pipeline"
  - "4-stage pipeline"
  - "candidate generation"
  - "fusion scoring"
  - "reranking"
  - "stage 4 filter"
  - "score invariant"
  - "MPAB chunk collapse"
---

# Search Pipeline - 4-Stage Retrieval

A four-stage retrieval pipeline that takes a search query through candidate generation, score fusion, reranking and final filtering to produce ranked memory results.

---

## Table of Contents

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. PIPELINE STAGES](#3--pipeline-stages)
- [4. KEY INVARIANTS](#4--key-invariants)
- [5. RELATED DOCUMENTS](#5--related-documents)

---

## 1. OVERVIEW

The `pipeline/` directory implements the core retrieval pipeline behind `memory_search`. Each search request flows through four sequential stages, each with a defined I/O contract and clear responsibility boundary. The pipeline supports hybrid, vector and multi-concept search types with optional deep-mode query expansion, cross-encoder reranking, MMR diversity pruning and MPAB chunk-to-parent reassembly.

The public API is a single function: `executePipeline(config)` exported from `index.ts`.

---

## 2. STRUCTURE

| File | Description |
|------|-------------|
| `index.ts` | Public barrel export. Re-exports `executePipeline` from the orchestrator and all pipeline type definitions from `types.ts`. |
| `orchestrator.ts` | Wires the four stages together in sequence. Passes each stage's output as input to the next and assembles the final `PipelineResult` with per-stage metadata. |
| `stage1-candidate-gen.ts` | Stage 1: Candidate Generation. Runs search channels (hybrid, vector, multi-concept), applies deep-mode query expansion (R6), embedding-based expansion (R12), summary embeddings (R8), constitutional memory injection, quality threshold filtering and tier/contextType filtering. |
| `stage2-fusion.ts` | Stage 2: Fusion + Signal Integration. The single authoritative scoring point. Applies 9 signal steps in fixed order: session boost, causal boost, co-activation spreading, community co-retrieval, graph signals, FSRS testing effect, intent weights (non-hybrid only, G2 prevention), artifact routing, feedback signals, artifact limiting, anchor metadata and validation metadata scoring. |
| `stage3-rerank.ts` | Stage 3: Rerank + Aggregate. Applies cross-encoder reranking (remote or local GGUF), MMR diversity pruning and MPAB chunk collapse with parent document reassembly from the database. |
| `stage4-filter.ts` | Stage 4: Filter + Annotate. Removes results below minimum memory state priority, enforces per-tier limits, runs TRM evidence-gap detection and attaches annotation metadata. Enforces the score immutability invariant at runtime. |
| `types.ts` | All pipeline data contracts: `PipelineRow`, `Stage4ReadonlyRow`, `PipelineConfig`, stage I/O interfaces (`Stage1Input`/`Output` through `Stage4Input`/`Output`), `PipelineResult`, `ScoreSnapshot` and the `resolveEffectiveScore()` shared score resolution function. Also provides `captureScoreSnapshot()` and `verifyScoreInvariant()` for Stage 4 defence-in-depth. |

---

## 3. PIPELINE STAGES

```text
Query + Config
      |
      v
  Stage 1: Candidate Generation
      |  search channels, constitutional injection, quality filter
      v
  Stage 2: Fusion + Signal Integration
      |  session/causal/co-activation boosts, intent weights,
      |  artifact routing, feedback signals, FSRS write-back
      v
  Stage 3: Rerank + Aggregate
      |  cross-encoder reranking, MMR diversity, MPAB chunk collapse
      v
  Stage 4: Filter + Annotate
      |  state filter, per-tier limits, TRM evidence gap, annotations
      v
  PipelineResult { results, metadata, annotations, trace }
```

**Stage 1 - Candidate Generation** (`stage1-candidate-gen.ts`)
- Runs one or more search channels based on `searchType` and `mode`.
- Channels: hybrid (with optional deep-mode expansion), vector, multi-concept.
- Optional R12 embedding expansion and R8 summary embedding channels.
- Injects constitutional memories when absent and no tier filter is active.
- Applies quality threshold and tier/contextType filters.

**Stage 2 - Fusion + Signal Integration** (`stage2-fusion.ts`)
- The only stage where scoring modifications happen (except Stage 3 reranking).
- 9 signal steps applied in a fixed order that must not be reordered.
- G2 prevention: intent weights are applied only for non-hybrid search types.
- FSRS testing effect fires only when `trackAccess` is explicitly true.

**Stage 3 - Rerank + Aggregate** (`stage3-rerank.ts`)
- Cross-encoder reranking via remote API or local GGUF model.
- MMR diversity pruning using per-intent lambda values.
- MPAB chunk collapse: groups chunks by parent, elects best chunk, reassembles parent content from the database.
- Preserves Stage 2 scores as `stage2Score` for auditability.

**Stage 4 - Filter + Annotate** (`stage4-filter.ts`)
- Memory state priority filtering (HOT > WARM > COLD > DORMANT > ARCHIVED).
- Per-tier hard limits prevent any single tier from dominating results.
- TRM evidence-gap detection (Z-score confidence check on score distribution).
- Runtime score invariant verification via snapshot comparison.

---

## 4. KEY INVARIANTS

1. **Single Scoring Point.** All score modifications happen in Stage 2 (fusion) or Stage 3 (reranking). Stage 4 must not change any score field.
2. **G2 Double-Weighting Guard.** Intent weights are applied only for non-hybrid search types. Hybrid search incorporates intent weighting during RRF/RSF fusion internally.
3. **Stage 4 Score Immutability.** Enforced at compile time via `Stage4ReadonlyRow` readonly fields and at runtime via `captureScoreSnapshot()` / `verifyScoreInvariant()`.
4. **Score Resolution Consistency.** All stages use the shared `resolveEffectiveScore()` function from `types.ts` with fallback chain: `intentAdjustedScore` > `rrfScore` > `score` > `similarity/100`, clamped to [0, 1].

---

## 5. RELATED DOCUMENTS

- `mcp_server/lib/search/` - Parent search directory containing hybrid search, vector index, cross-encoder and other search modules consumed by the pipeline.
- `mcp_server/lib/ops/` - Background operations (file watcher, job queue) that feed data into the search index.
- `@spec-kit/shared/contracts/retrieval-trace.ts` - Trace contract used for pipeline observability.
- `@spec-kit/shared/algorithms/mmr-reranker.ts` - MMR algorithm used by Stage 3.

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts | sed -n '1,180p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Sqlite Fts
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Semantic and lexical search (memory_search)
     5	// Weighted BM25 scoring for FTS5 full-text search.
     6	// Extracted from hybrid-search.ts ftsSearch() for independent
     7	// Testing and future delegation.
     8	
     9	import { BM25_FTS5_WEIGHTS, normalizeLexicalQueryTokens } from './bm25-index.js';
    10	import type Database from 'better-sqlite3';
    11	
    12	// ───────────────────────────────────────────────────────────────
    13	// 2. INTERFACES
    14	
    15	// ───────────────────────────────────────────────────────────────
    16	interface FtsBm25Result {
    17	  id: number;
    18	  fts_score: number;
    19	  [key: string]: unknown;
    20	}
    21	
    22	interface FtsBm25Options {
    23	  limit?: number;
    24	  specFolder?: string;
    25	  includeArchived?: boolean;
    26	}
    27	
    28	type LexicalPath = 'fts5' | 'like' | 'unavailable';
    29	type FallbackState =
    30	  | 'ok'
    31	  | 'compile_probe_miss'
    32	  | 'missing_table'
    33	  | 'no_such_module_fts5'
    34	  | 'bm25_runtime_failure';
    35	
    36	interface LexicalCapabilitySnapshot {
    37	  lexicalPath: LexicalPath;
    38	  fallbackState: FallbackState;
    39	}
    40	
    41	let lastLexicalCapabilitySnapshot: LexicalCapabilitySnapshot | null = null;
    42	
    43	function cloneLexicalCapabilitySnapshot(
    44	  snapshot: LexicalCapabilitySnapshot | null
    45	): LexicalCapabilitySnapshot | null {
    46	  return snapshot ? { ...snapshot } : null;
    47	}
    48	
    49	function setLastLexicalCapabilitySnapshot(snapshot: LexicalCapabilitySnapshot): void {
    50	  lastLexicalCapabilitySnapshot = { ...snapshot };
    51	}
    52	
    53	function getLastLexicalCapabilitySnapshot(): LexicalCapabilitySnapshot | null {
    54	  return cloneLexicalCapabilitySnapshot(lastLexicalCapabilitySnapshot);
    55	}
    56	
    57	function resetLastLexicalCapabilitySnapshot(): void {
    58	  lastLexicalCapabilitySnapshot = null;
    59	}
    60	
    61	function toErrorMessage(error: unknown): string {
    62	  return error instanceof Error ? error.message : String(error);
    63	}
    64	
    65	function readCompileOptionValue(row: unknown): string | null {
    66	  if (typeof row === 'string') {
    67	    return row;
    68	  }
    69	  if (!row || typeof row !== 'object') {
    70	    return null;
    71	  }
    72	
    73	  const record = row as Record<string, unknown>;
    74	  const direct = record.compile_options;
    75	  if (typeof direct === 'string') {
    76	    return direct;
    77	  }
    78	
    79	  const firstString = Object.values(record).find((value) => typeof value === 'string');
    80	  return typeof firstString === 'string' ? firstString : null;
    81	}
    82	
    83	function isNoSuchModuleFts5Error(error: unknown): boolean {
    84	  return toErrorMessage(error).toLowerCase().includes('no such module: fts5');
    85	}
    86	
    87	function isBm25RuntimeFailure(error: unknown): boolean {
    88	  const message = toErrorMessage(error).toLowerCase();
    89	  return message.includes('bm25');
    90	}
    91	
    92	function probeFts5Capability(db: Database.Database): LexicalCapabilitySnapshot {
    93	  try {
    94	    const compileRows = (db.prepare('PRAGMA compile_options') as Database.Statement).all() as unknown[];
    95	    const hasFts5CompileFlag = compileRows
    96	      .map(readCompileOptionValue)
    97	      .some((value) => typeof value === 'string' && value.toUpperCase().includes('ENABLE_FTS5'));
    98	
    99	    if (!hasFts5CompileFlag) {
   100	      return {
   101	        lexicalPath: 'unavailable',
   102	        fallbackState: 'compile_probe_miss',
   103	      };
   104	    }
   105	  } catch {
   106	    return {
   107	      lexicalPath: 'unavailable',
   108	      fallbackState: 'compile_probe_miss',
   109	    };
   110	  }
   111	
   112	  try {
   113	    const result = (db.prepare(
   114	      `SELECT name FROM sqlite_master WHERE type='table' AND name='memory_fts'`
   115	    ) as Database.Statement).get() as { name: string } | undefined;
   116	
   117	    if (!result) {
   118	      return {
   119	        lexicalPath: 'unavailable',
   120	        fallbackState: 'missing_table',
   121	      };
   122	    }
   123	  } catch (error: unknown) {
   124	    if (isNoSuchModuleFts5Error(error)) {
   125	      return {
   126	        lexicalPath: 'unavailable',
   127	        fallbackState: 'no_such_module_fts5',
   128	      };
   129	    }
   130	    return {
   131	      lexicalPath: 'unavailable',
   132	      fallbackState: 'missing_table',
   133	    };
   134	  }
   135	
   136	  return {
   137	    lexicalPath: 'fts5',
   138	    fallbackState: 'ok',
   139	  };
   140	}
   141	
   142	// ───────────────────────────────────────────────────────────────
   143	// 3. CORE FUNCTION
   144	
   145	// ───────────────────────────────────────────────────────────────
   146	/**
   147	 * Execute a weighted BM25 FTS5 search against memory_fts.
   148	 *
   149	 * Uses SQLite FTS5's built-in bm25() ranking function with
   150	 * per-column weights instead of the default `rank` pseudo-column.
   151	 * This gives title matches 10x weight, trigger_phrases 5x, etc.
   152	 *
   153	 * @param db - SQLite database connection
   154	 * @param query - Raw search query (will be sanitized)
   155	 * @param options - Search options (limit, specFolder, includeArchived)
   156	 * @returns Array of results with BM25 scores (higher = better)
   157	 * @example
   158	 * ```ts
   159	 * const rows = fts5Bm25Search(db, 'memory search', { limit: 10 });
   160	 * ```
   161	 */
   162	function fts5Bm25Search(
   163	  db: Database.Database,
   164	  query: string,
   165	  options: FtsBm25Options = {}
   166	): FtsBm25Result[] {
   167	  const { limit = 20, specFolder, includeArchived = false } = options;
   168	
   169	  // Sanitize via shared tokenizer, then wrap each token in quotes and join with OR for recall
   170	  const tokens = normalizeLexicalQueryTokens(query).fts;
   171	  const sanitized = tokens
   172	    .map(t => (t.startsWith('"') && t.endsWith('"')) ? t : `"${t}"`)
   173	    .join(' OR ');
   174	
   175	  if (!sanitized) {
   176	    setLastLexicalCapabilitySnapshot(probeFts5Capability(db));
   177	    return [];
   178	  }
   179	
   180	  const folderFilter = specFolder

exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts | sed -n '1,220p'" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Orchestrator
     3	// ───────────────────────────────────────────────────────────────
     4	// 4-stage pipeline execution with per-stage error handling and timeouts.
     5	//
     6	// B1 FIX: Each stage is wrapped in try/catch with withTimeout().
     7	// Stage 1 is mandatory (throws on failure — no candidates = no results).
     8	// Stages 2-4 fall back to previous stage output with degraded metadata.
     9	// Timing is recorded for latency observability.
    10	//
    11	// I/O CONTRACT:
    12	// Input:  PipelineConfig (query, embedding, limits, flags, intent, session)
    13	// Output: PipelineResult { results: Stage4ReadonlyRow[], metadata, annotations, trace }
    14	// Key invariants:
    15	//     - results are scored by Stage 2, reranked by Stage 3, filtered by Stage 4
    16	//     - Score fields are frozen after Stage 3; Stage 4 output scores == Stage 3 output scores
    17	//     - Stage metadata for all four stages is included for observability
    18	//     - When a stage degrades, metadata.degraded = true and timing tracks each stage
    19	// Side effects:
    20	//     - Delegates to each stage; see individual stage modules for their side effects
    21	
    22	import type {
    23	  PipelineConfig,
    24	  PipelineResult,
    25	  Stage1Output,
    26	  Stage2Output,
    27	  Stage3Output,
    28	  Stage4Output,
    29	  Stage4ReadonlyRow,
    30	  SignalStatus,
    31	} from './types.js';
    32	
    33	import { executeStage1 } from './stage1-candidate-gen.js';
    34	import { executeStage2 } from './stage2-fusion.js';
    35	import { executeStage3 } from './stage3-rerank.js';
    36	import { executeStage4 } from './stage4-filter.js';
    37	import { MemoryError, withTimeout } from '../../errors/core.js';
    38	
    39	// Feature catalog: 4-stage pipeline architecture
    40	// Feature catalog: 4-stage pipeline refactor
    41	
    42	
    43	/** Per-stage timeout in milliseconds. */
    44	const STAGE_TIMEOUT_MS = 10_000;
    45	
    46	/**
    47	 * Execute the 4-stage retrieval pipeline with per-stage error handling.
    48	 *
    49	 * Stage 1: Candidate Generation — MANDATORY (throws on failure)
    50	 * Stage 2: Fusion + Signal Integration — falls back to unsorted candidates
    51	 * Stage 3: Rerank + Aggregate — falls back to unranked scored results
    52	 * Stage 4: Filter + Annotate — falls back to unfiltered results
    53	 *
    54	 * @param config Pipeline configuration derived from search args
    55	 * @returns Pipeline result with stage metadata and timing
    56	 */
    57	export async function executePipeline(config: PipelineConfig): Promise<PipelineResult> {
    58	  const timing: Record<string, number> = {};
    59	  const pipelineStart = Date.now();
    60	  let degraded = false;
    61	
    62	  // -- Stage 1: Candidate Generation (MANDATORY — no fallback possible) --
    63	  let stage1Result: Stage1Output;
    64	  try {
    65	    const t0 = Date.now();
    66	    stage1Result = await withTimeout(
    67	      executeStage1({ config }),
    68	      STAGE_TIMEOUT_MS,
    69	      'Stage 1: Candidate Generation',
    70	    );
    71	    timing.stage1 = Date.now() - t0;
    72	  } catch (err) {
    73	    throw new MemoryError(
    74	      'PIPELINE_STAGE1_FAILED',
    75	      `Candidate generation failed: ${err instanceof Error ? err.message : String(err)}`,
    76	      { cause: err instanceof Error ? err.message : String(err) },
    77	    );
    78	  }
    79	
    80	  // -- Stage 2: Fusion + Signal Integration (falls back to unsorted candidates) --
    81	  let stage2Result: Stage2Output;
    82	  try {
    83	    const t0 = Date.now();
    84	    stage2Result = await withTimeout(
    85	      executeStage2({
    86	        candidates: stage1Result.candidates,
    87	        config,
    88	        stage1Metadata: stage1Result.metadata,
    89	      }),
    90	      STAGE_TIMEOUT_MS,
    91	      'Stage 2: Fusion',
    92	    );
    93	    timing.stage2 = Date.now() - t0;
    94	  } catch (err) {
    95	    const msg = err instanceof Error ? err.message : String(err);
    96	    console.warn(`[pipeline] Stage 2 failed, returning unscored candidates: ${msg}`);
    97	    degraded = true;
    98	    stage2Result = {
    99	      scored: stage1Result.candidates,
   100	      metadata: {
   101	        sessionBoostApplied: 'failed' as SignalStatus,
   102	        causalBoostApplied: 'failed' as SignalStatus,
   103	        intentWeightsApplied: 'failed' as SignalStatus,
   104	        artifactRoutingApplied: 'failed' as SignalStatus,
   105	        feedbackSignalsApplied: 'failed' as SignalStatus,
   106	        qualityFiltered: 0,
   107	        durationMs: 0,
   108	      },
   109	    };
   110	    timing.stage2 = 0;
   111	  }
   112	
   113	  // -- Stage 3: Rerank + Aggregate (falls back to unranked scored results) --
   114	  let stage3Result: Stage3Output;
   115	  try {
   116	    const t0 = Date.now();
   117	    stage3Result = await withTimeout(
   118	      executeStage3({
   119	        scored: stage2Result.scored,
   120	        config,
   121	      }),
   122	      STAGE_TIMEOUT_MS,
   123	      'Stage 3: Rerank',
   124	    );
   125	    timing.stage3 = Date.now() - t0;
   126	  } catch (err) {
   127	    const msg = err instanceof Error ? err.message : String(err);
   128	    console.warn(`[pipeline] Stage 3 failed, returning unranked results: ${msg}`);
   129	    degraded = true;
   130	    stage3Result = {
   131	      reranked: stage2Result.scored,
   132	      metadata: {
   133	        rerankApplied: false,
   134	        chunkReassemblyStats: {
   135	          collapsedChunkHits: 0,
   136	          chunkParents: 0,
   137	          reassembled: 0,
   138	          fallback: 0,
   139	        },
   140	        durationMs: 0,
   141	      },
   142	    };
   143	    timing.stage3 = 0;
   144	  }
   145	
   146	  // -- Stage 4: Filter + Annotate (falls back to unfiltered results) --
   147	  let stage4Result: Stage4Output;
   148	  try {
   149	    const t0 = Date.now();
   150	    stage4Result = await withTimeout(
   151	      executeStage4({
   152	        results: stage3Result.reranked as Stage4ReadonlyRow[],
   153	        config,
   154	        stage1Metadata: { constitutionalInjected: stage1Result.metadata.constitutionalInjected },
   155	      }),
   156	      STAGE_TIMEOUT_MS,
   157	      'Stage 4: Filter',
   158	    );
   159	    timing.stage4 = Date.now() - t0;
   160	  } catch (err) {
   161	    const msg = err instanceof Error ? err.message : String(err);
   162	    console.warn(`[pipeline] Stage 4 failed, returning unfiltered results: ${msg}`);
   163	    degraded = true;
   164	    stage4Result = {
   165	      final: stage3Result.reranked as Stage4ReadonlyRow[],
   166	      metadata: {
   167	        stateFiltered: 0,
   168	        constitutionalInjected: stage1Result.metadata.constitutionalInjected,
   169	        evidenceGapDetected: false,
   170	        durationMs: 0,
   171	      },
   172	      annotations: {
   173	        stateStats: {},
   174	        featureFlags: {},
   175	      },
   176	    };
   177	    timing.stage4 = 0;
   178	  }
   179	
   180	  timing.total = Date.now() - pipelineStart;
   181	
   182	  return {
   183	    results: stage4Result.final,
   184	    metadata: {
   185	      stage1: stage1Result.metadata,
   186	      stage2: stage2Result.metadata,
   187	      stage3: stage3Result.metadata,
   188	      stage4: stage4Result.metadata,
   189	      timing,
   190	      degraded: degraded || undefined,
   191	    },
   192	    annotations: stage4Result.annotations,
   193	    trace: config.trace,
   194	  };
   195	}

exec
/bin/zsh -lc "sed -n '1,180p' .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md" in /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
 succeeded in 0ms:
---
title: "Search Subsystem"
description: "5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval with Reciprocal Rank Fusion (RRF) and Adaptive Fusion."
trigger_phrases:
  - "search subsystem"
  - "hybrid search"
  - "vector search"
---

# Search Subsystem

> 5-channel hybrid search architecture combining vector, lexical (BM25/FTS5), graph-based and structure-aware graph retrieval, fused with Reciprocal Rank Fusion (RRF) and Adaptive Fusion.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
  - [4-STAGE PIPELINE ARCHITECTURE](#4--stage-pipeline-architecture)
- [2. KEY CONCEPTS](#2--key-concepts)
- [3. MODULE STRUCTURE](#3--module-structure)
- [4. FEATURES](#4--features)
  - [GRAPH SIGNAL FEATURES](#graph-signal-features)
  - [SAVE-TIME PROCESSING PIPELINE](#save-time-processing-pipeline)
  - [SCORING ENHANCEMENTS](#scoring-enhancements)
- [FTS CAPABILITY CASCADE FLOOR](#fts-capability-cascade-floor)
- [5. USAGE EXAMPLES](#5--usage-examples)
- [6. RECENT CHANGES (SPRINT 8)](#6--recent-changes-sprint-8)
- [7. RELATED RESOURCES](#7--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The search subsystem provides production-grade hybrid search capabilities with multiple retrieval methods fused via RRF scoring. It handles query expansion, intent classification, typo tolerance and optional cross-encoder reranking.

**Core Capabilities:**
- **5-Channel Hybrid Search**: Vector (semantic) + BM25/FTS5 (lexical) + Graph (relationship-based) + Graph Structure (structural)
- **RRF Score Fusion**: Industry-standard k=40 with convergence bonuses
- **Intent Classification**: 7 intent types route to task-specific retrieval weights
- **Query Enhancement**: Fuzzy matching (Levenshtein) + acronym expansions (via hybrid-search.ts inline logic)
- **Reranking Pipeline**: Optional cross-encoder with length penalties
- **MMR Diversity Reranking**: Maximal Marginal Relevance to reduce redundancy in result sets
- **Evidence Gap Detection**: Identifies missing context and suggests follow-up queries
- **Schema Management**: sqlite-vec schema v15 (current) with document-type fields, event-based decay and phase-aware columns

**Architecture Pattern:**
```text
Query Input
    |
Intent Classifier -> Task-specific weights
    |
Parallel Search (5 channels)
|---> Vector (sqlite-vec)       -> Semantic matches
|---> BM25 (Pure JS)            -> Keyword matches
|---> Graph (Co-activation)     -> Relationship matches
|---> Graph Structure           -> Structural matches
    |
RRF Fusion (k=40) + Adaptive Fusion -> Unified scores
    |
MMR Diversity Reranking -> Redundancy reduction
    |
Cross-Encoder Rerank (optional) -> Relevance refinement
    |
Recency Boost + Co-activation -> Final adjustments
    |
Final Results
```

**Architecture Note:**
`vector-index.ts` is the primary typed export surface for the vector index and re-exports the split schema, query, mutation, store and alias modules. `vector-index-impl.ts` is now a 14-line backward-compatibility shim that simply re-exports `vector-index.ts` for older import paths.

<a id="4-stage-pipeline-architecture"></a>
### 4-Stage Pipeline Architecture

The search pipeline (R6) decomposes retrieval into four bounded stages with strict responsibilities. Each stage has clear input/output contracts defined in `pipeline/types.ts`.

```text
Stage 1                Stage 2                 Stage 3              Stage 4
CANDIDATE GEN    -->   FUSION + SIGNALS   -->  RERANK + AGGREGATE  -->  FILTER + ANNOTATE
(no score changes)     (single scoring point)  (score changes: YES)    (score changes: NO)
```

**Stage 1 — Candidate Generation** (`stage1-candidate-gen.ts`):
Executes 5 search channels in parallel and collects raw candidates with no scoring modifications.

| Channel | Source | Description |
|---------|--------|-------------|
| Vector | `vector-index.ts` | Semantic similarity via sqlite-vec through the split vector-index modules |
| BM25 | `bm25-index.ts` | Pure TypeScript keyword matching |
| FTS5 | `sqlite-fts.ts` | SQLite FTS5 BM25 weighted scoring |
| Graph | `graph-search-fn.ts` | Causal edge traversal + typed-weighted degree (R4) |
| Degree | `graph-search-fn.ts` | Structural graph discovery via typed-weighted degree |

Post-channel: constitutional memory injection, quality score filtering, tier/contextType filtering.

**Stage 2 — Fusion + Signal Integration** (`stage2-fusion.ts`):
Single authoritative point for ALL scoring signals. Signal application order is fixed:

1. Session boost — working-memory attention amplification
2. Causal boost — graph-traversal neighbor amplification
3. Community co-retrieval (N2c) — inject community co-members
4. Graph signals (N2a + N2b) — momentum + causal depth
5. Testing effect — FSRS strengthening write-back (opt-in via `trackAccess`)
6. Intent weights — non-hybrid only (G2 double-weighting prevention: `isHybrid` boolean guard)
7. Artifact routing — class-based weight boosts
8. Feedback signals — learned trigger boosts (0.7x weight) + negative demotions
9. Anchor metadata — extract named ANCHOR sections (annotation only)
10. Validation signals — quality scoring multiplier (clamped 0.8-1.2)

**Stage 3 — Rerank + Aggregate** (`stage3-rerank.ts`):
Cross-encoder reranking (optional, min 2 results) followed by MPAB chunk-to-memory aggregation. Aggregation formula: `parentScore = sMax + 0.3 * Sum(rest) / sqrt(N)` where `sMax` is the best chunk score and N is the remaining chunk count. Chunk ordering preserves `chunk_index` document order (B2 guarantee). `contentSource` metadata marks provenance (`reassembled_chunks` or `file_read_fallback`).

**Stage 4 — Filter + Annotate** (`stage4-filter.ts`):
**Score immutability invariant**: Stage 4 MUST NOT modify scores. Enforced via compile-time `Stage4ReadonlyRow` readonly fields and runtime `captureScoreSnapshot` / `verifyScoreInvariant` defence-in-depth. Applies memory-state filtering (HOT/WARM/COLD/DORMANT/ARCHIVED with per-tier limits), evidence gap detection (Z-score confidence check), quality floor (`QUALITY_FLOOR=0.005`), and token budget truncation.

<!-- /ANCHOR:overview -->

---

## 2. KEY CONCEPTS
<!-- ANCHOR:key-concepts -->

### Reciprocal Rank Fusion (RRF)

**Formula**: `score = Sum 1/(k + rank_i)` where k=40 (tuned for ~1000-memory corpus)

**Why RRF?**
- Parameter-free fusion (no weight tuning required)
- Resilient to retrieval method failures (graceful degradation)
- Citation: Cormack et al. "RRF outperforms Condorcet" (SIGIR 2009)

**Enhancements (REQ-011):**
- **10% Convergence Bonus**: Results in multiple sources get +10% score boost
- **1.5x Graph Weight**: Graph-exclusive discoveries weighted higher for novelty
- **Adaptive Fusion**: Intent-aware weighted RRF with dark-run mode (feature flag `SPECKIT_ADAPTIVE_FUSION`)
- **MMR Diversity**: Maximal Marginal Relevance reranking reduces near-duplicate results
- **Recency Boost**: Time-aware score adjustment favoring recently updated memories
- **Co-activation Boost**: Graph-neighbor score propagation via 2-hop causal traversal

**Example:**
```javascript
// Vector rank: 2, BM25 rank: 5, Graph rank: 1
// RRF score = 1/(40+2) + 1/(40+5) + 1.5/(40+1)
//           = 0.0238 + 0.0222 + 0.0366 = 0.0826
// Convergence bonus: 0.0826 * 1.10 = 0.0909 (final)
```

### BM25 (Best Matching 25)

**Formula**:
```text
score(D, Q) = Sum IDF(qi) * (tf(qi,D) * (k1+1)) / (tf(qi,D) + k1 * (1-b + b*|D|/avgdl))
```

**Parameters:**
- `k1 = 1.2`: Term frequency saturation (higher = less saturation)
- `b = 0.75`: Length normalization (0=ignore length, 1=full penalty)
- `tf(qi,D)`: Term frequency of query term qi in document D
- `|D|`: Document length, `avgdl`: Average document length
- `IDF(qi)`: Inverse document frequency: `log((N - n(qi) + 0.5) / (n(qi) + 0.5) + 1)`

**Why BM25?**
- Handles term frequency saturation (repeated words don't dominate)
- Length normalization (short docs not penalized unfairly)
- Pure JavaScript implementation (REQ-028, no Python dependency)

<a id="fts-capability-cascade-floor"></a>
### FTS Capability Cascade Floor

Packet `026-graph-and-context-optimization/010-fts-capability-cascade-floor` freezes the lexical capability contract that packet `002-implement-cache-warning-hooks` now consumes. `memory_search` responses expose:

- `lexicalPath`: the lane that actually ran for lexical retrieval. Current packet-owned values are `fts5` and `unavailable`. The wider response schema also allows `like`, but packet `010` does not claim that lane for this runtime seam.
- `fallbackState`: the truthful FTS capability outcome for the request.

The forced-degrade matrix is:

codex
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

## Findings

### Finding 1: Modus is a single-binary, vault-first MCP server with a deliberately narrow runtime shape
- **Source**: [main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go#L26), [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7), [server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go#L36)
- **What it does**: Startup resolves a vault path, creates `memory/facts`, `brain`, and `atlas`, builds one in-memory index, wraps it in `vault.Vault`, then exposes a minimal stdio JSON-RPC MCP server with 11 retained memory tools.
- **Why it matters for us**: This is much simpler than our current retrieval runtime and is a useful reference for a lightweight local-first deployment mode, but it is not comparable to our full retrieval stack feature-for-feature.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: The main search architecture is “scan markdown -> build in-memory services -> serve from RAM”
- **Source**: [indexer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L65), [bm25.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16), [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10)
- **What it does**: `Build()` scans all `.md` files, materializes `document` structs, builds a BM25 inverted index, a 256-entry exact-plus-Jaccard query cache, a cross-reference index, and an in-memory fact store; `Search()` then runs cache -> BM25 -> OOD filter -> snippet extraction -> normalized ranking -> cache write.
- **Why it matters for us**: The architecture is operationally cheap and easy to reason about, but it trades away persistent index structures and richer multi-stage fusion for startup-time rebuild simplicity.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Modus splits “all documents” from “memory facts” and gives facts their own recall-and-decay loop
- **Source**: [vault/facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L12), [index/facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go#L23), [mcp/vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L271), [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L840)
- **What it does**: Persisted markdown fact files are decayed and reinforced through `vault/facts.go`, while `index/facts.go` keeps a separate in-memory searchable fact slice with recency and confidence boosts; `memory_search` auto-reinforces each returned fact asynchronously, unlike our Stage 2 FSRS testing effect which only writes back when `trackAccess=true`.
- **Why it matters for us**: Modus has a cleaner “returned result == recall event” model for fact memories, while our current system is more conservative and avoids write-on-read side effects by default.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Cross-referencing is intentionally shallow adjacency, not a real graph engine
- **Source**: [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9), [mcp/vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75)
- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
- **Why it matters for us**: This is weaker than our causal/code-graph style signal layers, but it is much easier to expose to users as understandable “connected docs” rather than invisible score boosts.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 5: The markdown layer is very portable, but intentionally loose and only lightly normalized
- **Source**: [parser.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L13), [writer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go#L31)
- **What it does**: Documents are plain markdown with YAML frontmatter; parse failures fall back to raw body, `ScanDir()` silently skips unreadable/unparseable files and `discard/`, wiki links are extracted from body text, and writes are just frontmatter-plus-body file rewrites after path traversal checks.
- **Why it matters for us**: This is excellent for human editability and git portability, but it also means weaker schema enforcement, silent parse skips, and nondeterministic frontmatter ordering from Go map iteration.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: The Librarian is not just documentation rhetoric; it is a real local model dependency in the search architecture
- **Source**: [client.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go#L17), [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10), [docs/librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L16)
- **What it does**: When available, the Librarian is contacted over HTTP at `127.0.0.1:8090` and is used for query expansion, result ranking, summarization, fact extraction, intent classification, and briefing production.
- **Why it matters for us**: Modus’s architecture is not purely “BM25 only” in practice once the Librarian is up, so any adoption decision has to treat LLM-mediated lexical expansion as an optional subsystem with availability and correctness risks.
- **Recommendation**: reject
- **Impact**: high

### Finding 7: Public already has the broader retrieval architecture; Modus is a simplification reference, not a replacement candidate
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [pipeline/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md#L1), [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L1), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L31), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L31), [go.mod](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.mod#L1)
- **What it does**: Public already runs a 4-stage hybrid pipeline with vector + BM25/FTS5 + graph channels, session and causal boosts, reranking, fallback-state reporting, and opt-in FSRS write-back. Modus is simpler, but the README also overstates some properties: `go.mod` is not zero-dependency, and the search path can invoke a local model when Librarian is available.
- **Why it matters for us**: The real comparison is selective borrowing, not replacement. The highest-value overlaps are adjacency hints and a cleaner recall-event policy; the rest would mostly duplicate or downgrade existing Public capabilities.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go)
- [server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go)
- [indexer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go)
- [bm25.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go)
- [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go)
- [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go)
- [vault/facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go)
- [index/facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go)
- [parser.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go)
- [writer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go)
- [client.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go)
- [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go)
- [mcp/vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go)
- [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md)
- [docs/librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [pipeline/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md)
- [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)
- [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts)

## Assessment
- New information ratio: 0.82
- Questions addressed: repo structure; entry points; key directories; runtime data flow; markdown persistence model; MCP surface; Public overlap; README credibility.
- Questions answered: structure and flow are answered; Public overlap is answered; benchmark credibility is only partially answered because I only did static inspection.
- Validation note: `validate.sh --strict` returned `PASSED`, but it also emitted `cannot create temp file for here document: Operation not permitted`, so I would not treat that validation result as fully trustworthy in this read-only session.

## Reflection
- What worked: reading in the requested order, anchoring on `main.go` plus `indexer.go`, then tracing outward through MCP handlers, markdown parsing, and our own `memory_search` pipeline gave a clean architecture map quickly.
- What did not work: both CocoIndex MCP searches were canceled, so this pass relied on direct source reads instead of semantic search support.
- What did not work: the workspace is read-only, so I could not create `research/research.md`, update `checklist.md`, create `implementation-summary.md`, or run the requested memory save flow.

## Recommended Next Focus
Deep-dive the ranking path next: exact BM25 field weights, tokenization and stemming behavior, cache reuse thresholds, librarian expansion ordering and merge rules, then compare those mechanics directly against Public’s lexical lane and query-enhancement stack.
hook: Stop
hook: Stop Completed
tokens used
197,499
# Iteration 001: ARCHITECTURE OVERVIEW

## Focus
ARCHITECTURE OVERVIEW: Scan repository structure, key directories, main entry points, README, and architecture docs. Map high-level components and data flow.

## Findings

### Finding 1: Modus is a single-binary, vault-first MCP server with a deliberately narrow runtime shape
- **Source**: [main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go#L26), [memory.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go#L7), [server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go#L36)
- **What it does**: Startup resolves a vault path, creates `memory/facts`, `brain`, and `atlas`, builds one in-memory index, wraps it in `vault.Vault`, then exposes a minimal stdio JSON-RPC MCP server with 11 retained memory tools.
- **Why it matters for us**: This is much simpler than our current retrieval runtime and is a useful reference for a lightweight local-first deployment mode, but it is not comparable to our full retrieval stack feature-for-feature.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 2: The main search architecture is “scan markdown -> build in-memory services -> serve from RAM”
- **Source**: [indexer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go#L65), [bm25.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go#L16), [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go#L10)
- **What it does**: `Build()` scans all `.md` files, materializes `document` structs, builds a BM25 inverted index, a 256-entry exact-plus-Jaccard query cache, a cross-reference index, and an in-memory fact store; `Search()` then runs cache -> BM25 -> OOD filter -> snippet extraction -> normalized ranking -> cache write.
- **Why it matters for us**: The architecture is operationally cheap and easy to reason about, but it trades away persistent index structures and richer multi-stage fusion for startup-time rebuild simplicity.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 3: Modus splits “all documents” from “memory facts” and gives facts their own recall-and-decay loop
- **Source**: [vault/facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go#L12), [index/facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go#L23), [mcp/vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L271), [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L840)
- **What it does**: Persisted markdown fact files are decayed and reinforced through `vault/facts.go`, while `index/facts.go` keeps a separate in-memory searchable fact slice with recency and confidence boosts; `memory_search` auto-reinforces each returned fact asynchronously, unlike our Stage 2 FSRS testing effect which only writes back when `trackAccess=true`.
- **Why it matters for us**: Modus has a cleaner “returned result == recall event” model for fact memories, while our current system is more conservative and avoids write-on-read side effects by default.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Cross-referencing is intentionally shallow adjacency, not a real graph engine
- **Source**: [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go#L9), [mcp/vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go#L75)
- **What it does**: Modus builds three adjacency maps (`bySubject`, `byTag`, `byEntity`), scores connected docs with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected-doc hints to search responses. The “second pass” only checks title and subject for entity mentions even though the comments imply broader body linkage.
- **Why it matters for us**: This is weaker than our causal/code-graph style signal layers, but it is much easier to expose to users as understandable “connected docs” rather than invisible score boosts.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 5: The markdown layer is very portable, but intentionally loose and only lightly normalized
- **Source**: [parser.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go#L13), [writer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go#L10), [vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go#L31)
- **What it does**: Documents are plain markdown with YAML frontmatter; parse failures fall back to raw body, `ScanDir()` silently skips unreadable/unparseable files and `discard/`, wiki links are extracted from body text, and writes are just frontmatter-plus-body file rewrites after path traversal checks.
- **Why it matters for us**: This is excellent for human editability and git portability, but it also means weaker schema enforcement, silent parse skips, and nondeterministic frontmatter ordering from Go map iteration.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: The Librarian is not just documentation rhetoric; it is a real local model dependency in the search architecture
- **Source**: [client.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go#L17), [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go#L10), [docs/librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md#L16)
- **What it does**: When available, the Librarian is contacted over HTTP at `127.0.0.1:8090` and is used for query expansion, result ranking, summarization, fact extraction, intent classification, and briefing production.
- **Why it matters for us**: Modus’s architecture is not purely “BM25 only” in practice once the Librarian is up, so any adoption decision has to treat LLM-mediated lexical expansion as an optional subsystem with availability and correctness risks.
- **Recommendation**: reject
- **Impact**: high

### Finding 7: Public already has the broader retrieval architecture; Modus is a simplification reference, not a replacement candidate
- **Source**: [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L482), [pipeline/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md#L1), [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts#L1), [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L31), [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md#L31), [go.mod](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/go.mod#L1)
- **What it does**: Public already runs a 4-stage hybrid pipeline with vector + BM25/FTS5 + graph channels, session and causal boosts, reranking, fallback-state reporting, and opt-in FSRS write-back. Modus is simpler, but the README also overstates some properties: `go.mod` is not zero-dependency, and the search path can invoke a local model when Librarian is available.
- **Why it matters for us**: The real comparison is selective borrowing, not replacement. The highest-value overlaps are adjacency hints and a cleaner recall-event policy; the rest would mostly duplicate or downgrade existing Public capabilities.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- [main.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go)
- [server.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go)
- [indexer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go)
- [bm25.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go)
- [cache.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go)
- [crossref.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go)
- [vault/facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go)
- [index/facts.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go)
- [parser.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go)
- [writer.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go)
- [client.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go)
- [search.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go)
- [mcp/vault.go](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go)
- [README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md)
- [docs/librarian.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md)
- [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
- [pipeline/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md)
- [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
- [sqlite-fts.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts)
- [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts)

## Assessment
- New information ratio: 0.82
- Questions addressed: repo structure; entry points; key directories; runtime data flow; markdown persistence model; MCP surface; Public overlap; README credibility.
- Questions answered: structure and flow are answered; Public overlap is answered; benchmark credibility is only partially answered because I only did static inspection.
- Validation note: `validate.sh --strict` returned `PASSED`, but it also emitted `cannot create temp file for here document: Operation not permitted`, so I would not treat that validation result as fully trustworthy in this read-only session.

## Reflection
- What worked: reading in the requested order, anchoring on `main.go` plus `indexer.go`, then tracing outward through MCP handlers, markdown parsing, and our own `memory_search` pipeline gave a clean architecture map quickly.
- What did not work: both CocoIndex MCP searches were canceled, so this pass relied on direct source reads instead of semantic search support.
- What did not work: the workspace is read-only, so I could not create `research/research.md`, update `checklist.md`, create `implementation-summary.md`, or run the requested memory save flow.

## Recommended Next Focus
Deep-dive the ranking path next: exact BM25 field weights, tokenization and stemming behavior, cache reuse thresholds, librarian expansion ordering and merge rules, then compare those mechanics directly against Public’s lexical lane and query-enhancement stack.

---

# Iteration 002: CORE DATA MODEL

## Focus
CORE DATA MODEL: Examine the storage layer - schemas, data structures, persistence, indexing, database design.

## Findings

### Finding 1: Modus has no durable search index; it rebuilds the entire retrieval model from markdown on startup
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- **What it does**: `Index` is just RAM state: `docs`, `bm25Engine`, `queryCache`, `factStore`, `crossIndex`, and a `meta` map keyed by path. `Build()` rescans markdown, projects it into `document` structs, then rebuilds BM25 postings, cross refs, and in-memory fact indexes; `Open()` ignores the supplied `indexPath` and simply rebuilds from `~/modus/vault` or `MODUS_VAULT_DIR`.
- **Why it matters for us**: This is simpler than our SQLite-backed model, but it means no persistent index state, no schema migration layer for retrieval data, and no incremental durability for derived structures. For Public, this would be a storage downgrade, not a simplification win.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: The authoritative schema is loose YAML frontmatter plus body; indexed structs are only lossy projections
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- **What it does**: `Document` stores `Frontmatter map[string]interface{}` and `Body`; getters are lightweight (`GetFloat` only handles numeric YAML types, not strings), and writes just serialize the map back out. Searchable `document` structs flatten only selected fields (`Path`, `Source`, `Subject`, `Title`, `Tags`, `Body`, `Predicate`, `Confidence`, `Importance`, `Kind`, `Created`, `Triage`) while keeping the raw map on the side.
- **Why it matters for us**: This is excellent for human-editable, git-friendly storage, but schema discipline is mostly conventional, not enforced. The most plausible use for Public is as an interchange/export layer, not as a replacement for typed persistent storage.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Modus has an immediate consistency split between file writes and searchable state
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- **What it does**: `vault_write`, `memory_store`, and `ReinforceFact` mutate markdown files directly. But `vault_search`, `vault_connected`, and `memory_search` only read the prebuilt in-memory `Index`, `factStore`, and `crossIndex`. Meanwhile `vault_list` and `memory_facts` rescan disk live, so they can see writes the search path cannot.
- **Why it matters for us**: This is a real storage-model weakness, not just a UX wrinkle: the system is not read-your-write consistent across tools. A newly stored fact can be listable but not searchable, and reinforced files can persist updated FSRS metadata while search still uses stale RAM copies. Public’s persisted DB plus consumer rebind path is materially safer.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: FSRS state is persisted directly in markdown fact files, but the active fact-search model ignores most of it
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- **What it does**: `DecayFacts()` and `ReinforceFact()` write `confidence`, `stability`, `difficulty`, `last_accessed`, `access_count`, `last_decayed`, and archival flags into fact frontmatter. But `MemFact` only materializes a smaller subset, and `factStore.search()` ranks on term overlap, a small confidence bonus, and created-date recency; it does not use stored stability, difficulty, or access history.
- **Why it matters for us**: Modus’s files carry cognitively meaningful state, but its query-time model only partially consumes that state. The useful lesson for Public is not to copy the thinner fact model, but to consider exposing our own persisted FSRS state more transparently when that helps operators reason about memory freshness.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Identity is path-derived, not stable, so renames are semantic changes
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- **What it does**: Search hits and facts are identified by relative path; `MemFact.ID` is the relative markdown path, dedup uses `Path`, and `memory_reinforce` takes a path. New facts are slugged from `subject-predicate` and collision-suffixed. There is no Modus-side equivalent of Public’s `memory_lineage` + `active_memory_projection` stable logical identity model.
- **Why it matters for us**: This is fine for a small personal vault, but path-based identity makes renames and moves double as identity changes, which weakens continuity for reinforcement history, links, and long-lived references. Public’s lineage tables are substantially stronger for evolving memories.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Public already has the richer persisted storage graph; Modus is a portability reference, not a schema upgrade
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`, `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`, `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- **What it does**: Public persists a unified `memory_index` row with provenance, governance scope, FSRS fields, chunking, quality, and `content_text`, then derives `memory_fts`, `vec_memories`, `causal_edges`, `memory_summaries`, `memory_entities`, `entity_catalog`, `memory_lineage`, and `active_memory_projection`. DB consumers can rebind when the backing SQLite handle changes, and FSRS strengthening on retrieval is opt-in via `trackAccess`.
- **Why it matters for us**: The storage-layer gap is architectural, not incremental. Modus’s value is in transparent file-native ergonomics and understandable portability, but its underlying persistence model is much weaker than what Public already has.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`

## Assessment
- **New information ratio**: 0.88
- **Questions addressed**: source-of-truth layout; schema shape; persistence model; fact storage; FSRS field persistence; write/search consistency; identity model; comparison to Public’s DB design
- **Questions answered**: Modus has no durable retrieval DB; markdown frontmatter is the real schema; live writes and searchable state diverge after mutation; persisted FSRS state is only partially consumed by fact search; identity is path-based; Public already has a much richer persisted storage model

## Reflection
- **What worked**: Starting from `indexer.go`, `vault.go`, and `vault/facts.go` exposed the real storage model quickly, and comparing that directly against `vector-index-schema.ts` made the “portable snapshot vs persistent unified schema” difference unambiguous.
- **What did not work**: Broad repo-wide grep was too noisy for this question; the useful path was targeted source reads. I also did not validate any runtime freshness or performance claims dynamically, so storage conclusions here are code-backed but still static-analysis-backed.

## Recommended Next Focus
Trace **runtime freshness and mutation semantics** next: whether any write path triggers rebuild or cache invalidation, how long write-to-search consistency gaps persist in practice, and how the librarian/ranking layer behaves when the underlying in-memory snapshot is stale.


Total usage est:        1 Premium request
API time spent:         4m 34s
Total session time:     4m 54s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.2m in, 17.4k out, 1.1m cached, 9.9k reasoning (Est. 1 Premium request)

---

# Iteration 003: TOOL/API SURFACE

## Focus
TOOL/API SURFACE: Analyze MCP tools, CLI commands, API endpoints, tool registration, profile separation.

## Findings

### Finding 1: Modus exposes a very thin MCP transport: stdio JSON-RPC with only `initialize`, `tools/list`, and `tools/call`
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **What it does**: `Server.Run()` reads newline-delimited JSON from stdin and `handle()` only recognizes `initialize`, `notifications/initialized`, `tools/list`, and `tools/call`. The binary starts this server directly from `main.go` after building the in-memory index and registering tools. There is no inbound HTTP listener, no resource/prompt surface, no session bootstrap tool, and no orchestration layer comparable to Public’s `memory_context`, `session_bootstrap`, `code_graph_query`, or `code_graph_context`.
- **Why it matters for us**: This is a portability win for a single-purpose local binary, but it is a surface-area downgrade relative to Public’s retrieval/orchestration server. It is useful as a minimal transport reference, not as a model for Public’s primary MCP surface.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus has hidden profile separation in code, but the shipped binary hard-wires a single 11-tool profile
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md`
- **What it does**: `RegisterVaultTools()` defines a much larger tool family (`atlas_*`, `qm_*`, `distill_status`, plus memory/vault tools). `RegisterMemoryTools()` first calls `RegisterVaultTools()` and then destructively deletes every tool not in its 11-tool allowlist. `RegisterLearningsTools()` defines a separate `modus_learnings_*` family, but `main.go` never wires it. Separately, `docs/librarian.md` recommends a 6-tool “librarian” subset in agent config, but that subset is documentation-only, not a negotiated runtime profile.
- **Why it matters for us**: The codebase clearly wants multiple role-specific surfaces, but the implementation is manual, non-discoverable, and not caller-selectable. Public could benefit from explicit tool-profile projections, but Modus’s current approach is too brittle to copy directly.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: The only real API endpoints are outbound sidecar calls to the local Librarian model, not Modus-owned service endpoints
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- **What it does**: Modus hard-codes `http://127.0.0.1:8090` as the Librarian endpoint, probes `/health` with `/v1/models` fallback, and posts chat requests to `/v1/chat/completions`. `ExpandQuery()`, `RankResults()`, `ExtractFacts()`, `ClassifyIntent()`, and `ProduceBriefing()` all run through this local OpenAI-compatible sidecar, but none are exposed as MCP tools themselves. MCP callers only see higher-level tools whose behavior changes if `librarian.Available()` returns true.
- **Why it matters for us**: The useful pattern is “optional local lexical-expansion/rerank sidecar,” not the hard-coded localhost contract. Public could prototype an internal expander/reranker channel, but should keep it capability-checked, configurable, and traceable rather than ambient and endpoint-bound.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: Tool registration and argument validation are loose enough that adopting Modus’s MCP schema pattern would weaken Public
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- **What it does**: Modus stores `InputSchema` as generic `interface{}` and passes raw `map[string]interface{}` into handlers. Validation is decentralized and uneven: many handlers use loose type assertions and defaults, while filesystem safety is enforced mostly by `vault.safePath()` on read/write/list operations. Public, by contrast, has centralized schema definitions, strict Zod validation, explicit `additionalProperties: false`, safe path validators, and governance/session fields baked into tool schemas.
- **Why it matters for us**: This is a material safety and operability gap. Public’s current tool layer is already stronger on input validation, scope governance, and explicit contracts; replacing it with Modus’s pattern would be regression, not simplification.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Modus search tools hide side effects and capability changes behind ambient conditions rather than explicit flags
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- **What it does**: `vault_search` silently switches to librarian-expanded multi-query retrieval when the sidecar is reachable, otherwise falls back to direct search. `memory_search` silently spawns async `ReinforceFact()` calls for every returned fact. There are no per-call controls for disabling reinforcement, forcing plain lexical search, asking for provenance, selecting a presentation profile, or scoping session behavior. Public exposes those controls explicitly through `trackAccess`, `includeTrace`, `profile`, `sessionId`, intent routing, and governed scope fields.
- **Why it matters for us**: Search-as-read with hidden write side effects is risky for operators and harder to reason about in evaluations. Public’s explicit opt-in `trackAccess` model is materially safer and easier to benchmark than Modus’s always-on recall reinforcement.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Modus’s CLI is a real second operator surface, separate from MCP, and that split is one of the cleaner parts of the design
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- **What it does**: The binary has a tiny command surface: `version`, `health`, `doctor`, and `import khoj`, with `--vault` or `MODUS_VAULT_DIR` selecting the vault. `doctor` performs structural diagnostics over markdown files and `import khoj` handles migration into vault folders. This is separate from the MCP tool plane and clearly aimed at human operators or one-shot maintenance tasks.
- **Why it matters for us**: Public already has rich MCP health/status/index tools, but a thin human-facing CLI wrapper for common operator flows—health, validate, reindex, diagnose—could improve ergonomics for local maintenance and CI without changing core retrieval architecture.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/import_khoj.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`

## Assessment
- **New information ratio**: 0.87
- **Questions addressed**: MCP transport shape; CLI command surface; outbound API endpoints; tool registration mechanics; runtime profile separation; discoverability of hidden tools; validation strictness; implicit search side effects; comparison with Public’s orchestration/governance surface
- **Questions answered**: Modus only implements a minimal stdio MCP core; the shipped binary hard-wires the 11-tool memory profile; broader vault and learnings profiles exist in source but are not runtime-selectable; the only actual HTTP/API endpoints are outbound Librarian sidecar calls; tool contracts are looser than Public’s; Public already has the richer, safer, more explicit operator/retrieval surface

## Reflection
- **What worked**: Tracing `cmd/modus-memory/main.go` into `RegisterMemoryTools()` and then back out through `server.go` exposed the real runtime surface quickly. Comparing that to `tool-schemas.ts` made the contrast with Public’s explicit orchestration, governance, and profile controls very clear.
- **What did not work**: Searching for inbound HTTP APIs mostly surfaced a stale `CallTool` comment about HTTP reuse; there is no implemented HTTP server to analyze. The README and librarian docs describe multiple role shapes, but source code shows those are only partially realized.

## Recommended Next Focus
Trace **runtime freshness and mutation semantics across tool calls**: whether `memory_store`, `vault_write`, `memory_reinforce`, and decay/archive operations ever invalidate or rebuild the in-memory BM25/fact/cross-ref state, how long the read-your-write gap lasts in practice, and whether any CLI path repairs stale MCP-visible state.


Total usage est:        1 Premium request
API time spent:         3m 8s
Total session time:     3m 26s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  840.3k in, 12.1k out, 703.0k cached, 4.4k reasoning (Est. 1 Premium
 request)

---

# Iteration 004: SESSION LIFECYCLE

## Focus
SESSION LIFECYCLE: How sessions are created, maintained, ended, summarized. Context survival across sessions.

## Findings

### Finding 1: Modus has no first-class session object; a “session” is just process startup plus a disk-backed vault snapshot
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- **What it does**: `main.go` resolves the vault path, creates a few directories, rebuilds the in-memory index, registers tools, and enters the stdio MCP loop. `server.go` only handles `initialize`, `notifications/initialized`, `tools/list`, and `tools/call`; it does not mint session IDs, persist client state, or expose resume/bootstrap/close semantics. By contrast, Public’s `memory_context` resolves trusted server-managed sessions and persists lifecycle state through `session-manager.ts`.
- **Why it matters for us**: Modus’s cross-chat continuity comes from durable files, not session lifecycle management. That is simpler, but it is not a substitute for Public’s explicit session continuity surface (`memory_context`, `session_resume`, `session_bootstrap`, trusted `sessionId`, saved state).
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Live-session maintenance is snapshot-based, so Modus does not really “learn during the current session” without restart
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- **What it does**: `index.Build()` creates an in-memory `Index` and fact store once at startup. During a session, `memory_search` asynchronously calls `ReinforceFact`, while `StoreFact`, `DecayFacts`, `ArchiveStaleFacts`, and `TouchFact` all mutate markdown on disk. But subsequent search still reads the old in-memory snapshot because there is no hot reload, invalidation, or rebuild in the running process.
- **Why it matters for us**: For session lifecycle, this means Modus’s memory state does not evolve coherently inside a live conversation. Public’s model is materially stronger because it treats session continuity and retrieval state as active managed state, not just files that will matter after restart.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: The only session-like metadata is mostly non-operative, and one of its freshness signals is broken
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- **What it does**: Modus projects `session_tag` into `MemFact.SessionTag`, but only while indexing; if missing, `indexer.go` defaults it to `"session-1"`. `StoreFact()` does not write a `session_tag`, and no MCP tool exposes session-scoped filtering or retrieval. Separately, `StoreFact()` writes `created: "now"`, while `recencyBoost()` and `Tier()` expect ISO/date strings, so newly stored facts can miss “hot/warm” treatment and fall back to neutral/cold handling.
- **Why it matters for us**: This is not enough structure to support session creation, session-local recall, or accurate “recent conversation” prioritization. Public already has explicit lifecycle metadata like trusted `sessionId`, `effectiveSessionId`, `resumed`, event counters, `contextSummary`, and `pendingWork`; Modus’s passive metadata is too weak to borrow directly.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Modus has summarization helpers, but no actual end-of-session or resume-summary pipeline wires them in
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- **What it does**: `SummarizeForCloud()` can compress search hits, and `ProduceBriefing()` can generate a five-bucket briefing from ingested items plus active missions. But there are no call sites for either helper in the shipped runtime, and `server.go` simply exits on EOF without any session-finalization hook. Public, by contrast, has cached continuity summaries in `session-resume.ts`, a one-call recovery tool in `session-bootstrap.ts`, and checkpoint generation in `session-manager.ts`.
- **Why it matters for us**: The useful idea is not Modus’s current lifecycle, because there effectively isn’t one. The transferable part is the **shape** of `ProduceBriefing()` as a structured end-of-cycle summary format that Public could test as an alternate session-summary profile.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: Modus’s strongest “context survival across sessions” idea is the learnings subsystem, but it is dormant in the shipped binary
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`
- **What it does**: The learnings subsystem is explicitly designed to persist “console-level” operational lessons across model swaps and format them for prompt injection via `LoadForPrompt()`. But `main.go` never calls `RegisterLearningsTools()`, so none of that cross-model continuity is available from the runtime that users actually launch.
- **Why it matters for us**: This is the clearest Modus-side attempt at continuity beyond raw fact recall: a separate, reusable memory plane for durable operator guidance. Public could consider a similarly explicit “operational learnings” channel, but only if it is truly first-class and not hidden behind unwired code.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Multi-client continuity in Modus is shared-file persistence, not isolated session continuity
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`, `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- **What it does**: The README says each AI client starts its own Modus process against the same vault, with index rebuild on startup and “last writer wins” at the file level for concurrent writes. That matches the code architecture: no shared session registry, no per-client isolation, and no recovery contract beyond reopening the vault and rebuilding the snapshot.
- **Why it matters for us**: This is fine for lightweight portability, but it is a poor fit for Public’s richer session semantics, where separate sessions can be trusted, resumed, checkpointed, completed, interrupted, and garbage-collected explicitly.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/missions.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`

## Assessment
- **New information ratio**: 0.84
- **Questions addressed**: session creation; what counts as a session in Modus; live-session maintenance after recall/write; session-ending behavior; end-of-cycle summarization; cross-model continuity; multi-client continuity; comparison with Public’s explicit session lifecycle
- **Questions answered**: Modus does not implement first-class sessions; continuity across chats comes from persisted markdown plus startup reindex, not resume state; session metadata is mostly passive and partly broken; no session-end summary pipeline is wired; the learnings subsystem is the strongest continuity idea but is dormant; Public already has materially stronger lifecycle primitives

## Reflection
- **What worked**: Treating “session lifecycle” as a code-path question instead of a README question exposed the real pattern quickly: startup, snapshot, file writes, exit. Tracing unused helpers (`ProduceBriefing`, `LoadForPrompt`) was especially useful because it separated intended continuity features from shipped ones.
- **What did not work**: The phase folder did not contain the expected deep-research state files, so I had to use prior iteration artifacts plus direct source tracing instead of reducer-managed state. Broad repo-wide session searches were also noisy until narrowed to runtime entrypoints and fact/index paths.

## Recommended Next Focus
Trace **client-side continuity expectations and ingestion timing**: whether Modus assumes the MCP client or agent prompt is responsible for calling `memory_store`, choosing when to recall, and compensating for the lack of server-side session resume/summarization, and whether any unwired docs/configs reveal an intended lifecycle contract that never made it into runtime.


Total usage est:        1 Premium request
API time spent:         4m 22s
Total session time:     4m 40s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.7m in, 16.9k out, 1.6m cached, 6.7k reasoning (Est. 1 Premium request)

---

# Iteration 005: SEARCH MECHANISMS

## Focus
SEARCH MECHANISMS: FTS, vector, hybrid, ranking algorithms. Query processing, shortcuts, relevance scoring.

## Findings

### Finding 1: Modus is **not** a vector or true hybrid retriever; it is a BM25-only engine with optional LLM query rewrites
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go:10-25,103-181,189-269`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:1-8,22-32,65-136,160-220`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:21-58,273-343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:100-104,482-485,771-810,1234-1235`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:11-17,616-750`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:147-205`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:45-66`
- **What it does**: Modus builds one in-memory lexical index over six fields with fixed weights `{path 1.5, source 1.0, subject 2.0, title 3.0, tags 1.5, body 1.0}`, tokenizes/stems locally, and falls back to prefix matching for terms of length `>=3`. The only “hybrid” element in shipped search is librarian-driven query expansion before rerunning the same lexical engine. There is no vector lane, no learned fusion, and no cross-channel score combination. Public already has explicit hybrid retrieval: weighted FTS5 BM25, embedding/vector retrieval, multi-variant deep mode, and RRF-based fusion.
- **Why it matters for us**: Modus is useful as a compact lexical baseline, but it is not evidence for replacing Public’s hybrid stack. Its field-weight idea is already overlapped here, and our current lexical weights are actually stronger and more structured.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus expands queries, but merges variant results with **first-seen dedup**, not global re-ranking
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:10-52,55-107`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28-58,280-332`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:324-343,346-391,713-750,803-850`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:21-41,931-942`
- **What it does**: `ExpandQuery()` always keeps the original query first, appends up to five additional strings, and `vault_search` / `memory_search` then append results variant-by-variant while deduplicating by `path` or `subject|predicate`. After dedup, Modus simply truncates to `limit`; it does not merge scores across branches or globally re-rank the union. A librarian `RankResults()` helper exists, but the only call site is its own definition. Public, by contrast, preserves branch/source provenance per candidate and fuses later in the pipeline.
- **Why it matters for us**: This is the biggest ranking weakness in Modus’s “hybrid-like” behavior. Expansion can improve recall, but Modus’s merge policy means later variants often cannot beat early lexical hits even if they are more relevant.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: The cache idea is useful, but the shipped Jaccard/LRU implementation is unsafe and only partially correct
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go:10-80,83-120,137-195`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:718-755`
- **What it does**: Modus adds a two-tier cache: exact query hash match first, then fuzzy reuse when token-set Jaccard similarity is `>=0.6`, with `256` max entries. That part is interesting. But `get()` mutates `hits` while holding only `RLock`, and cache reads never increment the global counter, so its “LRU” recency signal is not actually advanced on access.
- **Why it matters for us**: The architectural idea is stronger than the implementation. Public already has exact-argument caching around `memory_search`; a safe lexical/paraphrase cache could still be worth exploring for repeated nearby queries, but Modus’s version should not be copied.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 4: README latency claims only fit the pure in-memory BM25 path; the default librarian-expanded path can be network/LLM-bound
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:27-32,51-58,191-207,416-427`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28-35,280-285`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:17-33,35-82`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:71-75,717-739`
- **What it does**: Modus advertises `<100µs` cached search and `<5ms` cold search, which is believable for the in-memory BM25/cache path after startup. But when the librarian is reachable, both `vault_search` and `memory_search` first do a health probe and then send a chat-completions request with a `120s` HTTP timeout to generate expansions. That makes the real default search path dependent on external model latency, not just BM25 speed. Public’s deep expansion path is explicitly gated and wrapped in a `5s` timeout budget.
- **Why it matters for us**: The Modus performance story is valid only for one branch of the runtime. We should not import its “always expand when available” behavior into Public’s main retrieval path.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Modus’s fact lane is **not BM25**, and it couples search with automatic write-side reinforcement
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go:23-145,187-229`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:287-320,343`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:160-217,339-370`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:517-523,795-803`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:530-585,841-883,1194-1203`
- **What it does**: `memory_search` prints `bm25+librarian`, but the fact lane uses a separate `factStore.search()` that scores by token overlap, a small inverse-hit-frequency heuristic, `confidence * 0.1`, and a coarse recency multiplier. It is not BM25. Then every returned fact is asynchronously reinforced via `go v.ReinforceFact(...)`, so read access mutates stored state by default. Public already has FSRS strengthening logic, but only behind explicit `trackAccess=true`.
- **Why it matters for us**: Modus’s fact path is closer to a lightweight subject/value recall lane than a full lexical ranker. The automatic reinforcement loop is also too write-happy for Public’s default search semantics.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Cross-reference hints are the best transferable search-side idea, but only as a lightweight appendix, not as a ranking core
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:9-24,41-113,154-214`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:75-99,901-924`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:22-27,977-1050`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts:25-47`
- **What it does**: Modus builds adjacency maps keyed by normalized subject, tag, and entity name, then scores connected docs with fixed weights `subject=3`, `entity=2`, `tag=1`. This is cheap and useful for related-document surfacing. But it is intentionally shallow: no traversal, no causal semantics, and the “scan title/body for entity mentions” comment only checks title and subject in code. Public already has richer graph-aware ranking signals, causal boost, and structural freshness augmentation.
- **Why it matters for us**: The transferable piece is presentation, not retrieval replacement. Modus shows a cheap way to append “related memory” hints beside primary search hits without requiring full graph traversal on every query.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/bm25.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/cache.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`

## Assessment
- **New information ratio**: 0.81
- **Questions addressed**: whether Modus has real hybrid/vector retrieval; exact BM25 field behavior; cache tiers and fuzzy reuse; expansion ordering and failure handling; credibility of search latency claims; fact-lane scoring and reinforcement coupling; cross-reference weighting vs graph behavior
- **Questions answered**: Modus is lexical-only in shipped runtime; its query expansion is recall-oriented but rank-weak; its fuzzy cache idea is promising but its implementation is unsafe; its advertised latency excludes the LLM-expanded path; its fact search is a separate lightweight scorer with automatic write-back; its adjacency maps are best treated as related-doc hints, not as a graph substitute

## Reflection
- **What worked**: Tracing the actual call chain from MCP tool handlers into the BM25 engine and librarian client exposed the real runtime behavior quickly, especially the difference between “search core” and “search marketing.” Comparing Modus’s branch merge logic directly against Public’s Stage 1/Stage 2 pipeline made the recommendation boundaries much clearer.
- **What did not work**: README language around FTS5 and latency was too optimistic to trust without source tracing, and some comments overstate what the code does, especially around entity/body cross-referencing. Broad term searches were also noisy until narrowed to exact handler and pipeline entrypoints.

## Recommended Next Focus
Trace **agent/tool orchestration and caller contract** next: when Modus expects the client to choose `vault_search` vs `memory_search` vs `vault_connected`, how often searches implicitly mutate memory, and whether the shipped tool surface assumes a prompt-side policy layer to compensate for weak global ranking and LLM-latency tradeoffs.


Total usage est:        1 Premium request
API time spent:         6m 9s
Total session time:     6m 41s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  3.2m in, 20.0k out, 3.1m cached, 7.7k reasoning (Est. 1 Premium request)

---

# Iteration 006: MEMORY HYGIENE

## Focus
MEMORY HYGIENE: Deduplication, upserts, revision tracking, garbage collection, soft deletes, topic key stability.

## Findings

### Finding 1: Modus has no true fact upsert; it appends filename variants and hides duplicates at read time
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:339-375`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:273-316,347-379`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go:37-51`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts:182-243,245-310`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:927-977`
- **What it does**: `StoreFact()` derives a slug from `subject + "-" + predicate`, then resolves collisions by creating `-2`, `-3`, etc. files instead of updating an existing logical fact. Those duplicates are all indexed into the in-memory fact store. `memory_search` later deduplicates only at response time via `subject|predicate`, so duplication is masked rather than prevented.
- **Why it matters for us**: This is the opposite of hygienic memory mutation. It accumulates duplicate fact files and lets retrieval paper over the problem. Public already has same-path/content-hash dedup plus append-only supersede behavior when content actually changes, so Modus’s write pattern would be a regression.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus mutations do not refresh the live in-memory fact store, so hygiene is stale until restart
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:77-90`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:65-137,307-370`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:273-316,347-364,856-896`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:67-157,163-217,219-254,339-375`
- **What it does**: Modus builds its index once at startup. `memory_store`, `memory_reinforce`, `memory_decay_facts`, and `memory_archive_stale` all rewrite markdown files, but none update `idx.facts` or rebuild the index. Even automatic reinforcement from `memory_search` is just `go v.ReinforceFact(f.ID)`, so the persisted file changes asynchronously while the live search store stays unchanged.
- **Why it matters for us**: This is a major runtime hygiene flaw: dedup state, confidence, archive flags, and freshness are not read-your-writes consistent. Public’s mutation path updates DB state, BM25 state, lineage, and cache invalidation immediately; Modus does not.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Modus archive is only a partial soft-delete and its visibility rules are inconsistent
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:219-254,266-288`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:348-364`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:231-258,866-880`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-31`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:67-140,161-240`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:63-130`
- **What it does**: `ArchiveStaleFacts()` sets `archived=true` and `archived_at`, but `ListFacts()` does not filter archived files, so `memory_facts` still lists them. Only the startup-time fact index marks archived facts inactive for search. The memory tool surface exposes archive, decay, reinforce, and store, but no per-fact delete/update/restore workflow.
- **Why it matters for us**: Modus’s “soft delete” is not a coherent lifecycle state; it is a flag with inconsistent read behavior and no garbage-collection story beyond accumulation on disk. Public already distinguishes archived visibility at query time and offers explicit delete/checkpoint workflows.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Topic-key stability is weak because Modus uses raw strings, not canonical alias-backed identities
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go:48-50,147-159`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:52-76,81-111,154-190`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go:18-35,62-99`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/helpers.go:13-24`; `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts:18-64`; `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts:248-320`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:86-216`
- **What it does**: Fact lookup keys are just `strings.ToLower(strings.TrimSpace(subject))`; cross-ref keys are lowercased subject/tag/title text; entity resolution tries slug/name matching and finally a substring walk. There is no alias table or canonical subject/topic identifier, so spelling variants fragment neighborhoods.
- **Why it matters for us**: This is the biggest hygiene gap around topic stability. Public already does better on file identity and entity alias normalization, but Modus is a useful warning that exact-string topic keys are brittle. The lesson is worth exploring, but Modus’s implementation is not.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 5: `vault_write` is a destructive overwrite path with no revision trail, checkpoint, or append-only semantics
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:57-64`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:143-161`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go:10-51`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:138-224`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:94-140,190-239`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts:666-776`
- **What it does**: `vault_write` passes arbitrary path/frontmatter/body to `v.Write()`, which directly calls `markdown.Write()`, which directly calls `os.WriteFile()`. That means overwrite-in-place, no revision record, no checkpoint, no mutation ledger, and no logical predecessor/successor relationship.
- **Why it matters for us**: This is a clear memory-hygiene mismatch with Public’s mutation model. Public mutations are transactional and auditable; Modus exposes a generic write primitive that can erase provenance in one call.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Newly stored facts begin with `created: "now"`, which breaks Modus’s own recency and decay heuristics
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:118-143,339-375`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/beliefs.go:134-148`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go:53-79,187-228`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:243-257`
- **What it does**: `StoreFact()` writes a literal `created: "now"`. The shared `parseTime()` helper accepts RFC3339/date layouts only, so fresh facts cannot use `created` as a valid decay fallback. `recencyBoost()` and `StalenessWarning()` also fail open when that timestamp is unparseable.
- **Why it matters for us**: This is a concrete hygiene bug, not just a design tradeoff. A newly stored fact begins life outside the system’s own freshness/decay contract. Public’s save path writes machine-readable timestamps and lineage metadata, so Modus offers nothing to adopt here.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/entities.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/helpers.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/writer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/markdown/parser.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/lineage-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/prediction-error-gate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`

## Assessment
- **New information ratio**: 0.87
- **Questions addressed**: Modus fact dedup semantics; whether `memory_store` is an upsert; whether mutations refresh the live index; whether archive is coherent across tools; whether Modus has real revision tracking; how stable subject/entity/topic keys are; whether write-side timestamps support its own decay model.
- **Questions answered**: Modus does not implement true upsert for facts; duplicate control is mostly response-time masking; write-side mutations are not read-your-writes consistent; archive is only a partial soft-delete; revision/provenance tracking is largely absent on the generic write path; topic identity is exact-string fragile; freshly stored facts have a timestamp bug that undermines recency and decay.

## Reflection
- **What worked**: Tracing the hygiene path from MCP tool handlers into `vault` helpers, then checking the startup-only index build, made the runtime consistency story much clearer than searching README claims. Comparing each Modus mutation surface against Public’s dedup, lineage, checkpoint, and canonical-path code kept the recommendations concrete.
- **What did not work**: Broad keyword searches across the whole tree were noisy until narrowed to write/mutation entrypoints. The phase packet also lacks active deep-research state files, and the strict spec validation command was permission-blocked in this environment, so this iteration is a direct source-trace rather than a full packet-state update.

## Recommended Next Focus
Trace the **caller contract and write-arbitration boundary** next: whether Modus expects a prompt-side “Librarian” policy layer to decide when to `vault_write` versus `memory_store`, and how much of its claimed dedup/context hygiene is delegated to that policy layer rather than enforced in the server itself.


Total usage est:        1 Premium request
API time spent:         6m 14s
Total session time:     6m 43s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  3.1m in, 19.9k out, 2.9m cached, 9.4k reasoning (Est. 1 Premium request)

---

# Iteration 007: AGENT INTEGRATION

## Focus
AGENT INTEGRATION: Agent-agnostic patterns, passive capture, multi-agent safety, project scoping.

## Findings

### Finding 1: Modus’s “single Librarian / sole writer” model is documentation-only; the shipped MCP server does not enforce it
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:211-230`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:45-60,107-145,179-185`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:83-88`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-38`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:143-162,343,379,856-897`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go:149-188`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1100-1183,1458-1493`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:218-281,456-493`
- **What it does**: README/docs say the Librarian is the only model allowed to write, but the actual server starts by registering the default 11-tool memory surface, including `vault_write`, `memory_store`, `memory_reinforce`, and `memory_decay_facts`. MCP `tools/call` passes only an argument map to handlers; there is no caller identity, role check, or write broker. By contrast, Public’s save path validates governed ingest, enforces scope, checks shared-space membership, and audits allow/deny decisions.
- **Why it matters for us**: The useful idea here is **write mediation**, not Modus’s implementation. In source, “single writer” is a prompt convention, so any connected client can mutate persistent state directly. Public already has the harder part: actual scope/governance enforcement.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: In Modus, search is a write-side effect, so one agent’s recall mutates shared memory for every other agent
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:273-317,343,885-897`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:160-217`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:296-300,454-457`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-533,771-802,1304-1320`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts:83-116,145-181`; `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:157-199,205-258`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:962-973`
- **What it does**: `memory_search` merges fact hits, then asynchronously calls `go v.ReinforceFact(f.ID)` for every returned fact. In other words, retrieval is treated as a successful FSRS review and writes back `confidence`, `stability`, `difficulty`, `last_accessed`, and `access_count`. README explicitly frames the same vault as shared across multiple agents/clients. Public takes the opposite posture by default: `trackAccess` is opt-in, and passive query/citation/follow-on signals are shadow logging rather than guaranteed write-side mutation.
- **Why it matters for us**: For multi-agent memory, “read == write” is dangerous unless actor identity, audit, and scope are first-class. Modus’s pattern turns any retrieval agent into a global state mutator. That is especially weak given the earlier runtime-consistency bug: the write happens, but live search state does not refresh.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Modus’s only real project boundary is the vault root; inside a vault, everything is global
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:32-40,60-90,96-106`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go:20-45,74-121`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:65-136,160-220`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:298-324`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:175-215,500-533,719-748`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:95-135`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:158-166,456-493`
- **What it does**: Modus lets you pick one vault directory via `--vault`/`MODUS_VAULT_DIR`, and `safePath()` prevents path traversal outside that root. But after that, indexing/search/listing are vault-wide: `Build()` scans all markdown under the vault, and search has no project/spec/user/agent/session/shared-space parameters. README confirms that team use relies on filesystem access control rather than built-in scope boundaries. Public already carries spec-folder routing plus tenant/user/agent/session/shared-space scope fields through save and search.
- **Why it matters for us**: The coarse “one vault per project” pattern is operationally simple, but it is much weaker than Public’s in-process scoping. Modus is a reminder that filesystem-root isolation is useful as a deployment boundary, not as sufficient retrieval governance.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Passive capture is mostly aspirational in source; the shipped server depends on explicit memory tool use
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:83-88`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-38`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:119-160,181-258`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:11-220`; `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts:157-199,205-258`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:962-973`
- **What it does**: The repo contains helper primitives for summarization, fact extraction, intent classification, briefing generation, and a separate learnings toolset, but the shipped entrypoint only exposes the stripped 11-tool memory surface. There is no default pipeline that observes agent work, extracts facts, and saves them automatically. Public already has passive query-flow, citation, and follow-on-tool telemetry channels even when no explicit save occurs.
- **Why it matters for us**: Modus should not be treated as evidence that passive capture is solved. In source, passive capture is mostly a design direction, not a live ingestion path.
- **Recommendation**: reject
- **Impact**: medium

### Finding 5: Modus’s dormant `learnings` subsystem is the strongest agent-agnostic idea in this repo
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go:1-155,157-208,229-277,299-320`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go:11-220`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go:83-88`
- **What it does**: Modus separates **operational learnings** from user facts: learnings are domain-tagged (`search`, `triage`, `code`, etc.), typed (`mistake`, `pattern`, `decision`, `correction`), severity-scored, prompt-renderable via `LoadForPrompt()`, and reinforce/deprecate over time. The subsystem is explicitly model-neutral (“accessible to every cartridge”), but the main server never registers these tools.
- **Why it matters for us**: This is a useful pattern for Public: keep user/project memory separate from cross-agent operating lessons, and make the latter easy to inject into system prompts. The good part is the partitioning model, not the current Modus wiring.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 6: Modus has a good optional-sidecar shape for agent integration, but the implementation is hard-wired and the README overstates what ships
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go:1-33,35-119`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go:15-52`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:28-53,280-317`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:211-231,316-317`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md:16-29,107-145`
- **What it does**: Retrieval enrichment is optional: if the Librarian is reachable, Modus expands queries through a local OpenAI-compatible HTTP endpoint at `http://127.0.0.1:8090`; if not, search falls back to direct BM25. That separation of “reasoner” vs “local retriever/rewriter” is sound. But the implementation is hard-coded to one localhost endpoint with one request shape, while README says search needs no LLM calls and uses a “local synonym map,” which is not what the source does.
- **Why it matters for us**: The pattern worth borrowing is **optional local query-rewrite sidecar with fail-open fallback**, not the hard-coded provider contract. Public already has richer internal routing; if we add agent-side query rewriting, it should be provider-pluggable and explicitly optional.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/main.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/server.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/learnings.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/vault.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/client.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/librarian/search.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/learnings/learnings.go`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/docs/librarian.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/query-flow-tracker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`

## Assessment
- **New information ratio**: 0.86
- **Questions addressed**: whether Modus really enforces a single-writer agent pattern; whether recall is a passive read or a state mutation; what the actual scope boundary is in multi-agent use; whether passive capture exists in shipped code; whether there is any reusable agent-neutral memory partition; whether the Librarian sidecar is truly agent-agnostic.
- **Questions answered**: Modus’s single-writer model is not enforced; shared-agent recall mutates global memory by default; vault-root selection is its only real project boundary; passive capture is mostly not implemented in the shipped server; the dormant learnings subsystem is the best reusable agent-neutral idea; the Librarian sidecar pattern is useful, but its current implementation is rigid and partially misdescribed in docs.

## Reflection
- **What worked**: Following the runtime entrypoint first (`main.go` -> `RegisterMemoryTools` -> concrete handlers) made the agent-integration story much clearer than reading the Librarian docs in isolation. Comparing the shipped Modus surface directly against Public’s scope/governance and passive-feedback code kept the analysis grounded in actual operational guarantees rather than architecture rhetoric.
- **What did not work**: The repo contains many adjacent concepts (missions, trust, distillation, learnings), but most are not part of the default 11-tool server, so broad searches initially overstated what actually ships. README claims around “sole writer” and “no LLM calls on the search path” also required careful source-first correction.

## Recommended Next Focus
Investigate a system that **actually enforces** delegated writes and actor-scoped memory boundaries, so the next comparison can separate the good “Librarian/broker” idea from prompt-only policy.


Total usage est:        1 Premium request
API time spent:         5m 28s
Total session time:     5m 53s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  3.0m in, 18.8k out, 2.8m cached, 8.8k reasoning (Est. 1 Premium request)

---

# Iteration 008: COMPARISON - RETRIEVAL

## Focus
COMPARISON - RETRIEVAL: Compare search/retrieval against our Spec Kit Memory (`memory_search`, CocoIndex, code-graph).

## Findings

### Finding 1: Modus’s BM25 stack is clean, but Public’s lexical lane is already stronger and sits inside a broader retrieval system
- **Source**: `external/internal/index/bm25.go:10-25,103-181,189-269`; `external/internal/index/indexer.go:160-220`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts:45-67`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts:146-206`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:11-23,1391-1405`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1-25,113-124`
- **What it does**: Modus builds a six-field in-memory BM25 index with fixed weights (`path 1.5`, `source 1.0`, `subject 2.0`, `title 3.0`, `tags 1.5`, `body 1.0`), simple stemming, and a last-chance prefix scan when exact term lookup misses. Public already has weighted lexical retrieval too, but its FTS5 BM25 weights are materially stronger (`title 10x`, `trigger_phrases 5x`, generic metadata `2x`, body `1x`) and that lexical lane runs inside hybrid search with both vector and keyword channels active before later graph/session/feedback fusion.
- **Why it matters for us**: The useful conclusion is **not** “swap in Modus BM25.” Public already has a richer lexical+semantic memory path, plus dedicated code retrieval channels. Modus is a reference for a compact lexical implementation, not a superior search architecture.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus’s fuzzy query cache is one real retrieval idea Public does not already have
- **Source**: `external/internal/index/cache.go:10-17,41-80,83-119,167-195`; `external/internal/index/indexer.go:169-219`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:718-767`
- **What it does**: Modus adds a two-tier cache in front of search: exact normalized-query hash reuse, then fuzzy reuse when Jaccard similarity between token sets is at least `0.6`, with a small LRU of `256` entries. Public also caches search responses, but the cache key is exact and scope-heavy (`query/concepts/specFolder/tenant/user/agent/sharedSpace/session/flags`), so it does not opportunistically reuse near-duplicate lexical queries.
- **Why it matters for us**: This is one of the few genuinely missing retrieval mechanics. But it is only safe on a bounded lexical sub-lane; applying fuzzy reuse to Public’s fully fused response would be wrong because scoped visibility, session dedup, boosts, and telemetry make “similar query” much less equivalent than in Modus.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Modus’s “Librarian expansion” is a local LLM rewrite path, while Public already has three expansion families
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-321`; `external/README.md:261-267,316-317`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts:20-100`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts:155-259`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:347-383,616-860,1088-1155`
- **What it does**: In source, Modus expansion is not a static synonym table on the hot path; `ExpandQuery()` calls the Librarian model, parses JSON expansions, keeps the original query, caps the set at 6, then merges result sets by unique path or fact key. Public already has rule-based synonym expansion, embedding-based term mining, query decomposition, and optional LLM reformulation in deep mode, all fail-open and integrated into the hybrid pipeline.
- **Why it matters for us**: The net-new idea is narrower than the README suggests. We do **not** need “query expansion” in general; we already have it. The transferable part is a cheap, explicitly lexical rewrite lane that can widen BM25/FTS recall without changing semantic or graph routing.
- **Recommendation**: prototype later
- **Impact**: high

### Finding 4: Modus’s best retrieval-specific pattern is not its graph model, but its explicit “connected docs not in top hits” appendix
- **Source**: `external/internal/index/crossref.go:41-112,154-214`; `external/internal/mcp/vault.go:75-101`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:15-24,317-420`; `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts:46-117,143-159,178-247`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:10-39`
- **What it does**: Modus builds cheap adjacency maps over markdown documents only: shared subject gets weight `3.0`, entity `2.0`, tag `1.0`, then `vault_search` appends connected documents that were not already returned. Public’s code-graph and CocoIndex are stronger, but they solve different problems: `code_graph_query/context` answer structural code questions, and CocoIndex is the semantic code-search bridge. Neither is the same as “show me adjacent memory docs I might also want right now.”
- **Why it matters for us**: This is additive, not competitive. Public should not replace causal memory or code graph with Modus-style string adjacency, but a small connected-memory appendix for markdown artifacts could improve exploration and follow-on recall without disturbing the existing routing split of memory vs semantic code vs structural code.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: Modus’s fact-only retrieval lane is fast, but too narrow to replace Public’s scoped hybrid memory search
- **Source**: `external/internal/index/facts.go:23-145`; `external/internal/index/indexer.go:307-371`; `external/internal/vault/facts.go:290-336`; `external/internal/mcp/vault.go:273-343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:492-540,771-809,1071-1169,1251-1323`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:118-164,189-256`
- **What it does**: Modus maintains a separate in-memory fact store over `memory/facts/*.md`, scoring by token overlap with small confidence and recency boosts, then merges query variants by `subject|predicate`. Public’s `memory_search` is much broader: scoped retrieval (`tenant/user/agent/session/sharedSpace`), hybrid/vector/multi-concept modes, constitutional injection, session and causal boosts, reranking, dedup, and shadow telemetry.
- **Why it matters for us**: Modus’s split is a plausible fast path for a tiny fact surface, but it is much weaker than Public’s actual memory retrieval contract. If we want a “quick facts” helper later, it should be a sidecar or profile, not the main memory search model.
- **Recommendation**: reject
- **Impact**: medium

### Finding 6: Modus’s retrieval README overstates the hot path; only the cache story is source-plausible
- **Source**: `external/README.md:261-267,308-317`; `external/docs/librarian.md:33-40`; `external/internal/librarian/search.go:15-35,57-106`; `external/internal/index/cache.go:49-80,167-195`; `external/internal/index/bm25.go:116-118,171-181`
- **What it does**: README says search uses “local synonym map” and “no LLM calls on the search path,” but source expansion/reranking go through `Call(...)` when the Librarian is available. The “microseconds” claim is believable for exact cache hits only; fuzzy cache still scans cache entries, and prefix fallback scans the full term vocabulary. So the fast path exists, but the marketing summary collapses very different paths together.
- **Why it matters for us**: We should treat Modus’s performance story as a benchmark candidate for exact-cache and cold-BM25 tiers, not as proof that the overall retrieval design is cheaper or simpler than Public’s routed memory/CocoIndex/code-graph stack.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/index/indexer.go`
- `external/internal/index/facts.go`
- `external/internal/index/crossref.go`
- `external/internal/librarian/search.go`
- `external/internal/vault/facts.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/internal/mcp/vault.go`
- `external/internal/mcp/memory.go`
- `external/README.md`
- `external/docs/librarian.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/utils/cocoindex-path.ts`

## Assessment
- **New information ratio**: 0.81
- **Questions addressed**: BM25 transferability vs Public lexical search; cache-path differences; real query-expansion mechanics; adjacency-map usefulness vs code-graph/CocoIndex; fact-lane overlap vs `memory_search`; credibility of performance claims.
- **Questions answered**: Modus BM25 is not stronger than Public’s lexical lane; fuzzy lexical cache reuse is the clearest missing idea; Librarian expansion is real local-LLM rewriting, not a no-LLM synonym map; adjacency appendices are the best reusable retrieval UX pattern; Modus fact search is too narrow for Public’s main memory contract; README search/performance claims are only partially source-backed.

## Reflection
- **What worked**: Following the requested order from BM25/cache/expansion into MCP handlers made the retrieval story much clearer than starting from the README. Comparing Modus against Public’s actual lexical, hybrid, semantic-code, and structural-code surfaces prevented false “missing feature” conclusions.
- **What did not work**: The phase scaffold is incomplete for a full saved iteration: `research/research.md` is absent, and strict spec validation could not run because the validator hit a permission boundary. That means this iteration is solid as source-backed analysis, but not yet as a completed in-folder research artifact.

## Recommended Next Focus
Investigate a system that couples **retrieval-time expansion with explicit scoped caching and related-result surfacing** without turning recall into write-side mutation, so we can compare a stronger retrieval broker against both Modus and Public’s current split between `memory_search`, CocoIndex, and code-graph.


Total usage est:        1 Premium request
API time spent:         4m 23s
Total session time:     4m 43s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.9m in, 15.3k out, 1.8m cached, 7.4k reasoning (Est. 1 Premium request)

---

# Iteration 009: COMPARISON - LIFECYCLE

## Focus
COMPARISON - LIFECYCLE: Compare session/state management against our memory_context, generate-context.js, session bootstrap.

## Findings
### Finding 1: Modus boots a vault process, not a resumable session lifecycle
- **Source**: `external/cmd/modus-memory/main.go:30-94,96-105`; `external/internal/mcp/memory.go:7-39`; `external/internal/mcp/server.go:114-198`; `external/internal/mcp/vault.go:219-227`
- **What it does**: Modus resolves one vault root from flag/env/default, creates core directories, builds one in-memory index, registers 11 tools, and starts a stdio MCP loop. Its MCP initialize path only announces the tool surface, and its only built-in lifecycle/status tool is `vault_status`, which returns vault counts rather than any session/task recovery contract.
- **Why it matters for us**: Modus is process-and-vault scoped; Public is session-and-task scoped. Modus has no real analogue for `memory_context`, `session_resume`, or `session_bootstrap`.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus’s only session field is decorative, not an enforced partition
- **Source**: `external/internal/index/indexer.go:344-363`; `external/internal/index/facts.go:10-21,37-50,88-145`; `external/internal/vault/facts.go:339-376`
- **What it does**: Indexed facts may carry `session_tag`, defaulting to `session-1` when absent, but the fact store indexes only subject/predicate/value and scores only term overlap, confidence, and recency. `memory_store` does not write `session_tag` at all.
- **Why it matters for us**: There is no true session boundary in retrieval or storage. Public already does far more by threading `sessionId` through retrieval, dedup, and continuity logic.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: Public’s trusted session lifecycle is a real control plane; Modus has no equivalent
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:821-860,1221-1292,1352-1415,1434-1445`; `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385-435,1020-1076`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325-365`; `external/internal/mcp/server.go:114-198`; `external/internal/mcp/memory.go:7-39`
- **What it does**: Public resolves only server-managed session IDs, rejects mismatched callers, persists `session_state` with `spec_folder` and `current_task`, tracks inferred mode, and can inject attended working-memory items into resumed prompt context. Modus exposes no session token, no identity binding, and no resumed prompt-context surface.
- **Why it matters for us**: Public’s continuity model is explicit and guarded; Modus’s continuity is implicit in whatever markdown already exists in the vault.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Public’s resume/bootstrap path is compositional and fail-closed; Modus only offers raw vault health
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:191-332,400-597`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-126,163-350`; `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:104-167`; `external/internal/mcp/vault.go:219-227`; `external/internal/mcp/server.go:114-198`
- **What it does**: `session_resume` composes `memory_context(resume)`, code-graph status, CocoIndex availability, structural context, and cached continuity only when summary text, transcript identity, freshness, and scope all validate. `session_bootstrap` adds health, hints, and next actions. Modus has no comparable resume packet or cached-summary validator; `vault_status` is just counts.
- **Why it matters for us**: Public is already materially ahead on recovery lifecycle. Modus does not contribute a reusable bootstrap pattern here.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Modus’s write lifecycle is immediate markdown mutation, but it is not same-session freshness-safe
- **Source**: `external/internal/vault/vault.go:57-65,114-121`; `external/internal/vault/facts.go:339-376`; `external/internal/mcp/vault.go:143-162,347-379`; `external/internal/index/indexer.go:66-149,288-304,307-371`; `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:51-84,344-387,393-571`; `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:780-783,1066-1070,1852-2105`
- **What it does**: In Modus, `vault_write` and `memory_store` write markdown directly, but the searchable index is built at startup and queried in memory with no post-write refresh in the write path. Public’s `generate-context` flow is structured-input, path-validated, atomically written, post-reviewed, and immediately indexed.
- **Why it matters for us**: This is a lifecycle correctness gap, not just a style difference. Modus is simpler, but same-process writes can lag behind search until rebuild/restart. Public’s heavier save pipeline is justified for authoritative memory artifacts.
- **Recommendation**: reject
- **Impact**: high

### Finding 6: Modus treats recall as an implicit global write; Public’s two-timescale lifecycle is safer
- **Source**: `external/internal/mcp/vault.go:273-317,885-897`; `external/internal/vault/facts.go:160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:4-11,27-41,325-365`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:783-807,1434-1445`
- **What it does**: Modus `memory_search` asynchronously reinforces every returned fact, mutating confidence, stability, difficulty, `last_accessed`, and `access_count` on read. Public intentionally separates ephemeral session attention from long-term memory decay: resume retrieval disables long-term decay, while working-memory attention drives bounded prompt-context injection.
- **Why it matters for us**: The transferable idea is that recall events matter, but Modus implements that as implicit global mutation. For Public, any equivalent should be explicit and scoped.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- `external/cmd/modus-memory/main.go`
- `external/internal/mcp/server.go`
- `external/internal/mcp/memory.go`
- `external/internal/mcp/vault.go`
- `external/internal/vault/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/index/indexer.go`
- `external/internal/index/facts.go`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts`
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts`
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts`

## Assessment
- New information ratio: 0.78
- Questions addressed: actual lifecycle boundary in Modus; whether session metadata is real or decorative; whether Modus has any bootstrap/resume analogue; write/search freshness coupling; recall-as-write behavior vs Public’s session attention model.
- Questions answered: Modus is vault-scoped rather than session-scoped; `session_tag` is not an enforced retrieval boundary; Modus has no equivalent to `session_resume` or `session_bootstrap`; direct markdown writes are not paired with live index refresh; Public’s explicit save and resume machinery is materially stronger; the only transferable lifecycle idea is “recall events matter,” but only with explicit scoping.

## Reflection
- What worked: Tracing the lifecycle from `main.go` into the MCP registry and then following the write/search paths exposed the real boundary quickly. Comparing that directly to Public’s `memory_context` -> `session_resume` -> `session_bootstrap` chain, plus `generate-context`’s workflow, made the differences concrete.
- What did not work: Broad searches for `session` inside Modus produced many near-misses (`session_tag`, mission `state/`, import context) that initially looked richer than they really are. The current phase packet also still lacks the newer deep-research reducer state files, so the comparison had to stay iteration-local.

## Recommended Next Focus
Investigate a system that combines **actor-scoped session continuity, explicit save workflows, and live post-write index freshness**, so the next comparison can separate “local markdown simplicity” from a genuinely strong lifecycle/control plane.


Total usage est:        1 Premium request
API time spent:         5m 33s
Total session time:     5m 59s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.9m in, 20.1k out, 2.8m cached, 8.3k reasoning (Est. 1 Premium request)

---

# Iteration 010: COMPARISON - HYGIENE

## Focus
COMPARISON - HYGIENE: Compare memory quality/hygiene against our causal links, health tooling, trigger system.

## Findings
### Finding 1: Modus’s MCP health surface is thinner than advertised, and thinner than Public’s actual hygiene control plane
- **Source**: `external/internal/mcp/memory.go:7-39`; `external/internal/mcp/vault.go:219-227`; `external/internal/vault/vault.go:123-158`; `external/cmd/modus-memory/doctor.go:19-31`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222-594`
- **What it does**: Modus exposes `vault_status` as its only MCP-visible hygiene/status tool in the memory toolset, and the tool description claims “file counts, index size, cross-ref stats.” But `StatusJSON()` only returns `total_files`, `index_docs`, and a top-level directory breakdown. The richer cross-ref counts are only computed inside the separate `doctor` CLI. Public’s `memory_health`, by contrast, reports database/connectivity state, embedding/provider metadata, alias conflicts, FTS drift, orphan cleanup outcomes, and gated `autoRepair`.
- **Why it matters for us**: For agent-facing hygiene, status needs to be both truthful and actionable. Modus splits diagnostics between MCP and an offline CLI and under-delivers on the MCP side; Public already has the stronger operational pattern.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: Modus’s `doctor` has one reusable hygiene idea Public does not fully cover yet: content-level contradiction and duplicate-fact linting
- **Source**: `external/cmd/modus-memory/doctor.go:42-84`; `external/cmd/modus-memory/doctor.go:108-158`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:296-376`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:445-594`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:647-680`
- **What it does**: Modus `doctor` explicitly scans fact files for missing `subject`/`predicate`, duplicate `subject+predicate` pairs, and “same subject, same predicate, different value” contradictions. Public `memory_health` is stronger on infrastructure integrity and repair, but its current checks center on schema/DB/FTS/alias/vector/orphan health. Public’s contradiction tooling today is causal-edge oriented, not fact-content oriented.
- **Why it matters for us**: This is the clearest hygiene gap where Modus has a useful idea. A content-level contradiction/duplicate pass would complement Public’s existing infra health tooling instead of duplicating it.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 3: Modus cross-references are associative adjacency maps, not a causal-memory hygiene system
- **Source**: `external/internal/index/crossref.go:9-214`; `external/internal/mcp/vault.go:75-101`; `external/internal/mcp/vault.go:899-925`; `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:339-540`; `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts:557-847`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:18-52`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:173-247`; `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts:616-760`
- **What it does**: Modus builds an in-memory `bySubject`/`byTag`/`byEntity` cross-index, scores connections with fixed weights (subject `3.0`, entity `2.0`, tag `1.0`), and appends connected docs to search results or returns them via `vault_connected`. Public stores typed causal edges (`caused`, `enabled`, `supersedes`, `contradicts`, `derived_from`, `supports`), exposes traversal in both directions, tracks graph coverage/orphans, records `weight_history`, and applies contradiction detection and edge bounds.
- **Why it matters for us**: Modus’s cross-links are useful for loose discovery, but they do not preserve decision lineage or graph hygiene. They cannot answer the same class of “why was this decision made?” questions that Public’s causal graph can.
- **Recommendation**: reject
- **Impact**: high

### Finding 4: Modus has no trigger-recall plane; its query hygiene stops at query expansion
- **Source**: `external/internal/mcp/memory.go:7-39`; `external/internal/mcp/vault.go:21-104`; `external/internal/mcp/vault.go:273-343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184-229`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:273-550`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:157-185`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:337-440`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:644-689`; `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts:695-791`
- **What it does**: Modus exposes search plus Librarian expansion, but no trigger-phrase cache, no prompt-signal vocabulary, no scope/session validation, no degraded-mode reporting for trigger sources, and no co-activation or tiered-context recall path. Public’s trigger system caches validated phrases from `memory_index`, uses Unicode-aware boundary matching plus candidate indexing, fails closed on scope errors, reports degraded source parsing, supports signal boosts, and layers session-aware decay/co-activation/tier filtering on top.
- **Why it matters for us**: Trigger recall is a hygiene/control feature as much as a retrieval feature: it governs safe latent-context surfacing. Modus does not offer a comparable mechanism to borrow here.
- **Recommendation**: reject
- **Impact**: high

### Finding 5: Modus’s markdown pipeline is intentionally permissive, but that permissiveness weakens authoritative memory hygiene
- **Source**: `external/internal/markdown/parser.go:98-159`; `external/internal/markdown/parser.go:161-186`; `external/internal/markdown/writer.go:10-51`; `external/internal/vault/facts.go:348-375`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1273-1418`
- **What it does**: Modus treats malformed YAML frontmatter as raw body, skips parse failures during directory scans, writes frontmatter/body directly with no validation gate, and handles duplicate fact writes by suffixing filenames (`-2`, `-3`, ...). Public’s `memory_save` path runs explicit preflight checks for anchors, duplicates, tokens, and size, supports dry-run, and rejects invalid saves unless the caller deliberately bypasses preflight.
- **Why it matters for us**: Modus is optimized for lightweight human-editable vault ergonomics, not for high-integrity memory ingestion. That tradeoff is fine for a personal markdown vault, but it is weaker than Public’s current hygiene bar for durable indexed memory artifacts.
- **Recommendation**: reject
- **Impact**: high

## Sources Consulted
- `external/internal/index/crossref.go`
- `external/internal/mcp/vault.go`
- `external/internal/mcp/memory.go`
- `external/internal/vault/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/cmd/modus-memory/doctor.go`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/causal-graph.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`

## Assessment
- **New information ratio**: 0.76
- **Questions addressed**: whether Modus has a real MCP-visible hygiene/status plane; whether its cross-references overlap with Public causal links; whether Modus has any trigger-recall equivalent; whether its markdown pipeline enforces memory quality; whether any doctor-style checks should transfer into Public.
- **Questions answered**: Modus’s MCP status tooling is materially weaker than Public’s health surface; its adjacency maps are not substitutes for Public’s causal graph; it has no trigger-recall system comparable to Public’s; its markdown ingestion is permissive rather than hygiene-enforcing; the one transfer-worthy idea is a doctor-style duplicate/contradictory fact audit for Public.

## Reflection
- **What worked**: Tracing tool registration first and then following the actual handler implementations separated “claimed hygiene” from “agent-visible hygiene” quickly. Comparing `doctor` against `memory_health` also made it easy to distinguish useful content checks from overall control-plane strength.
- **What did not work**: Broad keyword searches on the Modus tree were noisy for hygiene because most of the relevant behavior is split across MCP handlers, vault helpers, and the standalone CLI. The trigger comparison was mostly an absence proof, so it only became solid after checking the full Modus memory tool surface rather than individual files.

## Recommended Next Focus
Compare against a system that combines **content-level memory linting, session-scoped recall controls, and typed relationship hygiene** in one agent-visible surface, so the next pass can separate “good markdown ergonomics” from a genuinely complete memory-governance design.


Total usage est:        1 Premium request
API time spent:         3m 55s
Total session time:     4m 16s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.3m in, 12.8k out, 1.1m cached, 6.3k reasoning (Est. 1 Premium request)

---

# Iteration 011: GAP ANALYSIS - MISSING FEATURES

## Focus
GAP ANALYSIS - MISSING FEATURES: What entirely NEW features should we build that we haven't considered?

## Findings

### Finding 1: Modus has a **prompt-ready operational learnings plane**, not just retrieval feedback
- **Source**: `external/internal/learnings/learnings.go:1-209,229-329`; `external/internal/mcp/learnings.go:11-220`; `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:1-20`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1775-1787`
- **What it does**: Modus stores cross-model operational lessons in `brain/learnings/*.md` with `domain`, `type`, `severity`, `confidence`, and `reinforced` metadata; `LoadByDomain` always includes `general` and `critical` items, `FormatForPrompt` renders them into `DO / AVOID / DECIDED / CORRECTED` prompt bullets, and MCP exposes list/record/search/reinforce/deprecate operations. Public’s reviewed learning path is `runBatchLearning`, which is explicitly **shadow-only** and does not create a reusable prompt-facing operational memory layer.
- **Why it matters for us**: This is a different capability from search ranking. It gives the system a place to remember “how to behave” across sessions and agents, not just “what to retrieve.”
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 2: Modus has a **promotion and retirement lifecycle for lessons**, which Public does not visibly expose
- **Source**: `external/internal/learnings/learnings.go:71-114,229-329,333-375`; `external/internal/mcp/learnings.go:102-218`; `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:13-20`
- **What it does**: Recording an existing learning reinforces it instead of overwriting it; `PromoteFromLesson` escalates an agent-local lesson into a global learning; `RecordCorrection` turns a supervisor correction into a high-confidence shared rule; `Deprecate` sets confidence to `0.0`, and `loadFromDir` then suppresses deprecated learnings from future injection. In the Public files reviewed, learning signals stay observational/shadow-only rather than becoming first-class operational directives with explicit retirement.
- **Why it matters for us**: Public has feedback and validation signals, but not a clear “candidate lesson -> proven operational rule -> deprecated obsolete rule” pipeline. That would close the loop between reflection, governance, and future agent behavior.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 3: Modus has an explicit **trust-stage autonomy control plane**
- **Source**: `external/internal/vault/trust.go:9-96`; `external/internal/mcp/vault.go:607-635`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-220`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:366-445`
- **What it does**: Modus persists `atlas/trust.md` with stage `1/2/3` (`Inform`, `Recommend`, `Act`), defaults safely to stage 1, records transition history in the body, and exposes MCP get/set tools while explicitly stating the system never self-promotes. In the Public memory files reviewed, I did not find an equivalent global autonomy mode; reconsolidation is advisory/shadow-only or narrow auto-archive behavior, not policy-level permissioning.
- **Why it matters for us**: Public already has powerful memory mutation and recommendation paths. A single operator-set autonomy state could gate when memory-derived suggestions remain advisory versus when certain maintenance or consolidation actions may execute automatically.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 4: Modus models **belief change as proposals with operator adjudication**
- **Source**: `external/internal/vault/prs.go:10-125`; `external/internal/vault/beliefs.go:31-127`; `external/internal/mcp/vault.go:681-777`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:395-437`
- **What it does**: Modus can open a PR-like markdown proposal against an `entity`, `belief`, or `fact`, store reasoning and linked belief IDs, then on merge reinforce linked beliefs or on rejection weaken them. Public’s reconsolidation bridge does similarity-based archive/review suggestions, but the reviewed path has no durable pending-proposal object, no explicit operator merge/reject event, and no confidence side-effects tied to that decision.
- **Why it matters for us**: This is a governance feature, not a search feature. It would give Public a clean way to handle contested or evolving memories where “keep/merge/archive” is too small a decision surface.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 5: Modus couples decay to a **stale-memory quarantine workflow**
- **Source**: `external/internal/vault/facts.go:64-254`; `external/internal/index/indexer.go:307-364`; `external/internal/index/facts.go:88-145,162-185`; `external/internal/mcp/vault.go:854-897`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520,797-801`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts:75-76`
- **What it does**: Modus decays fact confidence, then `memory_archive_stale` marks low-confidence facts `archived=true` with `archived_at`; the fact indexer maps archived facts to `IsActive=0`, and fact search excludes inactive items. Public supports archived state and opt-in `trackAccess`, but in the reviewed code those are not tied into an automatic “low confidence -> quarantine from retrieval” sweep.
- **Why it matters for us**: Public already has richer decay and archive concepts, but the missing piece is a policy-driven cleanup loop that turns decay into an operational retrieval boundary. That would reduce search clutter without deleting history.
- **Recommendation**: NEW FEATURE
- **Impact**: medium

### Finding 6: Modus has a lightweight **entity/belief atlas** on top of markdown, not just generic memories
- **Source**: `external/internal/vault/entities.go:12-100`; `external/internal/vault/beliefs.go:31-127`; `external/internal/markdown/parser.go:78-96`; `external/internal/mcp/vault.go:381-469`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-220`
- **What it does**: Modus separates `atlas/entities/` and `atlas/beliefs/`, resolves `[[wiki-links]]`, exposes entity pages with resolved links, lists beliefs by subject, and applies predicate-specific confidence decay to belief records. In the Public memory surface reviewed, the exposed tools are retrieval/context/save/trigger oriented; I did not find a first-class entity/belief object model or wiki-link-resolved atlas layer.
- **Why it matters for us**: Public already has causal links and code-graph structure, but this would add a human-readable “world model” layer for stable actors, systems, products, or concepts that many memories refer to indirectly.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- `external/internal/mcp/memory.go`
- `external/internal/mcp/vault.go`
- `external/internal/mcp/learnings.go`
- `external/internal/learnings/learnings.go`
- `external/internal/vault/facts.go`
- `external/internal/vault/beliefs.go`
- `external/internal/vault/prs.go`
- `external/internal/vault/trust.go`
- `external/internal/vault/entities.go`
- `external/internal/index/facts.go`
- `external/internal/index/indexer.go`
- `external/internal/markdown/parser.go`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Assessment
- New information ratio: 0.84
- Questions addressed: whether Modus has net-new memory-adjacent features beyond BM25/FSRS; whether it includes an operational lessons layer; whether it has autonomy/governance controls; whether decay feeds an actual quarantine/archive loop; whether it exposes a structured entity/belief model.
- Questions answered: yes — the strongest unconsidered gaps are an operational learnings plane, lesson promotion/deprecation, trust-stage autonomy gating, proposal-based belief governance, decay-driven stale-memory quarantine, and a lightweight atlas/entity layer.

## Reflection
- What worked: Moving off the already-studied search path and into `learnings`, `trust`, `prs`, `beliefs`, and `entities` surfaced genuinely new capabilities quickly. Comparing those directly against Public’s shadow-only feedback learning and reconsolidation paths made the gaps concrete.
- What did not work: Broad keyword searches in the Public tree were noisy because “learning,” “confidence,” and “archive” appear in many unrelated ranking and mutation paths. The clearest signal came from reading the handler/tool surfaces rather than grep-first scanning.

## Recommended Next Focus
Investigate a system with an explicit **review queue / due-items workflow** and **operator approval inbox**, so the next pass can test whether these new feature ideas need active scheduling and triage primitives, not just storage and mutation rules.


Total usage est:        1 Premium request
API time spent:         4m 22s
Total session time:     4m 39s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.2m in, 14.4k out, 1.0m cached, 7.4k reasoning (Est. 1 Premium request)

---

# Iteration 012: GAP ANALYSIS - REFACTORS

## Focus
GAP ANALYSIS - REFACTORS: Should we refactor or change direction on any existing features? Architecture changes?

## Findings
### Finding 1: **Reject Modus’s fuzzy result-cache architecture; it is the wrong cache contract for Public**
- **Source**: `external/internal/index/cache.go:10-17,41-80,83-119`; `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts:56-61,98-106,143-181,242-257`
- **What it does**: Modus caches full result sets with two tiers: exact query hash and fuzzy reuse when Jaccard similarity between token sets is `>= 0.6`. Its “LRU” bookkeeping is weaker than advertised: `counter` advances only on `put`, while `get` rewrites `hits` without advancing recency, so eviction is really write-recency-biased rather than true read-recency-aware. Public’s cache is a canonical-args SHA256 key with TTL, explicit invalidation by tool, and generation bumps to prevent stale reuse after mutations.
- **Why it matters for us**: Public’s retrieval result is shaped by many dynamic knobs — scope, archived filtering, session boost, causal boost, rerank, quality thresholds, trace flags, progressive disclosure. Modus-style fuzzy query reuse would blur those dimensions and risk replaying the wrong scored payload for a merely similar query. This is a direction change we should avoid.
- **Recommendation**: reject
- **Impact**: high

### Finding 2: **Do not simplify deep-mode query expansion to Modus’s “union then cap” flow**
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-331`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:347-389,616-779`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:6-20`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts:28-64`
- **What it does**: Modus expands a query into up to 6 strings, runs searches per variant, deduplicates by `path` or `subject|predicate`, then truncates to the requested limit. There is no cross-variant score reconciliation, branch attribution, or post-merge rerank contract; early variants effectively dominate. Public’s deep mode already runs variant branches with timeout protection and `Promise.allSettled`, merges rows by canonical id while preserving branch/source scores, then applies fusion and rerank under a deterministic ranking contract.
- **Why it matters for us**: Modus’s expansion prompt is interesting, but its merge semantics are weaker than Public’s current pipeline. If we refactor our deep retrieval path toward a simpler variant union, we would lose ranking fidelity and auditability. The right direction is to keep all expansion strategies inside Stage 1 and let Stage 2/3 own scoring.
- **Recommendation**: reject
- **Impact**: high

### Finding 3: **Adopt a stricter “one retrieval core” rule; Modus’s duplicated fact search paths are a warning**
- **Source**: `external/internal/index/indexer.go:117-130,287-370`; `external/internal/index/facts.go:23-145`; `external/internal/vault/facts.go:290-337`; `external/internal/mcp/vault.go:271-343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771-809`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:118-164`
- **What it does**: Modus has at least two fact-retrieval contracts for the same memory objects: a general document BM25 index filtered to `memory/facts/`, and a separate in-memory `factStore` with its own term index, confidence boost, recency boost, and active-flag handling. `memory_search` uses `Index.SearchFacts`, while `Vault.SearchFacts` uses a different path and fallback behavior. Public, by contrast, pushes `memory_search` through a single pipeline config and result contract.
- **Why it matters for us**: This is the clearest architecture lesson from Modus for refactor planning: do not create a second “special fast path” retrieval engine for a subset of memories. If Public adds more specialized search entry points, they should stay thin wrappers over the existing pipeline instead of growing parallel ranking rules that will drift.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: **Refactor Public’s access-writeback out of Stage 2 fusion before expanding it further**
- **Source**: `external/internal/mcp/vault.go:311-317`; `external/internal/vault/facts.go:160-216`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520,771-807`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:840-883,920-940,1194-1207`
- **What it does**: Modus treats every returned fact as a successful recall and asynchronously reinforces it straight from the MCP handler. Public is safer — `trackAccess` is explicit and off by default — but the actual FSRS strengthening write-back still runs inside Stage 2 fusion, alongside scoring signals like session boost, causal boost, and intent weighting.
- **Why it matters for us**: Comparing the two systems makes the boundary problem obvious: search-time mutation is a different concern from ranking. Public should keep the explicit opt-in policy, but move the write-back/testing-effect path into a post-retrieval access-effects module so Stage 2 stays purely about score construction. That will make future FSRS/review-policy work easier without creeping side effects into ranking logic.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 5: **If we want Modus-style “connected docs” ergonomics, add them as a formatter over existing graph evidence, not as a new index**
- **Source**: `external/internal/index/crossref.go:154-214,248-281`; `external/internal/mcp/vault.go:75-101,899-925`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts:223-257`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:947-995`
- **What it does**: Modus appends a lightweight connected-doc block after primary results using fixed subject/entity/tag weights. Public already computes and exposes graph contribution metadata in the pipeline response, but it does not currently turn that into a first-class “you may also want these linked memories” presentation block.
- **Why it matters for us**: The storage/index part of Modus’s adjacency model is not worth adopting over Public’s causal graph. But the UX layer is reusable: a formatter that emits graph-derived related-memory hints could improve browsing without touching retrieval architecture or inventing another relationship store.
- **Recommendation**: prototype later
- **Impact**: medium

## Sources Consulted
- `phase-research-prompt.md`
- `research/iterations/iteration-010.md`
- `research/iterations/iteration-011.md`
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/index/indexer.go`
- `external/internal/index/facts.go`
- `external/internal/index/crossref.go`
- `external/internal/librarian/search.go`
- `external/internal/vault/facts.go`
- `external/internal/mcp/vault.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`

## Assessment
- New information ratio: 0.79
- Questions addressed: whether Modus’s cache design should influence Public; whether Modus’s query-expansion merge path is architecturally better or worse than Public’s pipeline; whether Modus’s split fact-search surfaces suggest a refactor direction; whether Public’s own FSRS write-back placement should change; whether any part of Modus’s connected-doc UX is worth borrowing without adopting its adjacency index.
- Questions answered: Public should **not** move toward Modus’s fuzzy result cache or union-first expansion flow; Public **should** preserve a single canonical retrieval core and refactor access-writeback out of Stage 2; the only cross-ref idea worth carrying forward is a response-layer related-doc hint built from existing graph evidence rather than a new storage/index model.

## Reflection
- What worked: Tracing the exact merge and cache code paths exposed the architectural differences much faster than feature-by-feature comparison. Looking at where side effects happen — handler, retrieval core, or post-processing — was the key lens for this iteration.
- What did not work: The phase folder does not currently have the reducer-owned deep-research state files, so there was no machine-maintained “next focus” packet to resume from. I had to anchor this pass on the prior iteration markdown plus direct source tracing instead.

## Recommended Next Focus
Compare against a system with an explicit **review queue / due-items scheduler** and **approval inbox**, so the next pass can test whether Public’s strongest missing piece is not retrieval anymore, but the operator workflow that sits on top of retrieval, reinforcement, and governance.


Total usage est:        1 Premium request
API time spent:         5m 6s
Total session time:     5m 29s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.9m in, 16.9k out, 1.7m cached, 8.8k reasoning (Est. 1 Premium request)

---

# Iteration 013: GAP ANALYSIS - PARADIGM SHIFTS

## Focus
GAP ANALYSIS - PARADIGM SHIFTS: What paradigm shifts does this system suggest for our memory architecture?

## Findings

### Finding 1: **Modus treats memory as a multi-plane operating system, not one indexed corpus**
- **Source**: `external/internal/learnings/learnings.go:1-10,23-64,121-208,299-328`; `external/internal/vault/prs.go:10-46`; `external/internal/vault/missions.go:14-39,89-111,211-256`; `external/internal/index/crossref.go:9-16,154-214,221-245`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-45,48-188,275-399,471-499`
- **What it does**: Modus splits memory into distinct planes with different lifecycles: `brain/learnings` for cross-model operational lessons, `atlas/prs` for proposal artifacts, `missions/*` for execution state, and `atlas/*` for entity/belief knowledge. `crossref.go` then federates those planes into one neighborhood query without flattening them into one storage contract. Public’s exposed surface is broader in raw tooling, but it is still centered on one generic memory substrate plus adjunct mutation, checkpoint, causal, and pre/postflight tools.
- **Why it matters for us**: This is the clearest paradigm shift in the codebase. The next architecture step for Public is likely **not another retrieval feature**, but separating “retrieved knowledge,” “operational lessons,” “governed assertions,” and “execution state” into first-class memory planes with different mutation and surfacing rules.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: **Governance should include an explicit autonomy stage, not just access control**
- **Source**: `external/internal/vault/trust.go:11-25,28-95`; `external/internal/mcp/vault.go:607-635`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:275-399,402-466`
- **What it does**: Modus persists a trust stage in `atlas/trust.md`, defaults to stage 1 when absent, forbids self-promotion in code comments and tool descriptions, and appends human-readable transition history on every stage change. The stage changes runtime posture: Inform, Recommend, or Act. Public’s governance surface is strong on tenant/shared-space access and safe mutation boundaries, but that is **scope governance**, not **autonomy governance**.
- **Why it matters for us**: Public currently decides “can this caller touch this memory?” but not “may the system autonomously execute, only recommend, or only observe?” Modus suggests adding an operator-owned autonomy layer above mutation tools, reconsolidation actions, and future approval workflows.
- **Recommendation**: **prototype later**
- **Impact**: **high**

### Finding 3: **High-risk memory changes should pass through a durable proposal inbox**
- **Source**: `external/internal/vault/prs.go:10-110`; `external/internal/mcp/vault.go:681-777`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:64-131`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:291-322`
- **What it does**: Modus opens persistent PR artifacts with `target_type`, `target_id`, `reasoning`, `confidence`, and `linked_belief_ids`; merge/reject is explicit and feeds back into belief confidence. Public already has the raw ingredients for this pattern: assistive reconsolidation classifies borderline pairs and emits review-tier recommendations, but today those remain console warnings while actual changes still happen via direct `memory_update` / `memory_delete` / bulk-delete flows.
- **Why it matters for us**: This is an immediately actionable shift. Public does not need Modus’s whole atlas model to benefit; it can turn its existing shadow recommendations into durable proposal rows with accept/reject outcomes, creating a real operator inbox for reconsolidation, supersession, and possibly promotion/deprecation decisions.
- **Recommendation**: **adopt now**
- **Impact**: **high**

### Finding 4: **Decay should drive visible workflow states, not stay buried inside scoring and cleanup**
- **Source**: `external/internal/vault/facts.go:160-254`; `external/internal/vault/beliefs.go:31-126`; `external/internal/learnings/learnings.go:229-277`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:840-883,1194-1207`; `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:4-20,33-41,175-247`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:721-777`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:357-445,670-684`
- **What it does**: In Modus, recall and review outcomes change named artifact state directly: facts reinforce and later archive, beliefs decay/reinforce/weaken, learnings deprecate by zeroing confidence, and PR outcomes feed back into linked beliefs. Public has equivalent mechanics scattered across hidden layers: `trackAccess` is opt-in and off by default, FSRS write-back lives inside Stage 2, batch learning is explicitly shadow-only, negative validation adjusts scoring confidence, and archival runs as a background subsystem.
- **Why it matters for us**: The shift is from “decay as ranking math” to “decay as memory operations workflow.” Public already has most primitives, but not a first-class stale/review/promote/deprecate surface that operators can inspect and triage. That missing workflow layer is now a bigger gap than the decay math itself.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 5: **Memory can become an execution-readiness layer, not just a recall layer**
- **Source**: `external/internal/vault/missions.go:153-256`; `external/internal/mcp/vault.go:781-845`; `external/internal/index/crossref.go:154-214,263-278`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:471-499`
- **What it does**: Modus stores missions as markdown objects with typed dependencies (`blocks`, `informs`, `enhances`), cycle checks, satisfaction status, and `CanStart` readiness logic surfaced through MCP. Connected search can then return missions alongside facts, beliefs, and learnings. Public’s nearest analogue is `task_preflight` / `task_postflight`, but those record epistemic telemetry after or before work; they do not create a live ready/blocked execution graph.
- **Why it matters for us**: This suggests a second major shift: memory should not only help answer questions; it should also expose what work is blocked, what is ready, and what knowledge dependencies remain unresolved. That would pair naturally with the proposal inbox and review queue ideas.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

## Sources Consulted
- `external/internal/learnings/learnings.go`
- `external/internal/mcp/learnings.go`
- `external/internal/mcp/vault.go`
- `external/internal/vault/trust.go`
- `external/internal/vault/prs.go`
- `external/internal/vault/beliefs.go`
- `external/internal/vault/entities.go`
- `external/internal/vault/missions.go`
- `external/internal/vault/facts.go`
- `external/internal/index/crossref.go`
- `external/internal/index/facts.go`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/fsrs.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`

## Assessment
- New information ratio: **0.76**
- Questions addressed: whether Modus’s non-search modules imply a different memory architecture; whether Public’s largest remaining gaps are workflow/governance rather than retrieval; whether trust stages, PRs, and missions form a true control plane; whether decay should become an operator-visible state machine.
- Questions answered: **yes** — the strongest paradigm shifts are **multi-plane memory architecture, autonomy-stage governance, proposal-first mutation, decay-as-workflow, and readiness-aware mission state**. The delta is now more about **memory operations architecture** than about BM25 or FSRS formulas.

## Reflection
- What worked: Tracing `internal/mcp/vault.go` back into `trust.go`, `prs.go`, `missions.go`, and `learnings.go` made the architectural boundaries obvious very quickly. The cleanest comparison came from matching those tool surfaces against Public’s authoritative MCP schemas and mutation handlers.
- What did not work: Looking at beliefs/entities in isolation was too low-level; the paradigm shift only became visible once the operator-facing surfaces were included. Search-only comparisons would have understated the real gap.

## Recommended Next Focus
Investigate a system with an explicit **review queue / due-items scheduler / approval inbox** so the next pass can test whether Public now needs a dedicated triage layer above proposals, decay signals, and mission readiness rather than more retrieval improvements.


Total usage est:        1 Premium request
API time spent:         4m 27s
Total session time:     4m 52s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.3m in, 15.5k out, 2.2m cached, 7.9k reasoning (Est. 1 Premium request)

---

# Iteration 014: DEEP DIVE - STRONGEST PATTERN

## Focus
DEEP DIVE - STRONGEST PATTERN: Go deep on the single most impactful pattern from this system. Trace it end-to-end.

## Findings

### Finding 1: **Modus’s strongest pattern is a durable proposal inbox implemented as first-class markdown artifacts**
- **Source**: `external/internal/vault/prs.go:10-46`; `external/internal/vault/vault.go:48-65`; `external/internal/markdown/writer.go:10-52`; `external/internal/markdown/parser.go:13-76`
- **What it does**: Modus persists each risky knowledge change as `atlas/prs/<slug>.md`, not as transient handler state. `OpenPR()` writes frontmatter with `title`, `opened_by`, `status=open`, `opened_at`, `target_type`, `target_id`, `confidence`, and `linked_belief_ids`, plus a markdown reasoning body. The generic vault read/write path means PRs use the same plain-file contract as the rest of the system: human-readable, git-diffable, and operator-editable.
- **Why it matters for us**: This is the most valuable pattern in the repo because it turns memory mutation review into a durable operating surface instead of console output or ephemeral response metadata. Public already has strong mutation safety, but not a persistent review object that can be listed, approved, rejected, or resumed later.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: **The PR lifecycle is decision-tracking plus belief feedback, not target mutation execution**
- **Source**: `external/internal/vault/prs.go:49-110`; `external/internal/vault/beliefs.go:91-126`; `external/internal/mcp/vault.go:681-777`; `external/internal/vault/prs.go:32-37`; `external/internal/mcp/vault.go:686-700`
- **What it does**: On merge, Modus marks the PR `merged`, stamps `closed_at`/`closed_by`, and reinforces each `linked_belief_id`; on reject, it marks `rejected`, stores `rejection_reason`, and weakens linked beliefs. Critically, `target_type` and `target_id` are recorded when the PR is opened, but the merge/reject path does **not** apply any mutation to that target object. The proposal is an evidence/governance artifact whose outcome feeds confidence updates into beliefs.
- **Why it matters for us**: This is the key end-to-end nuance. The best part of the pattern is not “PRs for memories”; it is “operator decisions become durable signals that strengthen or weaken the system’s confidence model.” Public should copy that feedback loop, not assume proposals themselves are the mutation engine.
- **Recommendation**: **adopt now**
- **Impact**: **high**

### Finding 3: **The trust-stage model is real state, but in current code it is governance metadata, not enforced runtime gating**
- **Source**: `external/internal/vault/trust.go:11-95`; `external/internal/mcp/vault.go:607-635`; search showed no other `GetTrustStage` call sites in `external/internal/**/*.go`
- **What it does**: Modus persists `atlas/trust.md`, defaults to stage 1 when absent, records transition history in the markdown body, and exposes MCP tools to get/set the stage with labels `Inform`, `Recommend`, and `Act`. But the current code does not use that stage to gate `atlas_open_pr`, `atlas_merge_pr`, `atlas_reject_pr`, or other mutation paths.
- **Why it matters for us**: This corrects the earlier high-level read: the trust system is an operator-owned posture marker, but not yet a hard control plane. For Public, copying it verbatim would add a policy label without safety value unless it is wired into mutation and approval paths.
- **Recommendation**: **reject**
- **Impact**: **medium**

### Finding 4: **This proposal workflow is not part of Modus’s default memory-only surface; it lives in the broader vault control plane**
- **Source**: `external/internal/mcp/memory.go:7-38`; `external/internal/mcp/vault.go:15-18,605-777`; `external/README.md:172-208,191-208`
- **What it does**: `RegisterMemoryTools()` trims the exposed toolset down to 11 search/memory tools and removes the PR/trust tools from that profile. The proposal inbox exists in the broader vault tool registration, not in the lean memory profile described in the README.
- **Why it matters for us**: That makes the pattern more credible, not less: even Modus treats it as an advanced control-plane layer above retrieval, not as core search behavior. Public should do the same and avoid entangling proposal workflow with the canonical retrieval interface.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 5: **Public has auditability and advisory signals, but still lacks the durable triage object that makes Modus’s pattern useful**
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:417-435`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts:84-110,183-186,342-343`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts:201-223`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts:91-139`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:141-180`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-776`; `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:108-179,233-274`
- **What it does**: Public’s review-tier reconsolidation only creates an `assistiveRecommendation` payload and console warning; it is forwarded in the `memory_save` response but not persisted as a reviewable object. Meanwhile `memory_update`, `memory_delete`, and `memory_bulk_delete` act directly, protected by transactionality, checkpoints, and the append-only mutation ledger. `memory_validate` updates confidence, negative-feedback state, and promotion eligibility, but only emits hints like “consider updating or deleting.”
- **Why it matters for us**: Public’s gap is no longer retrieval math or mutation safety. The missing layer is a persistent operator inbox that can hold borderline reconsolidation, supersession, promotion, or deprecation proposals and then feed accept/reject outcomes back into existing confidence and feedback systems.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

## Sources Consulted
- `external/internal/vault/prs.go`
- `external/internal/vault/trust.go`
- `external/internal/vault/beliefs.go`
- `external/internal/vault/facts.go`
- `external/internal/vault/vault.go`
- `external/internal/mcp/vault.go`
- `external/internal/mcp/memory.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Assessment
- New information ratio: **0.74**
- Questions addressed: whether the proposal/approval pattern is actually implemented end-to-end; whether trust stages are enforced or only descriptive; whether PR merge/reject mutates target objects or only linked confidence; whether Public already has an equivalent durable review surface; whether this pattern belongs in core retrieval or in an operator control plane.
- Questions answered: the strongest Modus pattern is a **durable proposal inbox**, but its real value is **decision persistence plus belief-feedback wiring**; the trust-stage layer is **not enforced** in current code; PR resolution **does not mutate targets**; Public has **checkpoints, ledgers, and feedback**, but still lacks the **persistent triage object** that would turn those pieces into an operator workflow.

## Reflection
- What worked: Tracing `prs.go` through `mcp/vault.go`, then checking whether `target_type`/`target_id` are ever consumed elsewhere, exposed the true shape of the pattern quickly. Comparing that against Public’s reconsolidation response path and direct mutation handlers made the gap very concrete.
- What did not work: The earlier architectural framing overstated the trust-stage mechanism; once I searched for real call sites, it became clear that trust is currently metadata, not enforcement. Treating the README tool list as the whole product would also have hidden that the proposal workflow lives in the broader vault profile, not the default memory surface.

## Recommended Next Focus
Compare against a system with a **real due-items / review-queue / approval-inbox scheduler**, so the next iteration can test how Public should operationalize proposal triage once retrieval, confidence, and mutation safety are already in place.


Total usage est:        1 Premium request
API time spent:         3m 40s
Total session time:     3m 57s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.1m in, 10.3k out, 952.3k cached, 4.4k reasoning (Est. 1 Premium request)

---

# Iteration 015: DEEP DIVE - SECOND PATTERN

## Focus
DEEP DIVE - SECOND PATTERN: Go deep on the second most impactful pattern. Full implementation analysis.

## Findings

### Finding 1: **Modus treats successful recall as a default write-on-read event**
- **Source**: `external/internal/mcp/vault.go:273-343`; `external/internal/vault/facts.go:160-217`; `external/internal/index/indexer.go:307-364`
- **What it does**: `memory_search` merges fact hits across librarian-expanded queries, then asynchronously calls `go v.ReinforceFact(f.ID)` for every returned fact. `MemFact.ID` is the relative markdown path loaded at index time, so the search result is directly wired back to the underlying file. `ReinforceFact()` then raises confidence toward `0.99`, grows `stability`, lowers `difficulty`, stamps `last_accessed`, and increments `access_count`.
- **Why it matters for us**: This is the core of Modus’s second pattern: recall is not just ranking telemetry, it is a lifecycle event that mutates memory state by default. Public already has the underlying primitive, but keeps it deliberately opt-in via `trackAccess` rather than making every search a write.
- **Recommendation**: **prototype later**
- **Impact**: **high**

### Finding 2: **Modus exposes decay, reinforcement, and archival as an operator-facing memory hygiene loop**
- **Source**: `external/internal/vault/facts.go:18-30`; `external/internal/vault/facts.go:64-157`; `external/internal/vault/facts.go:219-264`; `external/internal/mcp/vault.go:854-897`
- **What it does**: Fact decay is a first-class maintenance action (`memory_decay_facts`), archival is a first-class cleanup action (`memory_archive_stale`), and reinforcement is both implicit (`memory_search`) and explicit (`memory_reinforce`). The FSRS state lives in markdown frontmatter (`confidence`, `stability`, `difficulty`, `last_accessed`, `access_count`, `archived`), so operators can inspect and edit the lifecycle directly.
- **Why it matters for us**: Public has stronger internals than Modus here, but not the same explicit operating surface. Our FSRS, archival, and feedback systems mostly live behind retrieval and storage handlers; Modus shows the value of turning memory freshness into a visible maintenance workflow.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 3: **The visible “stale” surface in Modus is useful, but its actual scheduling heuristic is much cruder than it looks**
- **Source**: `external/internal/index/facts.go:53-79`; `external/internal/index/facts.go:187-229`; `external/internal/mcp/vault.go:319-331`; `external/internal/vault/facts.go:140-157`
- **What it does**: Search ranking uses simple age buckets from `createdAt` (`hot`, `warm`, `recent`, `cold`), and result rendering appends `⚠ >30d old` / `⚠ >90d old` warnings from `StalenessWarning()`. Those warnings are based on creation age, not `last_accessed`, `stability`, `difficulty`, or a real due-review timestamp. Archival is then driven by a confidence threshold, not a due queue.
- **Why it matters for us**: The surface is good; the heuristic is not. Public should not copy this exact implementation because our FSRS stack can already express a more truthful notion of “due,” “cold,” or “review-needed” than crude age bands.
- **Recommendation**: **reject**
- **Impact**: **medium**

### Finding 4: **Public already has richer decay/governance primitives than Modus, but they are intentionally hidden behind safer defaults**
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202-203`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:840-883`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1194-1207`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-795`; `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts:13-20`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:192-200`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts:361-404`
- **What it does**: Public’s `memory_search` defaults `trackAccess=false`, and Stage 2 only applies FSRS strengthening when that opt-in flag is set. `memory_validate` records positive/negative usefulness, adaptive signals, auto-promotion, learned feedback, and ground-truth selection. Batch learning is shadow-only, and archival uses protected tiers plus age/access/confidence filters. In other words, Public already has the mechanics Modus needs several explicit tools to approximate.
- **Why it matters for us**: The gap is no longer retrieval math or decay correctness. The gap is that Public’s stronger primitives are distributed across internals and safety rails, while Modus packages a simpler subset as an obvious operator workflow.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 5: **The best transfer is a thin review/due-items layer on top of Public’s existing systems—not Modus’s exact fact model**
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:471-479`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:733-776`; `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:64-79`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:237-454`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-795`
- **What it does**: Public already exposes session readiness (`session_health`, `session_bootstrap`) and task-learning analytics (`task_preflight`, `task_postflight`), but not a comparable operator surface for memory hygiene. The right abstraction is a dedicated queue for memories that are due for review, repeatedly unhelpful, promotion-eligible, or archival candidates—fed by existing FSRS, validation, and archival signals.
- **Why it matters for us**: This is the concrete implementation delta. Modus proves the value of an operator-visible control plane, but Public should build that plane from its own stronger state model rather than regress to Modus’s simpler markdown-fact lifecycle.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

## Sources Consulted
- `external/internal/mcp/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/index/facts.go`
- `external/internal/index/indexer.go`
- `external/internal/index/crossref.go`
- `external/internal/vault/missions.go`
- `external/internal/vault/trust.go`
- `external/internal/vault/prs.go`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/batch-learning.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Assessment
- New information ratio: **0.81**
- Questions addressed: whether the second pattern is really a decay/review workflow rather than another retrieval feature; whether Modus’s recall loop mutates real source files or only in-memory state; whether its stale signals are true FSRS due-state or just age heuristics; whether Public already has equivalent primitives hidden behind safer defaults; whether the real gap is workflow/control-plane rather than memory math.
- Questions answered: **yes** — the second most impactful pattern is **operator-visible decay workflow**. Modus’s distinctive move is making recall, decay, stale detection, and archival obvious MCP actions. Public already has stronger FSRS/governance machinery, so the actionable gap is a **review/due-items surface**, not algorithm replacement.

## Reflection
- What worked: Tracing `memory_search` into `ReinforceFact()` and then confirming that `MemFact.ID` is the indexed relative markdown path made the write-on-read loop unambiguous. Comparing that directly against Public’s `trackAccess` gate and Stage 2 testing-effect path exposed the real difference very quickly.
- What did not work: Looking only at the FSRS formulas would have been misleading. The important difference is not that Modus has “better FSRS”; it is that Modus turns freshness into an operator workflow, while Public mostly keeps equivalent signals inside retrieval, validation, and background maintenance layers.

## Recommended Next Focus
Investigate a system with a real **due-items scheduler / review queue / approval inbox** so the next pass can determine how Public should surface review-needed, stale, promotion-eligible, and archival-candidate memories without inheriting Modus’s coarse age-based heuristics.


Total usage est:        1 Premium request
API time spent:         3m 36s
Total session time:     3m 55s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.3m in, 12.4k out, 944.6k cached, 5.7k reasoning (Est. 1 Premium request)

---

# Iteration 016: EDGE CASES & FAILURE MODES

## Focus
EDGE CASES & FAILURE MODES: How does this system handle errors, corruption, migration, scaling? Lessons for us.

## Findings

### Finding 1: **Modus’s “degraded mode” is not actually survivable**
- **Source**: `external/cmd/modus-memory/main.go:77-90`; `external/internal/mcp/vault.go:21-53,273-317,915-917`; `external/internal/vault/facts.go:290-337`
- **What it does**: Startup logs `index build failed` and claims it can continue, but `main.go` still calls `idx.DocCount()` even when `index.Build()` returned `nil, err`. The MCP layer also assumes an index exists: `memory_search` calls `v.Index.SearchFacts(...)` directly, while only the lower-level `Vault.SearchFacts()` method contains a no-index fallback. `vault_connected` also just returns `"Index not loaded."` rather than recovering.
- **Why it matters for us**: This is a brittle failure contract: one bad scan can turn “start degraded” into a startup panic or nil-deref path. Public is already stricter here: DB refresh/rebind is mutexed, refuses empty-db drift, and returns explicit degraded/error responses instead of pretending recovery succeeded.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 2: **Parser corruption is silently normalized instead of surfaced**
- **Source**: `external/internal/markdown/parser.go:98-159,161-186`; `external/cmd/modus-memory/doctor.go:33-106`
- **What it does**: If YAML frontmatter fails to parse, `Parse()` silently treats the frontmatter block as body text and returns success. `ScanDir()` also suppresses filesystem walk errors and parse failures (`return nil // skip errors`, `return nil // skip unparseable files`). Then `doctor` operates on that already-sanitized view, so malformed frontmatter is reduced to softer symptoms like “documents without frontmatter” or missing fact fields rather than a hard corruption report.
- **Why it matters for us**: Modus optimizes for “keep indexing something,” but the cost is silent data quality loss and weaker operator trust. Public’s `memory_save` path is materially safer: preflight, dry-run, validation, and atomic save all give us a better place to reject malformed state before it becomes indexed ambiguity.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 3: **The plain-file write and migration path is non-atomic, partial, and lossy**
- **Source**: `external/internal/markdown/writer.go:10-52`; `external/cmd/modus-memory/import_khoj.go:48-58,64-77,94-97,131-133,181-223,236-280,345-369`
- **What it does**: Core writes go straight to the final path with `os.WriteFile`; Khoj import uses `os.Create` directly, continues after per-file failures, skips already-existing files, truncates imported context over 2000 chars, deduplicates context by the first 200 chars, and falls back to `time.Now()` when timestamps cannot be parsed. There is no temp-file promotion, rollback, checkpoint, manifest, or resume journal.
- **Why it matters for us**: This is fine for a lightweight local tool, but it is the wrong mutation model for governed or high-value memory. Public already has the stronger pattern: checkpointed bulk operations, rollback-aware atomic saves, and post-insert cleanup when metadata application fails. If we ever add importer workflows or operator batch jobs, they should follow Public’s mutation model, not Modus’s write-through importer.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 4: **A timestamp edge case can disable the intended memory lifecycle**
- **Source**: `external/internal/vault/facts.go:118-157,339-375`; `external/internal/index/facts.go:53-79,187-229`; `external/cmd/modus-memory/import_khoj.go:266-280`
- **What it does**: `StoreFact()` writes `created: "now"` as a literal string. But recency boosting, tier labeling, staleness warnings, and decay all expect parseable dates or RFC3339 timestamps. That means newly stored facts can miss age-aware behavior until some later successful recall writes `last_accessed`. Separately, Khoj import converts bad timestamps to the current wall clock, which silently rewrites chronology.
- **Why it matters for us**: This is a good example of how lightweight markdown persistence can quietly undermine lifecycle logic if timestamps are not normalized at write time. Public should keep lifecycle timestamps machine-parseable and validation-gated at ingest; our current preflight/save architecture already gives us the right enforcement point.
- **Recommendation**: **reject**
- **Impact**: **medium**

### Finding 5: **Scaling is “rebuild everything in memory,” with a few latent concurrency footguns**
- **Source**: `external/internal/index/indexer.go:65-149,307-371`; `external/internal/index/bm25.go:103-181`; `external/internal/index/cache.go:27-119`; `external/internal/mcp/server.go:88-111`; `external/internal/mcp/vault.go:311-317`
- **What it does**: Every build/open rescans markdown, reparses documents, rebuilds BM25, cross-refs, and the fact store entirely in RAM. Prefix fallback linearly scans the full term map. `memory_search` launches a goroutine per returned fact for asynchronous reinforcement writes. The cache uses `RWMutex`, but `get()` mutates `hits` while holding only `RLock`, which is unsafe if request handling ever becomes concurrent. The current stdio loop is serial, so that race is partly masked today.
- **Why it matters for us**: Modus’s architecture is intentionally simple, but it does not transfer well to Public’s larger, longer-lived memory surface. Public’s incremental DB-backed indexing, guarded rebind path, and post-restore rebuild hooks are the right direction; the Modus lesson is mostly where the scaling cliffs are, not a backend we should copy.
- **Recommendation**: **reject**
- **Impact**: **high**

### Finding 6: **The strongest transferable pattern here is the operator-facing “doctor,” not Modus’s repair depth**
- **Source**: `external/cmd/modus-memory/doctor.go:13-241`; `external/cmd/modus-memory/main.go:130-147`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222-499`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479-520`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:43-180`
- **What it does**: Modus gives operators a very readable `health`/`doctor` surface: counts, contradictions, duplicates, empty docs, directory distribution. But it is mostly advisory; it does not pair diagnosis with durable rollback or strong repair flows. Public already has deeper repair machinery—auto-repair for FTS drift, orphan-edge cleanup, restore barriers, checkpoint restore index rebuilds—but the surface is more technical and less “single-screen triage.”
- **Why it matters for us**: The net-new idea is not Modus’s recovery engine; it is the usability of a compact operator diagnostic surface. Public could benefit from a friendlier “doctor summary” layered over existing `memory_health`, checkpoints, and mutation ledgers.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **medium**

## Sources Consulted
- `external/cmd/modus-memory/main.go`
- `external/cmd/modus-memory/doctor.go`
- `external/cmd/modus-memory/import_khoj.go`
- `external/internal/index/indexer.go`
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/index/facts.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/internal/markdown/json.go`
- `external/internal/librarian/client.go`
- `external/internal/librarian/search.go`
- `external/internal/mcp/server.go`
- `external/internal/mcp/memory.go`
- `external/internal/mcp/vault.go`
- `external/internal/vault/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/vault/prs.go`
- `external/internal/vault/trust.go`
- `.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`

## Assessment
- New information ratio: **0.86**
- Questions addressed: whether Modus really survives index/build failure; how malformed markdown is handled; whether migration/import is resumable or rollback-safe; whether lifecycle timestamps can corrupt decay behavior; what scaling/concurrency cliffs exist; whether health tooling is diagnostic or reparative.
- Questions answered: Modus is **much more best-effort than durable**. It prefers silent fallback, partial progress, and operator cleanup over transactional guarantees. Public already has stronger recovery primitives; the main missing transfer is a more humane **doctor-style summary surface**, not Modus’s storage/mutation model.

## Reflection
- What worked: Tracing failure paths from `main.go` into `index.Build`, then following parser behavior into `doctor`, exposed where marketing-friendly “it just keeps working” turns into silent loss or startup fragility. Comparing those paths directly against Public’s atomic save, checkpoint, and health handlers made the tradeoff very clear.
- What did not work: README and migration copy overstate recovery. Static analysis can validate that diagnostics exist and that writes are non-atomic, but it cannot prove the advertised performance numbers or how often the latent cache race would manifest in practice.

## Recommended Next Focus
Study a system with a **real resumable ingest/repair journal or maintenance queue**—something that combines operator-visible triage with durable rollback/retry—so the next iteration can test how Public should expose batch recovery workflows without inheriting Modus’s silent-fallback behavior.


Total usage est:        1 Premium request
API time spent:         4m 5s
Total session time:     4m 23s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.4m in, 16.1k out, 1.3m cached, 8.0k reasoning (Est. 1 Premium request)

---

# Iteration 017: INTEGRATION FEASIBILITY

## Focus
INTEGRATION FEASIBILITY: For top 5 adoption candidates, how hard would they be to integrate into Spec Kit Memory?

## Findings

### Finding 1: **Medium integration** — operator-visible review queue is the highest-value Modus pattern
- **Source**: `external/internal/mcp/vault.go:273-343,856-897`; `external/internal/index/facts.go:187-229`; `external/internal/vault/facts.go:64-157,160-264`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:125-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:467-509,2339-2343`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-579,840-870`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42-320`
- **What it does**: Modus makes the full decay loop visible: `memory_search` reinforces recalled facts, `memory_decay_facts` runs the sweep, `memory_archive_stale` archives low-confidence facts, `memory_reinforce` lets an operator review a fact directly, and result formatting exposes tier/staleness cues. Public already has the harder backend pieces: FSRS columns in `memory_index`, canonical review math, strengthening-on-access, and archival machinery. The missing piece is a first-class due/review queue.
- **Why it matters for us**: This is the clearest “control-plane gap.” Integration is **medium**, not high, because Public does **not** need new decay math or new storage; it needs a new MCP surface that turns existing `stability`, `difficulty`, `last_review`, `review_count`, archival state, and promotion signals into an actionable inbox.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: **Low integration** — a doctor-style summary fits Public almost immediately
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `external/cmd/modus-memory/main.go:130-147`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:343-520`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479-540`
- **What it does**: Modus’s `doctor` composes one-screen triage from existing index state: counts, missing fact fields, duplicate subject/predicate pairs, contradictions, empty docs, and directory distribution. Public already has deeper primitives than Modus—health diagnostics, FTS repair, orphan-edge cleanup, checkpoint restore, and post-restore index rebuilds—but they are exposed as richer technical envelopes rather than a compact operator summary.
- **Why it matters for us**: Integration is **low** because the data is already there. This is mostly formatter/reporting work: a friendlier “doctor” mode layered on `memory_health`, not a new subsystem.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 3: **Medium integration** — Modus-style lexical expansion can reuse Public’s deep-mode hooks
- **Source**: `external/internal/librarian/search.go:10-53`; `external/internal/mcp/vault.go:21-58,280-331`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:4-18,88-176,200-260`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
- **What it does**: Modus expands one query into 3-5 lexical variants, runs retrieval per variant, and merges deduped results. Public already has three nearby hooks: corpus-grounded LLM reformulation, deep-mode query decomposition, and graph-expanded fallback queries. So integration is not about inventing expansion; it is about deciding whether a **lighter lexical-only branch** should run before or beside the current deep pipeline.
- **Why it matters for us**: Integration is **medium** because the insertion points already exist, but the value is incremental, not foundational. Public must avoid duplicating its current deep-mode expansion stack or adding noisy variant fan-out across vector, FTS, BM25, and graph lanes.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 4: **Medium integration** — connected-doc hints are feasible, but should stay explanatory first
- **Source**: `external/internal/index/crossref.go:9-214`; `external/internal/index/indexer.go:113-136,277-289`; `external/internal/mcp/vault.go:75-101,901-925`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:520-700`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1474-1503`
- **What it does**: Modus builds an in-memory metadata adjacency map from subject/tag/entity overlap, weights subject/entity/tag at `3/2/1`, and appends “connected” documents that were not in the main ranked set. Public already has stronger structural enrichment—causal-neighbor boost, neighbor injection, and co-activation spreading—but those are graph-driven, not simple frontmatter co-membership summaries.
- **Why it matters for us**: Integration is **medium**. Public should not replace causal machinery with Modus’s simpler adjacency model, but it could add a lightweight explanation layer: “related by shared subject/tag/entity” as an appendix or secondary lane. That would improve operator comprehension without perturbing the main ranking path too aggressively.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 5: **Low integration** — Public can expose explicit review/reinforce actions without enabling global write-on-read
- **Source**: `external/internal/mcp/vault.go:311-317,885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,198-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-579,840-870`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:517-520,771-802`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:42-320`
- **What it does**: Modus exposes both automatic reinforcement on recall and an explicit `memory_reinforce` tool. Public already has the underlying grade model (`AGAIN/HARD/GOOD/EASY`), review processing, and strengthening-on-access logic, but keeps write-back behind `trackAccess=false` and has no first-class `memory_reinforce`/`memory_review` tool in the current schema set.
- **Why it matters for us**: Integration is **low** because the math and columns already exist. The work is mostly safe API design: expose explicit review as a deliberate operator action, instead of flipping Public toward Modus-style default write-on-read.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

## Sources Consulted
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/librarian/search.go`
- `external/internal/index/indexer.go`
- `external/internal/index/facts.go`
- `external/internal/index/crossref.go`
- `external/internal/vault/facts.go`
- `external/internal/mcp/vault.go`
- `external/internal/mcp/memory.go`
- `external/cmd/modus-memory/doctor.go`
- `external/cmd/modus-memory/main.go`
- `external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/sqlite-fts.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/archival-manager.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`

## Assessment
- **New information ratio**: **0.79**
- **Questions addressed**: which Modus ideas already have insertion points in Public; whether the missing work is backend math or operator surface; which candidates are low/medium integration versus truly invasive; whether connected-result hints overlap with Public graph features; whether librarian expansion is still meaningful given Public deep-mode reformulation.
- **Questions answered**: the best Modus transfers are mostly **control-plane additions**. Public already has stronger FSRS storage, lexical lanes, repair flows, and graph enrichment than Modus; the main feasible gains are a **review queue**, an **explicit review action**, and a **doctor-style summary**, with lexical expansion and connected-doc hints as bounded prototypes rather than architectural changes.

## Reflection
- **What worked**: Tracing Modus’s MCP handlers back into the underlying index and fact implementations made the integration story much clearer than comparing algorithms alone. The key move was matching each Modus surface against an existing Public insertion point—`processReview`, `strengthenOnAccess`, `memory_health`, deep-mode reformulation, and causal boost.
- **What did not work**: README speed and simplicity claims do not help much with feasibility ranking. The important question here was not “is Modus fast?” but “does Public already have the hard part?”, and that answer came from code paths, not marketing copy.

## Recommended Next Focus
Evaluate a concrete Public design for `memory_due` + `memory_review`: one tool that lists due/stale/promotion-eligible/archival-candidate memories, and one tool that applies graded FSRS review updates explicitly, then compare whether a metadata-based “connected docs” appendix improves operator trust beyond current causal/contiguity enrichment.


Total usage est:        1 Premium request
API time spent:         6m 32s
Total session time:     7m 7s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.8m in, 18.6k out, 2.6m cached, 9.0k reasoning (Est. 1 Premium request)

---

# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

## Findings

### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
- **Source**: `external/internal/mcp/vault.go:280-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2319-2343`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:512-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1194-1202`
- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: Doctor summary risk — a friendlier `doctor` surface can hide the repair semantics that currently keep Public safe
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:343-530`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479-540`
- **What it does**: Modus’s `doctor` is compact: build the index, count issues, print warnings. Public’s health path is richer: degraded/healthy distinction, confirmation-gated auto-repair, FTS/vector/orphan cleanup, and partial-restore error reporting.
- **Why it matters for us**: The risk is lossy compression. If Public promotes a one-screen doctor summary as the main surface, operators may miss whether a problem is merely informational, auto-repairable, or a partial restore failure with rollback details.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 3: Lexical expansion risk — copying Modus’s librarian directly would stack another weak branch onto Public’s already-expanded deep pipeline
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:280-299`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:8-18,88-125,148-175`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
- **What it does**: Modus asks an LLM for 3-5 keyword variants with no corpus grounding and searches each variant. Public already has deep-mode decomposition, corpus-grounded reformulation, and graph-expanded fallback queries.
- **Why it matters for us**: In Modus this is lightweight; in Public it risks branch explosion, extra latency, and noisier recall. Ungrounded lexical variants can duplicate or fight with stronger grounded/vector lanes, especially when reranking and graph fallback already exist.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 4: Connected-doc hint risk — metadata adjacency is useful as explanation, but risky as a scoring signal
- **Source**: `external/internal/index/crossref.go:41-214`; `external/internal/index/indexer.go:110-136,277-289`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:532-674`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1474-1503`
- **What it does**: Modus builds an in-memory adjacency map from subject/tag/entity overlap with weights `3/2/1`, using lightweight matching. Public already has causal traversal, neighbor injection, and co-activation enrichment.
- **Why it matters for us**: The risk is precision loss. Substring entity matches and coarse tag overlap can create false positives or duplicate relationships already expressed by Public’s graph layers. If those hints affect ranking, they can pollute better hybrid results.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 5: Explicit review action risk — a success-only `memory_reinforce` would undercut Public’s richer FSRS vocabulary
- **Source**: `external/internal/vault/facts.go:188-217`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-47,65-71,138-155,198-215`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:164-169`
- **What it does**: Modus exposes a success-only reinforce action: stability up, difficulty slightly down, confidence nudged toward 1.0, access count incremented. Public’s scheduler already supports `AGAIN/HARD/GOOD/EASY`, but the exposed read path only offers opt-in GOOD-style strengthening through `trackAccess`.
- **Why it matters for us**: If Public copies Modus literally, every explicit review starts looking like successful recall. That biases histories upward and makes any later due/review queue less trustworthy because “hard” or failed recall events have no first-class path.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

## Sources Consulted
- `research/iterations/iteration-017.md`
- `external/internal/mcp/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/index/facts.go`
- `external/internal/librarian/search.go`
- `external/internal/index/crossref.go`
- `external/internal/index/indexer.go`
- `external/cmd/modus-memory/doctor.go`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`

## Assessment
- New information ratio: **0.74**
- Questions addressed: what breaks if the five iteration-017 candidates are adopted; where Modus’s simpler assumptions conflict with Public’s stronger runtime; which ideas are safe only as control-plane additions rather than ranking-path changes.
- Questions answered: the main risks are semantic and operational, not algorithmic. The safest transfers remain a doctor-style summary and an explicit review action, but only if they preserve Public’s existing repair semantics and graded FSRS model. The riskiest transfer is unbounded lexical expansion. Connected-doc hints are safest as explanation, and a review queue needs an explicit due-state contract before it can be trusted.

## Reflection
- What worked: Tracing each iteration-017 candidate into both systems exposed the seams that matter: persisted schema vs computed due state, grounded vs ungrounded expansion, and graph-backed vs metadata-only relatedness.
- What did not work: Modus rarely encodes these risks as explicit guardrails because its whole design assumes a smaller lexical-only system. The strongest risk evidence came from mismatch against Public, not from explicit failure handling inside Modus.

## Recommended Next Focus
Define the mitigation contract: decide whether `memory_due` needs a persisted `next_review_at` field or a deterministic derived rule, constrain lexical-only expansion to weak-result recovery instead of always-on deep mode, and test connected-docs as an appendix/explanation lane rather than a score-bearing retrieval lane.


Total usage est:        1 Premium request
API time spent:         5m 34s
Total session time:     5m 53s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.2m in, 15.3k out, 1.0m cached, 6.3k reasoning (Est. 1 Premium request)

---

# Iteration 019: PRIORITY RANKING

## Focus
PRIORITY RANKING: Rank ALL findings by impact x feasibility. Create a concrete adoption roadmap.

## Findings

### Finding 1: Rank 1 (20/25) — explicit `memory_review` is the first thing Public should ship
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:529-585,840-877,1194-1202`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:300-316`
- **What it does**: Modus exposes an explicit `memory_reinforce` operator action on top of its FSRS state. Public already has the underlying pieces: graded review math (`AGAIN/HARD/GOOD/EASY`), `processReview()` with `nextReviewDate`, and opt-in strengthening-on-access. The current exposed adjacent surface is `memory_validate`, which records only `wasUseful` feedback and does not let an operator issue a graded FSRS review.
- **Why it matters for us**: This is the highest impact x feasibility transfer because it closes the clearest control-plane gap without inventing new storage or changing retrieval architecture. It also de-risks the bigger `memory_due` idea: until Public has a first-class graded review action, any future review queue would have no trustworthy way to record hard recalls, lapses, and easy wins distinctly.
- **Recommendation**: **adopt now**
- **Impact**: **high**

### Finding 2: Rank 2 (15/25, tie-broken ahead) — a doctor-style summary should ship in the same tranche as `memory_review`
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-273`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:378-443,455-555`
- **What it does**: Modus turns index and vault diagnostics into a one-screen operator summary. Public already has the deeper machinery: `memory_health` with confirmation-gated auto-repair, FTS rebuild, orphan-edge cleanup, orphan-vector cleanup, and degraded/healthy reporting. The gap is presentation, not backend capability.
- **Why it matters for us**: This is nearly pure formatter work and improves operator trust immediately. It ranks ahead of `memory_due` despite lower raw strategic upside because it is safer, independent, and can ship without any FSRS contract decisions.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 3: Rank 3 (15/25, tie-broken behind) — `memory_due` is the biggest strategic win, but only after a due-state contract is fixed
- **Source**: `external/internal/mcp/vault.go:273-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:467-473,1813-1888`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:505-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1194-1202`
- **What it does**: Modus exposes the full review lifecycle visibly: search recall, explicit reinforce, decay, and archive all operate over the same fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and `last_accessed`, and `processReview()` computes `nextReviewDate`, but no persisted `next_review_at` column exists and write-on-read remains opt-in through `trackAccess=false`.
- **Why it matters for us**: This is the most valuable missing product surface, but it should not ship first. If Public adds a queue before deciding whether “due” is persisted (`next_review_at`) or deterministically derived from `stability + last_review`, operators will see a review inbox that can drift from actual FSRS behavior.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 4: Rank 4 (9/25) — connected-doc hints are worth prototyping only as an explanation lane
- **Source**: `external/internal/index/crossref.go:9-214,248-260`; `external/internal/index/indexer.go:109-136,277-285`; `external/internal/mcp/vault.go:75-101,901-924`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:520-700`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1474-1503`
- **What it does**: Modus builds a lightweight adjacency layer from subject/tag/entity overlap and appends “connected docs not in results above” as an extra hint surface. Public already has stronger graph-backed enrichment via causal boosts, neighbor injection, and co-activation, but not a simple metadata-derived explanation appendix.
- **Why it matters for us**: The feasible transfer is not ranking logic; it is result explanation. That makes this a useful prototype for operator trust, but not a top roadmap item. If it affects scoring too early, it risks duplicating or diluting better graph evidence already present in Public.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 5: Rank 5 (6/25) — Modus-style librarian expansion belongs last, and only as weak-result recovery
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:280-299`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:4-18,88-176`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
- **What it does**: Modus uses an LLM to emit 3-5 lexical variants, then merges deduped fact results across those variants. Public already has deep-mode reformulation, corpus-seeded variants, and graph-expanded recovery paths; its remaining gap is not “can expand queries,” but “when is an extra lexical branch worth the latency and noise.”
- **Why it matters for us**: This has the weakest impact x feasibility score because it overlaps the most with existing Public machinery and carries the highest risk of branch explosion. The only credible adoption path is a bounded fallback for weak-result cases, never an always-on copy of Modus’s librarian path.
- **Recommendation**: **prototype later**
- **Impact**: **low**

### Finding 6: The concrete roadmap should follow dependency order, not just raw desirability
- **Source**: `external/internal/mcp/memory.go:7-15`; `external/internal/mcp/vault.go:75-101,273-317,885-924`; `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:197-215`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-316`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:378-555`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:467-473,1813-1888`
- **What it does**: The ranking resolves into a four-phase roadmap: **Phase 1** ship `memory_review` plus a doctor-style summary; **Phase 2** define the authoritative due-state contract and then add `memory_due`; **Phase 3** pilot connected-doc explanations as a non-scoring appendix; **Phase 4** run a feature-flagged lexical-expansion experiment only on weak-result fallback paths.
- **Why it matters for us**: This sequence matches the real code dependencies. Phase 1 uses existing Public primitives with low integration risk. Phase 2 is the first place schema and lifecycle semantics matter. Phases 3-4 stay explicitly out of the main ranking path until they prove incremental value over current causal and deep-mode behavior.
- **Recommendation**: **adopt now**
- **Impact**: **high**

## Sources Consulted
- `research/iterations/iteration-016.md`
- `research/iterations/iteration-017.md`
- `research/iterations/iteration-018.md`
- `external/internal/mcp/memory.go`
- `external/internal/mcp/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/index/facts.go`
- `external/internal/index/crossref.go`
- `external/internal/index/indexer.go`
- `external/internal/librarian/search.go`
- `external/cmd/modus-memory/doctor.go`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`

## Assessment
- New information ratio: **0.67**
- Questions addressed: which candidate should ship first; how to break the tie between high-impact and low-risk candidates; whether `memory_due` is blocked by missing persisted due-state; whether connected-docs and lexical expansion belong on the mainline roadmap or only in prototype lanes.
- Questions answered: the correct roadmap is **not** “build the biggest feature first.” Public should ship **`memory_review` first**, pair it with a **doctor-style summary**, then formalize the due-state contract before building **`memory_due`**. Connected-doc hints are worth testing only as explanation, and lexical expansion should be the final, tightly bounded experiment.

## Reflection
- What worked: Re-ranking the iteration-017 candidates against actual Public surface gaps clarified that the bottleneck is operator actionability, not search math. Checking tool exposure (`memory_health`, `memory_validate`, `trackAccess`) against Modus’s explicit MCP tools made the roadmap dependency chain much clearer than impact scoring alone.
- What did not work: The phase packet does not currently contain the reducer-owned deep-research state files, so the ranking had to be reconstructed from prior iteration reports plus source evidence instead of reading a canonical strategy/dashboard packet. That did not block the analysis, but it reduced the amount of loop metadata available for convergence-style bookkeeping.

## Recommended Next Focus
Finalize iteration 020 as a closing synthesis: specify the Public API shape for `memory_review` and `memory_due`, decide whether due state is persisted or derived, and define success metrics for the two later prototypes (connected-doc appendix and weak-result lexical fallback).


Total usage est:        1 Premium request
API time spent:         4m 34s
Total session time:     4m 52s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.2m in, 17.2k out, 1.1m cached, 5.9k reasoning (Est. 1 Premium request)

---

# Iteration 020: FINAL SYNTHESIS

## Focus
FINAL SYNTHESIS: Classify EVERY finding as adopt-now / prototype-later / new-feature-needed / reject. Executive summary.

**Executive summary:** Borrow **Modus’s operator surfaces**, not its weaker retrieval shortcuts. **Adopt now:** graded `memory_review`, doctor-style summary, and a strict one-retrieval-core rule. **New feature needed:** authoritative `memory_due` and a durable proposal inbox. **Prototype later:** connected-doc appendix, weak-result lexical fallback, and content-level contradiction linting. **Reject:** fuzzy result-cache reuse, permissive markdown ingestion, default write-on-read as policy, and unenforced trust-stage metadata.

## Findings

### Finding 1: Explicit graded review is the best immediate transfer
- **Source**: `external/internal/mcp/vault.go:885-897`; `external/internal/vault/facts.go:160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,65-71,197-215`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:298-316`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-790`
- **What it does**: Modus exposes `memory_reinforce`, but only as a success-only reinforce action. Public already has the stronger primitive: graded FSRS review (`AGAIN/HARD/GOOD/EASY`) plus computed `nextReviewDate`, yet the exposed adjacent tool is only `memory_validate(wasUseful)`, which adjusts confidence rather than recording a real review event.
- **Why it matters for us**: This closes the clearest control-plane gap without changing retrieval architecture. It also makes any later review queue trustworthy because review history would record hard recalls and lapses, not only “useful / not useful.”
- **Recommendation**: adopt now
- **Impact**: high

### Finding 2: A doctor-style summary should ship beside review
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:378-594`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-273`
- **What it does**: Modus’s `doctor` turns vault health into a one-screen operator report. Public already has deeper health and repair machinery—FTS rebuild, orphan cleanup, degraded/healthy state, confirmation-gated repair—but exposes it as a richer technical envelope.
- **Why it matters for us**: This is mostly presentation work, not backend work. It improves operator trust immediately while preserving Public’s stronger repair semantics underneath.
- **Recommendation**: adopt now
- **Impact**: medium

### Finding 3: Keep one retrieval core; Modus’s split fact-search paths are a warning
- **Source**: `external/internal/index/indexer.go:287-340`; `external/internal/vault/facts.go:290-337`; `external/internal/mcp/vault.go:273-317`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771-809`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts:1-32`
- **What it does**: Modus has multiple fact-search contracts for the same memory objects: `Index.SearchFacts`, a separate in-memory `factStore`, and `Vault.SearchFacts` fallback behavior. Public routes `memory_search` through one pipeline contract via `executePipeline`.
- **Why it matters for us**: This is the strongest architectural lesson from Modus’s weaknesses. Public should keep specialized search surfaces as thin wrappers over the canonical pipeline instead of growing parallel ranking rules that will drift.
- **Recommendation**: adopt now
- **Impact**: high

### Finding 4: `memory_due` is real product value, but it needs an authoritative due-state contract first
- **Source**: `external/internal/mcp/vault.go:273-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520`
- **What it does**: Modus visibly ties search recall, reinforce, decay, and archive to one fact state. Public already stores `stability`, `difficulty`, `last_review`, `review_count`, and opt-in access effects, and computes `nextReviewDate`, but does not expose an operator-facing due queue.
- **Why it matters for us**: This is the biggest missing workflow surface in Public. But it should not ship until “due” is defined as either persisted state (`next_review_at`) or a deterministic derivation from existing FSRS fields.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 5: Durable proposal inboxes are the best non-retrieval idea Modus has
- **Source**: `external/internal/vault/prs.go:10-118`; `external/internal/mcp/vault.go:681-777`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:417-452`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:681-790`
- **What it does**: Modus persists risky knowledge changes as markdown PR artifacts, then merge/reject outcomes reinforce or weaken linked beliefs. Public already produces advisory reconsolidation recommendations and confidence feedback, but the recommendation is transient and not stored as a durable review object.
- **Why it matters for us**: Public’s next gap is operator workflow, not mutation safety. A persistent inbox for reconsolidation, supersession, promotion, and deprecation proposals would let existing confidence and mutation systems work as a real review loop.
- **Recommendation**: NEW FEATURE
- **Impact**: high

### Finding 6: Connected-doc hints are worth prototyping only as an explanation appendix
- **Source**: `external/internal/index/crossref.go:154-214,248-280`; `external/internal/mcp/vault.go:75-101,901-924`
- **What it does**: Modus builds lightweight subject/entity/tag adjacency and appends connected docs that did not make the main ranked list. The weighting is simple and fixed (`subject 3`, `entity 2`, `tag 1`).
- **Why it matters for us**: The transferable part is explanation, not ranking. Public can test a “related memories” appendix without diluting stronger graph-backed or hybrid scoring paths.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 7: Lexical-only expansion belongs only in weak-result recovery
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:28-58,280-299`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:525-529,771-809`
- **What it does**: Modus asks the Librarian for 3-5 keyword variants, searches each, deduplicates, and caps results. It is lightweight, but ungrounded and union-first.
- **Why it matters for us**: Public already has a more complex retrieval pipeline, so copying this as a mainline branch would mostly add noise and latency. The only credible transfer is a tightly bounded fallback when hybrid retrieval is weak.
- **Recommendation**: prototype later
- **Impact**: low

### Finding 8: Content-level contradiction and duplicate-fact linting is still worth a prototype
- **Source**: `external/cmd/modus-memory/doctor.go:42-158`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:455-555`
- **What it does**: Modus’s `doctor` explicitly flags missing `subject`/`predicate`, duplicate `subject+predicate` pairs, and contradictory values for the same pair. Public’s current health surface is stronger on infrastructure integrity than on fact-content linting.
- **Why it matters for us**: This complements Public’s existing infra health checks instead of replacing them. It is one of the few Modus hygiene ideas that adds net-new value.
- **Recommendation**: prototype later
- **Impact**: medium

### Finding 9: Reject Modus’s fuzzy Jaccard result-cache contract
- **Source**: `external/internal/index/cache.go:10-17,41-119`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:502-529,718-755`
- **What it does**: Modus reuses cached result sets on exact hash hits or Jaccard-similar query term sets. Public’s search surface has too many scoring knobs—scope, archived filtering, session/causal boost, rerank, quality thresholds, trace/profile flags—for fuzzy query reuse to be safe.
- **Why it matters for us**: This is the wrong cache contract for Public. Similar text is not enough to guarantee equivalent retrieval intent or scoring context.
- **Recommendation**: reject
- **Impact**: high

### Finding 10: Reject Modus’s permissive markdown parse/write contract
- **Source**: `external/internal/markdown/parser.go:98-159,161-186`; `external/internal/markdown/writer.go:10-52`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:220-220`
- **What it does**: Modus treats malformed YAML as body, skips parse failures during scans, and writes markdown directly with minimal validation. That is good for a personal vault, but it optimizes for permissiveness over authoritative ingestion.
- **Why it matters for us**: Public’s memory layer is intentionally more governed. Regressing to Modus’s permissive storage contract would weaken memory integrity for little gain.
- **Recommendation**: reject
- **Impact**: high

### Finding 11: Reject default write-on-read as Public’s default policy
- **Source**: `external/internal/mcp/vault.go:311-317`; `external/internal/vault/facts.go:188-217`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:519-520,797-802`
- **What it does**: Modus treats every returned fact as a successful recall and asynchronously reinforces it. Public already supports access effects, but keeps them explicit with `trackAccess=false` by default.
- **Why it matters for us**: Public’s graded FSRS model is stronger than Modus’s success-only reinforce loop. Default write-on-read would blur retrieval and review, inflate successful-recall history, and make future due-state less trustworthy.
- **Recommendation**: reject
- **Impact**: high

### Finding 12: Reject trust-stage metadata unless it becomes real gating
- **Source**: `external/internal/vault/trust.go:11-82`; `external/internal/mcp/vault.go:610-635,681-777`; repo search on `external/internal/**/*.go` shows trust-stage calls only in trust read/write surfaces
- **What it does**: Modus persists trust stage and exposes get/set tools, but current code does not use that state to gate PR or other mutation tools. It is posture metadata, not enforced runtime policy.
- **Why it matters for us**: Public should not copy symbolic governance. If autonomy stages are added, they must actually gate review, proposal, or mutation flows.
- **Recommendation**: reject
- **Impact**: medium

## Sources Consulted
- `external/internal/index/bm25.go`
- `external/internal/index/cache.go`
- `external/internal/index/crossref.go`
- `external/internal/index/facts.go`
- `external/internal/index/indexer.go`
- `external/internal/librarian/search.go`
- `external/internal/markdown/parser.go`
- `external/internal/markdown/writer.go`
- `external/internal/mcp/memory.go`
- `external/internal/mcp/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/vault/prs.go`
- `external/internal/vault/trust.go`
- `external/internal/vault/missions.go`
- `external/internal/learnings/learnings.go`
- `external/internal/vault/vault.go`
- `external/cmd/modus-memory/doctor.go`
- `external/README.md`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`
- `research/iterations/iteration-010.md`
- `research/iterations/iteration-012.md`
- `research/iterations/iteration-013.md`
- `research/iterations/iteration-014.md`
- `research/iterations/iteration-015.md`
- `research/iterations/iteration-017.md`
- `research/iterations/iteration-018.md`
- `research/iterations/iteration-019.md`

## Assessment
- New information ratio: 0.39
- Questions addressed: which Modus patterns still survive final scrutiny; which ones are operator-surface wins versus retrieval regressions; whether broader control-plane ideas like PRs and trust stages hold up in code; what the final adopt/prototype/reject map should be.
- Questions answered: Public should **not** become “Modus with hybrid search.” It should keep its stronger hybrid/governed core, **ship review + doctor first**, then add **due-state and proposal workflow** as real product surfaces, while rejecting Modus’s fuzzy caching, permissive markdown semantics, and default write-on-read policy.

## Reflection
- What worked: The best synthesis came from tracing every promising Modus surface back to its actual state mutation path, then comparing that against the concrete Public MCP surface. That separated “good operator UX” from “unsafe simplification.”
- What did not work: Modus’s README value proposition is directionally right, but most of the final classification turned on source-level details the README does not encode—especially duplicate retrieval paths, success-only reinforce semantics, and the non-enforced trust-stage model.

## Recommended Next Focus
Turn this synthesis into implementation design: define the Public `memory_review` API first, add a doctor-style formatter over `memory_health`, then write the due-state ADR (`persisted next_review_at` vs deterministic derivation) before scoping `memory_due` and the proposal inbox.


Total usage est:        1 Premium request
API time spent:         4m 14s
Total session time:     4m 32s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.3m in, 14.8k out, 1.1m cached, 6.4k reasoning (Est. 1 Premium request)

---

