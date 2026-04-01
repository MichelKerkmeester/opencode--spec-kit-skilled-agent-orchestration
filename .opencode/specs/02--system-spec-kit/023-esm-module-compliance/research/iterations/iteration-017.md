# Iteration 17: Intent-to-Profile Auto-Routing Design + Working Memory Persistence Assessment

## Focus
Design the intent-to-profile auto-routing system identified as the highest-impact hookless improvement in iteration 16. This iteration maps the exact code architecture: how `classifyIntent()` in `intent-classifier.ts` produces intent types, how `applyResponseProfile()` in `profile-formatters.ts` consumes profile names, where the gap exists, and how to bridge them. Also assesses working-memory attention persistence and spec neighborhood auto-loading feasibility.

## Findings

### 1. Two Distinct Classification Systems Exist (Structural Gap Confirmed)

The codebase has TWO separate classifiers that are not connected:

- **Intent Classifier** (`lib/search/intent-classifier.ts`): Produces 7 `IntentType` values (`add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`, `find_spec`, `find_decision`) with confidence scores. Uses a 3-channel scoring system: centroid embedding (50%), keyword matching (35%), regex patterns (15%). Already called automatically in both `memory-search.ts:578` and `memory-context.ts:846`.

- **Query Complexity Classifier** (`lib/search/query-classifier.ts`): Produces 3 `QueryComplexityTier` values (`simple`, `moderate`, `complex`) with confidence. Used for pipeline routing (which stages to execute). Separate concern from intent.

The intent classifier's output feeds into `INTENT_WEIGHT_ADJUSTMENTS` (recency/importance/similarity weights) and `INTENT_LAMBDA_MAP` (MMR diversity), but it does NOT feed into the profile system at all.

[SOURCE: lib/search/intent-classifier.ts:404-486, lib/search/query-classifier.ts:143-201]

### 2. Profile System is Fully Built but Manually Triggered Only

The profile formatter system at `lib/response/profile-formatters.ts` provides 4 profiles:

| Profile | Purpose | Output Shape |
|---------|---------|-------------|
| `quick` | Fast decision-making | topResult + oneLineWhy + omittedCount + tokenReduction |
| `research` | Full exploration | results[] + evidenceDigest + followUps[] |
| `resume` | Session recovery | state + nextSteps + blockers + topResult |
| `debug` | Full trace | results[] + summary + hints + meta + tokenStats |

The `applyResponseProfile()` function (line 407) accepts a profile string and formats results accordingly. In `memory-search.ts:1108`, it is applied ONLY when the caller explicitly passes a `profile` parameter. In `memory-context.ts`, the profile parameter is threaded through options but similarly requires explicit caller specification.

The gap: intent is auto-detected (line 578/846) and profile is accepted (line 1108) in the same handler, but there is no code that maps one to the other.

[SOURCE: lib/response/profile-formatters.ts:407-430, handlers/memory-search.ts:1107-1123, handlers/memory-context.ts:126-127]

### 3. Intent-to-Profile Auto-Routing Design

**Proposed mapping table:**

| Intent | Default Profile | Rationale |
|--------|----------------|-----------|
| `fix_bug` | `debug` | Developers debugging need full trace, scores, signal breakdown |
| `security_audit` | `debug` | Security reviews need complete evidence chain |
| `understand` | `research` | Exploration benefits from digest + follow-up suggestions |
| `find_spec` | `research` | Spec lookup benefits from evidence digest + related specs |
| `find_decision` | `research` | Decision tracing benefits from full result list + evidence |
| `add_feature` | `quick` | Feature implementation needs the most relevant result fast |
| `refactor` | `quick` | Refactoring needs targeted result, not broad exploration |

**Injection point** (memory-search.ts): After line 597 (intent confidence floor) and before line 1107 (profile application), insert:

```typescript
// Intent-to-profile auto-routing: apply default profile when none explicitly specified
const INTENT_TO_PROFILE: Record<string, string> = {
  fix_bug: 'debug',
  security_audit: 'debug',
  understand: 'research',
  find_spec: 'research',
  find_decision: 'research',
  add_feature: 'quick',
  refactor: 'quick',
};

const effectiveProfile = profile
  ?? (detectedIntent ? INTENT_TO_PROFILE[detectedIntent] : undefined);
```

Then at line 1108, replace `profile` with `effectiveProfile`.

**Override mechanism**: The explicit `profile` parameter takes precedence. If the caller specifies `profile: 'debug'` but intent is `add_feature`, the explicit `debug` wins. This is the standard override pattern.

**Env var control**: `SPECKIT_INTENT_AUTO_PROFILE=false` to disable the auto-routing entirely. Default ON.

**Estimated effort**: ~30 lines of code change in memory-search.ts, ~15 lines in memory-context.ts. Plus ~40 lines of tests. Total: ~85 lines, ~1 hour.

[SOURCE: handlers/memory-search.ts:560-597 (intent detection), handlers/memory-search.ts:1107-1123 (profile application), INFERENCE: based on analysis of both systems' interfaces]

### 4. Memory-Context Handler Also Needs Auto-Routing

The `memory-context.ts` handler at line 846 already calls `classifyIntent()` and threads the `profile` parameter through to sub-calls. The same mapping table should be applied in this handler's `resolveEffectiveMode()` function (line 832). Currently `memory-context.ts` maps intent to MODE (`INTENT_TO_MODE` at line 852) but not to PROFILE.

The injection point is similar: after intent detection at line 848, compute `effectiveProfile` from `INTENT_TO_PROFILE` if no explicit profile was provided. Thread it through the options objects at lines 684, 715, 749.

[SOURCE: handlers/memory-context.ts:832-879, 684, 715, 749]

### 5. Working-Memory Attention Persistence: Already Partially Solved

The working memory module (`lib/cognitive/working-memory.ts`) stores attention scores in a SQLite `working_memory` table. This data IS already persisted to disk -- the session-scoped attention map survives process restarts because it is in SQLite, not in-memory.

However, there is a subtle gap: the `sessionModeRegistry` (line 129) is an in-process `Map<string, string>` that tracks inferred session modes. This is the ONLY ephemeral state in the working memory module. Everything else (attention scores, event counters, mention counts, focus history) is in SQLite.

**Persistence opportunity**: The `sessionModeRegistry` could be moved to a SQLite table (`session_mode_registry`) or added as a column to the existing `session_state` table. This would give full cross-restart continuity.

**Impact assessment**: LOW. The session mode registry is a convenience lookup for the current session's dominant intent pattern. Losing it on restart is not harmful -- it re-infers from the next query. The 30-minute session timeout (`sessionTimeoutMs: 1800000`) means most sessions do not span process restarts anyway.

[SOURCE: lib/cognitive/working-memory.ts:46-63 (schema), 129 (sessionModeRegistry), 354-366 (inferred mode)]

### 6. Spec Neighborhood Auto-Loading: Feasible But Non-Trivial

For spec neighborhood auto-context, the system would need to:

1. When `specFolder` is provided, query the memory index for related specs (parent, siblings, causally-linked via `causal_edges` table)
2. Include summaries or key findings from those specs in the response

The infrastructure exists:
- `causal_edges` table tracks relationships between memories (caused, enabled, supersedes, supports)
- `memory_drift_why` tool already traverses causal chains
- Folder discovery in `folder-relevance.ts` already resolves spec folder hierarchies

**Gap**: There is no "spec neighborhood resolver" function that takes a spec folder and returns related spec folders. The causal graph operates at the memory level, not the spec folder level. Building this would require:
- A new function that aggregates memory-level causal edges into spec-folder-level relationships
- A way to summarize a neighboring spec folder in ~50-100 tokens
- Integration into memory-context.ts to auto-inject neighbor summaries

**Estimated effort**: ~200-300 lines, ~4-6 hours. MEDIUM priority -- useful but significantly more work than intent-to-profile routing.

[INFERENCE: based on causal_edges table schema (iteration 5), folder-relevance.ts architecture (iteration 3), and memory-context.ts handler structure]

### 7. Attention-Enriched Context Hints: Straightforward Extension

The `getSessionPromptContext()` function (working-memory.ts:325) already returns the top-N memories by attention score for a session. These could be passed to the auto-surface trigger matcher as "attention-boosted concepts" to bias which memories surface.

**Current flow**: auto-surface in `hooks/memory-surface.ts` fires on every non-memory tool call, matching trigger phrases from high-attention memories. But it uses its own constitutional cache, not the working-memory attention map.

**Proposed enrichment**: After auto-surface trigger matching, boost results that also appear in the working memory's top-N attention list. This is a ~20-line change in `memory-surface.ts`:

```typescript
const wmContext = getSessionPromptContext(sessionId, DECAY_FLOOR, 5);
const wmMemoryIds = new Set(wmContext.map(e => e.memoryId));
// Boost trigger-matched results that are also in working memory
matchedResults.forEach(r => {
  if (wmMemoryIds.has(r.id)) r.score *= 1.3; // attention boost
});
```

**Estimated effort**: ~20 lines, ~30 minutes.

[SOURCE: lib/cognitive/working-memory.ts:325-351 (getSessionPromptContext), INFERENCE: based on memory-surface.ts architecture from iteration 4/16]

## Ruled Out
- **Automatic profile selection without override** -- explicit caller profile MUST always take precedence to avoid breaking existing integrations
- **Complex ML-based intent-to-profile routing** -- the deterministic mapping table is simpler, more predictable, and sufficient given only 7 intents and 4 profiles
- **Full working-memory persistence overhaul** -- the only ephemeral piece (sessionModeRegistry) has low impact; not worth a schema migration

## Dead Ends
- None this iteration. All research avenues were productive.

## Sources Consulted
- `lib/search/intent-classifier.ts` (full file, 656 lines) -- intent detection architecture
- `lib/response/profile-formatters.ts` (full file, 513 lines) -- profile formatting system
- `lib/cognitive/working-memory.ts` (full file, 768 lines) -- attention persistence architecture
- `handlers/memory-search.ts:560-597, 1107-1123` -- intent detection and profile application points
- `handlers/memory-context.ts:830-879, 684-749` -- intent detection and profile threading
- `lib/search/query-classifier.ts` (full file, 224 lines) -- complexity classification (separate concern)

## Assessment
- New information ratio: 0.57
- Questions addressed: intent-to-profile design, working-memory persistence, spec neighborhood feasibility, attention-enriched hints
- Questions answered: intent-to-profile design (complete), working-memory persistence (assessed), attention-enriched hints (designed)

## Reflection
- What worked and why: Reading the three core modules (intent-classifier, profile-formatters, working-memory) in full gave a complete picture of both systems' interfaces. The gap between them was immediately obvious -- classifyIntent() produces IntentType, applyResponseProfile() consumes profile string, but nothing maps one to the other. Reading the handler code confirmed the exact injection points.
- What did not work and why: N/A -- all approaches were productive.
- What I would do differently: Could have read memory-context.ts more thoroughly to find if there is already an INTENT_TO_MODE map that could serve as a template for INTENT_TO_PROFILE. The grep approach for specific symbols was more efficient than reading full handler files.

## Recommended Next Focus
Consolidation iteration: synthesize all 17 iterations into a comprehensive implementation roadmap with:
1. Final prioritized backlog (P1/P2/P3 with effort estimates)
2. Dependency graph between changes
3. Test impact summary
4. Risk assessment for each change
This would be a "thought" type iteration focused on synthesis rather than new evidence gathering.
