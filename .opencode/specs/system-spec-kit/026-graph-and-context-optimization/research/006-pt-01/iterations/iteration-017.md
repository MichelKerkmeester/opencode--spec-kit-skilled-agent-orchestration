---
title: "Iteration 017 — Failure modes, validation UX, error surface"
iteration: 17
band: C
timestamp: 2026-04-11T14:55:00Z
worker: claude-opus-4-6
scope: q7_q9_failure_modes
status: complete
focus: "Enumerate every failure class for phase 018. Design user-visible messages, recovery paths, state persistence, self-heal."
maps_to_questions: [Q7, Q9]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-017.md"]

---

# Iteration 017 — Failure Modes and Validation UX

## Goal

List every thing that can go wrong in Option C and design the operator experience for each.

## Failure taxonomy

### Category 1: Classifier failures

| Failure | Cause | User-visible message | Recovery |
|---|---|---|---|
| Low confidence refusal | Chunk doesn't match any category prototype | "Chunk [N] refused to route (confidence 0.42)" | User picks force-route or drop |
| Tier 3 LLM unavailable | API down | "Classifier unavailable, falling back to rule-based" | Continue with Tier 1 only; log warning |
| Ambiguous chunk (spans multiple categories) | Mixed content | "Chunk [N] matches 2 categories equally" | Split chunk or user picks one |
| Router disagrees with user's explicit `--route-as` | Override was wrong | "Override applied despite low match (confidence 0.3)" | Warn but proceed; user accepted risk |

### Category 2: Merge failures

| Failure | Cause | User-visible message | Recovery |
|---|---|---|---|
| Target anchor missing | Spec doc lacks the anchor | "Target anchor 'what-built' not found in implementation-summary.md" | Suggest creating anchor OR different target |
| Target doc missing | Spec doc doesn't exist | "Target doc implementation-summary.md not found" | Prerequisite failed (root-packet backfill) |
| Anchor integrity broken post-merge | Merge corrupted open/close pair | "Post-merge validation failed: ANCHORS_VALID" | **Automatic rollback**; pre-merge state restored |
| Frontmatter corruption | Human edit broke YAML | "Frontmatter parse error in handover.md" | Surface to user; no auto-fix |
| External edit during save | Human saved file mid-merge | "Concurrent edit detected; retrying" | Retry up to 3x then surface |

### Category 3: Save pipeline failures

| Failure | Cause | User-visible message | Recovery |
|---|---|---|---|
| Preflight validation fails | Input malformed | "Preflight failed: missing required field X" | Fix input and retry |
| Sufficiency gate fails | Not enough evidence | "Insufficient evidence: expected primary=3, got 1" | Add evidence or override |
| Quality loop doesn't converge | Auto-fixes keep failing | "Quality loop hit max iterations without passing" | Surface to user; save to scratch/ |
| Contamination gate trips | Cross-spec bleed | "Content mentions spec 022 but target is 018" | User explicitly overrides OR content is routed to correct folder |
| PE arbitration rejects | Near-duplicate exists | "Near-duplicate detected at 0.96 similarity" | Merge with existing (reinforce) OR skip |

### Category 4: Schema / index failures

| Failure | Cause | User-visible message | Recovery |
|---|---|---|---|
| UNIQUE constraint violation | Dedup key collision | "Duplicate key (spec_folder, doc, anchor)" | Retry with updated content OR update-in-place |
| FTS5 sync failure | Index corruption | "FTS5 index out of sync with memory_index" | Run `memory_index_scan --repair` |
| vec_memories embedding mismatch | Version mismatch | "Embedding model changed; re-embedding required" | Run reindex-embeddings script |
| Causal edge insert fails | FK violation | "Causal edge references unknown memory_id" | Skip edge; log warning |

### Category 5: Resume / read failures

| Failure | Cause | User-visible message | Recovery |
|---|---|---|---|
| Packet pointer invalid | Stale or wrong | "Packet folder not found: {path}" | User specifies --spec-folder |
| `_memory.continuity` missing | Old doc without block | "No continuity block found; falling through to full doc read" | Fall through succeeds on valid spec docs |
| handover.md malformed | Edit broke structure | "handover.md parse error; skipping to spec docs" | Fall through works |
| All docs missing | Root packet gap | "No canonical docs found; archived memory fallback active" | Root-packet backfill prerequisite should have caught this |

### Category 6: Silent failures (the dangerous class)

| Failure | Detection | Recovery |
|---|---|---|
| Save appears to succeed but content never reaches disk | Hash mismatch between declared and actual | Post-save verification step: re-read the file and confirm the fingerprint matches |
| Classifier routes to wrong target silently | Low-confidence route that was accepted by auto mode | Routing log at `scratch/routing-log.jsonl` — user can audit periodically |
| FSRS decay marks a row as expired incorrectly | Time calculation bug | Periodic `memory_health` check flags rows with suspicious decay state |
| Concurrent edit race wins and overwrites user content | Mtime-check fails to detect | Git tracking is the final safety net — human can `git log` and restore |

## Post-save verification (new safety net)

After every merge operation, run a verification step:
1. Re-read the target spec doc
2. Compute fingerprint
3. Compare to expected fingerprint from the merge operation
4. If mismatch → rollback + log + surface to user
5. If match → commit

This is the "save silently lost" mitigation. Costs <50ms per save. Worth it.

## Dashboard / observability

Phase 018 should expose these operator-facing metrics:

| Metric | Target | Alert threshold |
|---|---|---|
| `save_success_rate` | >99% | <95% |
| `save_latency_p95` | <2s | >5s |
| `resume_latency_p95` | <500ms | >1s |
| `classifier_refusal_rate` | <2% | >10% |
| `merge_rollback_rate` | <0.5% | >2% |
| `archived_hit_rate` | decreasing | increasing after week 4 |
| `concurrent_edit_detections` | rare | spikes indicate a tooling gap |
| `fingerprint_mismatches` | 0 | any non-zero is a bug |

## Findings

- **F17.1**: The failure taxonomy has 6 categories × ~5 failures = ~30 distinct failure modes. Each has a user-visible message and recovery path.
- **F17.2**: The "silent failure" category is the hardest. Post-save fingerprint verification + routing log + git tracking together catch most cases.
- **F17.3**: `concurrent_edit_detections` as a metric lets operators know when the mtime-check safety net is triggering. Spikes indicate a tooling gap (e.g., a background script is hammering the file).
- **F17.4**: Every merge failure has automatic rollback via the atomic envelope from iteration 3. The user never sees half-written spec docs.
- **F17.5**: Dashboard metrics give phase 018 explicit go/no-go signals for phase 019 readiness.

## Band C summary (iterations 13-17)

Band C (UX and developer ergonomics) is complete:

| Iter | Focus | Output |
|---:|---|---|
| 13 | Resume journey | 4x latency improvement, compact actionable output |
| 14 | /memory:save flow | Routing transparency + interactive mode + failure messages |
| 15 | Conflict handling | Per-spec-folder mutex + mtime check + human-wins arbitration |
| 16 | Migration M4 | 1-week implementation + data-driven permanence decision |
| 17 | Failure modes | 30 failure modes mapped + post-save verification + dashboard metrics |

## Next focus

Iteration 18 — begin Band D. End-to-end user journey composition.
