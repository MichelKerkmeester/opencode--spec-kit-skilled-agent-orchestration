# Iteration 038: OPEN QUESTIONS REGISTER

## Focus
OPEN QUESTIONS REGISTER: Catalog all remaining open questions, uncertainties, and items needing further investigation across all 37 prior iterations.

## Findings
### Finding 1: The Q1 integrity lane still lacks a locked issue contract
- **Source**: prior rollout planning and current tool surface [SOURCE: `research/iterations/iteration-031.md:105`; `research/iterations/iteration-032.md:29-46,130-133`; `research/iterations/iteration-033.md:8-18,113-119`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-270`; `external/src/drift/checkers/path.ts:6-67`; `external/src/drift/checkers/index-sync.ts:6-68`]
- **What it does**: prior iterations converged on lexical integrity as the only clear adopt-now slice, but the implementation contract is still open: the canonical issue schema, default checker set, alias-normalization rules, scope whitelist, authoritative index surfaces, and the objective criteria that would ever promote advisory integrity into blocking mode. Current `memory_health` only exposes `full` and `divergent_aliases`, so there is still no native integrity report envelope in the live MCP surface.
- **Why it matters**: this is the main unresolved blocker between research consensus and implementation. Without a locked schema and promotion contract, Q1 integrity work risks false-positive churn, ambiguous ownership, and incompatible downstream consumers.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: The operator-facing `spec-kit doctor` surface is still a design space, not a settled contract
- **Source**: Mex command surface, prior DX iterations, and current Public authority boundaries [SOURCE: `external/src/cli.ts:28-161`; `research/iterations/iteration-031.md:29-37,84-90,105`; `research/iterations/iteration-036.md:39-45,81-88`; `research/iterations/iteration-037.md:156-160`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-126`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-440`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1301-1389`]
- **What it does**: research settled that Public should eventually expose a thin planner over existing tools, but the concrete UX is still open: command namespace (`spec_kit:doctor` vs `memory:manage integrity`), allowed modes (`check`, `--json`, `--plan`, deferred `--fix`), exact handoff payloads, and the boundary between planner-only advice and any execution-capable follow-up. Mex's verb set is simple; Public still distributes next-step guidance across `session_bootstrap`, `memory_health`, and `memory_save` dry-run semantics.
- **Why it matters**: this is the biggest remaining DX question. If the command contract is vague, the new integrity work will increase namespace confusion instead of reducing it.
- **Recommendation**: NEW FEATURE
- **Impact**: high
- **Source strength**: primary

### Finding 3: Freshness still needs calibration, provenance semantics, and a Public-native temporal contract
- **Source**: Mex staleness code, earlier temporal analysis, and current session-health hints [SOURCE: `external/src/drift/checkers/staleness.ts:4-56`; `external/README.md:76-87`; `research/iterations/iteration-023.md:9951-9962`; `research/iterations/iteration-031.md:40-49`; `research/iterations/iteration-034.md:8-12,85-88`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:107-130`]
- **What it does**: Mex hardcodes `30/90` day and `50/200` commit thresholds and emits staleness as part of scaffold drift. Prior iterations already decided that Public should not transplant those thresholds as truth or retrieval score, but several questions remain open: what exact freshness states should exist (`exact`, `degraded`, `unknown`, or another set), where git-backed freshness is allowed to run, and how freshness stays separate from FSRS retrieval decay, session attention decay, and archival/repair.
- **Why it matters**: this is the clearest conceptual ambiguity left in the research set. If freshness is not modeled explicitly, implementers can easily collapse "old," "irrelevant," and "possibly wrong" back into one noisy signal.
- **Recommendation**: prototype later
- **Impact**: high
- **Source strength**: primary

### Finding 4: The retrieval-policy matrix and integrity-annotation rules are still under-specified
- **Source**: policy-split follow-ups and current retrieval routing [SOURCE: `research/iterations/iteration-026.md:7996,8061`; `research/iterations/iteration-029.md:6233,6297`; `research/iterations/iteration-035.md:7-18,23-29,84-89`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:638-665`; `research/iterations/iteration-037.md:145-149`]
- **What it does**: research already ruled out folding integrity into recall, but it has not yet frozen the positive routing contract: when Public should behave as `lexical-first`, `semantic-first`, `hybrid-balanced`, or `graph-first`; what attribution and degradation fields each mode must expose; and how integrity findings may annotate retrieval, resume, or doctor outputs without becoming a competing search/index layer.
- **Why it matters**: this is the control-plane question most likely to drift during implementation. Without the matrix, future work could accidentally smuggle lexical integrity into ranking, or make doctor hints inconsistent with retrieval authority.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 5: Performance and observability guardrails remain undefined in measurable terms
- **Source**: performance, testing, and rollout-matrix follow-ups [SOURCE: `research/iterations/iteration-032.md:130-133`; `research/iterations/iteration-033.md:38-52,113-119`; `research/iterations/iteration-034.md:24-45,85-88`; `research/iterations/iteration-035.md:82-89`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:113-126`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:117-130`]
- **What it does**: multiple iterations called for concrete budgets and pass bars, but those numbers do not exist yet. The remaining work includes defining acceptable latency for advisory integrity, when git-backed freshness may run, what storage-growth observability must exist for graph/vector indexes, what regression metrics block merges, and which rollback triggers demote a feature from rollout candidate back to advisory-only.
- **Why it matters**: this is the difference between a safe advisory subsystem and a feature that quietly leaks into hot paths. Without explicit thresholds, neither rollout confidence nor rollback discipline is real.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 6: Multi-agent conflict handling is implemented in the backend, but still not surfaced as visible workflow state
- **Source**: prior safety pass plus current resume/context surfaces [SOURCE: `research/iterations/iteration-025.md:10552,10568,10611,10627`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-126,194-209`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815`]
- **What it does**: prior research established that shared conflicts are recorded, concurrent writes are serialized, and high-risk collisions escalate to `manual_merge`; the unresolved question is how those conditions become visible to callers. Current `session_bootstrap` and `memory_context` surface readiness, routing, and recovery hints, but this register found no corresponding contract for exposing shared-space conflict state, degraded trust, or merge-required conditions in the user-facing recovery path.
- **Why it matters**: hidden conflict state undercuts the value of the backend safeguards. Operators and agents need to know when shared-memory results are safe, degraded, or waiting on a manual merge.
- **Recommendation**: NEW FEATURE
- **Impact**: medium
- **Source strength**: primary

### Finding 7: Optional scaffold-growth companion docs remain intentionally deferred but still undefined
- **Source**: roadmap, DX, and architecture-synthesis passes [SOURCE: `research/iterations/iteration-031.md:51-59,85-91`; `research/iterations/iteration-036.md:31-35,68-69`; `research/iterations/iteration-037.md:105-110,161`; `research/iterations/iteration-029.md:6218,6282`]
- **What it does**: research consistently rejected mandatory Mex-style `pattern add` closeout and markdown-first memory replacement, but it left an intentional prototype-later sidecar open: an opt-in companion-doc layer for repeatable playbooks and project patterns. The unanswered questions are ownership, update cadence, integrity coverage, and how to prevent uncontrolled doc churn or duplication of durable memory authority.
- **Why it matters**: this is the largest remaining scope-creep vector. If left vague, future implementation work could accidentally reintroduce the very post-task burden and duplicate-truth problem the research explicitly rejected.
- **Recommendation**: prototype later
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- `research/iterations/iteration-023.md:9951-9962`
- `research/iterations/iteration-025.md:10552,10568,10611,10627`
- `research/iterations/iteration-026.md:7996,8061`
- `research/iterations/iteration-029.md:6218,6233,6282,6297`
- `research/iterations/iteration-031.md:29-37,40-59,84-91,105`
- `research/iterations/iteration-032.md:29-46,130-133`
- `research/iterations/iteration-033.md:8-18,38-52,113-119`
- `research/iterations/iteration-034.md:8-12,24-45,85-88`
- `research/iterations/iteration-035.md:7-29,82-89`
- `research/iterations/iteration-036.md:31-45,68-69,81-88`
- `research/iterations/iteration-037.md:105-110,145-160`
- `external/README.md:76-87`
- `external/src/cli.ts:28-161`
- `external/src/drift/checkers/path.ts:6-67`
- `external/src/drift/checkers/index-sync.ts:6-68`
- `external/src/drift/checkers/staleness.ts:4-56`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:236-270,638-665`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:700-815`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:94-126,194-209`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:107-130`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:426-440`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1301-1389`

## Assessment
- **New information ratio**: 0.10
- **Questions addressed**: what still blocks Q1 integrity implementation; what remains undecided about the doctor surface; which freshness questions are unresolved; which routing/annotation rules are still missing; what observability and rollback thresholds are unspecified; whether multi-agent conflict visibility is solved; how optional scaffold-growth sidecars stay bounded
- **Questions answered**: the remaining unresolved work clusters into seven buckets: integrity schema, doctor command contract, freshness provenance, retrieval-policy matrix, performance/observability guardrails, multi-agent conflict visibility, and optional companion-doc growth boundaries
- **Novelty justification**: this pass does not add a new mechanism; it converts scattered "next focus," "prototype later," and migration-risk notes into one bounded register of unresolved implementation questions

## Ruled Out
- Re-opening the rejected idea of replacing `memory_context`, `memory_search`, CocoIndex, or code graph with a markdown-first scaffold
- Treating integrity findings as retrieval relevance signals inside `memory_context`, `memory_search`, or `code_graph_query`
- Using one Mex-style drift score as the primary health contract for Public
- Shipping mandatory Mex-style post-task pattern growth as a default closeout rule
- Letting a wrapper silently execute repairs, saves, scans, or reindex operations that currently require explicit calls or confirmation

## Reflection
- **What worked**: mining the late-synthesis packets and targeted exact-line searches for "next focus," promotion criteria, routing matrices, and deferred sidecars surfaced the remaining open work faster than re-reading every narrative packet linearly
- **What did not work**: the phase folder is missing the canonical reducer-state artifacts described by the current deep-research skill, and several older iteration files are partially noisy or duplicated, so the register had to be reconstructed from clean source-line hits rather than from a tidy machine-owned open-questions log
- **What I would do differently**: introduce a dedicated structured open-questions registry much earlier in the loop so the last iterations can close or rank unresolved work directly instead of extracting it from prose

## Recommended Next Focus
Convert the register into a closure matrix for iteration 039:
1. lock the Q1 integrity issue schema, checker scope, and advisory-to-blocking promotion gates
2. choose the doctor namespace and freeze planner-only versus execution-enabled boundaries
3. define the retrieval-policy matrix and integrity-annotation rules
4. set measurable latency, observability, rollback, and conflict-visibility requirements
```


Total usage est:        1 Premium request
API time spent:         7m 1s
Total session time:     7m 25s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.9m in, 29.0k out, 2.7m cached, 9.5k reasoning (Est. 1 Premium request)
