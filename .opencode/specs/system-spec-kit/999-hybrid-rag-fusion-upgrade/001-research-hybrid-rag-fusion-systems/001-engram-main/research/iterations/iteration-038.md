# Iteration 038: OPEN QUESTIONS REGISTER

## Focus
OPEN QUESTIONS REGISTER: Catalog all remaining open questions, uncertainties, and items needing further investigation across all 37 prior iterations.

## Findings
### Finding 1: The recent-session digest direction is settled, but its authoritative insertion points and token budget are still open
- **Source**: Engram bounded context formatter; Public composite resume/bootstrap, dynamic instructions, and compaction injection [SOURCE: `001-engram-main/external/internal/store/store.go:1613-1667`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409-597`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168-245`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:764-809`; `.opencode/plugins/spec-kit-compact-code-graph.js:396-417`]
- **What it does**: Engram exposes one bounded digest of recent sessions, prompts, and observations. Public already has four continuity surfaces in play: `session_resume`, `session_bootstrap`, dynamic server instructions, and compaction injection. The remaining open question is which of those surfaces should carry the new digest, in what form, and under what hard size budget so it stays additive instead of becoming a second recovery authority.
- **Why it matters**: This is still the highest-leverage adopt-now item, but it is also the place most likely to create authority drift, duplicate context blocks, or startup-token bloat if specified loosely.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: Exact-handle lookup is ready, but `thread_key` normalization and governed-scope semantics are still underspecified
- **Source**: Engram topic-key indexing, upsert, and direct lookup; Public router and governed-scope filters [SOURCE: `001-engram-main/external/internal/store/store.go:572-577`; `001-engram-main/external/internal/store/store.go:948-1068`; `001-engram-main/external/internal/store/store.go:1462-1583`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-157`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:218-280`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:456-493`]
- **What it does**: Engram can normalize one `topic_key`, upsert onto the latest live row, and short-circuit slash-shaped queries into an exact lookup. Public can safely add an exact-handle lane for artifact names, but the open design question is broader: whether future `thread_key` values cover only artifacts, or also research lines, ADRs, bug threads, and session summaries, and how collisions behave across tenant/user/agent/shared-space boundaries.
- **Why it matters**: This is the main unresolved prototype track. A weak key contract would either leak across governed scopes or become so narrow that it never improves retrieval meaningfully.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 3: Tool-profile packaging remains open because Public cannot hide structural and semantic tools behind a memory-only beginner surface
- **Source**: Engram profile maps and eager/deferred instructions; Public structural and semantic tool surface [SOURCE: `001-engram-main/external/internal/mcp/mcp.go:38-138`; `001-engram-main/external/internal/mcp/mcp.go:375-620`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-776`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:741-809`]
- **What it does**: Engram proves that smaller agent/admin bundles reduce clutter and make onboarding easier. Public, however, derives much of its value from the coexistence of `session_bootstrap`, `session_resume`, `code_graph_query`, `code_graph_context`, and CocoIndex-aware routing. The unresolved question is how to package those capabilities for agents without collapsing back to a memory-only recovery and discovery model.
- **Why it matters**: This is a delivery-layer uncertainty, not a core memory-model uncertainty, but a bad bundle design would quietly remove the very tools that distinguish Public from Engram.
- **Recommendation**: prototype later
- **Impact**: medium
- **Source strength**: primary

### Finding 4: Passive capture and close-session helpers still lack a Public-native authority model
- **Source**: Engram session-summary, session-end, and passive-capture tools; Public JSON-primary context generation and governed ingest validation [SOURCE: `001-engram-main/external/internal/mcp/mcp.go:460-595`; `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-88`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:218-280`; `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:456-493`]
- **What it does**: Engram can save summaries directly and extract learnings from loose text with saved/duplicate accounting. Public currently treats `generate-context.js` and governed ingest rules as the authoritative save path. The open question is whether a friendly close-session or passive wrapper should emit structured JSON into that file-first workflow, call governed save directly, or offer both with explicit provenance and retention controls.
- **Why it matters**: This remains the largest unresolved net-new feature area because it combines DX, provenance, retention, dedupe, and reviewability in one design decision.
- **Recommendation**: NEW FEATURE
- **Impact**: high
- **Source strength**: primary

### Finding 5: The doctor/scorecard concept is settled, but its source-of-truth contract and promotion thresholds are not
- **Source**: Engram lightweight stats surface; Public health and evaluation surfaces [SOURCE: `001-engram-main/external/internal/mcp/mcp.go:399-411`; `001-engram-main/external/internal/store/store.go:1588-1608`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:223-360`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:65-195`; `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:223-326`; `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:170-260`]
- **What it does**: The run already established that Public should expose a read-only composite scorecard rather than widen `memory_search`. The remaining questions are operational: which existing surfaces are mandatory in v1, whether any repair hints can appear without repair side effects, and what shadow-mode thresholds are required before digest, exact-handle, and packaging changes graduate from experiment to default behavior.
- **Why it matters**: Without an explicit source-of-truth contract and promotion policy, the adopt-now track risks either promoting too early or sitting in permanent shadow mode with no exit criteria.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 6: The final run still needs one explicit go/no-go matrix that separates policy questions from true engineering blockers
- **Source**: Late-run synthesis and Public promotion machinery [SOURCE: `research/iterations/iteration-030.md:1-91`; `research/iterations/iteration-032.md:1-129`; `research/iterations/iteration-033.md:1-85`; `research/iterations/iteration-034.md:1-90`; `research/iterations/iteration-035.md:1-90`; `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:223-326`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:107-131`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:113-157`]
- **What it does**: By iteration 037, the architecture direction was already stable: additive digest, thin runtime packaging, exact-handle routing, read-only scorecard, bounded `thread_key` prototype, and governed passive capture. What remains open is rollout governance: which of P1-P4 are blocked by unanswered policy questions, which can ship under flags immediately, and which must wait for the `thread_key` and passive-capture prototype results.
- **Why it matters**: This is the last synthesis gap between “good recommendations” and an executable production plan for the final two iterations.
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: secondary

## Sources Consulted
- `001-engram-main/external/internal/store/store.go:572-577`
- `001-engram-main/external/internal/store/store.go:948-1068`
- `001-engram-main/external/internal/store/store.go:1462-1667`
- `001-engram-main/external/internal/mcp/mcp.go:38-138`
- `001-engram-main/external/internal/mcp/mcp.go:375-620`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409-597`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168-245`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:741-809`
- `.opencode/plugins/spec-kit-compact-code-graph.js:396-417`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-776`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-157`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:218-280`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:456-493`
- `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js:61-88`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:223-360`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:65-195`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:223-326`
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts:170-260`
- `research/iterations/iteration-030.md:1-91`
- `research/iterations/iteration-032.md:1-129`
- `research/iterations/iteration-033.md:1-85`
- `research/iterations/iteration-034.md:1-90`
- `research/iterations/iteration-035.md:1-90`

## Assessment
- New information ratio: 0.11
- Questions addressed: [authoritative placement and token budget for recent-session digest, `thread_key` normalization and governed-scope behavior, tool-profile packaging boundary, passive/session-end authority model, doctor/scorecard source-of-truth and promotion thresholds, final go/no-go separation between policy and engineering blockers]
- Questions answered: [which unresolved items still remain after 37 iterations, which ones belong to adopt-now versus prototype/new-feature tracks, which uncertainties are policy-level rather than architecture-level]
- Novelty justification: This is the first pass that turns the late-run recommendation stack into an explicit unresolved-questions register, making the remaining uncertainty small, named, and actionable.

## Ruled Out
- Treating the P1-P4 adopt-now set as fully specified already; the architecture direction is stable, but policy and rollout contracts are still incomplete.
- Inferring Public’s `thread_key` or passive-capture semantics directly from Engram’s simpler `topic_key` and lifecycle model without governed-scope adaptation.
- Reopening already rejected directions such as memory-only recovery authority, coarse scope collapse, or lexical-first replacement of Public’s hybrid retrieval.

## Reflection
- What worked: Reading the late synthesis iterations together with the exact Engram/Public authority surfaces made it easy to separate “resolved recommendation” from “still-open implementation question.”
- What did not work: The packet still lacks canonical reducer state files, and some late artifacts are noisy enough that the iteration files had to be treated as the durable source of truth.
- What I would do differently: Track an explicit open-questions table from the start of the run so the final extended passes can update a live register instead of reconstructing one from late-stage summaries.

## Recommended Next Focus
FINAL GO/NO-GO MATRIX: decide which unanswered questions block the production track, which can remain behind feature flags, and which belong permanently to bounded prototype work for iterations 039-040.
```


Changes   +0 -0
Requests  1 Premium (6m 30s)
Tokens    ↑ 1.3m • ↓ 18.0k • 1.2m (cached) • 8.6k (reasoning)
