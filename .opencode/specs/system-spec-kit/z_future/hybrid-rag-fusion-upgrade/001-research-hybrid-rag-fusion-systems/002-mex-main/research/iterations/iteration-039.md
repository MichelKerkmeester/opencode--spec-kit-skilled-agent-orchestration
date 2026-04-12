# Iteration 039: CROSS-PHASE SYNTHESIS

## Focus
CROSS-PHASE SYNTHESIS: Compare findings across all 5 external systems (Engram, Mex, Modus, Mnemosyne, MemPalace). What do 3+ systems agree on? Where do they diverge?

## Findings
### Finding 1: Four external systems and Spec Kit converge on **scoped memory surfaces**, while Mex diverges into a router/scaffold control plane
- **Source**: `001-engram-main/external/README.md`, `004-opencode-mnemosyne-main/external/README.md`, `005-mempalace/external/mempalace/mcp_server.py`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `002-mex-main/external/README.md` [SOURCE: `001-engram-main/external/README.md:25-32,71-89`; `004-opencode-mnemosyne-main/external/README.md:37-59`; `005-mempalace/external/mempalace/mcp_server.py:7-18`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50,210-220,739-776`; `002-mex-main/external/README.md:178-216`]
- **What it does**: Engram exposes explicit session/search/save tools, Mnemosyne splits project/global/core recall/store/delete, MemPalace splits read/write/taxonomy/search tools, and Spec Kit splits `memory_context`, `memory_search`, `memory_match_triggers`, `session_bootstrap`, and maintenance/graph tools. Mex is the outlier: instead of a live memory API, it routes through `CLAUDE.md` -> `ROUTER.md` -> context/pattern files and uses CLI verbs to keep that scaffold aligned.
- **Why it matters**: The strongest cross-system agreement is not "use one smarter search tool." It is "separate the responsibilities." For Public, that validates keeping explicit retrieval, bootstrap, maintenance, and graph planes instead of collapsing everything into one memory endpoint or replacing the runtime contract with a markdown router.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Four systems agree that **startup context should be cheap and layered**, but they implement that warm-up very differently
- **Source**: `002-mex-main/external/README.md`, `004-opencode-mnemosyne-main/external/README.md`, `004-opencode-mnemosyne-main/external/src/index.ts`, `005-mempalace/external/mempalace/layers.py`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`, `001-engram-main/external/README.md` [SOURCE: `002-mex-main/external/README.md:178-216`; `004-opencode-mnemosyne-main/external/README.md:47-60,64-87`; `004-opencode-mnemosyne-main/external/src/index.ts:78-90,208-220`; `005-mempalace/external/mempalace/layers.py:3-16,76-85,185-214`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-45,753-776`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815`; `001-engram-main/external/README.md:79-87`]
- **What it does**: Mex keeps the always-loaded file tiny and routes on demand; Mnemosyne injects memory instructions into compaction and distinguishes project/global/core memory; MemPalace formalizes L0/L1 wake-up plus L2/L3 retrieval; Engram exposes `mem_context` and session tools; Spec Kit routes between quick trigger matches, deep semantic search, and resume/bootstrap flows. The agreement is "do not front-load everything"; the divergence is whether that layering is static markdown, hook-time instructions, fixed wake-up text, or a structured orchestration API.
- **Why it matters**: This strengthens the case for Public's current `memory_context` + `session_bootstrap` direction and argues against replacing it with Mex's router-first bootstrap. The real import from the cross-phase set is layered warm-up discipline, not any single warm-up format.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: Five systems agree that **memory needs hygiene, repair, or contradiction-handling surfaces**, even when retrieval is the headline feature
- **Source**: `001-engram-main/external/README.md`, `002-mex-main/external/README.md`, `003-modus-memory-main/external/cmd/modus-memory/doctor.go`, `004-opencode-mnemosyne-main/external/README.md`, `005-mempalace/external/mempalace/mcp_server.py`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` [SOURCE: `001-engram-main/external/README.md:79-87,113-116`; `002-mex-main/external/README.md:72-113`; `003-modus-memory-main/external/cmd/modus-memory/doctor.go:13-31,42-60,63-83,108-158`; `004-opencode-mnemosyne-main/external/README.md:69-77`; `005-mempalace/external/mempalace/mcp_server.py:70-100,169-176`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-269`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-468`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1273-1389`]
- **What it does**: Engram tracks session lifecycle and sync, Mex runs static drift checks plus targeted sync, Modus ships a `doctor` scan for missing fields/duplicates/contradictions, Mnemosyne explicitly deletes outdated memories, MemPalace logs writes and requires invalidation when facts change, and Spec Kit already separates `memory_health` from `memory_save` with confirmation and dry-run semantics.
- **Why it matters**: Cross-phase, this is the clearest consensus after scoped APIs: durable memory is not just save/retrieve. It needs an operator-visible truth-maintenance lane. That is exactly why the Mex-derived integrity lane belongs in Public as advisory maintenance, not as a retrieval feature.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 4: Four systems agree that **relationships matter**, but they diverge sharply on whether those relations are lightweight adjacency or a real graph
- **Source**: `003-modus-memory-main/external/internal/index/crossref.go`, `002-mex-main/external/README.md`, `005-mempalace/external/mempalace/knowledge_graph.py`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` [SOURCE: `003-modus-memory-main/external/internal/index/crossref.go:9-15,41-56,154-213`; `002-mex-main/external/README.md:78-80,189-216`; `005-mempalace/external/mempalace/knowledge_graph.py:5-16,61-88,121-178,196-214`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:483-500,638-665`]
- **What it does**: Modus builds a cross-index over subjects/tags/entities without introducing a full graph store; Mex uses frontmatter edges and a pattern index as navigational structure; MemPalace builds a temporal entity-relation graph with typed edges and validity ranges; Spec Kit already exposes two distinct relation systems: causal memory links and a structural code graph. The agreement is that isolated documents are not enough. The divergence is how much machinery that relation layer deserves.
- **Why it matters**: This is where the external systems stop agreeing on implementation shape. The safe cross-phase conclusion for Public is to keep relationship layers explicit and separate: causal links answer "why", code graph answers structure, and integrity edges stay lexical. A single universal graph would erase useful authority boundaries.
- **Recommendation**: prototype later
- **Impact**: medium
- **Source strength**: primary

### Finding 5: The biggest divergence is still the **source of truth** itself, which rules out wholesale adoption of any one external system
- **Source**: `001-engram-main/external/README.md`, `001-engram-main/external/internal/store/store.go`, `003-modus-memory-main/external/README.md`, `003-modus-memory-main/external/internal/learnings/learnings.go`, `004-opencode-mnemosyne-main/external/README.md`, `004-opencode-mnemosyne-main/external/src/index.ts`, `005-mempalace/external/README.md`, `005-mempalace/external/mempalace/searcher.py`, `002-mex-main/external/README.md`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` [SOURCE: `001-engram-main/external/README.md:25-32,58-69`; `001-engram-main/external/internal/store/store.go:1-6,29-60,105-120`; `003-modus-memory-main/external/README.md:27-31,53-58,191-207`; `003-modus-memory-main/external/internal/learnings/learnings.go:1-10,66-113,121-155`; `004-opencode-mnemosyne-main/external/README.md:82-87`; `004-opencode-mnemosyne-main/external/src/index.ts:34-75,78-90,95-203`; `005-mempalace/external/README.md:13-21,145-169`; `005-mempalace/external/mempalace/searcher.py:21-52,93-152`; `002-mex-main/external/README.md:34-35,72-87,178-216`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50,236-269,483-500,638-665,739-776`]
- **What it does**: Engram is a SQLite+FTS5 observation store; Modus is a markdown vault with BM25/FSRS/crossrefs; Mnemosyne is a local hybrid document store wrapped as an OpenCode plugin; MemPalace is a verbatim ChromaDB palace plus auxiliary graph/taxonomy layers; Mex treats markdown scaffold files as the main project-memory substrate; Spec Kit is already a hybrid indexed memory/orchestration stack with separate graph and code-intelligence planes.
- **Why it matters**: This is the main divergence that survives every comparison. The five systems do **not** agree on one best persistence model, one best authoring model, or one best write authority. That means the right outcome for Public remains selective adoption: take the integrity lane, planner ergonomics, and bounded lifecycle improvements; reject any attempt to replace Spec Kit with Engram, Modus, Mnemosyne, Mex, or MemPalace wholesale.
- **Recommendation**: reject
- **Impact**: high
- **Source strength**: primary

## Sources Consulted
- `001-engram-main/external/README.md:25-32,58-69,71-89,113-116`
- `001-engram-main/external/internal/store/store.go:1-6,29-60,105-120`
- `002-mex-main/external/README.md:34-35,72-113,178-216`
- `003-modus-memory-main/external/README.md:27-31,53-58,191-220`
- `003-modus-memory-main/external/internal/index/crossref.go:9-15,41-56,154-213`
- `003-modus-memory-main/external/internal/learnings/learnings.go:23-48,66-113,121-208`
- `003-modus-memory-main/external/cmd/modus-memory/doctor.go:13-31,42-60,63-83,108-158`
- `004-opencode-mnemosyne-main/external/README.md:37-87`
- `004-opencode-mnemosyne-main/external/src/index.ts:34-75,78-90,95-220`
- `005-mempalace/external/README.md:13-21,113-169,190-205`
- `005-mempalace/external/mempalace/searcher.py:21-52,93-152`
- `005-mempalace/external/mempalace/layers.py:3-16,76-85,185-214`
- `005-mempalace/external/mempalace/knowledge_graph.py:5-16,61-88,121-178,196-214`
- `005-mempalace/external/mempalace/mcp_server.py:7-18,70-100,169-176`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50,210-220,236-269,483-500,638-665,739-776`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-468`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1273-1389`

## Assessment
- **New information ratio**: 0.17
- **Questions addressed**: what 3+ systems independently agree on; where the external systems disagree at the architecture level; which agreements map cleanly onto Spec Kit; which divergences block any wholesale transplant
- **Questions answered**: the strongest agreements are scoped interfaces, low-token layered warm-up, and explicit hygiene/repair surfaces; relationship layers are useful but not consensus-standardized; the deepest divergence is still the underlying source of truth and write authority model
- **Novelty justification**: earlier phases established system-local patterns, but this pass is the first source-backed synthesis that separates reusable consensus from irreducible architectural disagreement across all five external systems and Spec Kit

## Ruled Out
- Replacing Spec Kit Memory with any single external architecture
- Treating Mex's integrity checks as retrieval-ranking signals instead of maintenance signals
- Adopting MemPalace's raw-verbatim-everything storage model as the default Public memory substrate
- Replacing `session_bootstrap` / `memory_context` with a markdown-router-first startup path
- Collapsing causal links, lexical integrity edges, and structural code graph data into one universal graph surface

## Reflection
- **What worked**: comparing the external systems at the boundary they expose to agents (tool contract, wake-up contract, maintenance contract, relation contract) produced clearer agreement/divergence lines than trying to merge all five research reports narratively
- **What did not work**: the canonical reducer-owned deep-research state artifacts are still absent in this phase folder, and the full phase reports are too large to use directly as working state, so synthesis had to come from late-stage iteration packets plus targeted primary-source reads
- **What I would do differently**: start a cross-system comparison matrix around iteration 10-15 next time, then let later iterations only confirm or overturn rows instead of rebuilding the comparison at the end

## Recommended Next Focus
Iteration 040 should lock the final adoption matrix:
1. freeze the cross-system `adopt now / prototype later / reject` table
2. convert the consensus findings into a Q1/Q2 implementation order for Public
3. define the exact boundaries for the integrity lane, doctor/planner surface, and relation-plane annotations
4. write the final rationale for every non-adoption so future work does not reopen rejected architecture swaps
```


Total usage est:        1 Premium request
API time spent:         9m 32s
Total session time:     9m 56s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.2m in, 36.2k out, 1.8m cached, 16.3k reasoning (Est. 1 Premium request)
