# Implementation Prompt: 006-default-on-boost-rollout

> Delegation prompt for `/spec_kit:implement :auto` via CLI Copilot (GPT 5.4 high reasoning)

---

## Invocation

```bash
# Set reasoning effort to high (one-time, persists in config)
python3 -c "
import json, os
cfg_path = os.path.expanduser('~/.copilot/config.json')
with open(cfg_path) as f: cfg = json.load(f)
cfg['reasoning_effort'] = 'high'
with open(cfg_path, 'w') as f: json.dump(cfg, f, indent=2)
"

# Execute implementation
copilot -p "$(cat .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/006-default-on-boost-rollout/scratch/implement-prompt.md)" \
  --model gpt-5.4 \
  --allow-all-tools \
  2>&1
```

---

## Prompt

You are implementing a pre-planned spec folder. All research, planning, and task decomposition is complete. Your job is to execute the implementation.

### Command

Run `/spec_kit:implement :auto` on the following spec folder:

```
Spec folder: .opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/006-default-on-boost-rollout/ (pre-approved, skip Gate 3)
```

### Context

The Spec Kit Memory MCP server has a 4-stage retrieval pipeline. Three key scoring features are currently off-by-default, degrading search quality for all users:

1. **Session boost** (`SPECKIT_SESSION_BOOST`) -- requires explicit env var opt-in, but `isFeatureEnabled()` in `rollout-policy.ts` already treats undefined as ON. The issue is a suppression layer or incorrect wiring.
2. **Causal boost** (`SPECKIT_CAUSAL_BOOST`) -- same pattern as session boost.
3. **Deep expansion** -- `buildDeepQueryVariants()` returns only the original query for common queries, so `queryVariants.length > 1` never fires.
4. **Artifact classifier** -- returns `unknown` with `confidence: 0` for queries like "semantic search" because keyword lists are too narrow and there's no intent-based fallback.

### What to Implement (26 tasks, 3 phases)

Read the full task list from `tasks.md` in the spec folder. Key implementation targets:

#### Phase 1: Diagnosis (T001-T004)

Confirm root causes before writing code. Trace the actual call paths:

- `session-boost.ts:29` -- `isFeatureEnabled('SPECKIT_SESSION_BOOST', sessionId)` -- does this return true when env var is unset?
- `causal-boost.ts:145` -- `isFeatureEnabled('SPECKIT_CAUSAL_BOOST')` -- same check
- `stage2-fusion.ts:774` -- the `if (isHybrid && config.enableSessionBoost && config.sessionId)` guard -- is `config.enableSessionBoost` ever true by default?
- `stage1-candidate-gen.ts` -- trace `buildDeepQueryVariants` to see why it returns only 1 variant

#### Phase 2: Implementation (T005-T024)

**Session boost default-ON** (T005):
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts`
- Line 29: `return isFeatureEnabled('SPECKIT_SESSION_BOOST', sessionId ?? undefined);`
- If `isFeatureEnabled` already returns true for unset vars, the suppression may be in `stage2-fusion.ts` at the `config.enableSessionBoost` guard (line 774). Trace where `enableSessionBoost` is set in the config builder.
- Goal: session boost fires by default when a sessionId is present. `SPECKIT_SESSION_BOOST=false` disables it.

**Causal boost default-ON** (T006):
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts`
- Line 145: `return isFeatureEnabled('SPECKIT_CAUSAL_BOOST');`
- Same pattern -- trace the config builder that sets `config.enableCausalBoost` if any.
- Goal: causal boost fires by default. `SPECKIT_CAUSAL_BOOST=false` disables it.

**Deep expansion fix** (T007):
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts`
- Find `buildDeepQueryVariants` -- it returns only the original query for short/common queries
- The guard `queryVariants.length > 1` prevents the multi-search branch from executing
- Fix: ensure deep mode always generates at least 2 variants (paraphrase, synonym expansion, or relax the guard)

**search-flags.ts consolidation** (T008-T009, optional):
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- Add `isSessionBoostEnabled()` and `isCausalBoostEnabled()` alongside other graduated flags

**MCP config files** (T017-T021):
Add `SPECKIT_SESSION_BOOST` and `SPECKIT_CAUSAL_BOOST` env vars to all 5 consumer config files, and update `_NOTE_7_FEATURE_FLAGS`:

| # | File | Format | Env key |
|---|------|--------|---------|
| T017 | `.mcp.json` | JSON `.mcpServers.spec_kit_memory.env` | Add `"SPECKIT_SESSION_BOOST": "true"`, `"SPECKIT_CAUSAL_BOOST": "true"` |
| T018 | `opencode.json` | JSON `.mcp.spec_kit_memory.environment` | Same + update `_NOTE_7` |
| T019 | `.claude/mcp.json` | JSON `.mcpServers.spec_kit_memory.env` | Same + update `_NOTE_7` |
| T020 | `.codex/config.toml` | TOML `[mcp_servers.spec_kit_memory.env]` | `SPECKIT_SESSION_BOOST = "true"` etc. + update `_NOTE_7` |
| T021 | `../Barter/coder/opencode.json` | JSON `.mcp.spec_kit_memory.environment` | Same + update `_NOTE_7` |

Updated `_NOTE_7` should read:
```
"Opt-out flags (all default ON): SPECKIT_ADAPTIVE_FUSION, SPECKIT_EXTENDED_TELEMETRY, SPECKIT_SESSION_BOOST, SPECKIT_CAUSAL_BOOST"
```

**Artifact classifier -- keyword expansion** (T022):
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts`
- Lines 156-197: `QUERY_PATTERNS` array
- Add to `research` keywords: `"search"`, `"retrieval"`, `"pipeline"`, `"indexing"`, `"embedding"`, `"vector"`, `"semantic"`
- Add to `implementation-summary` keywords: `"config"`, `"setup"`, `"env"`, `"flag"`, `"setting"`
- Add to `memory` keywords: `"resume"`, `"recover"`, `"continuation"`

**Artifact classifier -- intent fallback** (T023):
- File: `.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts`
- In `getStrategyForQuery()` (line 239), add optional `intent?: string` parameter
- Insert a new fallback tier at line 286 (between `bestScore === 0` check and specFolder hint):

```typescript
// Intent-based fallback: map detected intent to artifact class
const INTENT_TO_ARTIFACT: Record<string, ArtifactClass> = {
  understand: 'research',
  find_spec: 'spec',
  find_decision: 'decision-record',
  add_feature: 'implementation-summary',
  fix_bug: 'memory',
  refactor: 'implementation-summary',
  security_audit: 'research',
};

if (bestScore === 0 && intent && INTENT_TO_ARTIFACT[intent]) {
  const mappedClass = INTENT_TO_ARTIFACT[intent];
  return {
    strategy: ROUTING_TABLE[mappedClass],
    detectedClass: mappedClass,
    confidence: 0.4, // Low-medium confidence from intent mapping
  };
}
```

**Wire intent into handler** (T024):
- File: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- Find where `getStrategyForQuery(query, specFolder)` is called
- Change to `getStrategyForQuery(query, specFolder, detectedIntent)` where `detectedIntent` is the already-computed intent from the search pipeline

#### Phase 3: Verification (T010-T016, T025-T026)

Run manual MCP tool calls to confirm:
- `sessionBoostApplied` not `"off"` (default, no env vars, with sessionId)
- `causalBoostApplied` not `"off"` (default, no env vars)
- `deepExpansion: true` in deep mode
- Kill-switches work (`=false` produces `"off"`)
- "semantic search" query returns `detectedClass != "unknown"` and `confidence > 0`
- Varied queries show improved artifact classification

### Key Constraints

1. **G2 guard is correct** -- do NOT change `intentWeightsApplied` logic in `stage2-fusion.ts:954`. Hybrid search intentionally skips intent weights to prevent double-counting.
2. **Kill-switch semantics** -- env vars remain available as opt-out (`=false` to disable). Do NOT introduce new env var names.
3. **`rollout-policy.ts`** -- do NOT modify `isFeatureEnabled()` core logic. Only change call-site defaults.
4. **Non-fatal errors** -- all boost failures must remain non-fatal (try/catch, log warning, return unboosted results).
5. **TypeScript strict** -- all changes must compile. Run `npx tsc --noEmit` or equivalent.
6. **Read files before editing** -- always read the current file state before making changes.

### Completion

After implementation, run the checklist verification (30 items: 11 P0, 16 P1, 3 P2). All P0 items must pass with evidence. Update `implementation-summary.md` with what was changed and why.

### Files Reference

| File | Purpose |
|------|---------|
| `mcp_server/lib/search/session-boost.ts` | Session boost enable check (line 29) |
| `mcp_server/lib/search/causal-boost.ts` | Causal boost enable check (line 145) |
| `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` | Deep expansion variant generation |
| `mcp_server/lib/search/pipeline/stage2-fusion.ts` | All signal application (12-step pipeline) |
| `mcp_server/lib/search/search-flags.ts` | Graduated feature flag registry |
| `mcp_server/lib/search/artifact-routing.ts` | Artifact classifier (keyword lists + routing) |
| `mcp_server/handlers/memory-search.ts` | Search handler (wires intent to artifact routing) |
| `mcp_server/lib/cognitive/rollout-policy.ts` | `isFeatureEnabled()` -- DO NOT MODIFY |
| `mcp_server/lib/config/capability-flags.ts` | Roadmap capability flags |
| `.mcp.json` | MCP config (Claude Code fallback) |
| `opencode.json` | OpenCode config |
| `.claude/mcp.json` | Claude Code MCP config |
| `.codex/config.toml` | Codex CLI config |
| `../Barter/coder/opencode.json` | Barter coder OpenCode config |
