# T007b: Agent Consumption Pre-Analysis

**Scope**: How AI agents currently consume memory search results
**Sources**: `.claude/CLAUDE.md`, `.opencode/agent/*.md`, `.opencode/command/**/*.md`, `.opencode/skill/*/SKILL.md`
**Captured**: 2026-02-27

---

## 1. How `memory_context` Decides What to Search

`memory_context` is the L1 unified entry point. Its routing logic (from `handlers/memory-context.ts`) follows this sequence:

1. **Mode resolution**: If `mode=auto`, the intent classifier runs on the input string. The result maps to a mode:
   - `add_feature`, `refactor`, `security_audit` → `deep` (2000 token budget)
   - `fix_bug`, `understand` → `focused` (1500 token budget)
   - Short inputs (<50 chars) or question-starters (`what/how/where/when/why`) → forced to `focused`
2. **Token pressure override**: If the caller reports high `tokenUsage`, `SPECKIT_PRESSURE_POLICY` may downgrade `deep` → `focused` → `quick`
3. **Multi-query expansion**: In `deep` mode, the input is expanded to multiple query variants via domain vocabulary before scatter-gather search
4. **RRF fusion**: All channel results (vector, BM25, FTS5, graph) are fused using RRF with intent-weighted channel weights from `adaptive-fusion.ts`
5. **Auto-resume injection**: If `SPECKIT_AUTO_RESUME` is enabled and prior session state exists, it's injected into the top of the result set

---

## 2. Top Consumption Patterns (by Frequency)

### Pattern 1 — Gate 1 Trigger Check (Most Frequent)

**Tool**: `memory_match_triggers(prompt)`
**Frequency**: Every new user message (mandated by CLAUDE.md Gate 1)
**Query construction**: The raw user message is passed verbatim as the prompt
**What agents select**: Matching trigger phrases and their parent memory IDs; used to decide whether to proceed or investigate further
**What gets ignored**: Memories with similarity below the trigger threshold; all body content (triggers return metadata + relevance score, not content)

**Source**: `.claude/CLAUDE.md` §2 Gate 1, `.opencode/agent/context.md:132`, `.opencode/command/memory/context.md:352`

---

### Pattern 2 — Session Resume (`mode: "resume"`)

**Tool**: `memory_context({ input: "session state", mode: "resume", specFolder: "<folder>", includeContent: true })`
**Frequency**: At session start when user invokes `/memory:continue` or continuation prompt
**Query construction**: Fixed input of "session state" or topic-scoped variant; anchors `['state', 'next-steps']` frequently appended
**What agents select**: The prior session's task state, unfinished tasks, and next steps. Agents extract the structured state block and re-present it to the user.
**What gets ignored**: Memories from different sessions or spec folders; general knowledge memories that don't have state/next-steps anchors

**Source**: `.opencode/command/memory/continue.md:77-84`, `.opencode/command/spec_kit/resume.md:245-246`, README.md:629

---

### Pattern 3 — Pre-Implementation Context Load

**Tool**: `memory_context({ input: feature_description, mode: "focused", includeContent: true })`
**Frequency**: Before every implementation task (mandated by CLAUDE.md "File modification" workflow)
**Query construction**: The feature/task description is passed as the `input`. Mode is usually `focused` or `auto`. `specFolder` is set when a spec folder is established at Gate 3.
**What agents select**: Prior decisions, existing architecture patterns, related spec documents. Agents read the result to avoid re-solving already-solved problems.
**What gets ignored**: Memories from unrelated spec folders; low-tier (COLD/DORMANT) memories; scratch-type memories (0.6 multiplier deprioritizes them)

**Source**: `.opencode/command/spec_kit/implement.md:197`, `.opencode/command/spec_kit/plan.md:63`, `.opencode/agent/context.md:113`

---

### Pattern 4 — Decision Archaeology (Anchor-based)

**Tool**: `memory_search({ query: topic, anchors: ['decisions', 'rationale'], includeContent: true })`
**Frequency**: During planning phases and spec creation; also when @context agent runs deep investigation
**Query construction**: Topic string + explicit anchors that target decision content. `includeContent: true` is almost always set for this pattern.
**What agents select**: The content of the matched anchor sections (not full memory). Agents extract decision rationale for their spec plan.md or research.md.
**What gets ignored**: Non-anchor content in matched memories (the anchor filter reduces token usage by ~90%)

**Source**: `.opencode/command/spec_kit/plan.md:276`, `.opencode/command/spec_kit/research.md:249,263`, `.opencode/skill/system-spec-kit/SKILL.md:539`

---

### Pattern 5 — @context Deep Investigation

**Tool sequence**: `memory_match_triggers` → `memory_context(deep)` → `memory_search(includeContent)` → `memory_list(specFolder)`
**Frequency**: Every exploration task routed through @context agent
**Query construction**: The topic phrase is passed to each tool in sequence. `memory_context` uses `mode: "deep"`. `memory_search` uses `includeContent: true` with no anchors (full content retrieval).
**What agents select**: All 6 Context Package sections are populated. Agents use the Codebase Findings and Memory Context sections; Pattern Analysis and Recommendation are for the orchestrator.
**What gets ignored**: Results below similarity threshold; duplicate content (session dedup via `enableDedup: true`); memories already surfaced in the Layer 1 phase are not re-included (dedup)

**Source**: `.opencode/agent/context.md:113,153-155`, Layer 3 retrieval strategy

---

### Pattern 6 — Architecture / Spec Discovery (specFolder scoped)

**Tool**: `memory_search({ query: topic, specFolder: "NNN-name" })` or `memory_list({ specFolder: "NNN-name" })`
**Frequency**: During @speckit agent work, @review work, or when spec folder is known
**Query construction**: A conceptual query is combined with a `specFolder` filter. No `includeContent` in the initial pass; `memory_list` is used to enumerate what exists.
**What agents select**: Memory titles and their importance tiers; then selected memories are loaded individually if relevant
**What gets ignored**: Memories in other spec folders; chunk children (default `includeChunks: false` in memory_list)

**Source**: `.opencode/command/memory/manage.md:218`, `.opencode/agent/context.md:155`

---

### Pattern 7 — Constitutional Rule Enforcement

**Tool**: `memory_match_triggers(prompt)` (implicit, always includes constitutional tier)
**Frequency**: Every query (constitutional memories always surface at top of results)
**Query construction**: No special construction; constitutional memories are injected unconditionally at the top of every search result
**What agents select**: Constitutional rules are read and treated as absolute constraints (cannot be overridden by user instructions)
**What gets ignored**: Nothing — constitutional memories are never filtered out by tier, decay, or dedup

**Source**: `.opencode/skill/system-spec-kit/SKILL.md:313,546`, `tool-schemas.ts:64` (`includeConstitutional: true` default)

---

### Pattern 8 — Concept AND Search

**Tool**: `memory_search({ concepts: ["concept1", "concept2"], includeContent: true })`
**Frequency**: Lower frequency; used for cross-cutting queries about relationships between 2-5 concepts
**Query construction**: Concepts array (2-5 strings) replaces query string for AND-semantics matching. All concepts must appear in results.
**What agents select**: Memories that cover the intersection of all provided concepts. Agents use this to find cross-document relationships.
**What gets ignored**: Memories matching only one concept; memories below the joint similarity threshold

**Source**: `.opencode/skill/system-spec-kit/SKILL.md:538`, tool parameter description

---

### Pattern 9 — Git/Session Context Recovery

**Tool**: `memory_search({ query: "git workflow", specFolder: "007-feature-name" })`
**Frequency**: At start of git-related work sessions (sk-git skill)
**Query construction**: Domain-specific phrase ("git workflow", "branch strategy decisions") scoped to a spec folder
**What agents select**: Prior git context, branch naming decisions, workflow choices
**What gets ignored**: Memories outside the spec folder; high-level architecture memories unrelated to git

**Source**: `.opencode/skill/sk-git/SKILL.md:358,361,368`

---

### Pattern 10 — Completion Verification

**Tool**: `memory_search({ query: task_description, anchors: ['state', 'checklist'] })` or `memory_list({ specFolder })`
**Frequency**: After claiming task completion; checklist.md verification
**Query construction**: Anchors target the 'state' section of session memory or checklist items
**What agents select**: The state anchor content to verify completion status; checklist items to mark `[x]` with evidence
**What gets ignored**: General memory content; memories from prior sessions in different contexts

**Source**: `.opencode/command/spec_kit/resume.md:245-252`, CLAUDE.md Completion Verification Rule

---

## 3. Query Construction Patterns

| Pattern                          | Tool                    | Query Form                                          | Parameters                                    |
| -------------------------------- | ----------------------- | --------------------------------------------------- | --------------------------------------------- |
| Gate 1 trigger check             | `memory_match_triggers` | Raw user message verbatim                           | `limit: 3` (default)                          |
| Session resume                   | `memory_context`        | "session state" (fixed) or topic scoped             | `mode: "resume"`, `includeContent: true`, `anchors: ['state', 'next-steps']` |
| Pre-implementation context       | `memory_context`        | Feature/task description                            | `mode: "auto"` or `"focused"`, optional `specFolder` |
| Decision archaeology             | `memory_search`         | Topic string                                        | `anchors: ['decisions', 'rationale']`, `includeContent: true` |
| Deep investigation               | `memory_context`        | Topic phrase                                        | `mode: "deep"`, optional `intent: "understand"` |
| Spec-scoped browse               | `memory_list`           | (no query)                                          | `specFolder: "NNN-name"`, `limit: 20`         |
| Cross-concept AND                | `memory_search`         | (no query, concepts array)                          | `concepts: ["a", "b"]`, `includeContent: true` |
| Anchor extraction                | `memory_search`         | Topic string                                        | `anchors: ['summary']`, `includeContent: true` |
| Constitution enforcement         | any tool                | Any query                                           | `includeConstitutional: true` (default)       |

---

## 4. What Agents Select vs. Ignore From Results

### Selected (used by agents)
- Memory **title** and **spec folder** (always — used to decide relevance before loading content)
- **Trigger phrase matches** (from `memory_match_triggers`) — top 3-5 matches drive Gate 1 decision
- **Anchor content** when `anchors` parameter is specified — only the targeted section is read
- **Importance tier** — constitutional and critical tier memories are always read
- **The top N results** by score (typically N=10 default, sometimes N=3 for fast paths)
- **Decision rationale and architectural patterns** (from decision_record and spec document types)

### Ignored (discarded by agents)
- Results beyond the limit (N+1 and beyond are not read)
- **COLD/DORMANT/ARCHIVED** tier memories (filtered by `minState: "WARM"` default)
- **Chunk children** (`includeChunks: false` default in `memory_list`)
- **Scratch-type memories** (0.6 document type multiplier deprioritizes them; rarely in top results)
- **Session-deduplicated** memories when `enableDedup: true` and `sessionId` is active
- **Low-similarity results** below the system's minimum threshold (~0.2-0.3 typically)
- **Already-returned memories** in multi-turn sessions (dedup ~50% token savings)
- **Body content** when only anchors are needed — `includeContent: false` drops the full text

---

## 5. Identified Gaps and Observations

### 5a. Query Text Quality Varies Widely

Gate 1 passes the raw user message verbatim to `memory_match_triggers`. User messages range from terse commands ("fix the bug") to long paragraphs. The trigger matcher must handle both extremes. For the ground truth query set (T000d), queries should reflect this range — some should be terse/command-like, some conversational.

### 5b. Mode Selection Is Implicit for Most Agents

Most agents use `mode: "auto"` rather than specifying `mode: "deep"` explicitly. This means mode selection is entirely driven by the intent classifier on the input string. Evaluation queries should use natural language that maps unambiguously to expected intent types to avoid mode-selection noise.

### 5c. `includeContent: true` Is Expensive but Common

Deep investigation (Pattern 5) and decision archaeology (Pattern 4) both use `includeContent: true`. This dramatically increases token consumption. The eval pipeline should track content-included vs. non-content queries separately.

### 5d. `specFolder` Scoping Is Used Frequently but Not Always

Plans, resume sessions, and spec-scoped searches specify `specFolder`. Gate 1 trigger checks and general cross-cutting queries do NOT specify it. Ground truth queries should include both scoped and unscoped variants to evaluate both retrieval modes.

### 5e. Constitutional Memories Always Surface — A Priority Inversion Risk

Since constitutional memories surface unconditionally at position 1-2 in every result set, an agent consuming "top N" results always gets constitutional content first. If the constitutional rules are irrelevant to the query, they consume tokens without value. This is a known design trade-off but worth measuring.

### 5f. Anchor-Based Retrieval Reduces Effective Token Costs by ~90%

Many patterns use `anchors` to extract only relevant sections. The ground truth query set should include some anchor-based retrieval tests to evaluate whether the correct anchors surface.

---

## 6. Recommendations for Ground Truth Query Design (T000d)

Based on real usage patterns observed:

1. **Include Gate 1 style queries**: Short, verbatim-looking user messages that trigger fast-path matching (e.g., "fix the bug in the memory context handler"). These stress the trigger matching channel.

2. **Include resume-style queries**: Queries explicitly asking about "session state" or "what was being worked on" — these map to the `mode: "resume"` path.

3. **Include decision archaeology queries**: Queries asking "why was X decided" or "what led to Y" — these stress the causal graph and `find_decision` intent routing.

4. **Include cross-concept queries**: Queries that span 2-3 concepts without exact term matching — these stress multi-hop vector retrieval.

5. **Include hard negatives from plausible-but-absent domains**: Out-of-domain queries that sound plausible (billing, OAuth, GraphQL) but have zero relevant content.

6. **Include specFolder-scoped queries**: Queries about a specific sprint or spec that should be scoped — tests that scoping correctly filters.

7. **Vary query length**: From 3-word commands to full sentences, reflecting the range of actual Gate 1 inputs.
