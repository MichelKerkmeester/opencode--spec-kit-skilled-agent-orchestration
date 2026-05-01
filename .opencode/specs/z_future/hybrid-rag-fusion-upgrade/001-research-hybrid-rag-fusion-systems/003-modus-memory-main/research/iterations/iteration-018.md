# Iteration 018: RISK ASSESSMENT

## Focus
RISK ASSESSMENT: What are the risks of adopting each recommended pattern? What could go wrong?

## Findings

### Finding 1: Review queue risk — a Public `memory_due` inbox will be misleading unless it gets a first-class due-state contract
- **Source**: `external/internal/mcp/vault.go:280-317,856-897`; `external/internal/vault/facts.go:64-157,160-217`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2319-2343`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-71,177-215`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:512-520`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:1194-1202`
- **What it does**: Modus keeps search recall, explicit reinforce, decay, and archive on the same fact fields. Public already persists `access_count`, `last_accessed`, `stability`, `difficulty`, `last_review`, and `review_count`, and `processReview()` computes `nextReviewDate`, but that due date is not persisted and read-time strengthening stays opt-in via `trackAccess=false`.
- **Why it matters for us**: If Public adds a due/review queue without defining one authoritative source of truth for “due,” the queue can drift from actual search behavior. A memory can look overdue while recent read activity updated its effective retrievability, which would make the inbox feel unreliable.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**

### Finding 2: Doctor summary risk — a friendlier `doctor` surface can hide the repair semantics that currently keep Public safe
- **Source**: `external/cmd/modus-memory/doctor.go:13-242`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:343-530`; `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:479-540`
- **What it does**: Modus’s `doctor` is compact: build the index, count issues, print warnings. Public’s health path is richer: degraded/healthy distinction, confirmation-gated auto-repair, FTS/vector/orphan cleanup, and partial-restore error reporting.
- **Why it matters for us**: The risk is lossy compression. If Public promotes a one-screen doctor summary as the main surface, operators may miss whether a problem is merely informational, auto-repairable, or a partial restore failure with rollback details.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

### Finding 3: Lexical expansion risk — copying Modus’s librarian directly would stack another weak branch onto Public’s already-expanded deep pipeline
- **Source**: `external/internal/librarian/search.go:10-52`; `external/internal/mcp/vault.go:280-299`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts:8-18,88-125,148-175`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:616-740`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:173-251`
- **What it does**: Modus asks an LLM for 3-5 keyword variants with no corpus grounding and searches each variant. Public already has deep-mode decomposition, corpus-grounded reformulation, and graph-expanded fallback queries.
- **Why it matters for us**: In Modus this is lightweight; in Public it risks branch explosion, extra latency, and noisier recall. Ungrounded lexical variants can duplicate or fight with stronger grounded/vector lanes, especially when reranking and graph fallback already exist.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 4: Connected-doc hint risk — metadata adjacency is useful as explanation, but risky as a scoring signal
- **Source**: `external/internal/index/crossref.go:41-214`; `external/internal/index/indexer.go:110-136,277-289`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts:532-674`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1474-1503`
- **What it does**: Modus builds an in-memory adjacency map from subject/tag/entity overlap with weights `3/2/1`, using lightweight matching. Public already has causal traversal, neighbor injection, and co-activation enrichment.
- **Why it matters for us**: The risk is precision loss. Substring entity matches and coarse tag overlap can create false positives or duplicate relationships already expressed by Public’s graph layers. If those hints affect ranking, they can pollute better hybrid results.
- **Recommendation**: **prototype later**
- **Impact**: **medium**

### Finding 5: Explicit review action risk — a success-only `memory_reinforce` would undercut Public’s richer FSRS vocabulary
- **Source**: `external/internal/vault/facts.go:188-217`; `external/internal/mcp/vault.go:885-897`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-47,65-71,138-155,198-215`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:164-169`
- **What it does**: Modus exposes a success-only reinforce action: stability up, difficulty slightly down, confidence nudged toward 1.0, access count incremented. Public’s scheduler already supports `AGAIN/HARD/GOOD/EASY`, but the exposed read path only offers opt-in GOOD-style strengthening through `trackAccess`.
- **Why it matters for us**: If Public copies Modus literally, every explicit review starts looking like successful recall. That biases histories upward and makes any later due/review queue less trustworthy because “hard” or failed recall events have no first-class path.
- **Recommendation**: **adopt now**
- **Impact**: **medium**

## Sources Consulted
- `research/iterations/iteration-017.md`
- `external/internal/mcp/vault.go`
- `external/internal/vault/facts.go`
- `external/internal/index/facts.go`
- `external/internal/librarian/search.go`
- `external/internal/index/crossref.go`
- `external/internal/index/indexer.go`
- `external/cmd/modus-memory/doctor.go`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/llm-reformulation.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts`

## Assessment
- New information ratio: **0.74**
- Questions addressed: what breaks if the five iteration-017 candidates are adopted; where Modus’s simpler assumptions conflict with Public’s stronger runtime; which ideas are safe only as control-plane additions rather than ranking-path changes.
- Questions answered: the main risks are semantic and operational, not algorithmic. The safest transfers remain a doctor-style summary and an explicit review action, but only if they preserve Public’s existing repair semantics and graded FSRS model. The riskiest transfer is unbounded lexical expansion. Connected-doc hints are safest as explanation, and a review queue needs an explicit due-state contract before it can be trusted.

## Reflection
- What worked: Tracing each iteration-017 candidate into both systems exposed the seams that matter: persisted schema vs computed due state, grounded vs ungrounded expansion, and graph-backed vs metadata-only relatedness.
- What did not work: Modus rarely encodes these risks as explicit guardrails because its whole design assumes a smaller lexical-only system. The strongest risk evidence came from mismatch against Public, not from explicit failure handling inside Modus.

## Recommended Next Focus
Define the mitigation contract: decide whether `memory_due` needs a persisted `next_review_at` field or a deterministic derived rule, constrain lexical-only expansion to weak-result recovery instead of always-on deep mode, and test connected-docs as an appendix/explanation lane rather than a score-bearing retrieval lane.


Total usage est:        1 Premium request
API time spent:         5m 34s
Total session time:     5m 53s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.2m in, 15.3k out, 1.0m cached, 6.3k reasoning (Est. 1 Premium request)
