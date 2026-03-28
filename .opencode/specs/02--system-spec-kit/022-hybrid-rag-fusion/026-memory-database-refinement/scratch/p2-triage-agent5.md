## P2-026: External DB reinitialization leaves stale in-process caches alive
- **Decision**: FIX
- **Reason**: The stale-cache risk is real after an out-of-process DB reinitialization. I added a server-side invalidation step that clears the tool cache and trigger matcher cache before dispatch whenever `checkDatabaseUpdated()` reports a refresh.
- **Evidence**: `context-server.ts:267-276`, `context-server.ts:319-321`, `tests/context-server.vitest.ts:920-939`
- **Impact**: medium

## P2-029: memory_quick_search returns envelopes labeled as memory_search
- **Decision**: FIX
- **Reason**: The results were correct, but the envelope metadata identified the wrong tool name, which can skew observability and any client behavior keyed off `meta.tool`. The dispatcher now rewrites the reused search envelope to `memory_quick_search`.
- **Evidence**: `tools/memory-tools.ts:28-50`, `tools/memory-tools.ts:72-90`, `tests/memory-tools.vitest.ts:41-66`
- **Impact**: low

## P2-030: Shared-memory admin tools publish looser contract than enforced
- **Decision**: FIX
- **Reason**: This was a real public-contract mismatch: JSON schema accepted both actor identifiers together while runtime validation rejected them. The published schemas now encode "exactly one actor identity" with `oneOf` plus `not`.
- **Evidence**: `tool-schemas.ts:401-473`, `tests/tool-input-schema.vitest.ts:381-443`
- **Impact**: medium

## P2-031: Published JSON schemas under-document numeric/non-empty constraints
- **Decision**: FIX
- **Reason**: Public schemas were missing several runtime bounds and minimum-length requirements, which weakens client-side validation and tool discoverability. I mirrored the missing constraints into `tool-schemas.ts` for the affected tool surfaces.
- **Evidence**: `tool-schemas.ts:43`, `tool-schemas.ts:73`, `tool-schemas.ts:197-198`, `tool-schemas.ts:212`, `tool-schemas.ts:219`, `tool-schemas.ts:226`, `tool-schemas.ts:232`, `tool-schemas.ts:248-253`, `tool-schemas.ts:293`, `tool-schemas.ts:303-308`, `tool-schemas.ts:332-397`, `tool-schemas.ts:491-510`, `tests/tool-input-schema.vitest.ts:24-40`, `tests/tool-input-schema.vitest.ts:445-469`
- **Impact**: medium

## P2-032: Dispatcher-local ContextArgs drifted from public memory_context contract
- **Decision**: FIX
- **Reason**: `profile` was documented publicly but not represented in the dispatcher-local arg type, and routed strategies could silently drop it. I added the field to the shared type and forwarded it through the routed `memory_search` calls.
- **Evidence**: `tools/types.ts:41-58`, `handlers/memory-context.ts:71-85`, `handlers/memory-context.ts:636-706`, `handlers/memory-context.ts:1118-1124`, `tests/handler-memory-context.vitest.ts:246-259`
- **Impact**: medium

## P2-038: Timeout handling incomplete for HF local and cloud warmup
- **Decision**: DEFER
- **Reason**: The finding is valid, but the tested runtime path for `@spec-kit/shared/*` resolves through checked-in `../shared/dist/*.js` exports, not just the TypeScript source files in my ownership. A source-only change would not actually fix the live/imported providers in this workspace, and updating the exported dist artifacts is outside the allowed file set.
- **Evidence**: `../shared/package.json:5-9`, `../shared/dist/embeddings/providers/hf-local.js:180-203`, `../shared/dist/embeddings/providers/openai.js:184-199`, `../shared/dist/embeddings/providers/voyage.js:208-223`
- **Impact**: high

## P2-039: Base envelope tokenCount undercounts actual MCP payload
- **Decision**: FIX
- **Reason**: The previous token estimate only covered `data`, which understated the payload used for MCP transport and token-budget enforcement. The envelope now computes `meta.tokenCount` from the final serialized envelope.
- **Evidence**: `lib/response/envelope.ts:99-119`, `lib/response/envelope.ts:148-179`, `tests/envelope.vitest.ts:252-260`
- **Impact**: medium

## P2-040: autoSurfacedContext creates second out-of-envelope response contract
- **Decision**: DEFER
- **Reason**: The extra top-level field is a genuine contract smell, but removing or relocating it would be a response-shape breaking change for current consumers and tests. I left it untouched in this triage pass because there was no approval to break the additive compatibility surface.
- **Evidence**: `context-server.ts:374-376`, `tests/context-server.vitest.ts:915-917`
- **Impact**: low

## P2-041: Handler barrel eagerly imports full handler graph, amplifies side effects
- **Decision**: DEFER
- **Reason**: The eager-import concern is credible, but a safe fix needs wider import-graph refactoring than the owned files alone can provide. Changing only the barrel here would leave the broader direct-import pattern unresolved and risks partial startup behavior changes.
- **Evidence**: `handlers/index.ts:5-19`, `handlers/index.ts:166-180`, `context-server.ts:32-36`
- **Impact**: medium
