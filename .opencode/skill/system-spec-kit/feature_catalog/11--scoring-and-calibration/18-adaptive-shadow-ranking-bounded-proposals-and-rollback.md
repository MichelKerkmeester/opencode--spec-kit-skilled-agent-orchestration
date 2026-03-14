# Adaptive shadow ranking, bounded proposals, and rollback

## 1. OVERVIEW

Describes the Phase 4 adaptive ranking module that computes bounded proposal deltas from access and validation signals in shadow mode, preserving live ordering as the production source of truth.

This feature lets the system experiment with new ranking ideas without changing what you actually see. It runs alternative rankings in the background and records what would have changed, like a flight simulator for search results. The experiments have strict limits on how big a change they can propose, and a single switch turns the whole thing off if anything looks wrong. Only after a deliberate decision would any of these proposals go live.

---

## 2. CURRENT REALITY

Phase 4 introduced adaptive ranking in shadow mode. The adaptive module computes proposal deltas from access and validation signals while preserving live ordering as the production source of truth.

Proposal magnitudes are explicitly bounded so adaptive exploration cannot produce unbounded score swings. Shadow payloads expose what would change, while the runtime result order remains unchanged unless an explicit graduation decision is made.

Rollback is immediate via feature gating (`SPECKIT_MEMORY_ADAPTIVE_RANKING`). When disabled, adaptive proposal generation and related trace output are removed without schema rollback or data-loss side effects.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/cache/cognitive/adaptive-ranking.ts` | Lib | Adaptive proposal generation and bounded delta logic |
| `mcp_server/lib/storage/access-tracker.ts` | Lib | Access-signal capture feeding adaptive proposals |
| `mcp_server/handlers/memory-search.ts` | Handler | Shadow proposal exposure in search responses |
| `mcp_server/handlers/checkpoints.ts` | Handler | Rollback-compatible checkpoint flow for adaptive rollout operations |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/adaptive-ranking.vitest.ts` | Shadow-mode proposals, bounded deltas, and disable-path rollback behavior |

---

## 4. SOURCE METADATA

- Group: Scoring and calibration
- Source feature title: Adaptive shadow ranking, bounded proposals, and rollback
- Current reality source: Phase 015 implementation

---

## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario NEW-121
