# Iteration 9 — Shared payload trust seams (9/10)

## Investigation Thread
I audited the shared payload contract layer behind startup, resume, bootstrap, and OpenCode transport output. The focus was whether payload-level trust and provenance remain truthful once structural state leaves the raw graph/session helpers and gets serialized for runtime consumption.

## Findings

### Finding R9-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
- **Lines:** `592-601`
- **Severity:** P1
- **Description:** The shared trust-state mappers collapse non-usable structural states into `stale`, erasing the difference between "graph exists but is outdated" and "graph is empty/unavailable". `trustStateFromGraphState()` maps both `empty` and `missing` startup graph states to `stale`, and `trustStateFromStructuralStatus()` maps `missing` bootstrap/resume structural context to `stale`.
- **Evidence:** `startup-brief.ts:225-239` feeds `graph.graphState` into `trustStateFromGraphState()`, while `session-snapshot.ts:215-221` produces `status = 'missing'` whenever graph freshness is `empty` or `error`. `session-resume.ts:530-546` and `session-bootstrap.ts:321-338` then serialize that missing state as `provenance.trustState = 'stale'`. The direct tests already lock one half of this collapse in place by asserting `brief.sharedPayload?.provenance.trustState === 'stale'` for an `empty` graph (`tests/startup-brief.vitest.ts:79-99`), while `tests/session-bootstrap.vitest.ts:104-123` only covers the explicit `stale` branch and leaves `missing` untested.
- **Downstream Impact:** `buildOpenCodeTransportPlan()` prints `payload.provenance.trustState` verbatim into runtime-facing startup and retrieval digests (`lib/context/opencode-transport.ts:64-71,122-149`), so hookless consumers see a recoverable "`stale` graph" even when structural context is actually absent or failed. That blurs the operator action boundary between "refresh existing graph" and "run an initial scan / repair a missing graph".

### Finding R9-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts`
- **Lines:** `40-54`
- **Severity:** P2
- **Description:** Shared payload coercion is shape-only, not contract-level. `coerceSharedPayloadEnvelope()` accepts any object with a string `kind`, string `summary`, array `sections`, and object `provenance`, without validating `kind`, `producer`, `trustState`, `sourceSurface`, or the section payload schema.
- **Evidence:** `isSharedPayloadEnvelope()` only checks top-level primitive/container shapes (`opencode-transport.ts:40-49`), and `coerceSharedPayloadEnvelope()` returns the object unchanged (`53-54`). `session-bootstrap.ts:250-251` trusts that helper for nested `resume` and `health` payloads, and `renderBlockContent()` then emits `payload.provenance.producer`, `trustState`, and `sourceSurface` directly into OpenCode transport blocks (`opencode-transport.ts:64-71`). The test suite only exercises a typed happy path plus rejection of `{ nope: true }` (`tests/opencode-transport.vitest.ts:33-60`); there is no regression for malformed provenance strings or invalid section members.
- **Downstream Impact:** A drifted `session_resume` or `session_health` payload can survive bootstrap transport coercion with bogus provenance labels and still be rendered as authoritative startup/retrieval guidance. Because `session_bootstrap` only fail-closes on missing `structuralTrust` for the resume structural section (`handlers/session-bootstrap.ts:253-270`), envelope-level provenance drift can pass through unnoticed.

## Novel Insights
Phase 015 reviewed fail-closed `structuralTrust` handling on the bootstrap path, but it did not cover the broader payload envelope semantics. This iteration shows two deeper seams: first, absent structural state is relabeled as `stale` at the shared vocabulary layer; second, once payloads cross into OpenCode transport, the envelope provenance framing the whole payload is trusted much more loosely than the structural-trust section data inside it.

## Next Investigation Angle
Trace the same envelope/provenance seam into cached and compaction surfaces, especially `hooks/claude/shared.ts`, `hooks/gemini/compact-cache.ts`, and any replay wrapper that emits provenance headers or rehydrates cached shared payloads.
