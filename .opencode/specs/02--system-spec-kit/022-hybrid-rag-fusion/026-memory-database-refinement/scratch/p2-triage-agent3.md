## P2-009: Delimiter collisions warned but ambiguous keys still persisted
- **Decision**: FIX
- **Reason**: The finding is real, but the unsafe case is narrow. I kept the legacy readable key format for normal rows and switched only separator-collision cases to a hashed structured key so ambiguous lineage identities no longer persist.
- **Evidence**: `lib/storage/lineage-state.ts:220-265`
- **Impact**: medium

## P2-010: Concurrent supersedes not serialized or retried
- **Decision**: DEFER
- **Reason**: The race is real because version assignment is computed before the insert and uniqueness is enforced on `(logical_key, version_number)`. A correct fix needs an explicit branch/conflict policy plus concurrency-focused tests, which would extend beyond the owned files and current single-writer assumptions.
- **Evidence**: `lib/storage/lineage-state.ts:583-672`; `lib/search/vector-index-schema.ts:1142-1155`
- **Impact**: medium

## P2-011: SPECKIT_GRAPH_WALK_ROLLOUT docs advertise unsupported `full` state
- **Decision**: DEFER
- **Reason**: The mismatch is real: runtime only resolves `off`, `trace_only`, and `bounded_runtime`, while the docs still mention `full`. Removing the stale doc text is outside my ownership, and implementing a true `full` mode would require coordinated type/schema/telemetry updates beyond this pass.
- **Evidence**: `lib/search/search-flags.ts:192-206`; `references/config/environment_variables.md:217`
- **Impact**: low

## P2-012: Shared-memory defaults documented as true but defaulted off
- **Decision**: DEFER
- **Reason**: Runtime already defaults the roadmap shared-memory capability to `false`; the problem is the stale telemetry README entry, not the code path. Fixing the inconsistency is documentation-only and outside my owned files.
- **Evidence**: `lib/config/capability-flags.ts:141-147`; `lib/telemetry/README.md:101`
- **Impact**: low

## P2-013: Some SPECKIT flags frozen at import time
- **Decision**: FIX
- **Reason**: The finding is real and affects live flag flips in long-running server processes. I replaced the import-time env snapshots with runtime resolvers so co-activation strength, co-activation enablement, and relations gating now honor current `process.env` values without a module reload.
- **Evidence**: `lib/cognitive/co-activation.ts:24-49`; `lib/learning/corrections.ts:151-225`; `lib/search/pipeline/stage2-fusion.ts:56-61`; `lib/search/pipeline/stage2-fusion.ts:792-805`
- **Impact**: medium

## P2-014: Encoding detection misdecodes BOM-less UTF-16 as UTF-8
- **Decision**: FIX
- **Reason**: The parser really did fall straight back to UTF-8 whenever a BOM was absent, which can silently corrupt BOM-less UTF-16 content during indexing. I added a parity/null-byte heuristic to detect BOM-less UTF-16LE/BE before the UTF-8 fallback.
- **Evidence**: `lib/parsing/memory-parser.ts:130-218`
- **Impact**: medium

## P2-015: Global shared-memory enablement is unauthenticated
- **Decision**: DEFER
- **Reason**: The security concern is valid, but `handleSharedMemoryEnable()` currently accepts an untyped free-form args object and the public tool/schema contract does not expose caller identity for this operation. A real fix needs handler, tool-schema, and caller-contract changes together, which is outside my ownership list.
- **Evidence**: `handlers/shared-memory.ts:723-762`
- **Impact**: high

## P2-016: Session learning file does not implement FSRS state
- **Decision**: REJECT
- **Reason**: I do not see a broken runtime contract here. This handler is scoped to epistemic preflight/postflight measurement and learning-history reporting, while FSRS scheduling already lives in the cognitive subsystem; the module name is broad, but the implemented tool contract is internally consistent.
- **Evidence**: `handlers/session-learning.ts:15-50`; `handlers/session-learning.ts:543-647`; `lib/cognitive/fsrs-scheduler.ts:29-201`
- **Impact**: low

## P2-033: Auto-discovered spec folders found too late for resume recovery
- **Decision**: DEFER
- **Reason**: The ordering issue is real in the read-only code: session state is saved before auto-discovery can populate `specFolder`, so resume recovery can miss discovered scope on first persistence. The fix belongs in `handlers/memory-context.ts`, which is explicitly out of scope for my edits.
- **Evidence**: `handlers/memory-context.ts:847-858`; `handlers/memory-context.ts:1065-1071`
- **Impact**: medium
