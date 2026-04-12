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
