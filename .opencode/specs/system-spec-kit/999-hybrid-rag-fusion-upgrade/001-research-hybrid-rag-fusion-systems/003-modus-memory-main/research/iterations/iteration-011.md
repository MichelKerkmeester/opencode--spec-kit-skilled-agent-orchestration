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
