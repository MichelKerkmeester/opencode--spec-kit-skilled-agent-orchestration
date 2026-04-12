---
title: "Iteration 018 — End-to-end user journey composition"
iteration: 18
band: D
timestamp: 2026-04-11T15:00:00Z
worker: claude-opus-4-6
scope: synthesis_user_journey
status: complete
focus: "Compose a single narrative walkthrough of a complete packet lifecycle under Option C: plan → work → save → resume → search → close."
maps_to_questions: [Q1, Q2, Q3, Q4, Q5, Q6, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-018.md"]

---

# Iteration 018 — End-to-End User Journey

## Goal

Sanity check: do the 17 prior iterations compose into a coherent system? Walk through the full lifecycle from a user's perspective. Identify weak links.

## The journey

### Day 1: Starting a new packet

**User action**: `/spec_kit:plan "Add rate limiting to the auth API"`

**What happens**:
1. Plan workflow creates `specs/NNN-add-rate-limiting/` folder
2. Writes `spec.md`, `plan.md`, `tasks.md`, `checklist.md` from templates
3. Each template includes the `_memory.continuity` block (iteration 5 schema) with empty initial state
4. `/spec_kit:plan` does NOT run `/memory:save` — the plan docs themselves are the initial memory

**User sees**: 4 spec kit docs created, ready for implementation.

### Day 1 afternoon: First work session

**User action**: Opens the codebase, writes some code, makes 3 decisions along the way, hits a blocker.

**At session end**: user runs `/memory:save`.

**What happens**:
1. `/memory:save` collects session context (exchanges, tool calls, decisions, blockers)
2. `contentRouter` (iteration 2) classifies 5 content chunks:
   - Chunk 1: narrative progress → `implementation-summary.md::what-built`
   - Chunk 2: narrative delivery → `implementation-summary.md::how-delivered`
   - Chunk 3: decision (JWT signing algorithm) → `decision-record.md::adr-001` (NEW ADR, packet is L3)
   - Chunk 4: decision (rate limit window) → `decision-record.md::adr-002`
   - Chunk 5: blocker (upstream lib race condition) → `handover.md`
3. `anchorMergeOperation` (iteration 3) applies each merge inside `withSpecFolderLock`
4. Each merge updates the target anchor + the `_memory.continuity` block
5. Validator runs, ANCHORS_VALID passes, fingerprint stored

**User sees**: save summary with 5 routing decisions, latency ~1.5s.

### Day 2: Resume next day

**User action**: `/spec_kit:resume`

**What happens** (iteration 13 fast path):
1. Packet pointer resolved from git worktree
2. `handover.md` read (~20ms) — returns the blocker entry
3. `implementation-summary.md` frontmatter read (~30ms) — returns `_memory.continuity`: recent action, next safe action, key files
4. Total latency ~300ms

**User sees**:
```
Resumed: NNN-add-rate-limiting

Recent action: Implemented JWT rate limiter; hit upstream race condition
Next safe action: Try the fix in [file:line] — requires upstream patch review
Blockers: Upstream lib race condition (awaits upstream fix)
Completion: 40% (8 of 20 tasks)

Key files:
- src/middleware/rate-limiter.ts
- specs/NNN-add-rate-limiting/decision-record.md (adr-001, adr-002)
```

User immediately knows what to do without reading memory narrative.

### Day 3: Researching prior work

**User action**: `/memory:search "JWT rotation strategies"`

**What happens** (iteration 7):
1. Query reaches `memory_context(auto mode)`
2. Intent classifier identifies "find_decision" intent
3. Search targets `decision-record.md::adr-*` anchors first
4. Returns 3 relevant ADRs from prior packets (plus 1 fresh ADR from the current packet)
5. Archived memories are not surfaced (fresh spec docs cover it)

**User sees**: 4 decision records with context, no archived memory clutter.

### Day 5: Implementation complete

**User action**: Runs final tests, fixes remaining checklist items, then `/spec_kit:complete`.

**What happens**:
1. `/spec_kit:complete` calls the existing completion workflow
2. Runs validator (ANCHORS_VALID + FRONTMATTER_MEMORY_BLOCK both pass)
3. Calls `/memory:save` with final session context
4. Router places final narrative in `implementation-summary.md::what-built` + `::how-delivered` + `::verification`
5. `_memory.continuity.completion_pct` → 100%
6. `handover.md` gets a "Session ended — packet complete" entry

**User sees**: completion summary, packet closed.

### Day 30: Someone else picks up a related packet

**User B action**: `/memory:search "rate limiting with JWT"`

**What happens**:
1. Semantic search hits `implementation-summary.md::what-built` from the completed packet
2. Causal graph (iteration 10) follows edges to related ADRs
3. Returns the full packet's implementation summary + decisions + verification
4. The packet's narrative is discoverable via spec docs, not via memory files

**User B sees**: prior work immediately, as rich context, without having to dig through memory files.

## Weak links found

Walking through this journey, I noticed these friction points:

### WL1: Decision record auto-numbering

When the router inserts a new ADR, it scans existing ADRs to compute the next number. Under concurrent saves, two simultaneous inserts could both choose ADR-003. The mutex serializes them, so the second insert sees ADR-003 already exists and picks ADR-004. Safe but needs to be explicit in the implementation.

### WL2: First-time packet missing implementation-summary.md

If a user runs `/memory:save` before any `implementation-summary.md` exists (e.g., mid-implementation before running `/spec_kit:complete`), the merge has no target. Router falls back to saving to `handover.md` as "pending implementation" content.

**Fix**: phase 019 templates should pre-create empty `implementation-summary.md` with anchors during `/spec_kit:plan`, not just during `/spec_kit:complete`.

### WL3: Orphaned routing decisions

If the router classifies a chunk as `research_finding` but the packet has no `research/` subdirectory yet, the merge fails. Fix: auto-create `research/research.md` on first research save.

### WL4: Cross-packet citations

A decision in packet A references a file in packet B. The causal graph can track this (F10.3 in iteration 10), but the user may not see the cross-reference without explicit traversal.

**Mitigation**: the resume path optionally surfaces cross-packet causal edges. Not blocking but worth polishing.

### WL5: Low-level implementation details drift to narrative anchors

The router classifies implementation details as `narrative_progress`, which can lead to `implementation-summary.md::what-built` accumulating a lot of technical minutiae. The spec doc becomes noisy over time.

**Mitigation**: periodic compaction — every N saves, the router can suggest "what-built has grown; should we extract older entries to `research/history.md`?" This is a phase 020 consideration, not a phase 018 blocker.

## Findings

- **F18.1**: The end-to-end journey composes cleanly. The 4 new components (contentRouter, anchorMergeOperation, thinContinuityRecord, resumeLadder) work together without interface mismatches.
- **F18.2**: The 4x resume latency improvement (iteration 13) is visible in the user journey — Day 2 resume feels fast compared to current baselines.
- **F18.3**: 5 weak links found, none are blockers. Mitigations are straightforward (pre-create docs, auto-create subdirs, surface cross-packet edges, periodic compaction).
- **F18.4**: The packet lifecycle from plan → work → save → resume → complete → search is fully covered. No missing primitive.
- **F18.5**: The journey validates that Option C preserves "the user can always find what they need", which was the core concern from phase 017.

## Next focus

Iteration 19 — testing strategy and evidence plan.
