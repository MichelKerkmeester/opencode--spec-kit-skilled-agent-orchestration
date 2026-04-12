---
title: "Research: Contextador (003-contextador) -- MCP query interface, self-healing context, Mainframe shared cache"
description: "Source-grounded v3 synthesis on Contextador's MCP query surface, query routing, self-healing repair loop, Mainframe shared cache, budget controls, setup ergonomics, GitHub automation, token-efficiency claims, multi-provider abstraction, and licensing model. Findings are labeled adopt now / prototype later / reject for Code_Environment/Public after a 20-iteration closeout."
trigger_phrases:
  - "contextador research"
  - "mcp query interface research"
  - "self-healing context"
  - "mainframe shared cache"
  - "token efficient navigation"
importance_tier: "normal"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/research.md"]

---
# Research: Contextador (003-contextador)

<!-- ANCHOR:summary -->
This closeout keeps the Contextador packet anchored to source-backed MCP, setup, and cache findings. [SOURCE: external/README.md:1-40] [SOURCE: research/iterations/iteration-020.md:1-24]
<!-- /ANCHOR:summary -->

<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- Research Status: COMPLETE -->

## 1. METADATA

- Research ID: RESEARCH-003-contextador
- Phase: 003-contextador (track 026 graph-and-context-optimization, sub-track 001 research-graph-context-systems)
- Status: Complete
- Date Started: 2026-04-06
- Date Completed: 2026-04-08
- Researchers: cli-codex (gpt-5.4 high) iteration agents for runs 1-13, extended by Codex for runs 14-20 and final synthesis refresh
- Iterations completed: 20 of 20
- Stop reason: user-requested extension to 20 total iterations, with all 12 phase questions explicitly resolved and no new top-level subsystem discovered beyond the already-classified runtime ergonomics lane
- Related: phase-research-prompt.md, spec.md, plan.md, decision-record.md, implementation-summary.md

## 2. INVESTIGATION REPORT

### Request Summary

The phase prompt asked for a source-grounded study of Contextador as a Bun-based MCP query server, with emphasis on its natural-language `context` tool, model-first routing, self-healing feedback loop, Mainframe shared cache, provider abstraction, token-efficiency claims, and licensing constraints. The goal was not a generic product summary, but a direct comparison against current `Code_Environment/Public` retrieval surfaces so we could classify ideas as adopt now, prototype later, or reject. The work also had to resolve overlap boundaries with sibling phases `002-codesight` and `004-graphify`, because Contextador sits in the runtime query/repair/cache lane rather than scan-time artifact generation or graph intelligence. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/phase-research-prompt.md:8-14] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/phase-research-prompt.md:49-80]

### Current State of Code_Environment/Public

`Code_Environment/Public` already has three strong retrieval substrates: CocoIndex for semantic/vector search, Code Graph MCP for structural queries and graph-context expansion, and Spec Kit Memory for memory retrieval plus typed session recovery. That means Contextador is being compared against a stack that already supports semantic search, structural traversal, session bootstrap, memory continuity, anchor-filtered retrieval, and readiness/freshness reporting; the fair question is therefore which Contextador ideas are genuinely additive operational ergonomics rather than replacement retrieval primitives. [SOURCE: .opencode/skill/mcp-coco-index/README.md:42-47] [SOURCE: .opencode/skill/mcp-coco-index/README.md:137-143] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:86-192] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217]

### Key Findings Summary

Contextador remains real software, not README theater: after 20 iterations the traced repo now has source-backed and partly test-backed coverage across bootstrap, routing, feedback intake, generator shape, Janitor staging, Mainframe message mechanics, budget enforcement, setup wizard behavior, GitHub automation, and the remaining core helper modules. The extra 7 runs did not discover a new subsystem; they converted that broad coverage into explicit closure for Q1-Q12 and revalidated the final adoption boundary against current `Code_Environment/Public` surfaces. The core conclusion stayed stable: the live retrieval path is materially thinner than the marketing suggests because the served `context` result is plain text built from a narrow pointer schema over authored `CONTEXT.md` files, not a richer typed context object and not a deeper semantic or structural backend. The final closure pass further narrowed three claims that matter operationally: `.mcp.json` "auto-detection" is project-file generation plus host discovery, Mainframe remains under-governed on privacy/conflict semantics, and the helper layer is weaker than names like `validation.ts` or `writer.ts` imply.

### Recommendations Snapshot

- Adopt now: config-gated bootstrap layering over existing Public retrieval surfaces; it is low-risk, additive, and still the cleanest reusable runtime pattern in the repo.
- Adopt now: generated `.mcp.json` scaffolding plus friendly setup/doctor guidance, but only for project bootstrap ergonomics, not as evidence of deep framework integration.
- Adopt now: benchmark-honest wording for token-efficiency claims; the source now proves the arithmetic and still disproves any measured-93%-savings framing.
- Prototype later: model-first routing facade, query-triggered repair plus deterministic enrichment, Mainframe-style answer-cache reuse, local budget gating, bounded event-driven automation, and selective provider/setup ergonomics.
- Reject: pointer-only context delivery as a primary response model, Contextador as a semantic or structural retrieval replacement, Mainframe's privacy/conflict model as-is, Bun runtime coupling, and any direct source adoption under AGPL/commercial licensing.

### Extension Closure (Iterations 14-20)

The final seven iterations were not a second research branch; they were a deliberate answer-closure pass over the already-traced code. They explicitly resolved the packet's remaining questions by:

- separating the typed `ContextResponse` model from the narrower text-and-pointer MCP contract (`external/src/lib/core/types.ts:49-62`, `external/src/lib/core/pointers.ts:14-190`, `external/src/mcp.ts:185-282`)
- converting the feedback, janitor, and generator path into a bounded self-healing story instead of a vague "self-improving" claim (`external/src/lib/core/feedback.ts:20-143`, `external/src/lib/core/janitor.ts:84-147`, `external/src/lib/core/janitor.ts:387-490`, `external/src/lib/core/generator.ts:101-156`)
- tightening the operational and legal adoption boundary for Mainframe, `.mcp.json` onboarding, and AGPL/commercial licensing (`external/src/lib/mainframe/bridge.ts:26-57`, `external/src/lib/mainframe/client.ts:182-188`, `external/src/cli.ts:141-158`, `external/src/cli.ts:769-776`, `external/package.json:2-7`, `external/LICENSE-COMMERCIAL.md:1-20`)
- rechecking novelty against Public's current semantic, structural, and recovery stack so the keep-vs-reject boundary rests on direct source comparison rather than packet-level intuition (`.opencode/skill/mcp-coco-index/README.md:42-86`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-44`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217`)

## 3. EVIDENCE-BACKED FINDINGS

### Finding 1 -- Bootstrap is root-scoped, config-driven, and keeps Mainframe optional
- Source evidence: `external/src/mcp.ts:34-91`, `external/src/lib/core/projectconfig.ts:19-65`
- Evidence type: source-proven
- What Contextador actually does: `bootstrap()` anchors the server to `CONTEXTADOR_ROOT` or `process.cwd()`, validates scopes against that root, loads project config from `.contextador/config.json`, and only wires provider/Mainframe behavior when configuration enables it. The result is a repo-local MCP server that works in a minimal local mode first and layers in provider setup and shared-cache behavior later.
- Why it matters for Code_Environment/Public: This pattern survives comparison because it is operational architecture, not retrieval substrate. Public could borrow the same feature-gated bootstrap shape around existing CocoIndex, Code Graph, and Memory surfaces without inheriting Contextador's pointer-only delivery model.
- Affected subsystem: MCP bootstrap and provider wiring
- Recommendation: adopt now
- Cross-phase ownership note: firmly in 003-contextador scope because it is runtime surface orchestration, not 002 scan-time generation or 004 graph intelligence.
- Risk / ambiguity / validation requirement: `loadConfig()` uses a shallow merge, so partial nested config blocks can overwrite defaults in surprising ways (`external/src/lib/core/projectconfig.ts:40-64`). Reimplementation should use explicit schema merges.

### Finding 2 -- The MCP surface is 11 explicit tools, but the flagship `context` contract is text-first and pointer-oriented
- Source evidence: `external/src/mcp.ts:180-183`, `external/src/mcp.ts:186-671`, `external/src/mcp.ts:677-686`, `external/src/mcp.ts:97-99`, `external/src/lib/core/types.ts:49-62`, `external/src/lib/core/types.ts:91-97`
- Evidence type: source-proven
- What Contextador actually does: The authoritative MCP surface is statically declared inside `mcp.ts`: `context`, `context_feedback`, `context_status`, `context_sweep`, `context_stats`, `context_init`, `context_generate`, `mainframe_pause`, `mainframe_resume`, `mainframe_tasks`, and `mainframe_request`. Even though library types define a richer `ContextResponse`, the live `context` tool returns `text(...)`, not a typed JSON payload.
- Why it matters for Code_Environment/Public: The tool inventory is easy to audit, but the flagship query surface is materially weaker than Public's split-but-richer typed interfaces. A single "ask one question" tool is attractive ergonomically, but in Contextador that convenience comes bundled with shallow output.
- Affected subsystem: MCP query interface
- Recommendation: reject
- Cross-phase ownership note: 003 owns the runtime query surface; the weakness here is specifically in 003's delivery format, not in 002 or 004 concerns.
- Risk / ambiguity / validation requirement: The richer response types may still matter in non-MCP library call sites, but the traced stdio MCP surface does not use them.

### Finding 3 -- `routeQuery()` is model-first, then hard-falls back to deterministic keyword routing with validation and fan-out
- Source evidence: `external/src/lib/core/headmaster.ts:61-126`, `external/src/lib/core/headmaster.ts:128-157`, `external/src/lib/core/headmaster.ts:159-197`, `external/src/lib/core/headmaster.ts:199-242`, `external/src/mcp.ts:212-246`, `external/src/lib/core/headmaster.test.ts:8-22`, `external/src/lib/core/headmaster.test.ts:24-38`
- Evidence type: source-proven plus test-confirmed branch behavior
- What Contextador actually does: Routing first asks `local-fast` to return JSON `targetScopes`. If model lookup, generation, or JSON parsing fails, the code drops entirely into `keywordFallback()`, which scores scopes from normalized keywords, adds scope-path boosts, reuses hit-log bonuses, and fans out to every non-root scope within 60% of the top score. Tests now confirm two canonical branches: short-circuiting to the deepest specific scope with a populated context chain, and ambiguous fan-out across multiple targets. Ranking quality, failure tracing, and messy-tree robustness remain source-only because the test file covers only those two happy-path scenarios.
- Why it matters for Code_Environment/Public: This remains a genuinely interesting ergonomic layer over existing artifacts. Public does not currently expose a single model-first routing facade that decides when to hit semantic search, memory, or graph tools on the user's behalf.
- Affected subsystem: query routing
- Recommendation: prototype later
- Cross-phase ownership note: this is the core 003 lane; it consumes context artifacts and runtime signals rather than generating artifacts or graph structure.
- Risk / ambiguity / validation requirement: The model branch hides failure causes, and fuzzy scope validation can silently coerce a weak prediction into a nearby real scope. Any Public prototype needs tracing, confidence surfaces, replayable fallback diagnostics, and route-quality benchmarking beyond the two tested branches.

### Finding 4 -- The routing corpus and served payload depend on authored `CONTEXT.md` plus optional `briefing.md`, not on a true semantic or graph backend
- Source evidence: `external/src/lib/core/headmaster.ts:16-36`, `external/src/lib/core/headmaster.ts:199-203`, `external/src/lib/core/pointers.ts:23-138`, `external/src/lib/core/briefing.ts:21-27`, `external/src/lib/core/briefing.ts:29-45`, `external/src/lib/core/briefing.ts:61-77`, `external/src/lib/core/pointers.test.ts:37-68`, `external/src/lib/core/pointers.test.ts:70-126`
- Evidence type: source-proven plus test-confirmed parser grammar; lossiness remains inferred
- What Contextador actually does: `routeQuery()` either loads `.contextador/briefing.md` or builds a summary from the first lines of every `CONTEXT.md`. The live context payload is then extracted from heading-specific markdown patterns in `CONTEXT.md`; it is not assembled from code symbols, embeddings, or graph traversal. The pointer tests now confirm the supported extraction grammar and graceful degradation for missing sections, but they do not measure how much real-world detail is lost when the output is flattened into the compact pointer schema.
- Why it matters for Code_Environment/Public: This explains both the speed and the limitation. Contextador is better understood as a summary-routing overlay than as a retrieval engine that competes with CocoIndex or Code Graph.
- Affected subsystem: routing corpus and context substrate
- Recommendation: reject
- Cross-phase ownership note: 002-codesight can own artifact generation; 003 should not be misdescribed as the artifact-authoring phase.
- Risk / ambiguity / validation requirement: Retrieval quality is tightly coupled to author discipline and freshness of `CONTEXT.md` and `briefing.md`. Any evaluation should benchmark artifact drift and answer-quality loss, not just query latency.

### Finding 5 -- The self-healing loop is real, but the explicit feedback path is narrower than the return message suggests
- Source evidence: `external/src/lib/core/feedback.ts:24-47`, `external/src/lib/core/feedback.ts:53-97`, `external/src/lib/core/feedback.ts:106-143`, `external/src/mcp.ts:104-115`, `external/src/mcp.ts:296-340`, `external/src/lib/core/stats.ts:29-41`, `external/src/lib/core/stats.ts:53-58`, `external/src/lib/core/feedback.test.ts:50-72`, `external/src/lib/core/feedback.test.ts:74-145`
- Evidence type: source-proven plus test-confirmed intake behavior
- What Contextador actually does: `context_feedback` updates `feedback_failures` in `CONTEXT.md`, appends missing files into `## Key Files`, queues repair work when needed, records feedback stats, and may synchronously run `processRepairQueue()` before calling `enrichFromFeedback()`. Tests now confirm the intake boundary: `missing_context` appends files and bumps failures, `build_failure` and `wrong_location` enqueue janitor work, repeated failures increment counters, and `recordSuccess()` increments success counts. What remains source-only is the broader claim implied by the user-facing confirmation text: the explicit feedback path still does not show a full autonomous background freshness sweep or an end-to-end verified repair completion.
- Why it matters for Code_Environment/Public: This is still one of the most additive ideas in the whole repo. Live retrieval misses can produce durable artifact fixes, but the implementation should be described as bounded patch-and-repair, not as a full autonomous maintenance loop on every feedback report.
- Affected subsystem: feedback ingestion and self-healing entrypoint
- Recommendation: prototype later
- Cross-phase ownership note: this is canonical 003 scope because it is runtime repair after retrieval misses, not scan-time artifact production.
- Risk / ambiguity / validation requirement: `addToKeyFiles()` does not deduplicate repeated missing-file bullets, and the returned confirmation text still overstates what the code guarantees beyond the now-tested intake mutations.

### Finding 6 -- Repair queue processing and enrichment mix deterministic file IO with model-driven regeneration, and the loop is only locally bounded
- Source evidence: `external/src/lib/core/janitor.ts:65-81`, `external/src/lib/core/janitor.ts:89-147`, `external/src/lib/core/generator.ts:7-18`, `external/src/lib/core/generator.ts:21-47`, `external/src/lib/core/generator.ts:49-64`, `external/src/lib/core/generator.ts:76-99`, `external/src/lib/core/generator.ts:101-157`, `external/src/mcp.ts:119-174`, `external/src/lib/core/feedback.ts:87-96`, `external/src/lib/core/janitor.ts:242-272`, `external/src/lib/core/generator.test.ts:7-25`, `external/src/lib/core/generator.test.ts:27-44`, `external/src/lib/core/generator.test.ts:46-68`
- Evidence type: source-proven plus test-confirmed filesystem and output-shape behavior
- What Contextador actually does: `processRepairQueue()` creates or refreshes full `CONTEXT.md` files, and `generateContextContent()` uses bounded file previews plus one `local-fast` model call, with a deterministic directory-listing fallback on model failure. `enrichFromFeedback()` is fully rule-based: it reads reported files, extracts a short description, rewrites `Key Files`, and appends `Notes`. The tests now confirm directory filtering, depth capping, and the minimal file-shape guarantee that generated output includes frontmatter plus non-empty body text. Still source-only are the harder claims: regeneration quality, hand-edit preservation, queue retry behavior, and the end-to-end interaction between feedback enqueueing and eventual successful repair.
- Why it matters for Code_Environment/Public: This remains a strong prototype-later candidate because it combines deterministic remediation with optional model assistance, which is often the right ergonomics boundary. But it should not be described as a strongly bounded or self-stabilizing maintenance system.
- Affected subsystem: repair queue, enrichment, and boundedness
- Recommendation: prototype later
- Cross-phase ownership note: runtime artifact repair stays in 003; any future artifact-generation rules still belong upstream to 002.
- Risk / ambiguity / validation requirement: Whole-file regeneration can discard hand-edited nuance, queue failures have no retry cutoff or backoff, and basename-only enrichment can collide for same-named files in different folders.

### Finding 7 -- Janitor combines deterministic freshness heuristics with six maintenance stages, but only part of that story is test-backed
- Source evidence: `external/src/lib/core/freshness.ts:4-6`, `external/src/lib/core/freshness.ts:95-153`, `external/src/lib/core/freshness.ts:155-170`, `external/src/lib/core/janitor.ts:149-157`, `external/src/lib/core/janitor.ts:167-235`, `external/src/lib/core/janitor.ts:242-272`, `external/src/lib/core/janitor.ts:279-311`, `external/src/lib/core/janitor.ts:317-379`, `external/src/lib/core/janitor.ts:387-490`, `external/src/mcp.ts:436-448`, `external/src/lib/core/stats.ts:68-73`, `external/src/lib/core/freshness.test.ts:4-40`, `external/src/lib/core/janitor.test.ts:8-22`, `external/src/lib/core/hitlog.test.ts:22-36`, `external/src/lib/core/docsync.ts:30-119`, `external/src/lib/core/docsync.ts:149-268`, `external/src/lib/core/depscan.ts:48-213`
- Evidence type: source-proven plus helper-level test confirmation
- What Contextador actually does: Freshness is computed from git drift and frontmatter success/failure ratios, then Janitor runs six stages in code order: repair queue, freshness sweep, new-scope detection, dependency scan, hit-log cleanup, and doc-sync artifact regeneration. The extra pass clarified two things. First, helper-level tests now confirm frontmatter parsing/building, day-difference math, empty-queue no-op, new-scope detection, and hit-log pruning. Second, the closing module sweep traced `docsync.ts` and `depscan.ts`, so the late-stage dependency/doc regeneration is now fully source-proven. What still remains mostly source-only is the operational end-to-end claim: there is no substantial test coverage for full staged execution, stale-policy quality, or write-side cleanup breadth.
- Why it matters for Code_Environment/Public: The useful takeaway is still not Janitor as a brand, but the coupling of deterministic freshness thresholds with a staged maintenance pass. Public already has bounded freshness/readiness checks; what it lacks is this kind of integrated artifact-repair sweep.
- Affected subsystem: janitor orchestration and freshness handling
- Recommendation: prototype later
- Cross-phase ownership note: 003 owns runtime freshness/repair ergonomics; 004 graph refresh is a separate concern.
- Risk / ambiguity / validation requirement: Reimplementation should keep the deterministic thresholds but add auditable write tracking, dry-run mode, explicit stage-level mutability, and stronger tests, because Contextador's stage names still over-promise relative to the proven execution surface.

### Finding 8 -- Mainframe is a Matrix-backed shared answer cache whose protocol mechanics are partly test-confirmed, but lifecycle robustness is still mostly source-only
- Source evidence: `external/src/lib/mainframe/rooms.ts:6-69`, `external/src/lib/mainframe/bridge.ts:119-123`, `external/src/lib/mainframe/bridge.ts:128-166`, `external/src/lib/mainframe/bridge.ts:157-175`, `external/src/lib/mainframe/bridge.ts:216-250`, `external/src/lib/mainframe/dedup.ts:8-26`, `external/src/lib/mainframe/summarizer.ts:17-21`, `external/src/lib/mainframe/summarizer.ts:79-99`, `external/src/mcp.ts:193-208`, `external/src/lib/core/hitlog.ts:9-18`, `external/src/lib/mainframe/rooms.test.ts:4-28`, `external/src/lib/mainframe/dedup.test.ts:5-26`, `external/src/lib/mainframe/summarizer.test.ts:19-53`
- Evidence type: source-proven plus partly test-confirmed protocol behavior
- What Contextador actually does: Mainframe does not maintain a separate cache object. It scans recent Matrix room history for prior `broadcast` events, matches them by a query hash built from normalized keywords, can summarize room history into digest messages, stores janitor locks and room budget as Matrix state, and replays matching pointer payloads on cache hit. The extended loop upgraded confidence at the protocol layer: tests now confirm broadcast/request envelope shapes, exact-hash matching, stale-timestamp rejection, and summary serialization thresholds. What is still source-only is the full cache lifecycle: the bridge's memoized fetch window, room-history windowing, missing-timestamp behavior on real broadcasts, and whether summary compaction is actually exercised in practice.
- Why it matters for Code_Environment/Public: This is still the clearest new operational pattern that Public does not already expose. Shared memory exists in Public, but it is persisted knowledge storage and governed collaboration, not a cross-agent answer-cache keyed by recent query history.
- Affected subsystem: Mainframe shared cache and cross-agent reuse
- Recommendation: prototype later
- Cross-phase ownership note: this is purely 003 territory; 004 graphify can consume shared signals later, but it does not own answer-cache semantics.
- Risk / ambiguity / validation requirement: Query hashing is intentionally coarse, the TTL/freshness story is only partly exercised, and summary posting has no proven dedup/reconciliation path. A Public prototype would need stronger cache keys, explicit timestamps, and tested invalidation logic.

### Finding 9 -- Mainframe's privacy and distributed-consistency model is still materially weaker than its collaboration pitch
- Source evidence: `external/src/mcp.ts:66-90`, `external/src/lib/mainframe/bridge.ts:26-57`, `external/src/lib/mainframe/bridge.ts:80-83`, `external/src/lib/mainframe/bridge.ts:169-175`, `external/src/lib/mainframe/bridge.ts:216-250`, `external/src/lib/mainframe/client.ts:81-92`, `external/src/lib/mainframe/client.ts:124-129`, `external/src/lib/mainframe/client.ts:163-172`, `external/src/lib/mainframe/client.ts:182-188`, `external/src/lib/mainframe/summarizer.ts:101-108`, `external/src/lib/mainframe/client.test.ts:4-18`, `external/src/lib/mainframe/rooms.test.ts:4-28`
- Evidence type: source-proven; new tests do not materially reduce the risk
- What Contextador actually does: Once enabled, Mainframe persists a stable local agent identity and plaintext password in `.contextador/mainframe-agent.json`, posts raw query text, scopes, pointers, and token metadata into room history, and coordinates janitor and budget state through blind Matrix room-state writes. Rooms are created as `visibility: "private"` but with `preset: "public_chat"` and an inline comment saying any registered user may join. The new tests barely touch this risk surface: `rooms.test.ts` only validates payload shapes, and `client.test.ts` only covers construction defaults plus agent-id generation/override.
- Why it matters for Code_Environment/Public: This design is operationally simple, but the privacy and coordination tradeoffs are still real. It is not a ready-made model for governed multi-user environments, and the added test pass did not change that conclusion.
- Affected subsystem: privacy, identity, and distributed consistency
- Recommendation: reject
- Cross-phase ownership note: still 003 scope because this is about cache/coordination transport, not artifact generation or graph semantics.
- Risk / ambiguity / validation requirement: Any Public experiment in this area needs scoped identities, audited retention, conflict resolution, non-plaintext secret handling, and explicit reconciliation of shared budget/lock state from day one.

### Finding 10 -- `stats.ts` reports estimated token savings, so the README's 93% claim is estimated, not measured
- Source evidence: `external/src/lib/core/stats.ts:26-28`, `external/src/lib/core/stats.ts:43-50`, `external/src/lib/core/stats.ts:60-65`, `external/src/lib/core/stats.ts:75-107`, `external/src/cli.ts:557-577`, `external/README.md:13-19`, `external/README.md:31-38`, `external/src/lib/core/stats.test.ts:8-14`, `external/src/lib/core/stats.test.ts:16-25`, `external/src/lib/core/stats.test.ts:36-52`
- Evidence type: both, with test-confirmed internal arithmetic
- What Contextador actually does: The stats system stores aggregate counters such as queries served, cache hits, and recorded token usage. Savings are derived from fixed constants like `AVG_MANUAL_EXPLORATION_TOKENS = 25000` and `AVG_CACHE_SAVINGS_TOKENS = 25000`, then surfaced by the CLI as `Tokens saved (est.)`. The new tests confirm that the counters and arithmetic behave exactly as encoded. They do not validate the business claim behind the constants, and the README still markets "93% fewer tokens" with an example that does not numerically line up with 93%.
- Why it matters for Code_Environment/Public: This is a positive lesson even though the implementation itself should be rejected. Public should keep its current budget/trace posture and treat any future token-efficiency claims as benchmark outputs or clearly labeled estimates, never as blended marketing math.
- Affected subsystem: token-efficiency reporting and evidence quality
- Recommendation: adopt now
- Cross-phase ownership note: 003 owns runtime-efficiency framing, so this lesson belongs here rather than in 002 or 004.
- Risk / ambiguity / validation requirement: A Public benchmark needs per-query baselines, avoided-read accounting, and explicit measurement methodology before any percentage headline is published.

### Finding 11 -- Provider abstraction is real, but it is finite and implemented as explicit adapters plus one OpenAI-compatible escape hatch
- Source evidence: `external/src/lib/providers/config.ts:6-13`, `external/src/lib/providers/config.ts:15-44`, `external/src/lib/providers/config.ts:46-63`, `external/src/lib/providers/config.ts:76-112`, `external/src/lib/providers/config.ts:114-132`, `external/src/lib/setup/wizard.ts:31-114`
- Evidence type: source-proven
- What Contextador actually does: The source explicitly supports `anthropic`, `openai`, `google`, `copilot`, `openrouter`, `custom`, and `claude-code`. The wizard offers those seven options and tests connectivity for everything except host-provided `claude-code`. "Local models" are not a separate subsystem; they ride through the generic OpenAI-compatible `custom` path.
- Why it matters for Code_Environment/Public: This is additive setup/runtime ergonomics, not a new retrieval substrate. A unified provider abstraction around existing Public tools could reduce configuration friction, especially when multiple surfaces need provider-aware behavior.
- Affected subsystem: multi-provider abstraction
- Recommendation: prototype later
- Cross-phase ownership note: still 003 because this is runtime/provider orchestration, not scan-time analysis or graph reasoning.
- Risk / ambiguity / validation requirement: README-style wording like "Any AI provider" overstates what the code proves. A Public prototype should advertise the exact supported adapters and compatibility-mode boundaries.

### Finding 12 -- `.mcp.json` auto-detection is really project-file generation plus editor discovery, and the adopt-now value is narrower than v1 implied
- Source evidence: `external/src/lib/setup/wizard.ts:299-325`, `external/src/lib/setup/wizard.ts:328-335`, `external/src/lib/setup/wizard.ts:116-149`, `external/src/cli.ts:141-145`, `external/src/cli.ts:769-776`, `external/src/lib/frameworks/index.ts:1-2`, `external/src/lib/frameworks/hermes.ts:1-46`, `external/src/lib/frameworks/openclaw.ts:1-53`, `external/src/lib/ui.ts:20-33`, `external/src/lib/ui.ts:152-190`
- Evidence type: source-proven, with README/inferred marketing gap explicitly narrowed
- What Contextador actually does: The setup wizard records provider/framework/Mainframe choices in `~/.contextador/config.json` and tells the user to run `contextador init`; it does not itself initialize project MCP wiring. `contextador init` writes a generic project-root `.mcp.json` only when the file is missing, and `doctor` later checks only for file presence before warning that MCP editors will not auto-detect Contextador if the file is absent. The framework layer is thinner than v1 implied: the wizard offers four labels (`claude-code`, `openclaw`, `hermes`, `other`), but only OpenClaw and Hermes have dedicated modules, and even those mostly emit a single helper markdown artifact rather than deep host integration.
- Why it matters for Code_Environment/Public: The surviving value is still real, but narrower. Public can borrow generated project scaffolding, setup prompts, and doctor-style hints; it should not infer that Contextador proves rich framework auto-detection or deep preset automation.
- Affected subsystem: setup automation and editor discovery
- Recommendation: adopt now
- Cross-phase ownership note: 003 owns runtime entry ergonomics; 002 and 004 are downstream consumers once the tools are available.
- Risk / ambiguity / validation requirement: Reimplementation should preserve Public's existing wrapper schema conventions and make the generated config explain what is scaffolded versus what is merely discovered by the host.

### Finding 13 -- Bun is a hard runtime boundary for Contextador's CLI and setup flows
- Source evidence: `external/src/cli.ts:1`, `external/package.json:27-33`, `external/package.json:44-53`, `external/src/lib/setup/wizard.ts:218-255`, `external/src/cli.ts:807-808`, `external/TROUBLESHOOTING.md:9-24`
- Evidence type: source-proven
- What Contextador actually does: The CLI shebang is `#!/usr/bin/env bun`, `package.json` declares Bun-based scripts and `engines.bun >=1.0.0`, and setup/doctor flows use Bun runtime APIs such as `Bun.spawn()`. Troubleshooting instructions tell users to install Bun when setup cannot start.
- Why it matters for Code_Environment/Public: This is not a portable Node-neutral reference implementation. Public should treat Contextador as a design reference, not a runtime template, unless there is a separate strategic decision to standardize on Bun.
- Affected subsystem: runtime assumptions and deployment portability
- Recommendation: reject
- Cross-phase ownership note: runtime/deployment assumptions belong to 003 when evaluating operability.
- Risk / ambiguity / validation requirement: None beyond the direct portability cost; the code is clear that Bun is required.

### Finding 14 -- The licensing model is AGPL-3.0-or-later by default with a separate commercial track, so adoption means study plus reimplementation, not source copying
- Source evidence: `external/package.json:2-7`, `external/package.json:6`, `external/README.md:113-117`, `external/LICENSE:1`, `external/LICENSE-COMMERCIAL.md:1-20`
- Evidence type: both
- What Contextador actually does: The repository metadata declares `AGPL-3.0-or-later`, while `LICENSE-COMMERCIAL.md` offers a proprietary alternative for closed-source or support-driven use. The README shortens the open-source label to `AGPL-3.0`, but the repo metadata and commercial side letter together make the intended dual-track model explicit.
- Why it matters for Code_Environment/Public: This is still the largest adoption constraint in the packet. Any recommendation that survives comparison must default to concept transfer and clean-room reimplementation rather than direct reuse of Contextador source.
- Affected subsystem: licensing and adoption strategy
- Recommendation: reject
- Cross-phase ownership note: applies across all sibling phases, but it is especially important in 003 where tempting operational code paths exist.
- Risk / ambiguity / validation requirement: This report is not legal advice. Before any direct dependency or code import is considered, licensing review would be required.

### Finding 15 -- Public already wins on retrieval substrate; Contextador's surviving value is runtime retrieval ergonomics
- Source evidence: `external/src/mcp.ts:185-277`, `external/src/lib/core/pointers.ts:14-20`, `external/src/lib/core/pointers.ts:151-190`, `.opencode/skill/mcp-coco-index/README.md:42-47`, `.opencode/skill/mcp-coco-index/README.md:137-143`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:86-192`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:68-143`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217`
- Evidence type: source-proven plus inferred comparison
- What Contextador actually does: It compresses routing, retrieval, and presentation into one markdown-pointer pipeline over authored artifacts. Public instead splits those concerns across stronger specialized tools: CocoIndex for semantic search, Code Graph for structural precision, and Memory/session bootstrap for continuity and recovery.
- Why it matters for Code_Environment/Public: This remains the synthesis headline. Contextador is not a retrieval replacement for Public; it is a source of ideas about runtime ergonomics on top of a retrieval substrate that Public already has and that is materially stronger.
- Affected subsystem: overall architectural comparison
- Recommendation: reject
- Cross-phase ownership note: this is the boundary-setting conclusion for 003 relative to 002 and 004.
- Risk / ambiguity / validation requirement: The comparison is fair only if Public keeps its current retrieval stack healthy; if those surfaces regress, the ergonomic gap becomes more tempting.

### Finding 16 -- `budget.ts` is a real local cost-control subsystem, but it is not a durable shared quota service
- Source evidence: `external/src/lib/mainframe/budget.ts:16-22`, `external/src/lib/mainframe/budget.ts:24-27`, `external/src/lib/mainframe/budget.ts:29-46`, `external/src/lib/mainframe/budget.ts:57-73`, `external/src/lib/mainframe/budget.ts:90-100`, `external/src/lib/mainframe/bridge.ts:119-123`, `external/src/lib/mainframe/bridge.ts:145-185`, `external/src/lib/mainframe/bridge.ts:283-289`, `external/src/lib/mainframe/budget.test.ts:4-42`
- Evidence type: source-proven plus test-confirmed enforcement rules
- What Contextador actually does: The budget tracker gates daily spend, room-hour ceilings, pause state, hard kill state, and one-shot 80% alerting. The bridge hydrates room-budget state on connect, uses `canRead()` for history/task requests, and uses `canSpend(tokensUsed)` before broadcasting. The tests now confirm the user-visible enforcement rules that matter first: daily overspend blocking, room-hour blocking, pause semantics, hard kill/read blocking, and one-shot alert behavior. What is not proven is the shared-state durability story: the tracker has no independent persisted snapshot, no hourly reset logic, and no tested reconciliation path after the bridge writes updated room state.
- Why it matters for Code_Environment/Public: This is worth separating from the broader Mainframe cache finding because it is the clearest reusable "local guardrail on expensive collaboration" pattern in the codebase. It is more plausible for Public than the rest of Mainframe, but only as a bounded local cost gate, not as a shared quota authority.
- Affected subsystem: Mainframe budget and spend gating
- Recommendation: prototype later
- Cross-phase ownership note: still 003 scope because this is runtime coordination and cost gating around query/cache behavior.
- Risk / ambiguity / validation requirement: Any Public prototype needs explicit persistence semantics, reconciliation after reconnect, concurrency-safe shared updates, and clear distinction between local budget state and collaborative room budget state.

### Finding 17 -- The GitHub integration is a real bounded automation pipeline, but it is a CLI-local workflow with light proof rather than a hardened MCP-integrated subsystem
- Source evidence: `external/src/lib/github/index.ts:1-3`, `external/src/lib/github/types.ts:1-53`, `external/src/lib/github/triage.ts:39-113`, `external/src/lib/github/triage.ts:168-232`, `external/src/lib/github/triage.ts:238-296`, `external/src/lib/github/webhook.ts:35-68`, `external/src/lib/github/webhook.ts:73-148`, `external/src/lib/github/webhook.ts:168-275`, `external/src/cli.ts:403-553`, `external/src/cli.ts:587-603`, `external/src/cli.ts:927-935`, `external/src/mcp.ts:180-215`, `external/src/lib/github/triage.test.ts:27-108`, `external/src/lib/github/webhook.test.ts:1-12`
- Evidence type: source-proven plus light helper-level test coverage
- What Contextador actually does: The GitHub layer exposes `contextador webhook ...` as a CLI command family, verifies signatures, filters branches and event types, triages changed files through a deterministic narrowing pass plus narrow model decision, then runs a targeted sweep that rewrites only affected scopes and refreshes derived artifacts. It does not call the MCP `context` tool and does not demonstrate Mainframe coordination in practice. The test surface is thin: helper utilities are covered, but the HTTP handler, signature verification, triage model path, and targeted sweep side effects are not meaningfully integration-tested.
- Why it matters for Code_Environment/Public: This is the strongest "real workflow, light proof" example in the repo. The reusable value is not GitHub itself; it is the bounded automation pattern: cheap deterministic filter, narrow model adjudication, scoped repair, and append-only event logging.
- Affected subsystem: event-driven automation over Contextador core services
- Recommendation: prototype later
- Cross-phase ownership note: 003 owns this because the pattern sits on top of runtime routing/repair surfaces rather than scan-time generation or graph reasoning.
- Risk / ambiguity / validation requirement: A Public prototype should treat transport as secondary, require explicit dry-run and audit trails, and avoid claiming robustness until end-to-end webhook/event tests exist.

### Finding 18 -- The closing helper sweep narrows several over-broad assumptions and fully closes the Janitor support-story coverage gap
- Source evidence: `external/src/lib/core/agents.ts:18-45`, `external/src/lib/core/agents.ts:47-103`, `external/src/lib/core/validation.ts:12-20`, `external/src/lib/core/validation.ts:27-60`, `external/src/lib/core/writer.ts:15-66`, `external/src/lib/core/sizecheck.ts:4-33`, `external/src/lib/core/docsync.ts:30-119`, `external/src/lib/core/docsync.ts:149-268`, `external/src/lib/core/depscan.ts:48-213`, `external/src/lib/core/demolish.ts:23-70`, `external/src/lib/core/janitor.ts:330-330`, `external/src/lib/core/janitor.ts:457-464`, `external/src/lib/github/webhook.ts:137-142`, `external/src/cli.ts:372-372`
- Evidence type: source-proven
- What Contextador actually does: The remaining helper modules materially narrow earlier assumptions. `agents.ts` is prompt orchestration over scope-local `CONTEXT.md`, not another durable identity surface, so F9's privacy concern stays scoped to optional Mainframe enablement. `validation.ts` checks only file existence, a three-item subset of `## Key Files`, and a freshness stamp, which is much weaker than a full contract validator. `writer.ts` plans coordination metadata and returns a response shape, but performs no file writes, locking, atomic swap, or dry-run logic. `sizecheck.ts` is a repo-adoption heuristic, not a context-size validator. `docsync.ts` and `depscan.ts` now fully close the Janitor doc/dependency stage story as deterministic regeneration from `CONTEXT.md` cues, not semantic reconciliation. `demolish.ts` removes Contextador-owned artifacts on the happy path, but swallows failures and intentionally leaves residue when ownership cannot be proven.
- Why it matters for Code_Environment/Public: This finding tightens several recommendations. It confirms that the helper layer contains useful patterns, but many names overstate their guarantees. It also closes the Janitor coverage story enough that remaining uncertainty is now concentrated in tests and operational robustness, not unread production modules.
- Affected subsystem: core helper contracts and Janitor support modules
- Recommendation: prototype later
- Cross-phase ownership note: still 003 because these helpers support runtime routing, repair, automation, and cleanup rather than scan-time artifact generation or graph intelligence.
- Risk / ambiguity / validation requirement: Public should adopt only the deterministic patterns it can name honestly. If a future implementation wants stronger guarantees, validation, write integrity, and cleanup completeness must be designed explicitly rather than assumed from Contextador's filenames.

## 4. CROSS-COMPARISON TABLE (vs Code_Environment/Public)

| Capability | Contextador implementation | Public equivalent (CocoIndex / Code Graph MCP / Spec Kit Memory) | Verdict (NEW / DUPLICATE / HYBRID / NEGATIVE) | Recommendation |
| --- | --- | --- | --- | --- |
| MCP query interface for codebase questions | One primary `context` tool takes a natural-language question, optionally checks Mainframe, routes locally, then reads `CONTEXT.md` files and returns serialized pointer text (`external/src/mcp.ts:185-277`). | Public deliberately splits this into `memory_context()` for orchestration, CocoIndex for semantic search, and `code_graph_query()` / `code_graph_context()` for structural follow-up (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50`, `.opencode/skill/system-spec-kit/SKILL.md:767-802`). | NEGATIVE | Reject as a replacement; only study the facade ergonomics. |
| Semantic search backend | Source-proven live path is routed `CONTEXT.md` lookup plus pointer extraction and serialization; no vector or embedding index appears on the traced `context` path (`external/src/mcp.ts:212-245`, `external/src/lib/core/pointers.ts:23-38`, `external/src/lib/core/pointers.ts:151-190`). | CocoIndex is a real vector-search subsystem with indexing, embedding models, SQLite vector storage, and a dedicated MCP search tool (`.opencode/skill/mcp-coco-index/README.md:42-47`, `.opencode/skill/mcp-coco-index/README.md:53-59`, `.opencode/skill/mcp-coco-index/README.md:137-143`, `.opencode/skill/mcp-coco-index/README.md:161-170`). | NEGATIVE | Reject. Public already has the stronger semantic backend. |
| Structural query backend (callers, imports, dependencies) | Pointer payloads expose only summary dependencies and API/test lists parsed from markdown headings, not symbol-level traversal (`external/src/lib/core/pointers.ts:14-20`, `external/src/lib/core/pointers.ts:80-138`, `external/src/lib/core/pointers.ts:151-190`). | Public has `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, transitive traversal, seed-based expansion, and graph-context responses (`.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:9-16`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:86-192`). | NEGATIVE | Reject. Public's structural layer is materially stronger. |
| Self-healing / stale-context repair | Missing scopes are queued, repair sweeps run, and feedback can patch or enrich `CONTEXT.md` by reading discovered files (`external/src/mcp.ts:101-115`, `external/src/mcp.ts:117-174`, `external/src/mcp.ts:224-255`, `external/src/lib/core/feedback.ts:106-143`). | Public has readiness and freshness guidance plus bounded verify/fix flows, but not a query-triggered markdown repair loop (`.opencode/skill/system-spec-kit/SKILL.md:612-613`, `.opencode/skill/system-spec-kit/SKILL.md:782-786`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:118-133`). | HYBRID | Prototype later. This is one of Contextador's clearest additive ideas. |
| Cross-agent shared cache | Mainframe replays recent query results from Matrix room history by query hash, with janitor locks and shared budget state (`external/src/lib/mainframe/bridge.ts:128-166`, `external/src/lib/mainframe/bridge.ts:216-249`, `external/src/mcp.ts:200-208`). | Public has shared-memory spaces and governed collaboration, but not a query-hash answer cache (`.opencode/skill/system-spec-kit/SKILL.md:583-589`, `.opencode/skill/system-spec-kit/SKILL.md:616-617`, `.opencode/skill/system-spec-kit/SKILL.md:702-708`). | HYBRID | Prototype later, but only with stronger privacy and conflict controls. |
| Token-efficiency reporting / measurement | Savings come from fixed token constants and aggregate counters, not measured per-query avoided reads (`external/src/lib/core/stats.ts:26-28`, `external/src/lib/core/stats.ts:75-107`). | Public emphasizes token budgets, anchor-filtered retrieval, progressive disclosure, and typed traces rather than a broad savings percentage (`.opencode/skill/system-spec-kit/SKILL.md:591-591`, `.opencode/skill/system-spec-kit/SKILL.md:604-605`, `.opencode/skill/system-spec-kit/SKILL.md:638-640`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:131-139`). | NEGATIVE | Reject the measurement model; adopt only the discipline of clear estimate labeling. |
| Multi-provider abstraction | Explicit support for Anthropic, OpenAI, Google, Copilot, OpenRouter, custom OpenAI-compatible endpoints, and `claude-code` (`external/src/lib/providers/config.ts:6-13`, `external/src/lib/providers/config.ts:46-63`, `external/src/lib/providers/config.ts:76-112`). | Public supports multiple backend choices at the embedding/config layer, but not as one unified user-facing provider abstraction (`.opencode/skill/mcp-coco-index/README.md:55-57`, `.opencode/skill/mcp-coco-index/README.md:139-140`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:67-73`). | NEW | Prototype later. This is an ergonomics gain, not a retrieval moat. |
| `.mcp.json` auto-detection / framework setup | `contextador init` writes `.mcp.json`, and README language relies on editors discovering that file (`external/src/cli.ts:141-145`, `external/src/cli.ts:769-776`, `external/README.md:51-57`). | Public setup is more manual, with richer runtime recovery after install rather than generated per-project MCP config (`.opencode/skill/mcp-coco-index/README.md:94-126`, `.opencode/skill/system-spec-kit/SKILL.md:741-757`). | NEW | Adopt now as onboarding automation, with Public's existing config conventions. |
| Memory continuity / session resumption | Mainframe replays cached answers and can summarize room history, but it is not a full merged recovery surface (`external/src/mcp.ts:200-208`, `external/src/lib/mainframe/bridge.ts:128-166`, `external/src/lib/mainframe/bridge.ts:205-214`). | Public has typed `session_resume()` and `session_bootstrap()` that merge memory context, graph freshness, CocoIndex status, health, and next actions (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:68-143`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217`). | NEGATIVE | Reject. Public's recovery surface is already deeper. |
| Pointer-based context delivery format | The served payload is a compact fixed schema rendered as plain text: `purpose`, `keyFiles`, `dependencies`, `apiSurface`, `tests` (`external/src/lib/core/pointers.ts:14-20`, `external/src/lib/core/pointers.ts:151-190`, `external/src/mcp.ts:243-282`). | Public can return anchor-filtered memory content, graph neighborhoods, and metadata-rich results rather than only markdown-derived outline text (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-45`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:166-189`). | NEGATIVE | Reject as the primary delivery format. It is compact but too lossy. |

Contextador ideas survive comparison only when they stay in the operational-ergonomics lane: routing facade, repair loop, answer-cache reuse, budget gating, bounded automation, and onboarding automation. The moment the comparison shifts to semantic retrieval, structural retrieval, session recovery, or payload richness, Public's existing stack is already stronger and more precise. That is why the right synthesis posture remains "study and selectively reimplement ergonomics," not "adopt Contextador as a new retrieval core."

## 5. CROSS-PHASE BOUNDARY RESOLUTION

| Topic | 002-codesight | 003-contextador | 004-graphify | Owner |
| --- | --- | --- | --- | --- |
| AST detectors and framework-specific scanning | Primary lane: stack detection, framework and ORM detectors, AST-first route/schema extraction, blast-radius inputs | Consumes prebuilt context artifacts; does not own detector design | Uses AST extraction as graph seed, but not framework-detector evaluation | 002-codesight |
| Static `CONTEXT.md` / config file generation | Owns generated assistant artifacts and profile/config outputs from a scan | Reads generated `CONTEXT.md`-style artifacts through its MCP query path | Out of scope except as upstream graph corpus input | 002-codesight |
| MCP query interface for codebase questions | Secondary: exposes MCP tools, but phase focus is detector/profile architecture rather than one natural-language query entry point | Primary lane: natural-language query, routing, scope selection, pointer serialization | Secondary at most: graph retrieval/report surfaces, not Contextador-style query transport | 003-contextador |
| Self-healing context repair loop | Not the focus; static generation happens before runtime misses | Primary lane: feedback ingestion, repair queueing, Janitor, stale-context correction | Not the focus; graph refresh and export are separate concerns | 003-contextador |
| Mainframe-style shared agent cache | No shared answer-cache ownership | Primary lane: query-hash deduplication, shared replay, multi-agent cache reuse | No shared answer-cache ownership | 003-contextador |
| Pointer-based compression / token-efficiency framing | Upstream reduction via generated context artifacts and profile files | Primary lane: query-time pointer serialization and compressed response framing | Secondary: graph summaries can reduce ambiguity, but not via pointer transport | 003-contextador |
| Knowledge graph (NetworkX, Leiden) | Out of scope beyond possible upstream AST feed | Out of scope; only a neighboring comparison surface | Primary lane: graph construction, clustering, graph-first analysis | 004-graphify |
| Multimodal evidence tagging / graph viz | Out of scope | Out of scope | Primary lane: extracted versus inferred evidence, multimodal ingestion, graph/report rendering | 004-graphify |

The canonical 003-contextador scope is runtime retrieval ergonomics: query routing, payload compression, repair, cache reuse, and related setup/runtime plumbing. `002-codesight` owns scan-time analysis plus artifact generation, while `004-graphify` owns graph/provenance intelligence. Keeping those boundaries explicit prevents 003 from being misread as either the upstream artifact-authoring system or the downstream graph-reasoning system.

## 6. RECOMMENDATIONS BY CATEGORY

Any recommendation below means study plus reimplementation inside `Code_Environment/Public`, not direct reuse of Contextador source.

### 6.1 Adopt now

**Config-gated bootstrap layering**

Contextador's bootstrap split is still one of the cleanest ideas in the repo: local operation first, shared-cache/provider behavior only when configured. Public can adopt that layering around existing retrieval substrates without changing their underlying semantics. Concrete next step: define a thin runtime facade packet that wraps CocoIndex, Code Graph, and Memory under one config-gated bootstrap contract, with shared-cache hooks off by default.

**Generated `.mcp.json` project scaffold plus setup hints**

The actual behavior here is modest but useful: the wizard captures setup intent, `init` creates the project MCP file, and `doctor` tells the user when that file is missing. Public already has richer runtime recovery after install, so the missing piece is activation ergonomics, not capability depth. Concrete next step: prototype a repo-local generator that emits Public-compatible MCP config using existing wrapper schema conventions and explains that discovery is editor-side, not magical runtime auto-registration.

**Benchmark-honest token reporting**

Contextador's failure mode is instructive: the implementation says `est.` while the README markets a stronger percentage than the code proves. Public should keep the implementation honesty and extend it into docs and reporting, especially if future routing, repair, or cache work introduces efficiency claims. Concrete next step: write a small measurement rubric for any future token-savings claim so estimates, benchmarks, and assumptions are explicitly labeled.

### 6.2 Prototype later

**Model-first routing facade over existing Public tools**

Contextador's routing split is useful because it cleanly separates model-first scope selection from deterministic fallback. Public could expose a similar facade that decides when to consult semantic search, memory, or graph tools, while preserving the underlying specialized surfaces. Promotion criteria: routed results must beat or match manual tool selection on answer quality, traceability, and stability across a representative benchmark set.

**Query-triggered repair and deterministic enrichment**

The feedback-to-repair loop remains the strongest additive behavior in Contextador. Public could experiment with a narrow version that patches stale research or context artifacts only after verified misses, with full audit logs and dry-run controls. Promotion criteria: repair quality must be demonstrably useful, low-noise, and revertible, with clear write scopes, stronger validation than Contextador's `validation.ts`, and no silent degradation of hand-authored content.

**Janitor-style staged freshness pass**

The staged Janitor plus freshness heuristics still suggest a good maintenance shape for artifact systems. Public already has readiness and freshness checks, but not a comparable staged repair sweep for context artifacts. Promotion criteria: each stage must have a clear contract, dry-run support, explicit mutation reporting, and stronger test coverage than Contextador's helper-level checks.

**Mainframe-style shared answer cache with local budget gating**

The interesting part of Mainframe is not generic collaboration; it is replayable answer reuse keyed by recent query history, plus local guardrails around expensive shared behavior. Public does not currently expose that as a first-class surface, so a carefully bounded cache prototype could reduce repeated discovery work in multi-agent sessions. Promotion criteria: stronger cache keys, privacy-safe identity handling, audited retention, scoped membership, reconciliation logic, and clearly separated local-vs-shared budget semantics must exist before any broader rollout.

**Bounded event-driven automation pipeline**

The GitHub layer shows a reusable pattern: intake, deterministic narrowing, optional model adjudication, targeted remediation, and append-only event logging. Public could reuse that pattern for selected automation flows without adopting GitHub-specific transport or Contextador's whole runtime. Promotion criteria: explicit dry-run mode, auditable logs, scope limits, and end-to-end tests for the full event loop.

**Unified provider and setup abstraction**

Contextador's provider surface and setup wizard are not retrieval breakthroughs, but they do reduce cognitive load. Public could benefit from a single place that explains and validates which providers or host modes are active across search and retrieval surfaces. Promotion criteria: the abstraction must clarify supported modes rather than overstate universality, and it must not obscure surface-specific failure modes.

### 6.3 Reject

**Pointer-only context delivery as the primary response model**

Contextador's served payload is deliberately small, but it drops too much structure and narrative detail. Public already has richer content-plus-structure surfaces, so replacing them with a pointer-only markdown outline would be a net regression. Existing Public surface is sufficient because it can already return targeted memory content, graph neighborhoods, and typed recovery packages.

**Contextador as a semantic or structural retrieval replacement**

The traced source shows no vector index on the live path and no symbol-level structural traversal. Public already covers those domains with CocoIndex and Code Graph MCP, so adopting Contextador's retrieval substrate would duplicate weaker capabilities. Existing Public surface is sufficient because it already wins on the underlying retrieval primitives.

**Mainframe privacy and conflict model as-is**

Persistent local identities, plaintext local secrets, broad room-history metadata, blind shared-state writes, and shallow conflict handling are too weak for direct adoption. The collaboration concept is interesting, but the shipped transport model is not ready for governed multi-user use. Existing Public surface is sufficient today because shared-memory collaboration already exists without these specific transport risks.

**Bun runtime coupling**

Contextador's CLI and setup flows are Bun-native. Public should treat that as an implementation detail of the external repo, not as a reason to reshape its own runtime stack. Existing Public surface is sufficient because the value under study here is design, not Bun-specific execution.

**Direct source adoption under AGPL/commercial licensing**

The licensing model alone makes direct source reuse the wrong default. Even where the ideas are attractive, the safe path is to reimplement the pattern rather than import the code. Existing Public surface is sufficient as the substrate; only selected ergonomics need new work.

## 7. LICENSING AND ADOPTION CONSTRAINTS

Contextador is not an MIT-style reference repo. `external/package.json:6` declares `AGPL-3.0-or-later`, and `external/LICENSE-COMMERCIAL.md:1-20` offers a separate commercial track for proprietary or closed-source use. In practice, that means any "adopt now" or "prototype later" item in this report must default to study plus reimplementation, not direct copying of Contextador source. The safest reading for `Code_Environment/Public` is therefore: extract patterns, not code. If a future decision ever considers direct reuse, that becomes a separate licensing review, not an engineering follow-on from this research packet.

## 8. RISKS AND VALIDATION REQUIREMENTS

- README-overstatement risk: the 93% token-reduction headline and broad "Any AI provider" framing are stronger than the traced implementation proves. Any Public reuse of the idea must separate estimates from benchmarks and enumerate supported providers exactly.
- Mainframe privacy and operational risk: persistent agent IDs, plaintext local password storage, raw room-history metadata, blind shared-state writes, and weak reconciliation make the design unsuitable for direct adoption.
- Bun runtime assumption: Contextador's setup and CLI are Bun-native; any pattern transfer into Public must remove Bun as an implicit requirement unless explicitly chosen.
- Shared-room conflict gap: janitor locks, budgets, and summary posts all use best-effort writes with no strong conflict resolution or proven reconciliation back into local repair logic.
- Pointer-lossiness risk: the served payload preserves only a narrow schema. Any Public prototype that borrows the compression idea must benchmark task-quality loss, not just response size.
- Artifact-repair risk: query-triggered repair is promising, but whole-file rewrites and basename-level enrichment can damage hand-authored artifacts if guardrails are weak, especially when validation and write layers are thinner than their filenames suggest.
- Cache-correctness risk: Mainframe query hashes normalize only keyword bags, and the shared budget/cache layers lack strong invalidation and sync guarantees. A Public prototype needs stronger keys, timestamps, and reconciliation semantics before answer replay can be trusted.
- Automation-confidence risk: the GitHub pipeline is real but lightly tested. Any reuse should start with dry-run workflows, explicit scope caps, and end-to-end tests before it is treated as reliable maintenance automation.
- Adoption-constraint risk: AGPL/commercial licensing means all implementation work should be clean-room and source-independent at the code level.

## 9. OPEN QUESTIONS (post-research)

No material production-source gap remains after the 20-iteration closeout; practical production-source coverage was already reached by iteration 13, and the remaining extension work focused on question closure rather than new subsystem discovery. The genuinely open questions are now:

- How much answer quality is lost or preserved if a Public routing facade compresses outputs before delivery instead of returning richer typed results?
- What governed cache key, retention, reconciliation, and budget model would make shared answer reuse acceptable in Public without inheriting Mainframe's coarse hashes and shallow room-state sync?
- What validation and write policy would keep query-triggered artifact repair useful without destabilizing hand-authored docs, given that Contextador's `validation.ts` is thin and `writer.ts` is only a planner?

## 10. RESEARCH METHODOLOGY

Thirteen iterations were executed via `cli-codex` using `gpt-5.4` with high reasoning effort. The original eight-iteration loop followed the phase brief closely: `mcp.ts` first, then routing (`headmaster.ts`, `pointers.ts`, `hierarchy.ts`), then self-healing (`feedback.ts`, `janitor.ts`, `generator.ts`, `freshness.ts`), then Mainframe (`bridge.ts`, `client.ts`, `rooms.ts`, `dedup.ts`, `summarizer.ts`), then README, stats, providers, setup, licensing, cross-comparison, cross-phase ownership, and pointer-lossiness closure. The user-extended pass added five focused validation sweeps: test coverage for core modules, Mainframe tests plus `budget.ts`, setup wizard and preset reality check, GitHub webhook automation, and the closing helper-module sweep. That extension changed the evidence mix from predominantly source-only to a more explicit split between test-confirmed mechanics, source-proven behavior, and remaining inferred prototype questions.

## 11. ITERATION INDEX

| Iteration | Focus | Findings | newInfoRatio | Status |
|-----------|-------|----------|--------------|--------|
| 1 | `external/src/mcp.ts` MCP tool surface and bootstrap | 6 | 0.82 | insight |
| 2 | routing path: `headmaster.ts`, `pointers.ts`, `hierarchy.ts` | 7 | 0.74 | insight |
| 3 | self-healing loop: `feedback.ts`, `janitor.ts`, `generator.ts`, `enrichFromFeedback` | 8 | 0.68 | insight |
| 4 | Mainframe shared cache: `bridge.ts`, `client.ts`, `rooms.ts`, `dedup.ts`, `summarizer.ts` | 8 | 0.73 | insight |
| 5 | README + stats + licensing reality check | 7 | 0.62 | insight |
| 6 | cross-comparison vs CocoIndex, Code Graph MCP, Spec Kit Memory | 5 | 0.71 | insight |
| 7 | cross-phase ownership boundaries vs 002-codesight and 004-graphify | 4 | 0.39 | insight |
| 8 | pointer payload lossiness: `pointers.ts`, `response.ts`, `briefing.ts` | 5 | 0.24 | insight |
| 9 | test coverage audit for feedback, janitor, routing, generator, freshness, stats, pointers, hit-log | 5 | 0.41 | insight |
| 10 | Mainframe tests plus first production-source trace of `budget.ts` | 4 | 0.46 | insight |
| 11 | setup wizard, framework presets, UI helpers, `.mcp.json` reality check | 5 | 0.34 | insight |
| 12 | GitHub webhook + triage as a real automation example | 5 | 0.31 | insight |
| 13 | closing module sweep: `agents.ts`, `validation.ts`, `writer.ts`, `sizecheck.ts`, `docsync.ts`, `depscan.ts`, `demolish.ts` | 6 | 0.23 | insight |
| 14 | question closure pass: MCP tool surface, payload shape, and `routeQuery` decision flow | 4 | 0.19 | insight |
| 15 | question closure pass: feedback ingestion, repair queue, janitor stages, and self-healing claim boundary | 4 | 0.17 | insight |
| 16 | question closure pass: Mainframe broadcast/request protocol, janitor locking, and privacy/consistency tradeoffs | 4 | 0.16 | insight |
| 17 | question closure pass: token-savings arithmetic, budget gating, and provider abstraction support | 4 | 0.15 | insight |
| 18 | question closure pass: setup wizard, framework presets, and `.mcp.json` onboarding reality | 3 | 0.14 | insight |
| 19 | question closure pass: AGPL plus commercial licensing, Bun runtime, and direct-reuse constraints | 3 | 0.13 | insight |
| 20 | final closure pass: novelty-vs-duplication boundary against CocoIndex, Code Graph, and session bootstrap | 4 | 0.12 | insight |

## 12. CONVERGENCE REPORT

- Stop reason: user-requested extension to 20 total iterations, ending at the raised cap after the final comparison pass resolved Q12 and confirmed the same overall recommendation posture
- Total iterations: 20 of 20
- Phase questions: all 12 are now explicitly marked resolved in the synchronized strategy/dashboard state
- Last 7 `newInfoRatio` values: `0.19`, `0.17`, `0.16`, `0.15`, `0.14`, `0.13`, `0.12`
- Overall pattern: after iteration 13 closed production-source coverage, novelty declined in a healthy way because the remaining work shifted from subsystem discovery to contract clarification, question closure, and final comparison against Public's existing stack
- Iterations 1-13 were executed via cli-codex (gpt-5.4 high); iterations 14-20 were executed by Codex as a packet-local extension pass
- Total findings consolidated: 18 primary synthesis findings plus 7 answer-closure iteration artifacts that tighten question coverage and adoption boundaries

## 13. SOURCE INDEX

Source coverage statement after 20 iterations: approximately `56 / 66 ~= 84.8%` of files under `external/src/` were read directly by some iteration, and effectively `100%` of non-test production source files. The extension pass did not broaden production-file coverage further because it focused on explicit question closure, adoption boundaries, and direct comparison against Public's existing retrieval stack. The remaining unread slice is still test-only, which means the main residual uncertainty is behavioral robustness rather than missing production-source trace coverage.

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/003-contextador/phase-research-prompt.md` — cited lines: `8-14`, `49-80`
- `.opencode/skill/mcp-coco-index/README.md` — cited lines: `42-47`, `42-86`, `53-59`, `94-126`, `137-143`, `161-170`
- `.opencode/skill/system-spec-kit/SKILL.md` — cited lines: `583-589`, `591`, `604-605`, `612-613`, `616-617`, `638-640`, `702-708`, `741-757`, `767-802`, `782-786`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` — cited lines: `40-44`, `40-50`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` — cited lines: `67-73`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` — cited lines: `9-16`, `116-238`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` — cited lines: `86-192`, `166-189`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` — cited lines: `68-143`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` — cited lines: `107-217`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` — cited lines: `131-139`
- `external/src/mcp.ts` — cited lines: `34-91`, `66-90`, `97-99`, `101-115`, `104-115`, `117-174`, `180-183`, `185-277`, `185-282`, `193-208`, `200-208`, `212-246`, `224-255`, `243-282`, `296-340`, `344-671`, `415-671`, `436-448`, `677-686`
- `external/src/lib/core/projectconfig.ts` — cited lines: `19-65`, `40-64`
- `external/src/lib/core/types.ts` — cited lines: `49-62`, `91-97`
- `external/src/lib/core/headmaster.ts` — cited lines: `16-36`, `61-126`, `128-157`, `159-197`, `199-242`
- `external/src/lib/core/pointers.ts` — cited lines: `14-20`, `23-138`, `80-138`, `151-190`
- `external/src/lib/core/briefing.ts` — cited lines: `21-27`, `29-45`, `61-77`
- `external/src/lib/core/feedback.ts` — cited lines: `24-47`, `53-97`, `87-96`, `106-143`
- `external/src/lib/core/generator.ts` — cited lines: `7-18`, `21-47`, `49-64`, `76-99`, `101-157`
- `external/src/lib/core/freshness.ts` — cited lines: `4-6`, `95-153`, `155-170`
- `external/src/lib/core/janitor.ts` — cited lines: `65-81`, `89-147`, `149-157`, `167-235`, `242-272`, `279-311`, `317-379`, `330-330`, `387-490`, `457-464`
- `external/src/lib/core/stats.ts` — cited lines: `26-28`, `29-41`, `43-50`, `53-58`, `60-65`, `68-73`, `75-107`
- `external/src/lib/core/hitlog.ts` — cited lines: `9-18`
- `external/src/lib/core/agents.ts` — cited lines: `18-45`, `47-103`
- `external/src/lib/core/validation.ts` — cited lines: `12-20`, `27-60`
- `external/src/lib/core/writer.ts` — cited lines: `15-66`
- `external/src/lib/core/sizecheck.ts` — cited lines: `4-33`
- `external/src/lib/core/docsync.ts` — cited lines: `30-119`, `149-268`
- `external/src/lib/core/depscan.ts` — cited lines: `48-213`
- `external/src/lib/core/demolish.ts` — cited lines: `23-70`
- `external/src/lib/core/feedback.test.ts` — cited lines: `50-72`, `74-145`
- `external/src/lib/core/janitor.test.ts` — cited lines: `8-22`
- `external/src/lib/core/headmaster.test.ts` — cited lines: `8-22`, `24-38`
- `external/src/lib/core/generator.test.ts` — cited lines: `7-25`, `27-44`, `46-68`
- `external/src/lib/core/freshness.test.ts` — cited lines: `4-40`
- `external/src/lib/core/stats.test.ts` — cited lines: `8-14`, `16-25`, `36-52`
- `external/src/lib/core/pointers.test.ts` — cited lines: `37-68`, `70-126`
- `external/src/lib/core/hitlog.test.ts` — cited lines: `22-36`
- `external/src/lib/mainframe/bridge.ts` — cited lines: `26-57`, `80-83`, `119-123`, `128-166`, `145-185`, `157-175`, `169-175`, `205-214`, `216-250`, `283-289`
- `external/src/lib/mainframe/rooms.ts` — cited lines: `6-69`
- `external/src/lib/mainframe/dedup.ts` — cited lines: `8-26`
- `external/src/lib/mainframe/summarizer.ts` — cited lines: `17-21`, `79-99`, `101-108`
- `external/src/lib/mainframe/client.ts` — cited lines: `20-72`, `81-92`, `124-129`, `145-189`, `163-172`, `182-188`
- `external/src/lib/mainframe/budget.ts` — cited lines: `16-22`, `24-27`, `29-46`, `57-73`, `90-100`
- `external/src/lib/mainframe/rooms.test.ts` — cited lines: `4-28`
- `external/src/lib/mainframe/dedup.test.ts` — cited lines: `5-26`
- `external/src/lib/mainframe/summarizer.test.ts` — cited lines: `19-53`
- `external/src/lib/mainframe/client.test.ts` — cited lines: `4-18`
- `external/src/lib/mainframe/budget.test.ts` — cited lines: `4-42`
- `external/src/lib/providers/config.ts` — cited lines: `6-13`, `15-44`, `46-63`, `76-112`, `114-132`
- `external/src/lib/setup/wizard.ts` — cited lines: `31-114`, `116-149`, `152-169`, `171-215`, `218-255`, `299-325`, `328-335`
- `external/src/lib/frameworks/index.ts` — cited lines: `1-2`
- `external/src/lib/frameworks/hermes.ts` — cited lines: `1-46`
- `external/src/lib/frameworks/openclaw.ts` — cited lines: `1-53`
- `external/src/lib/ui.ts` — cited lines: `20-33`, `152-190`
- `external/src/lib/github/index.ts` — cited lines: `1-3`
- `external/src/lib/github/types.ts` — cited lines: `1-53`
- `external/src/lib/github/triage.ts` — cited lines: `39-113`, `168-232`, `238-296`
- `external/src/lib/github/webhook.ts` — cited lines: `35-68`, `73-148`, `137-142`, `168-275`
- `external/src/lib/github/triage.test.ts` — cited lines: `27-108`
- `external/src/lib/github/webhook.test.ts` — cited lines: `1-12`
- `external/src/cli.ts` — cited lines: `1`, `141-145`, `141-158`, `372-372`, `403-553`, `557-577`, `587-603`, `769-776`, `807-808`, `927-935`
- `external/package.json` — cited lines: `2-7`, `6`, `8-12`, `27-33`, `44-53`, `51-53`
- `external/README.md` — cited lines: `13-19`, `31-38`, `46-57`, `51-57`, `98-117`, `113-117`
- `external/TROUBLESHOOTING.md` — cited lines: `9-24`
- `external/LICENSE` — cited lines: `1`, `1-26`
- `external/LICENSE-COMMERCIAL.md` — cited lines: `1-20`

## 14. APPENDIX A -- iteration files

- research/iterations/iteration-001.md
- research/iterations/iteration-002.md
- research/iterations/iteration-003.md
- research/iterations/iteration-004.md
- research/iterations/iteration-005.md
- research/iterations/iteration-006.md
- research/iterations/iteration-007.md
- research/iterations/iteration-008.md
- research/iterations/iteration-009.md
- research/iterations/iteration-010.md
- research/iterations/iteration-011.md
- research/iterations/iteration-012.md
- research/iterations/iteration-013.md
- research/iterations/iteration-014.md
- research/iterations/iteration-015.md
- research/iterations/iteration-016.md
- research/iterations/iteration-017.md
- research/iterations/iteration-018.md
- research/iterations/iteration-019.md
- research/iterations/iteration-020.md

## 15. APPENDIX B -- state files

- research/deep-research-config.json
- research/deep-research-state.jsonl
- research/deep-research-strategy.md
- research/deep-research-dashboard.md
- research/findings-registry.json

## 16. APPENDIX C -- related Public surfaces (read-only during research)

- `.opencode/skill/mcp-coco-index/` (CocoIndex semantic search skill)
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` (Spec Kit Memory MCP server entrypoint)
- `.opencode/skill/system-spec-kit/SKILL.md` (system-spec-kit skill index)

## 17. APPENDIX D -- related sibling phase prompts

- 002-codesight: scan-time AST + framework detectors -> CLAUDE.md generation
- 004-graphify: knowledge graph (NetworkX + Leiden), provenance, multimodal evidence
- 003-contextador (this phase): runtime MCP query, self-healing, shared cache
