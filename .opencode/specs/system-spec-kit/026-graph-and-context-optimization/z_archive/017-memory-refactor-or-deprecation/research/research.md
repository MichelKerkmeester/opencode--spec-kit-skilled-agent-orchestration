# Memory Refactor vs Deprecation Research

## Executive Summary

The current Spec Kit Memory system is not valueless, but its strongest value is narrower than the current architecture assumes. The real win is packet-scoped continuity retrieval for session-shaped queries and a machine-readable metadata layer for provenance, deduplication, and future graph-style relationships. The weakest part is the heavy narrative memory document itself: large parts of `CONTINUE SESSION`, `PROJECT STATE SNAPSHOT`, `IMPLEMENTATION GUIDE`, `OVERVIEW`, `DETAILED CHANGES`, and `DECISIONS` repeat material that already belongs in `tasks.md`, `implementation-summary.md`, `decision-record.md`, and `handover.md` (`.opencode/specs/system-spec-kit/021-spec-kit-phase-system/memory/20-02-26_18-04__spec-kit-phase-system.md:95-257`, `.opencode/specs/system-spec-kit/021-spec-kit-phase-system/implementation-summary.md:33-84`, `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/010-search-retrieval-quality-fixes/memory/31-03-26_18-45__completed-all-6-search-retrieval-quality-fixes.md:94-229`, `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/010-search-retrieval-quality-fixes/implementation-summary.md:31-79`).

The operational story is also shaky. `memory_search` hard-fails on cache misses when the embedding model is not ready after 30 seconds, `session_resume` depends on `memory_context` for its first sub-call, and `session_bootstrap` wraps that same dependency chain (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:763-768`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409-434`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168-199`). Combined with the previously documented 562 generator-quality findings in phase 005 and the fact that the indexed corpus is already dominated by spec docs rather than memory docs, the best path is not "keep as-is" and not "delete everything." The best path is to move canonical narrative into spec docs, keep only a thin continuity layer, and treat episodic memory saves as exceptions rather than the default (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-release-alignment/005-memory-deep-quality-investigation/spec.md:62-80`, `.opencode/skill/system-spec-kit/mcp_server/database/context-index.sqlite [queried 2026-04-11]: research=538, plan=374, tasks=320, checklist=307, implementation_summary=300, spec=296, memory=180, decision_record=165, handover=8`).

## Q1. What does the current memory system actually do?

1. Save path:
   `generate-context.ts` takes structured JSON, resolves an authoritative spec folder, then runs `runWorkflow(...)` to generate a memory file under `<spec-folder>/memory/` (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:51-83`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:550-571`).
2. File shape:
   The template emits a large narrative wrapper plus a large YAML metadata block, including trigger phrases, causal links, dedup fields, decay fields, key topics, and file lists (`.opencode/skill/system-spec-kit/templates/context_template.md:301-342`, `.opencode/skill/system-spec-kit/templates/context_template.md:398-520`).
3. MCP ingestion:
   `memory_save` is no longer a thin "index this file" helper. It runs preflight, template-contract checks, spec-doc health, sufficiency checks, dedup, embedding generation, quality gates, prediction-error arbitration, reconsolidation, post-insert enrichment, lineage, causal edges, and governance logic (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:12-25`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:27-107`).
4. Retrieval:
   `memory_context` is the L1 orchestration surface and routes into `handleMemorySearch` and `handleMemoryMatchTriggers`, while also doing intent classification and code-graph routing (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:15-21`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:60-63`).
5. Session continuity:
   `session_resume` starts by calling `memory_context({ input: "resume previous work continue session", mode: "resume", profile: "resume" })`, then adds code-graph and CocoIndex state. `session_bootstrap` wraps `session_resume` plus `session_health` (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409-469`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168-199`).

Assessment:
The system currently does two different jobs at once:

- It acts like a narrative session journal.
- It acts like a retrieval/indexing substrate for continuity, provenance, and ranking.

The second job is useful. The first job is where most redundancy and quality drift lives.

## Q2. Are the memories themselves useful?

Sampled memories show three patterns:

1. Useful but bloated:
   The large Hybrid RAG sprint memory captures session-shaped phrasing and resume context well, but most of its narrative overlaps packet docs and still contains pending placeholders like "description pending" (`.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/27-02-26_19-03__sprint-1-3-impl-27-agents.md:119-251`).
2. Redundant and noisier than the canonical summary:
   The phase-system memory repeats packet state, resume steps, and implementation summary content, but with truncation markers and lower signal than the packet's own implementation summary (`.opencode/specs/system-spec-kit/021-spec-kit-phase-system/memory/20-02-26_18-04__spec-kit-phase-system.md:95-257`, `.opencode/specs/system-spec-kit/021-spec-kit-phase-system/implementation-summary.md:33-84`).
3. Sometimes the only narrative left:
   The `016-release-alignment` root memory points to canonical root docs that do not exist at that folder level, so the memory is acting as the only narrative artifact there even though its own provenance fields are empty (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-release-alignment/memory/10-04-26_17-09__new-phase-inside-016-release-alignment-for.md:34-47`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-release-alignment/memory/10-04-26_17-09__new-phase-inside-016-release-alignment-for.md:114-170`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-release-alignment/.DS_Store`).

The phase-005 investigation is the bigger warning sign. Its baseline documents 562 findings across 16 defect classes, including empty causal links, noisy n-gram triggers, broken provenance, git-count mismatches, and title corruption (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-release-alignment/005-memory-deep-quality-investigation/spec.md:62-80`).

Assessment:

- Yes, some memories are useful for exact "what was I just doing?" recovery.
- No, the average narrative memory is not strong enough to justify the current default-save architecture.
- The saved content is more useful as a retrieval hint layer than as a canonical document layer.

## Q3. How redundant is memory with spec kit docs?

High-overlap sections:

- `CONTINUE SESSION` overlaps `handover.md`, `tasks.md`, and the recovery-oriented parts of `implementation-summary.md`.
- `PROJECT STATE SNAPSHOT` overlaps `tasks.md`, `checklist.md`, and current packet metadata.
- `IMPLEMENTATION GUIDE`, `OVERVIEW`, and `DETAILED CHANGES` overlap `implementation-summary.md`, `plan.md`, and `research/research.md`.
- `DECISIONS` overlaps `decision-record.md`.
- `RECOVERY HINTS` is mostly template boilerplate, not packet-specific knowledge (`.opencode/skill/system-spec-kit/templates/context_template.md:301-342`).

Lower-overlap sections:

- `MEMORY METADATA`
- `PREFLIGHT BASELINE`
- `POSTFLIGHT LEARNING DELTA`

But those lower-overlap sections are mostly machine data, not high-value human-readable context (`.opencode/skill/system-spec-kit/templates/context_template.md:398-520`).

Assessment:

- Narrative overlap is high.
- Unique content is mostly metadata, not prose.
- The overlap becomes worst when the packet already has a clean `implementation-summary.md` and `decision-record.md`.

## Q4. Does retrieval on memories actually work?

### Method

I attempted both local handler execution and corpus-level fallback testing.

- Live local handler path:
  - `handleMemorySearch(...)` hit the runtime guard that waits 30 seconds for embeddings and then errors if the model is still unavailable (`.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:763-768`).
  - `handleSessionResume(...)` and `handleSessionBootstrap(...)` therefore inherit memory-path fragility because they route through `memory_context` first (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409-434`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168-199`).
- Fallback comparison:
  - I ran 10 realistic resume-style queries directly against the indexed SQLite FTS corpus.
  - I compared `document_type='memory'` against spec-doc types (`spec`, `plan`, `tasks`, `checklist`, `implementation_summary`, `decision_record`, `handover`, `research`).

### Result

Memory search is often better for session-shaped or historical phrasing:

- `create prompt command` -> memory clearly better because it found the archived target packet immediately while spec docs surfaced newer but wrong "create" packets.
- `agent lightning deep research phase` -> memory-only side returned the exact target memory while spec docs returned nothing.
- `release alignment new phase` -> memory was better because a root memory exists while root canonical docs do not.

Spec-doc retrieval is better when packet docs exist and are current:

- `search retrieval quality fixes` -> both sides found the target, but spec docs returned `implementation-summary.md`, `tasks.md`, and `checklist.md`, which are more canonical and actionable.
- `esm migration spec kit shared` -> both sides found the right area, but spec docs landed directly on the implementation packet.

Assessment:

- Retrieval value is real.
- The value is strongest for exact resume phrasing, archived work, and gaps where packet docs are incomplete.
- The operational path is too brittle for a system whose main promise is reliable continuity.

## Q5. What are the viable alternative architectures?

See [alternatives-comparison.md](../findings/alternatives-comparison.md). The short version:

1. Best:
   Wiki-style spec doc updates as canonical narrative, with a thin continuity layer retained for handovers, decision snapshots, and machine metadata.
2. Second-best:
   Minimal memory only for critical decisions and handovers.
3. Third-best:
   Full deprecation, but only after replacing the few cases where memory is the only surviving packet narrative.

## Q6. What happens to the existing corpus?

There are three different corpus numbers in play:

- 149 actionable memory files in the phase-004 remediation run across the audited repo scope (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-release-alignment/004-memory-retroactive-alignment/spec.md:50-67`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-release-alignment/004-memory-retroactive-alignment/implementation-summary.md:35-51`).
- 123 current `.md` files under `.opencode/specs/system-spec-kit/**/memory/` in this checkout (local file count run on 2026-04-11).
- 180 `document_type='memory'` rows in the current index across the broader indexed scope (local SQLite query run on 2026-04-11).

Recommendation:

- Do not bulk-convert every memory body into packet docs.
- Freeze old memory files as read-only history.
- Promote only high-value unique material:
  - durable decisions -> `decision-record.md`
  - active next-step continuity -> `handover.md`
  - research findings -> `research/research.md`
- Keep the rest archived and searchable during the transition.

## Q7. What breaks if memory is deprecated?

Primary impact surfaces:

1. `/spec_kit:resume`
   It explicitly prioritizes `session_bootstrap()` / `memory_context(...resume...)` / targeted `memory_search()` as its recovery ladder (`.opencode/command/spec_kit/resume.md:252-359`).
2. `/memory:search` and `/memory:save`
   These are direct user-facing command families around the MCP memory surfaces (`.opencode/command/memory/search.md:771-918`, `.opencode/command/memory/save.md:512-661`).
3. Spec Kit workflow commands:
   `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:complete`, `/spec_kit:deep-research`, `/spec_kit:deep-review` all embed memory retrieval or memory-save steps (`.opencode/command/spec_kit/plan.md:72-309`, `.opencode/command/spec_kit/implement.md:201-205`, `.opencode/command/spec_kit/complete.md:75-421`, `.opencode/command/spec_kit/deep-research.md:68-199`, `.opencode/command/spec_kit/deep-review.md:70-235`).
4. Agent instructions:
   `@context`, `@orchestrate`, `@speckit`, `@deep-research`, and `@ultra-think` all assume memory-first or memory-assisted context loading (`.opencode/agent/context.md:46-164`, `.opencode/agent/orchestrate.md:807-822`, `.opencode/agent/speckit.md:162-172`, `.opencode/agent/deep-research.md:235-242`, `.opencode/agent/ultra-think.md:53-85`).
5. MCP contracts and docs:
   The memory tool family is deeply documented and tested throughout `mcp_server/README.md`, `INSTALL_GUIDE.md`, schemas, and tests.

Assessment:
The migration is very doable, but it is not a one-file change. The largest cost is command/agent contract cleanup, not archive handling.

## Q8. What should we actually do?

### Recommendation

Adopt **Option C as the target architecture**, with **Option B as the retention policy**:

- Canonical narrative belongs in spec docs.
- Memory saves should stop producing heavyweight narrative session journals by default.
- Keep only a thin continuity layer for:
  - `handover.md` style next-step continuity
  - optional decision snapshots when the decision has not yet been promoted into `decision-record.md`
  - machine metadata needed for retrieval, provenance, dedup, and future graph links

### Why this beats the alternatives

1. It preserves the only part of memory that is clearly earning its keep: exact continuity retrieval.
2. It removes the most failure-prone part: redundant, generator-heavy narrative documents.
3. It fits the actual indexed corpus, which is already mostly spec docs rather than memory docs.
4. It aligns the system with current operator behavior, where packet docs are already treated as the source of truth.

## Ranked Alternatives

| Rank | Option | Verdict | Why |
|------|--------|---------|-----|
| 1 | C. Wiki-style spec kit updates | Recommended | Best value-to-complexity ratio if paired with a thin continuity layer |
| 2 | B. Minimal memory | Strong fallback | Simplest safe reduction if in-place spec updates feel too risky for phase 018 |
| 3 | F. Full deprecation | Viable later | Cleanest architecture, but too disruptive until resume and handover replacements are hardened |
| 4 | D. Handover-only | Partial | Good for session end, weak for research/discovery and machine metadata |
| 5 | E. Findings-only | Partial | Works for research, weak for implementation continuity |
| 6 | A. Status quo + fix generator | Not recommended | Highest complexity for the weakest long-term information architecture |

## Phased Migration Plan

1. Phase 018:
   Redefine canonical authority. Shift narrative save responsibilities into `handover.md`, `implementation-summary.md`, `decision-record.md`, and `research/research.md`. Keep old memories read-only.
2. Phase 019:
   Replace default `memory_save` behavior with a thin continuity artifact or metadata-only save. Update `/spec_kit:resume`, `/memory:*`, and agent guidance.
3. Phase 020:
   Decide whether the remaining thin memory layer is permanent or whether the system can move to full deprecation once handover/spec-doc retrieval proves sufficient.

## Open Risks

1. Some root packets currently rely on memory because canonical packet docs are missing or stale.
2. Archived or historical work is easier to retrieve from memory titles than from packet docs today.
3. [I'M UNCERTAIN ABOUT THIS: live production retrieval precision under a healthy embedding runtime may be somewhat better than the local runtime path observed here, because the local handler test environment was degraded.]

