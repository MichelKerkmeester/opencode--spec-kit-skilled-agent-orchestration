# High-Priority Deep Dive

Line numbers below refer to the current repository state for each source file.

## H1. `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`

### Architecture Assessment

This file is the producer-side Claude stop hook for continuity capture. Its structure is a three-stage pipeline: resolve the autosave script path and spawn it (`34-105`), parse transcript and producer metadata (`190-218`, `274-278`), then mutate per-session hook state and optionally retarget the spec folder before autosave (`220-319`, `340-417`). Complexity concentrates in `processStopHook()` (`220-319`) because it mixes transcript parsing, state mutation, logging, retargeting, and autosave dispatch without a transactional boundary.

### Contract Surface

The main exported contract is `processStopHook(input, options)` (`220-319`), which returns a `SessionStopProcessResult` containing touched paths, parse counts, autosave mode, and producer-metadata status. `detectSpecFolder()` (`340-417`) is a second public surface and encodes the file's strongest path-format assumptions. The hook promises best-effort state persistence and best-effort autosave, not durable completion. Inputs are assumed to include a valid `session_id`, readable transcript path, and a spec-folder-shaped transcript tail.

### Failure Modes

The sharpest failure is the `input.session_id ?? 'unknown'` fallback at `240`: missing IDs collapse multiple sessions onto one hashed state key. Autosave is fail-open at `85-101`; timeouts and script failures only log warnings. Spec-folder retargeting at `281-296` silently overwrites the previous target with no rollback path. `runContextAutosave()` re-reads state at `308-309`, so a read-after-write ordering bug remains possible if the prior state update is not yet durably visible.

### Concurrency & State

This hook writes shared state through `recordStateUpdate()` and downstream `updateState()` with no locking. Two overlapping stop events for the same session can lose intermediate writes. The missing-session fallback turns a per-session file into a shared collision bucket. Atomic rename in the lower-level writer protects against torn files, not against concurrent last-write-wins behavior.

### Drift Risk

`SPEC_FOLDER_PATH_RE` and `SPEC_FOLDER_SEGMENT_RE` (`28-31`) hardcode transcript path shapes. `resolveGenerateContextScriptPath()` (`37-58`) assumes the current monorepo layout and a compiled script path that may drift during refactors. `detectSpecFolder()` only scans the last `SPEC_FOLDER_TAIL_BYTES` of the transcript (`340-417`), so longer transcripts can silently hide earlier valid references.

### Test Coverage Assessment

Direct coverage exists for `detectSpecFolder()` via `mcp_server/tests/hook-session-stop.vitest.ts`, and replay-style coverage exists in `mcp_server/tests/hook-session-stop-replay.vitest.ts`. Missing direct coverage includes the `session_id ?? 'unknown'` path, autosave timeout behavior, retargeting overwrite behavior, and end-to-end `processStopHook()` state-to-autosave ordering.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `85-101` | `spawnSync()` timeout/failure is fail-open, so autosave can be dropped after 4 seconds with only a warning. | P1 |
| `199-218`, `274-278` | producer-metadata/stat failures are absorbed into a warning path, leaving `producerMetadataWritten = false` without a hard signal. | P2 |
| `240` | `input.session_id ?? 'unknown'` routes missing IDs into a shared state key and permits silent cross-session overwrite. | P1 |
| `281-296` | spec-folder retargeting overwrites the previous autosave target with an info log only. | P1 |
| `308-309` | autosave reloads state after mutation, but the file offers no explicit ordering guarantee between write completion and read. | P1 |
| `331-336` | `withTimeout()` only bounds stdin parsing, not transcript parse + autosave execution. | P2 |
| `340-417` | spec-folder detection is transcript-tail and regex dependent, so valid earlier references can be missed silently. | P2 |

### Recommended Deep-Review Focus

1. Prove whether missing `session_id` events are possible in real Claude stop traffic and classify the collision risk if they are.
2. Stress the retargeting path with long transcripts that mention multiple spec folders and verify whether the last detected path is always the intended winner.
3. Reproduce the write-then-autosave sequence under artificial I/O delay to determine whether `runContextAutosave()` can observe stale state.
4. Decide whether autosave should remain fail-open or whether repeated timeout/drop events must become durable backlog items.

## H2. `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`

### Architecture Assessment

This file is the tempdir-backed state authority for Claude hook continuity. It maps `cwd` and `sessionId` to stable hashed filenames (`58-70`), loads and saves JSON state (`71-107`, `170-181`), resolves recent state by scope (`109-167`), and provides merge-style updates plus compact-prime helpers (`221-263`). Complexity hotspots are `loadMostRecentState()` and `updateState()` because both encode implicit governance and recency rules that later startup/stop hooks trust.

### Contract Surface

The file promises durable-ish per-session JSON state at `$TMPDIR/speckit-claude-hooks/<project>/<session>.json`. `loadState()` returns `HookState | null`, `saveState()` performs a temp-write plus rename, `updateState()` merges partial patches into a complete state object, and `loadMostRecentState()` fails closed unless either `specFolder` or `claudeSessionId` is provided (`118-129`). The module assumes every stored JSON file already matches the current in-memory `HookState` shape.

### Failure Modes

`JSON.parse(raw) as HookState` at `87` performs no runtime shape validation, so corrupt or schema-drifted files degrade into either silent `null` or a structurally wrong object. `updateState()` (`221-241`) is non-atomic read-modify-write. `saveState()` uses a deterministic `.tmp` path (`173`), so concurrent writers to the same session race even before rename. `cleanStaleStates()` relies on filesystem `mtime` (`244-263`) rather than `updatedAt`, so backup restore or `touch` can make stale state look fresh.

### Concurrency & State

This file is the highest-value concurrency seam in the hook layer. There is no file lock, no compare-and-swap, and no per-write randomized temp path. Overlapping hook flows can lose state patches or overwrite compact payloads. The exported deprecated `readAndClearCompactPrime()` path also creates a destructive read hazard if a caller clears state and crashes before consuming it.

### Drift Risk

There is no `schemaVersion` field on `HookState`, so persisted state cannot be migrated intentionally. `pendingCompactPrime.payloadContract` is loaded as typed data with no validation. `loadMostRecentState()` recognizes only `specFolder` and `claudeSessionId` as scope selectors, even though broader governance elsewhere includes tenant/user/agent dimensions.

### Test Coverage Assessment

Direct tests exist in `mcp_server/tests/hook-state.vitest.ts`. Indirect coverage exists through `mcp_server/tests/token-snapshot-store.vitest.ts`, `hook-precompact.vitest.ts`, and `hook-session-start.vitest.ts`. Missing coverage includes concurrent writers, corrupt-JSON recovery, schema-evolution handling, deterministic `.tmp` collisions, and `mtime` drift versus `updatedAt`.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `87` | `JSON.parse(raw) as HookState` skips runtime validation and silently trusts persisted shape. | P1 |
| `118-129` | recent-state lookup rejects `agentId`/`userId`-only scopes even though those are legitimate governance dimensions elsewhere. | P2 |
| `170-181` | rename is crash-safe but not writer-safe; deterministic `.tmp` path still races. | P1 |
| `173` | `.tmp` path is deterministic per session file, so concurrent writers can overwrite each other's temp content. | P1 |
| `221-241` | `updateState()` is a read-modify-write critical section with no lock or retry. | P1 |
| `244-263` | stale cleanup uses `mtime`, not JSON `updatedAt`, so filesystem drift changes cleanup behavior. | P2 |

### Recommended Deep-Review Focus

1. Model concurrent pre-compact/stop-hook overlap and verify whether deterministic temp filenames can corrupt or lose writes.
2. Add schema-version and validation thinking: should stale files migrate, fail, or be quarantined?
3. Decide whether `loadMostRecentState()` should understand broader scope selectors or remain intentionally narrow.
4. Re-evaluate the deprecated clear-on-read helper as a latent data-loss API.

## H3. `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`

### Architecture Assessment

This is the shared vocabulary layer for trust, provenance, freshness, and payload envelopes. It is mostly pure data-plus-validation: literal-value arrays, assertion helpers, structural trust builders, and envelope construction (`14-90`, `371-401`, `546-614`). Complexity concentrates around the structural trust seam because the file mixes type guards, throwing validators, and compatibility bridges in the same surface.

### Contract Surface

The file promises that callers can construct and validate structural trust using separate axes instead of collapsed confidence. `validateStructuralTrustPayload()` (`371-401`) and `validateGraphEdgeEnrichment()` throw, while helpers such as `isStructuralTrustComplete()` and trust-state mappers are meant to act like predicates or normalizers. `createSharedPayloadEnvelope()` (`546-589`) promises a normalized envelope that strips empty sections but preserves provenance.

### Failure Modes

`isStructuralTrustComplete()` (`495-504`) calls into a throwing constructor path, so an `is-*` predicate can throw instead of returning `false`. `buildStructuralContextTrust()` (`407-431`) silently collapses unknown statuses into the all-unknown trust triple. `createSharedPayloadEnvelope()` accepts zero surviving sections after filtering, yielding a formally valid but operationally empty envelope. `trustStateFromGraphState()` (`592-596`) maps `missing` and `empty` to `stale`, which erases the difference between "not indexed" and "outdated."

### Concurrency & State

This module is stateless and concurrency-safe.

### Drift Risk

The anti-collapsed-trust model depends on `PROHIBITED_STRUCTURAL_TRUST_KEYS` (`193-199`) being manually curated. `SharedPayloadKind` and `producer` are string-literal unions without exported runtime validator arrays, so consumers cannot validate them consistently at runtime. The compatibility bridge `detectorProvenanceToParserProvenance()` (`298-307`) has a hardcoded `structured -> regex` mapping that will break noisily if new detector provenance values appear.

### Test Coverage Assessment

Direct coverage exists in `mcp_server/tests/graph-payload-validator.vitest.ts` and `mcp_server/tests/structural-trust-axis.vitest.ts`. Missing direct coverage includes `isStructuralTrustComplete()` throw behavior, zero-section envelopes, unknown status defaults in `buildStructuralContextTrust()`, and the lossy `trustStateFromGraphState()` collapse.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `153-162` | `SharedPayloadKind`/`producer` have no exported runtime value arrays, so callers cannot validate them consistently. | P2 |
| `193-199` | prohibited collapsed-trust keys are manually enumerated and can drift behind new anti-patterns. | P2 |
| `298-307` | detector provenance compatibility is a single special case; new detector values will fall into throw behavior. | P2 |
| `407-431` | unknown status values silently downgrade to the all-unknown trust triple. | P1 |
| `495-504` | `isStructuralTrustComplete()` can throw, violating predicate expectations. | P1 |
| `546-589` | envelope construction allows `sections: []` after filtering empty content. | P2 |
| `592-596` | graph trust-state mapping collapses `missing`/`empty` into `stale`, erasing recovery semantics. | P1 |

### Recommended Deep-Review Focus

1. Split strict validators from boolean predicates so `is-*` helpers cannot throw.
2. Decide whether empty or missing graph states need a first-class trust state instead of reusing `stale`.
3. Export runtime validators for `SharedPayloadKind` and `producer`.
4. Audit whether any consumer already assumes `createSharedPayloadEnvelope()` implies at least one non-empty section.

## H4. `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`

### Architecture Assessment

This file is the `graph-metadata.json` authority: validation, legacy migration, derivation, merge, and atomic write all live here. It parses JSON or legacy content (`141-208`, `223-255`), derives key files/entities/status/trigger phrases (`409-455`, `791-929`), merges with manual fields (`938-950`), then writes via a temp file (`969-989`). Complexity hotspots are the legacy fallback path and cross-track key-file resolution because both can silently change meaning instead of failing.

### Contract Surface

`validateGraphMetadataContent()` returns a validation result and may quietly migrate legacy content. `loadGraphMetadata()` throws on invalid files or returns `null` when absent. `deriveGraphMetadata()` performs I/O-heavy derivation and re-validates before returning. `mergeGraphMetadata()` preserves manual sections and timestamp fields. `writeGraphMetadataFile()` promises an atomic-ish write guarded by path validation.

### Failure Modes

The highest-risk path is JSON-valid-but-schema-invalid content falling back to legacy parsing (`223-255`). That can convert a malformed modern file into "valid" migrated data with no migration signal. `resolveSpecFolderPath()` can fall back to `basename()` (`480-494`), manufacturing a likely-wrong single-segment spec path. Cross-track probing in `swapCrossTrackPath` / `resolveKeyFileCandidate` (`553-577`, `622-652`) can accept a same-named file from the wrong spec tree. The entity cap at `774` is insertion-order dependent and undocumented.

### Concurrency & State

The final rename is atomic for a single writer, but concurrent refresh/backfill runs still race at the target file. The temp-name scheme uses `process.pid + Date.now()` (`985`), which is not collision-safe for same-process same-millisecond writes.

### Drift Risk

Hardcoded canonical docs (`29-39`) and cross-track folders can drift behind new packet structures. The legacy parser remains an implicit migration channel with no explicit opt-in. The file also duplicates packet-shape assumptions that appear elsewhere in hook code.

### Test Coverage Assessment

Strong direct coverage exists in `mcp_server/tests/graph-metadata-schema.vitest.ts`. Missing targeted coverage includes the JSON-valid/Zod-invalid legacy fallback, cross-track false positives, basename fallback, temp-path collisions, and entity-cap ordering.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `223-255` | schema-invalid JSON silently retries as legacy content with no `migrated` signal. | P1 |
| `266-270` | `existsSync()` followed by `readFileSync()` leaves a TOCTOU read window. | P2 |
| `480-494` | basename fallback can produce a wrong single-segment `spec_folder`. | P1 |
| `553-577`, `622-652` | cross-track file probing can resolve a same-named file from the wrong spec tree. | P1 |
| `774` | 24-entity cap depends on insertion order; no priority rule explains which entities survive. | P2 |
| `831-870` | status derivation relies on checklist/implementation-summary heuristics that can silently shift with template changes. | P2 |
| `985` | temp filename uses `process.pid + Date.now()` and is not robust against rapid same-process collisions. | P2 |

### Recommended Deep-Review Focus

1. Decide whether legacy fallback should require an explicit migration flag or at least emit a `migrated: true` signal.
2. Review cross-track probing with adversarial same-filename fixtures.
3. Harden `resolveSpecFolderPath()` so invalid folder shapes fail instead of fabricating single-segment output.
4. Add concurrency tests for dual writers and deterministic entity-selection rules at the 24-item cap.

## H5. `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts`

### Architecture Assessment

This file implements hybrid RRF fusion plus feature-flagged adaptive weighting. It defines intent profiles (`60-69`), rollout/flag helpers (`81-115`), weight computation (`138-188`), the adaptive fusion core (`203-250`), and the exported entry point (`356-429`). Complexity sits at the boundary between documented scoring behavior and feature-flag fallbacks, where multiple paths produce structurally similar outputs with different semantics.

### Contract Surface

`hybridAdaptiveFuse()` is the main entry point, while `getAdaptiveWeights()` and `INTENT_WEIGHT_PROFILES` are directly exported. The file promises adaptive weighting based on intent, doc-type weight factor, and rollout status. It also exposes `graphCausalBias` in every profile, implying causal influence even though the algorithm never reads that field.

### Failure Modes

The private `continuity` profile is publicly exported through `INTENT_WEIGHT_PROFILES`, so future intent classifiers can activate it accidentally. `graphCausalBias` exists in type and tests but is runtime inert. `computeStandardSafe()` returns unnormalized fallback weights, and the adaptive-error fallback path can still report adaptive weights even when standard fusion actually ran. A malformed `SPECKIT_ROLLOUT_PERCENT` defaults to full rollout (`99-103`) instead of failing closed.

### Concurrency & State

The fusion logic is stateless, but `DOC_TYPE_WEIGHT_FACTOR` is read once at module load (`86`). Long-lived processes cannot reconfigure it without reloading the module, which creates hidden statefulness in tests and daemons.

### Drift Risk

The undocumented `continuity` profile can drift from classifier expectations. Weight constants have no versioning. The typed-yet-unused `graphCausalBias` field creates a false contract surface: tests and readers think it matters, but production scoring ignores it.

### Test Coverage Assessment

Direct weighting coverage exists in `mcp_server/tests/intent-weighting.vitest.ts`. Missing coverage includes malformed rollout values, error-fallback weight reporting, and any proof that `graphCausalBias` affects output (it does not today).

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `25-27` | `graphCausalBias` is defined in the type but never consumed by fusion logic. | P1 |
| `60-69`, `435-438` | internal `continuity` profile is exported publicly via `INTENT_WEIGHT_PROFILES`. | P1 |
| `86` | `DOC_TYPE_WEIGHT_FACTOR` is frozen at import time, not per call. | P2 |
| `99-103` | malformed rollout env values default to `100`, effectively fail-open. | P1 |
| `370-388` | standard fallback weights are unnormalized and can mislead callers inspecting `result.weights`. | P2 |
| `401-411` | adaptive-error fallback returns adaptive weights even when standard fusion ran. | P1 |

### Recommended Deep-Review Focus

1. Decide whether `graphCausalBias` should be implemented or removed before more callers depend on it.
2. Hide or formalize the `continuity` profile.
3. Make malformed rollout config conservative by default.
4. Align reported weights with the algorithm path that actually executed.

## H6. `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`

### Architecture Assessment

This file is the save-time reconsolidation governor. It first classifies planner mode and assistive mode (`72-94`), normalizes requested scope (`177-236`), then runs reconsolidation plus assistive recommendation logic (`243-444`, `453-512`). The highest complexity is in the interplay between exact scope filtering, early return behavior, and the embedded `storeMemory` callback that performs transactional writes inside the reconsolidation engine.

### Contract Surface

`runReconsolidationIfEnabled()` returns `{ earlyReturn, warnings, assistiveRecommendation }`. `ASSISTIVE_AUTO_MERGE_THRESHOLD` and `ASSISTIVE_REVIEW_THRESHOLD` are exported constants. The contract implies that scope filtering is authoritative and that assistive recommendations are advisory. The file assumes candidate rows contain sane numeric IDs and content text usable for similarity decisions.

### Failure Modes

`reconWarnings.assistiveRecommendation = assistiveRecommendation` at `500` attaches a typed field to an array instance, which disappears under serialization or spread. Over-fetching 3x before scope filtering (`283-294`) can yield a silent no-candidate outcome that looks like "no similar memories exist" rather than "everything was filtered out." The complement path can fall through to normal create (`394`) even though reconsolidation may already have invoked `storeMemory`. Null `content_text` is passed downstream with no local guard (`299-301`).

### Concurrency & State

The inner `storeMemory` callback is transactional, but the outer pre-check/search/filter logic is not. Two concurrent saves can both pass the checkpoint gate and then both reconcile against the same near-duplicate candidate set.

### Drift Risk

`classifySupersededOrComplement()` uses length ratio only, so semantic drift can silently flip merge/complement decisions. The exported `ASSISTIVE_AUTO_MERGE_THRESHOLD` suggests automation that does not actually exist, which is a contract-drift hazard for future callers.

### Test Coverage Assessment

Direct coverage exists in `mcp_server/tests/reconsolidation-bridge.vitest.ts` and `assistive-reconsolidation.vitest.ts`. Indirect save-path coverage exists through `handler-memory-save.vitest.ts`. Missing targeted coverage includes the array-property side channel, complement double-write risk, zero-survivor scope filtering diagnostics, and the misleading auto-merge threshold name/behavior.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `254` | default planner mode is effectively `plan-only`, so reconsolidation is disabled unless callers opt in explicitly. | P2 |
| `283-294` | 3x over-fetch followed by strict scope filtering can silently erase all candidates. | P1 |
| `299-301` | null `content_text` can reach downstream similarity logic without a local guard. | P2 |
| `394` | complement path falls through to normal create, creating double-write risk if reconsolidation already stored output. | P1 |
| `478-481` | exported auto-merge threshold is advisory only; no merge/archive side effect occurs. | P1 |
| `500` | assistive recommendation is attached to an array object and is easy to lose in transport/serialization. | P1 |

### Recommended Deep-Review Focus

1. Prove whether complement evaluation can write before falling through to normal create.
2. Remove the array-property side channel and keep assistive output on the typed result object only.
3. Distinguish "no candidates" from "all candidates filtered by scope" in logs or return metadata.
4. Rename or implement the auto-merge threshold so callers are not misled.

## H7. `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts`

### Architecture Assessment

This file is the sequential post-insert enrichment pipeline. It gates execution by planner mode (`63-65`), then runs causal-linking, entity extraction, summary generation, entity linking, and graph lifecycle steps in order (`80-215`), with a deferred-status wrapper at `217-242`. Complexity comes from the file acting as a workflow controller while encoding success, skip, and defer states into the same boolean status fields.

### Contract Surface

`runPostInsertEnrichmentIfEnabled()` is the public entry point. `shouldRunPostInsertEnrichment()` promises a boolean decision based on planner mode and feature flags. The file returns `executionStatus`, `enrichmentStatus`, and `followUpAction`. Callers are expected to treat planner-first deferral honestly, but the current structure makes that difficult because per-step booleans do not distinguish run vs skipped vs deferred.

### Failure Modes

Every step marks its boolean status `true` in both success and many skip paths (`99`, `112`, `125`, `133`, `152`, `155`, `179`, `181`, `207`, `208`). The deferred branch (`227-234`) sets every status to `true` as well, so `executionStatus.status` is the only truthful discriminator. `followUpAction: 'runEnrichmentBackfill'` (`235`) appears to have no local or upstream consumer. Entity linking checks feature flags, not the actual outcome of prior entity extraction (`159-161`), and graph lifecycle can be activated as an undocumented side effect of enabling entity linking (`187`).

### Concurrency & State

The pipeline is sequential and stateless locally, but `generateAndStoreSummary()` is I/O-bound and unbounded by timeout. A slow embedding provider stalls all later enrichment steps.

### Drift Risk

This controller depends on scattered feature flags staying semantically aligned with pipeline behavior. The existence of `followUpAction` promises deferred recovery that the code does not itself enforce. Success logging currently uses `console.error`, which can drift into false-positive alerting in monitored environments.

### Test Coverage Assessment

Direct coverage exists in `mcp_server/tests/post-insert-deferred.vitest.ts`. Indirect save-flow coverage exists through `handler-memory-save.vitest.ts`. Missing targeted coverage includes the meaninglessness of boolean step status, entity-link-after-failed-extraction behavior, graph-lifecycle implicit enablement, and any consumer for deferred backfill.

### Specific Findings

| Lines | Finding | Severity |
| --- | --- | --- |
| `99`, `112`, `125`, `133`, `152`, `155`, `179`, `181`, `207`, `208` | per-step booleans are `true` for both success and many skip paths, so they do not encode outcome truthfully. | P1 |
| `159-161` | entity linking keys off flags, not actual success of prior entity extraction. | P1 |
| `187` | graph lifecycle is enabled by `isGraphRefreshEnabled() || isEntityLinkingEnabled()`, creating implicit coupling. | P1 |
| `227-234` | deferred path marks all enrichment status values `true`, producing false-success reporting. | P1 |
| `235` | `followUpAction: 'runEnrichmentBackfill'` appears to have no consumer. | P1 |

### Recommended Deep-Review Focus

1. Replace boolean enrichment flags with a tri-state or enum contract.
2. Verify whether deferred enrichment is ever resumed in practice; if not, the follow-up action is dead contract.
3. Decouple graph lifecycle from entity-linking enablement.
4. Add timeout/error-budget thinking around summary embedding so one slow provider does not block the entire pipeline.
