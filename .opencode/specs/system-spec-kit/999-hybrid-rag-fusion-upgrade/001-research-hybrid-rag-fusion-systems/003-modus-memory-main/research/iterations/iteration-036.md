# Iteration 036: USER WORKFLOW IMPACT

## Focus
USER WORKFLOW IMPACT: How will adopted patterns change the agent developer experience? New commands, changed behaviors, migration guides needed.

## Findings

### Finding 1: Public should not copy Modus's monolithic vault UX; it needs a task-to-tool workflow map instead
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-39`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:15-18`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:170-207`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,638-665,740-757` [SOURCE: paths above]
- **What it does**: Modus flattens the operator surface into 11 vault/memory tools and teaches usage through a small verb set. Public already uses a different control plane: `memory_context` is the unified retrieval entrypoint, `session_bootstrap` is the recovery entrypoint, and `code_graph_query` / `code_graph_context` stay separate for structural questions.
- **Why it matters**: If Public adopts Modus-inspired features without a workflow map, DX gets worse: more tools, but less clarity on when to use `memory_context`, `memory_search`, `session_bootstrap`, CocoIndex, or code-graph. The needed migration artifact is a task-to-tool guide, not a new top-level `vault_*` lane.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 2: `memory_review` is the one new command that would materially improve agent workflow; it must stay distinct from `memory_validate`
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:885-897`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:160-217`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:297-317`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-790` [SOURCE: paths above]
- **What it does**: Modus exposes explicit reinforcement as a first-class command. Public exposes `memory_validate`, but that surface records binary usefulness feedback, ranking/selection telemetry, and promotion signals; it is not a spaced-repetition review API.
- **Why it matters**: This is the clearest workflow addition for Public: agents need a first-class way to say “this memory was reviewed with a recall grade” without overloading `memory_validate`. Migration guidance should say: keep `memory_validate` for usefulness/ranking feedback, add `memory_review` for review-state changes, and only introduce `memory_due` after the review contract is stable.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 3: Search behavior must remain observational by default; implicit reinforcement would be a breaking workflow change
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:273-317`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202,519,771-809`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:164-169` [SOURCE: paths above]
- **What it does**: Modus treats successful recall during `memory_search` as a write event and reinforces returned facts automatically. Public explicitly gates write-on-read behind `trackAccess`, defaults it to `false`, and keeps the canonical hybrid pipeline observational unless the caller opts in.
- **Why it matters**: For agent developers, this is the main behavior-contract issue. If Public silently changed `memory_search` to mutate state on reads, existing workflows would start producing hidden writes and ambiguous cache semantics. The migration rule should instead be: current search behavior stays the same; reinforcement only happens through an explicit mutation path or explicit opt-in tracking.
- **Recommendation**: **reject**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 4: Connected-doc UX is useful, but it should ship as an appendix in memory results with clear non-authoritative wording
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:75-101,901-924`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:9-16,154-214`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-665,740-757`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:143-156`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:157-193` [SOURCE: paths above]
- **What it does**: Modus appends cross-reference hints directly to search results and also exposes `vault_connected` for follow-up. Public already nudges agents toward code-graph tools for structural questions and keeps memory retrieval separate from structural expansion.
- **Why it matters**: This pattern can improve navigation, but only if the workflow language is precise. If Public adopts it, connected-doc output should mean “related memory context to inspect next,” not evidence equivalent to code-graph or causal links. That means a response-shape change and migration note, not a new authority surface.
- **Recommendation**: **prototype later**
- **Impact**: **medium**
- **Source strength**: **primary**

### Finding 5: Public's save workflow should stay authoritative; any Modus-like write ergonomics must wrap `generate-context`, not bypass it
- **Source**: `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:141-161`; `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:209-229`; `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93` [SOURCE: paths above]
- **What it does**: Modus offers direct vault writes and frames a Librarian model as the sole authority over persistent state. Public instead makes structured session/context capture the canonical save path: `generate-context.js` expects JSON-first input, writes anchored memory files into the spec folder, and treats an explicit CLI spec-folder target as authoritative.
- **Why it matters**: This is a workflow migration issue more than an algorithm issue. If Public adds a friendlier “remember this session” surface, it should still compile down to `generate-context --stdin/--json` or equivalent structured save semantics. Agents should not treat spec memory as arbitrary markdown that can be hand-written like a Modus vault file.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

## Sources Consulted
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/memory.go:7-39`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/mcp/vault.go:15-18,75-101,141-161,273-317,885-924`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/vault/facts.go:160-217`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/internal/index/crossref.go:9-16,154-214`
- `.opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/001-research-hybrid-rag-fusion-systems/003-modus-memory-main/external/README.md:170-229`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,164-169,297-317,638-665,740-757`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:202,519,771-809`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:648-790`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:143-156`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:157-193`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-93`

## Assessment
- New information ratio: **0.19**
- Questions addressed: which adopted patterns would require new user-facing commands; which existing behaviors must remain stable; what migration guidance agents would need around retrieval, review, connected results, and saving memory.
- Questions answered: the only high-value new mutation command is `memory_review`; search should remain observational by default; connected-doc behavior should be additive and explicitly non-authoritative; save ergonomics must preserve `generate-context` as the canonical persistence path; and Public needs a workflow map rather than a monolithic Modus-style vault surface.
- Novelty justification: Earlier iterations established compatibility and ranking trade-offs; this pass translates those decisions into concrete developer-experience changes, behavior contracts, and migration/documentation requirements.

## Ruled Out
- Adding a top-level `vault_*` compatibility layer as a first migration step, because it would hide Public’s intentional split between memory, semantic code search, structural graph lookup, and session bootstrap.
- Rebranding `memory_validate` into a review API, because usefulness feedback and spaced-repetition review are different operator intents with different telemetry semantics.
- Making connected-doc hints a new authority surface for code or dependency questions, because Public already routes those questions to CocoIndex and code-graph tools.
- Allowing raw markdown writes to become the default save path for spec memory, because Public’s governance depends on structured, authoritative context generation.

## Reflection
- What worked: comparing Modus’s onboarding promises against the live Public tool descriptions exposed the real workflow delta quickly: Modus optimizes for a smaller verb set, while Public optimizes for explicit authority boundaries.
- What did not work: trying to validate or write into the phase folder in this environment hit a permission boundary, so this iteration had to stay source-driven and inline.
- What I would do differently: in a write-enabled follow-up, turn these findings into a one-page migration matrix that maps common agent intents (“resume,” “recall,” “review,” “save session,” “find related code”) to the preferred Public tool and the planned future additions.

## Recommended Next Focus
Translate the workflow-impact findings into rollout artifacts: a migration matrix for current tools, an API contract for `memory_review`, and response-shape guidance for any future connected-doc appendix so adoption changes developer behavior intentionally rather than implicitly.


Total usage est:        1 Premium request
API time spent:         3m 36s
Total session time:     3m 54s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.2m in, 14.5k out, 1.1m cached, 5.6k reasoning (Est. 1 Premium request)
