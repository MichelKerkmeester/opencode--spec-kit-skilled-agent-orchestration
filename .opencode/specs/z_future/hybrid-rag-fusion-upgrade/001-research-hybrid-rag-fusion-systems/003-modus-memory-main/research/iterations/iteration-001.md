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
