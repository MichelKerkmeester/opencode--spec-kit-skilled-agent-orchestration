# Iteration 037: ARCHITECTURE EVOLUTION MAP

## Focus
ARCHITECTURE EVOLUTION MAP: Draw the before/after architecture showing exactly what changes in our memory system with all adoptions applied.

## Findings

### Finding 1: The "before" architecture is already a routed multi-lane memory system, not a single vault server
- **Source**: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-50,638-757`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-807`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771-809,812-861,1071-1143`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:143-156`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97-193` [SOURCE: paths above]
- **What it does**: Public already has an authority-split control plane. `memory_context` routes quick requests to trigger matching and deep/focused/resume requests to the canonical hybrid `memory_search` pipeline; `session_bootstrap` separately nudges structural questions toward `code_graph_query`; `code_graph_context` consumes CocoIndex/manual/graph seeds for structural expansion; and `memory_search` applies cache, canonical pipeline execution, optional weak-result community fallback, then post-cache session dedup. The current architecture is:

  ```text
  BEFORE
  agent / command
  ├─ memory_context
  │  ├─ quick -> memory_match_triggers
  │  ├─ deep/focused/resume -> memory_search
  │  │  ├─ exact-key cache
  │  │  ├─ executePipeline()  # canonical retrieval core
  │  │  ├─ community fallback on weak/global results
  │  │  └─ post-cache session dedup / response shaping
  │  └─ profile shaping (quick/research/resume/debug)
  ├─ session_bootstrap / session_resume
  ├─ CocoIndex -> semantic code search
  ├─ code_graph_query / code_graph_context -> structural expansion
  ├─ memory_validate -> usefulness feedback
  ├─ memory_health -> diagnostics / repair
  └─ generate-context.js -> anchored memory files -> memory index / vector DB
  ```
- **Why it matters**: The evolution target should not replace Public with a Modus-style monolithic vault lane. The safe path is additive: keep this routing split and change only the missing operator surfaces and low-authority overlays.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 2: The main new solid-line component is a `memory_review` mutation lane beside `memory_validate`
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:164-169,297-317`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215` [SOURCE: paths above]
- **What it does**: Modus exposes `memory_reinforce` as an explicit FSRS mutation. Public already has the graded review primitives (`AGAIN/HARD/GOOD/EASY`, `processReview()`, `nextReviewDate`) and already distinguishes read-side strengthening behind `trackAccess: false` by default, but its current public mutation surface next to that is `memory_validate`, which only records usefulness feedback. With adoption, Public gains a separate `memory_review` tool that reuses the existing FSRS scheduler while leaving `memory_validate` untouched for ranking/usefulness telemetry.
- **Why it matters**: This is the clearest architecture delta: a new control-plane write path appears, but the retrieval core, storage model, and cache topology do not need to change. It also preserves the current contract that search stays observational unless the caller explicitly opts into mutation.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 3: Diagnostics should evolve as a doctor/debug presentation overlay on top of `memory_health`, not as a parallel authority surface
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:13-31,42-118`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:334-344`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222-340,445-594`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127-128`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211-212` [SOURCE: paths above]
- **What it does**: Modus has a separate `doctor` command that summarizes missing fields, duplicates, contradictions, empty docs, and distribution. Public already owns the richer operational health surface in `memory_health`, including schema/DB validation, alias conflict reporting, FTS/vector integrity checks, orphan cleanup, and guarded auto-repair, and it already has `debug` response profiles in the retrieval surfaces. The transferable architecture move is therefore a doctor/debug presentation layer that summarizes existing health data, not a new diagnostics subsystem.
- **Why it matters**: This keeps one source of truth for repair semantics and avoids the Modus split where some hygiene intelligence lives in a separate CLI-only lane. The change is additive presentation, not new persistence or indexing logic.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **medium**
- **Source strength**: **primary**

### Finding 4: Save-path evolution should be a friendly wrapper over `generate-context.js`, not a direct markdown write lane
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:141-161`; `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93` [SOURCE: paths above]
- **What it does**: Modus exposes `vault_write` for direct relative-path markdown writes. Public's canonical persistence contract is the opposite: structured JSON-first input into `generate-context.js`, anchored memory output, and an explicit rule that the CLI target spec folder is authoritative. With adoption, any nicer "remember this session" or "save memory" UX should compile down to `generate-context --stdin/--json` rather than bypassing it.
- **Why it matters**: The architectural change is only a facade at the top edge. The actual persistence boundary, anchored file format, and indexing assumptions remain intact.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 5: The "after" architecture adds overlays around the existing pipeline; deferred search-side ideas stay explicitly low-authority
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:21-103,273-317,901-924`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:154-214`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771-809,812-861,1071-1143`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:143-156`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97-193` [SOURCE: paths above]
- **What it does**: Modus bundles lexical expansion, connected-doc hints, and reinforcement into its search lane. Public should not. The evolved target keeps `executePipeline()` as the only canonical retrieval core, adds `memory_review` and doctor/debug/save-wrapper surfaces as solid-line changes, and reserves lexical weak-result fallback plus connected-doc appendices as dotted, low-authority overlays beneath `memory_search`, never as replacements for CocoIndex or code-graph authority. The target map is:

  ```text
  AFTER (solid = adopt now / new feature, dashed = prototype later)
  agent / command
  ├─ workflow map / routing guidance
  ├─ memory_context (same authority split)
  │  ├─ quick -> memory_match_triggers
  │  ├─ deep/focused/resume -> memory_search wrapper
  │  │  ├─ exact-key cache
  │  │  ├─ executePipeline()  # still the only canonical retrieval core
  │  │  ├─ -- dashed: weak-result lexical fallback
  │  │  ├─ -- dashed: connected-memory appendix
  │  │  └─ session dedup / trace / debug shaping
  │  └─ no default write-on-read
  ├─ memory_review -> FSRS scheduler -> review state / nextReviewDate
  ├─ memory_validate (unchanged usefulness feedback)
  ├─ doctor/debug overlay -> memory_health full diagnostics
  ├─ session_bootstrap / CocoIndex / code_graph_* (unchanged authority)
  └─ save wrapper -> generate-context.js -> anchored memory files -> memory index / vector DB
  ```
- **Why it matters**: This is the exact before/after delta. Public changes at the orchestration, mutation, and presentation edges; it does not adopt Modus's monolithic search lane, fuzzy cache reuse, per-process in-memory rebuild, or default write-on-read semantics.
- **Recommendation**: **prototype later**
- **Impact**: **high**
- **Source strength**: **primary**

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/indexer.go:65-149,307-370`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:41-120,154-214`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:21-120,141-161,273-340,885-924`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/cmd/modus-memory/doctor.go:13-118`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:331-359`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-50,128-169,297-317,638-757`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127-128,700-807`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:184-240`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:204-215,751-861,1071-1143`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:143-156`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:97-193`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222-340,445-594`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,197-215`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93`

## Assessment
- **New information ratio**: **0.17**
- **Questions addressed**: what the real "before" architecture is today; which pieces change if the adopted patterns land; which components stay authoritative; where deferred lexical/connected-result ideas would plug in without breaking tool boundaries.
- **Questions answered**: Public should keep its routed multi-lane architecture; the only new solid-line mutation surface is `memory_review`; diagnostics should gain a doctor/debug presentation overlay rather than a new authority lane; save UX should wrap `generate-context`; and any lexical/connected-result additions belong as low-authority sidecars under `memory_search`, not as a new monolithic vault path.
- **Novelty justification**: Earlier iterations ranked features one by one; this pass converts those decisions into a single before/after topology with explicit unchanged boundaries, new control-plane edges, and deferred attachment points.

## Ruled Out
- Replacing Public's routed memory/CocoIndex/code-graph split with a single Modus-style vault lane, because the current system already encodes higher-authority routing boundaries.
- Making default search a write event, because `trackAccess` is explicitly off by default and cache/dedup semantics rely on observational reads.
- Letting connected-doc or lexical-fallback overlays outrank `executePipeline()` or intercept structural/code-search questions, because that would duplicate or weaken CocoIndex and code-graph authority.
- Adding a direct markdown write surface for spec memory, because Public's authoritative persistence contract is structured `generate-context` input and anchored outputs.

## Reflection
- **What worked**: Re-reading the live Public entrypoints (`memory_context`, `memory_search`, `session_bootstrap`, `code_graph_context`, `memory_health`, `generate-context`) against the exact Modus surfaces isolated the true architectural delta quickly: edge-layer additions, not core-engine replacement.
- **What did not work**: Mining the accumulated iteration artifacts was noisy because several late files contain repeated synthesis fragments; direct source reads were much cleaner for this topology pass.
- **What I would do differently**: In an implementation-design follow-up, turn this map into a one-page ADR with three buckets: solid-line Q1 changes (`memory_review`, doctor/debug overlay, save wrapper), dashed Q2/Q3 experiments (lexical weak-result fallback, connected-doc appendix), and explicit "do not implement" invariants.

## Recommended Next Focus
Convert this architecture map into implementation design packets in this order: `memory_review` contract and storage touchpoints first, doctor/debug overlay second, save-wrapper and workflow-map third, then feature-flagged experiments for weak-result lexical fallback and connected-memory appendix.


Total usage est:        1 Premium request
API time spent:         5m 16s
Total session time:     5m 34s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.6m in, 22.0k out, 1.5m cached, 10.3k reasoning (Est. 1 Premium request)
