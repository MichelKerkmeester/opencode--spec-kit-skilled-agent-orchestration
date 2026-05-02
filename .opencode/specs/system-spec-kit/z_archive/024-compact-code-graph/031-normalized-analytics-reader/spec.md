---
title: "Feature Specification: Normalized [system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/spec]"
description: "Reader-owned normalized replay model for cross-session token analytics, built on the completed Stop-hook producer metadata seam."
trigger_phrases:
  - "normalized analytics reader"
  - "session analytics replay"
  - "cross-session token analytics"
  - "reader-owned replay model"
  - "024 compact code graph"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
# Feature Specification: Normalized Analytics Reader

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_ADDENDUM: Phase - Child Header -->

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 31 (`031-normalized-analytics-reader`) |
| **Predecessor** | `030-opencode-graph-plugin` |
| **Successor** | `032-cached-summary-fidelity-gates` |

---

## EXECUTIVE SUMMARY

Packet `024/003` proved the Stop hook can persist useful session-end facts, but those facts still lived in per-session hook-state JSON and could not answer cross-session questions safely. This packet closes that gap by adding a reader-owned normalized SQLite replay model that ingests the producer metadata seam without changing the writer or startup authority.

**Key Decisions**: Keep the writer boundary unchanged; key `sessions` by `claudeSessionId`; key `turns` by `claude_session_id + transcript_path + byte_start`; seed model-pricing and normalized cache-tier lookup tables; keep dashboard and SessionStart consumers out of scope.

**Critical Dependencies**: The producer metadata packet in `026/002-continuity-memory-runtime/001-cache-warning-hooks` must already be complete, because this packet consumes `producerMetadata.transcript` and cache-token carry-forward fields instead of recreating them.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-08 |
| **Branch** | `024-compact-code-graph/031-normalized-analytics-reader` |

---

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The Stop hook already captures token snapshots and now persists transcript identity plus cache-token carry-forward data, but that state remains stranded in per-session JSON files. Cross-session analytics, turn-level replay, and later token-insight contracts need a reader-owned normalized model with deterministic replay keys, not more producer logic.

### Purpose

Deliver a narrow Level 3 packet that turns the producer seam into a queryable replay model:

- deterministic transcript-turn parsing with absolute line numbers and byte offsets
- normalized `analytics_sessions` and `analytics_turns` tables
- additive lookup tables for model-pricing windows and normalized cache tiers
- idempotent replay from hook-state plus transcript JSONL
- explicit deferral of startup consumers, dashboards, and publication contracts
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Extend transcript replay parsing so the reader can emit turn-level facts with deterministic byte offsets and absolute line numbers.
- Create a reader-owned SQLite analytics store with normalized `analytics_sessions` and `analytics_turns` tables.
- Seed additive lookup tables for model-pricing windows and normalized cache tiers so later reporting packets have a stable contract to build on.
- Ingest from `HookState` producer metadata plus transcript JSONL without changing the Stop hook writer.
- Prove first replay, double replay, and growing-transcript replay behave idempotently.

### Out of Scope

- Any new Stop-hook producer changes in `session-stop.ts` or `hook-state.ts`.
- Any `session-prime.ts`, `session_bootstrap()`, or cached-summary startup consumer work.
- Any dashboard UI, HTML contract, or reporting endpoint.
- Any branch-level, agent-level, or subagent-aware rollups beyond the session/turn read model.
- Any runtime enablement through `.claude/settings.local.json`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/claude-transcript.ts` | Modify | Emit deterministic transcript turns with byte offsets and absolute line numbers. |
| `.opencode/skill/system-spec-kit/mcp_server/lib/analytics/session-analytics-db.ts` | Create | Reader-owned normalized analytics schema, seed data, and ingest helpers. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/session-analytics-db.vitest.ts` | Create | Verify schema creation, replay ingest, idempotency, and growing-transcript replay. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/session-stop-replay.jsonl` | Reuse | Fixture-backed transcript for replay verification. |
| `.opencode/specs/system-spec-kit/024-compact-code-graph/031-normalized-analytics-reader/*.md` | Modify | Align packet docs to the implemented reader-only boundary. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Transcript replay must emit deterministic turn rows. | `parseTranscriptTurns()` returns byte offsets, absolute line numbers, and per-turn token fields so replay identity does not depend on aggregate session offsets alone. |
| REQ-002 | The reader must own normalized `sessions` and `turns` storage. | `analytics_sessions` and `analytics_turns` exist in a dedicated SQLite DB and are not written by the Stop hook directly. |
| REQ-003 | Session identity must stay aligned to the producer seam. | `analytics_sessions.claude_session_id` is the primary key; `speckit_session_id` remains nullable and additive. |
| REQ-004 | Turn identity must be replay-safe and idempotent. | `analytics_turns` enforces uniqueness on `claude_session_id + transcript_path + byte_start`, and double replay inserts zero duplicate turns. |
| REQ-005 | The reader must ingest from existing producer metadata without changing the writer. | Ingest requires `producerMetadata.transcript.path`, replays transcript JSONL, and leaves `session-stop.ts` untouched in this packet. |
| REQ-006 | The packet must seed normalized lookup tables for future pricing/reporting lanes. | `model_pricing_versioned` and `cache_tier_normalized` exist and are queryable after DB initialization. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | The reader must support growing-transcript replay. | Replaying after transcript growth inserts only the newly appended turn(s) and advances `last_replay_offset` monotonically. |
| REQ-008 | Session totals must be derived from normalized turns, not copied blindly from hook-state snapshots. | Session aggregates recompute from `analytics_turns` and remain stable across repeated replays. |
| REQ-009 | Pricing metadata must stay consistent with the current family-level estimate contract. | Seeded pricing rows mirror the existing `estimateCost()` family rates and add normalized cache multipliers for replayed turn costs. |
| REQ-010 | Packet docs must preserve reader-only boundaries. | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` all defer dashboards and startup consumers explicitly. |

### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | The packet README summarizes the current runtime boundary and follow-on lanes. | Root packet README no longer shows raw template text and points clearly to this packet's role in the train. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cross-session analytics no longer depend on scanning raw hook-state JSON files.
- **SC-002**: First replay creates one session row and two turn rows from the fixture-backed transcript.
- **SC-003**: Replaying the same transcript twice inserts zero new turns and preserves stable session totals.
- **SC-004**: Replaying after transcript growth inserts only the appended turn and advances the replay offset.
- **SC-005**: Pricing and cache-tier lookup tables are present for later reporting packets without forcing a dashboard contract into this packet.
- **SC-006**: `session-stop.ts`, `hook-state.ts`, `session-prime.ts`, and `.claude/settings.local.json` remain outside the active write scope for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Completed producer metadata packet (`026/002-continuity-memory-runtime/001-cache-warning-hooks`) | High | Consume the existing `producerMetadata` seam instead of recreating transcript identity or cache-token fields in this packet. |
| Risk | Replay identity drift | High | Key turns by `claude_session_id + transcript_path + byte_start` and verify absolute line numbers in tests. |
| Risk | Session totals drift from writer snapshots | High | Recompute session aggregates from normalized turns after every ingest. |
| Risk | Pricing drift or overclaiming | Medium | Seed family-level pricing rows from the current runtime estimate contract and keep reporting consumers out of scope. |
| Risk | Reader/writer boundary collapse | High | Keep `session-stop.ts` and `hook-state.ts` out of the active write scope and document the reader-only boundary everywhere. |

### Hard Rules

- **Reader-owned only**: this packet adds replay parsing and normalized tables, not producer mutations.
- **No startup authority changes**: `session_bootstrap()` and resume flows remain authoritative.
- **No dashboard shell**: presentation and reporting surfaces are follow-on packets.
- **No hook registration changes**: `.claude/settings.local.json` remains unchanged.
- **Idempotency is mandatory**: replay correctness requires stable totals on repeated ingest.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Replay parsing must stay streaming-based and avoid loading the full transcript into memory for normal ingest.
- **NFR-P02**: Re-running ingest on an unchanged transcript must do near-zero work beyond checking the saved replay offset.

### Security
- **NFR-S01**: The reader must remain local-only and introduce no network calls.
- **NFR-S02**: The analytics DB path must stay under the configured server data directory or an explicitly supplied test directory.

### Reliability
- **NFR-R01**: Database initialization must be idempotent and safe to switch between test directories.
- **NFR-R02**: Replay tests must cover unchanged transcripts and growing transcripts.

### Operability
- **NFR-O01**: Seeded pricing and cache-tier metadata must be queryable for later packets.
- **NFR-O02**: Packet docs must name the next likely consumers without implying they shipped here.

---

## 8. EDGE CASES

### Data Boundaries
- Missing `producerMetadata.transcript.path`: ingest must fail clearly instead of guessing a transcript source.
- Empty replay delta: ingest must return zero inserted turns and preserve existing session totals.
- Appended transcript line without usage: replay may advance offsets but must not fabricate a turn row.

### Error Scenarios
- DB rebind to a new temp directory: singleton handle must close cleanly before switching paths.
- Replayed transcript with reused `claudeSessionId` but new transcript fingerprint: session metadata must refresh while preserving turn identity rules.
- Pricing lookup fallback: unknown models must degrade to the default family row instead of blocking replay.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Crosses parser, analytics storage, replay ingest, tests, and packet docs. |
| Risk | 19/25 | Drift here would poison later reporting and startup consumer packets. |
| Research | 17/20 | The packet exists to implement the exact reader contract the research called for. |
| Multi-Agent | 1/15 | Delivery is packet-local and sequential. |
| Coordination | 12/15 | Depends on accurate boundaries with both predecessor and successor packets. |
| **Total** | **67/100** | **Level 3 because this packet creates a durable analytics seam that later continuity work depends on.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Turn identity is not deterministic enough for replay. | High | Medium | Use byte offsets as the uniqueness key and verify absolute line numbers in tests. |
| R-002 | Session totals rely on writer snapshots instead of normalized replay. | High | Medium | Recompute aggregates from `analytics_turns` after every ingest. |
| R-003 | Pricing fields imply a finished reporting contract. | Medium | Medium | Keep pricing as lookup plus replayed cost fields only and defer dashboards. |
| R-004 | Writer boundary regresses and analytics logic leaks into Stop hook code. | High | Low | Keep `session-stop.ts` read-only in this packet and document the boundary clearly. |
| R-005 | Growing-transcript replay duplicates prior turns. | High | Medium | Start replay from stored `last_replay_offset` and assert appended-turn behavior in tests. |

---

## 11. USER STORIES

### US-001: Query Cross-Session Analytics Safely (Priority: P0)

**As a** maintainer of the continuity lane, **I want** session-end facts replayed into a normalized DB, **so that** later analytics work does not have to scan raw hook-state JSON files.

**Acceptance Scenarios**:

- **Given** a completed producer metadata state, **When** the reader ingests it, **Then** it creates one normalized session row and replayed turn rows.
- **Given** later packets need cross-session totals, **When** they read the analytics DB, **Then** they do not depend on raw hook-state file scans.

---

### US-002: Replay Without Duplicates (Priority: P0)

**As a** runtime maintainer, **I want** deterministic turn identity and replay offsets, **so that** repeated ingest stays stable and only appends new transcript work.

**Acceptance Scenarios**:

- **Given** the same transcript is replayed twice, **When** ingest runs again, **Then** zero new turns are inserted.
- **Given** the transcript grows, **When** ingest runs again, **Then** only the appended turn is inserted and the replay offset advances.

---

### US-003: Keep Future Consumers Honest (Priority: P1)

**As a** planner for later continuity packets, **I want** pricing and cache-tier lookup contracts without a forced dashboard, **so that** reporting and startup packets can build later without overclaiming what shipped now.

**Acceptance Scenarios**:

- **Given** the analytics DB initializes, **When** lookup tables are queried, **Then** seeded pricing rows and cache-tier mappings are present.
- **Given** this packet closes, **When** future work is planned, **Then** startup consumers and dashboard contracts remain explicit follow-on work.

---

## 12. OPEN QUESTIONS

1. Should the next packet wire a CLI or MCP surface for replaying historical state files into the normalized analytics DB?
2. Should later reporting packets keep the family-level pricing model or switch to finer-grained model-version windows?
3. When the dashboard contract lands, should it read directly from `analytics_turns` or through a narrower reporting view?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
