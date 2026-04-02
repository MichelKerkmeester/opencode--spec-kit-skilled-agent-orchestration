# Review Iteration 3: On-Demand Comparison + Architectural Alignment

## Focus
Two dimensions examined together due to their interplay:
1. **on_demand_comparison** -- What does proactive startup injection add that on-demand MCP tools do not?
2. **architectural_alignment** -- Does the startup injection serve its intended purpose per spec 024 and the decision record?

## Scope
- Review target: startup-brief.ts, session-prime.ts (handleStartup path), code-graph-db.ts (queryStartupHighlights)
- Spec refs: spec.md (Layer 3, Phase 002, SessionStart Priming), decision-record.md (DR-002, DR-003, DR-010, DR-012)
- Dimensions: on_demand_comparison, architectural_alignment

## Scorecard
| File | Corr | Sec | Trace | Maint |
|------|------|-----|-------|-------|
| startup-brief.ts | 7/10 | 8/10 | 5/10 | 7/10 |
| session-prime.ts (handleStartup) | 7/10 | 7/10 | 6/10 | 7/10 |
| code-graph-db.ts (queryStartupHighlights) | 6/10 | 8/10 | 4/10 | 6/10 |

## On-Demand Comparison Matrix

| Capability | Proactive Injection (startup-brief.ts) | On-Demand MCP Tools | Delta |
|-----------|---------------------------------------|---------------------|-------|
| **Scale context** (file/node/edge counts) | Provided automatically: "15488 files, 382268 nodes, 198135 edges" | `code_graph_status` returns same data on demand | Low -- AI can get this any time with one tool call |
| **Freshness indicator** (lastScan) | Provided + stale warning if >24h | `code_graph_status` also returns lastScanTimestamp | Low -- same data, same stale logic possible |
| **Top-connectivity nodes** (highlights) | 5 most-connected nodes by outgoing CALLS edges | `code_graph_query({ operation: "calls_from", subject: X })` returns task-relevant call graph | **Negative** -- on-demand is superior because it is task-targeted |
| **Task-relevant context** | No task context available at startup; highlights are generic | `code_graph_context` accepts seeds from CocoIndex, resolves neighborhoods | **Negative** -- on-demand provides exactly what the task needs |
| **Zero-tool-call cost** | Free -- injected without AI action | Requires 1 tool call per query | Marginal positive -- saves 1 tool call |
| **Token cost** | ~100 tokens consumed unconditionally every session | 0 tokens when not needed; variable when needed | **Negative** -- proactive pays cost even when unused |
| **Relevance to actual task** | Evidence: AI ignored highlights entirely in observed session | On-demand: code_graph_context returned focused, task-relevant results | **Negative** -- proactive was irrelevant; on-demand was useful |

**Summary**: The proactive injection provides information that is either (a) already available via on-demand tools at equal quality, or (b) worse than on-demand alternatives because it lacks task context. The only advantage is saving one tool call for scale/freshness data, which the AI did not need in the observed session.

## Architectural Alignment Analysis

### Spec 024 Requirements vs. Actual Behavior

**Spec Problem Statement (spec.md line 91-95):**
> "Session-start is generic, not recovery-aware -- startup instructions only announce memory stats, not last task or spec folder"

**Analysis**: The structural context section (startup-brief.ts) does NOT address this gap. It is generic by design -- it shows global graph statistics and top-connected nodes regardless of session context, prior task, or recovery needs. The `sessionContinuity` field in StartupBriefResult (startup-brief.ts:19) does address recovery awareness by showing the last spec folder and session summary, but this is a separate concern from the structural context highlights.

### DR-002: Hybrid Hook + Tool Architecture
- **Decision**: "Use Claude Code hooks where available, tool-based fallback for all runtimes"
- **Alignment**: The structural context section is injected via hook (session-prime.ts:118-129). This aligns with the transport mechanism decision. However, DR-002's rationale states "Hooks provide guaranteed context injection at lifecycle boundaries." The structural context highlights are not lifecycle-boundary context -- they are static global statistics.

### DR-003: Direct Import over MCP Call for Hook Scripts
- **Decision**: "Hook scripts import from compiled dist directly, not via MCP tool calls"
- **Alignment**: startup-brief.ts imports directly from code-graph-db.ts (line 7). Technically aligned with the direct-import decision. However, this decision was motivated by latency ("must complete in <2s / <3s"), not by the value of the data being injected.

### DR-010: CocoIndex as Complementary Semantic Layer
- **Decision**: "CocoIndex = 'what resembles what', Code Graph = 'what connects to what'"
- **Alignment**: The startup highlights show "what is most connected globally" -- a valid code graph question. But this is not what the AI needs at startup. The AI needs structural context for its current task, not a global leaderboard.

### DR-012: Token Budget Allocation
- **Decision**: "SessionStart allocation: constitutional 500, graph 700, CocoIndex 400, triggered 200, overflow 200"
- **Alignment**: The structural context section consumes part of the graph's 700-token budget. Given the evidence that the highlights were unused, this is budget spent without return.

### Missing Requirement Traceability
- [SOURCE: spec.md lines 99-115] The spec describes SessionStart source=startup as: "primes new session with tool overview + stale-index detection."
- The tool overview is in session-prime.ts:101-115 (handleStartup's "Session Priming" section) -- this is useful and aligned.
- Stale-index detection is in session-prime.ts:139-153 -- this is useful and aligned.
- The structural context highlights (startup-brief.ts:65-73) are NOT mentioned in the spec's SessionStart description. The highlights appear to have been added as an enhancement beyond the spec requirement.

## Findings

### P2-001: Structural Context Highlights Provide No Value Over On-Demand Tools
- Dimension: on_demand_comparison
- Evidence: [SOURCE: startup-brief.ts:65-73] -- highlights are generic top-5-by-CALLS nodes
- Evidence: [SOURCE: session-prime.ts:118-129] -- handleStartup injects graphOutline unconditionally
- Evidence: [INFERENCE: Live session evidence shows AI ignored all 5 highlights and used CocoIndex search instead]
- Impact: ~100 tokens consumed every session startup with information that (a) was not used in observed sessions, (b) is available on-demand via code_graph_status, and (c) is inferior to task-targeted on-demand alternatives like code_graph_context. This is dead weight in the context window.
- Final severity: P2

### P2-002: Startup Injection Structural Section Not Traceable to Any Spec Requirement
- Dimension: architectural_alignment
- Evidence: [SOURCE: spec.md:99-115] -- SessionStart source=startup described as "tool overview + stale-index detection"
- Evidence: [SOURCE: startup-brief.ts:47-87] -- buildGraphOutline() produces highlights not required by spec
- Evidence: [SOURCE: decision-record.md] -- No DR specifically requires or justifies startup highlights
- Impact: The structural context highlights section was implemented without a corresponding spec requirement or decision record. While the tool overview and stale-index detection are traceable to spec requirements, the highlights section is not. This creates traceability debt -- future reviewers cannot understand why this code exists from the spec alone.
- Final severity: P2

### P2-003: queryStartupHighlights Uses Outgoing CALLS as Sole Heuristic
- Dimension: on_demand_comparison (architectural_alignment secondary)
- Evidence: [SOURCE: code-graph-db.ts:350-379] -- `ORDER BY call_count DESC` using `SUM(CASE WHEN UPPER(e.edge_type) = 'CALLS' THEN 1 ELSE 0 END)`
- Evidence: [SOURCE: code-graph-db.ts:358] -- Only counts edges where the node is the SOURCE (outgoing calls), not the target (incoming calls / callers)
- Impact: The heuristic measures "what calls the most other things" rather than "what is called the most." A node that is a callee of 50 functions is more architecturally significant than a test helper that calls 50 other functions. The observed result (test_specific with 51 outgoing calls) demonstrates this inversion -- test files are over-represented because test methods call many functions. Even if highlights were kept, the selection heuristic is directionally wrong for surfacing architecturally significant nodes.
- Final severity: P2

### P2-004: Graph Scale Stats Duplicate code_graph_status MCP Tool
- Dimension: on_demand_comparison
- Evidence: [SOURCE: startup-brief.ts:49-53] -- getStats() returns totalFiles, totalNodes, totalEdges, lastScanTimestamp
- Evidence: [SOURCE: code-graph-db.ts] -- Same getStats() function is used by the code_graph_status MCP tool handler
- Evidence: [SOURCE: session-prime.ts:101-115] -- handleStartup already tells the AI that `code_graph_status` is available
- Impact: The proactive injection tells the AI "15488 files, 382268 nodes, 198135 edges" and separately tells it that `code_graph_status` is available. The AI could get the same stats by calling that tool if it ever needed them. The proactive stats are informational but not actionable -- knowing the graph has 382K nodes does not inform any decision the AI needs to make at session start.
- Final severity: P2

## Cross-Reference Results
### Core Protocols
- Confirmed: DR-003 (direct import) is followed in startup-brief.ts import chain
- Confirmed: DR-010 (CocoIndex complementary) separation is maintained -- startup-brief only queries code graph, not CocoIndex
- Contradictions: The structural context highlights section is not traceable to any spec requirement (spec.md SessionStart description says "tool overview + stale-index detection," not "highlights")
- Unknowns: Whether the original author intended highlights as a discovery aid or a debugging artifact

### Overlay Protocols
- Confirmed: Hook transport mechanism aligns with DR-002
- Contradictions: None at overlay level
- Unknowns: None

## Ruled Out
- **Session continuity section**: startup-brief.ts:89-103 (buildSessionContinuity) was examined but found to be genuinely useful -- it provides last spec folder and session summary, directly addressing the "session-start is generic" gap identified in the spec. Not a finding.
- **Stale index detection**: session-prime.ts:139-153 was examined but found to be genuinely useful -- it warns about indexes >24h old, directly traceable to spec requirement. Not a finding.
- **Tool overview section**: session-prime.ts:101-115 was examined but found to be genuinely useful -- it lists available tools, directly traceable to spec's "tool overview" requirement. Not a finding.
- **handleCompact path**: Not in scope for this dimension (compact recovery is a different concern from startup priming).

## Sources Reviewed
- [SOURCE: startup-brief.ts:1-113] -- Full file, startup brief builder
- [SOURCE: session-prime.ts:1-253] -- Full file, SessionStart hook handler
- [SOURCE: code-graph-db.ts:350-379] -- queryStartupHighlights function
- [SOURCE: spec.md:86-167] -- Solution architecture, Layer 3, SessionStart description
- [SOURCE: decision-record.md:39-161] -- DR-002 through DR-012

## Assessment
- Confirmed findings: 4
- New findings ratio: 1.00
- noveltyJustification: All 4 findings are new (first iteration to cover on_demand_comparison and architectural_alignment dimensions); weightedNew = 4x1.0 = 4.0, weightedTotal = 4.0, ratio = 1.0
- Dimensions addressed: on_demand_comparison, architectural_alignment

## Reflection
- What worked: The comparison matrix approach was effective for on_demand_comparison. Tracing each startup injection component back to specific spec requirements and DRs revealed the traceability gap clearly.
- What did not work: N/A -- both dimensions were productive on first examination.
- Next adjustment: If subsequent iterations revisit these dimensions, focus on quantifying token cost vs. benefit across multiple sessions rather than a single observed session.
