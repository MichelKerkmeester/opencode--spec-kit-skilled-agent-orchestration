---
title: "Decision Record: Remaining Bugs Remediation [054-remaining-bugs-remediation/decision-record]"
description: "Date: 2026-01-01"
trigger_phrases:
  - "decision"
  - "record"
  - "remaining"
  - "bugs"
  - "remediation"
  - "decision record"
  - "054"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Remaining Bugs Remediation

| Field | Value |
|-------|-------|
| **Spec ID** | 054-remaining-bugs-remediation |
| **Created** | 2026-01-01 |
| **Status** | Draft |

---

## Decision Log

### DEC-001: Database Change Notification Mechanism

**Date**: 2026-01-01
**Status**: Proposed
**Deciders**: TBD

#### Context

BUG-001 identified a race condition where generate-context.js writes to SQLite while the MCP server maintains a separate connection. Changes aren't visible until server restart.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A: File-based notification** | Simple, no DB changes, works with any SQLite version | Requires file system access, slight latency |
| **B: SQLite WAL mode** | Better concurrent access, standard SQLite feature | Requires DB migration, more complex |
| **C: Shared connection pool** | Single source of truth | Major architectural change, complex |
| **D: IPC/Socket notification** | Real-time, no file I/O | Complex, platform-dependent |

#### Decision

**Selected: Option A - File-based notification**

#### Rationale

- Simplest implementation with minimal risk
- No database schema changes required
- Works with existing SQLite configuration
- Can be upgraded to WAL mode later if needed

#### Consequences

- Small file I/O overhead on each request
- Notification file must be in accessible location
- Future enhancement: Consider WAL mode for high-concurrency scenarios

---

### DEC-002: Transaction Rollback Strategy

**Date**: 2026-01-01
**Status**: Proposed
**Deciders**: TBD

#### Context

BUG-002 identified that failed vector insertions leave orphaned metadata records.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A: Explicit BEGIN/COMMIT/ROLLBACK** | Clear, explicit control | Verbose |
| **B: better-sqlite3 transaction() wrapper** | Cleaner syntax, auto-rollback | Less explicit |
| **C: Two-phase commit** | Maximum safety | Overkill for single-DB |

#### Decision

**Selected: Option A - Explicit transaction control**

#### Rationale

- Most explicit and debuggable
- Clear error handling path
- Matches existing code patterns in the codebase

#### Consequences

- Slightly more verbose code
- Clear audit trail in logs
- Easy to add additional cleanup logic

---

### DEC-003: Embedding Dimension Confirmation Strategy

**Date**: 2026-01-01
**Status**: Proposed
**Deciders**: TBD

#### Context

BUG-003 identified that schema creation may use wrong dimensions if it happens before embedding provider warmup.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A: Delay schema creation with timeout** | Simple, non-blocking after timeout | May delay startup |
| **B: Lazy schema creation on first insert** | No startup delay | First insert slower |
| **C: Require explicit dimension config** | No guessing | Breaks existing deployments |

#### Decision

**Selected: Option A - Delay with timeout (5 seconds)**

#### Rationale

- Balances correctness with startup time
- Falls back gracefully to default
- Logs warning when using fallback

#### Consequences

- Startup may be delayed up to 5 seconds
- Clear logging when fallback is used
- Existing deployments continue to work

---

### DEC-004: Rate Limiting Persistence

**Date**: 2026-01-01
**Status**: Proposed
**Deciders**: TBD

#### Context

BUG-005 identified that rate limiting state is lost on server restart.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A: Store in database config table** | Persistent, transactional | Adds DB queries |
| **B: Store in file** | Simple | Not transactional |
| **C: Redis/external store** | Scalable | Adds dependency |

#### Decision

**Selected: Option A - Database config table**

#### Rationale

- Already have SQLite database
- Transactional consistency
- No new dependencies
- Config table useful for other settings

#### Consequences

- Small overhead per rate limit check
- Config table can be reused for other settings
- Survives server restarts

---

### DEC-005: Cache Key Collision Prevention

**Date**: 2026-01-01
**Status**: Proposed
**Deciders**: TBD

#### Context

BUG-009 identified that cache keys using string concatenation could collide if queries contain the separator character.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A: SHA256 hash of JSON** | Collision-resistant, fixed length | Slight CPU overhead |
| **B: URL encoding** | Reversible | Still possible collisions |
| **C: UUID per query** | Unique | Loses cache benefit |

#### Decision

**Selected: Option A - SHA256 hash**

#### Rationale

- Cryptographically collision-resistant
- Fixed-length keys (16 chars after truncation)
- Negligible CPU overhead for hash computation

#### Consequences

- Cache keys not human-readable (debugging harder)
- Consistent key length regardless of query size

---

### DEC-006: Non-Interactive Mode Behavior

**Date**: 2026-01-01
**Status**: Proposed
**Deciders**: TBD

#### Context

BUG-011 identified that non-interactive mode silently uses defaults, which could save to wrong folders in CI/CD.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A: Fail explicitly** | Clear error, forces explicit config | Breaks some workflows |
| **B: Require --spec-folder flag** | Explicit, scriptable | Additional argument |
| **C: Use environment variable** | No CLI change | Hidden configuration |

#### Decision

**Selected: Option A + B - Fail explicitly, require --spec-folder**

#### Rationale

- Explicit is better than implicit
- Prevents accidental saves to wrong location
- --spec-folder flag makes scripts explicit

#### Consequences

- Existing CI/CD scripts may need updating
- Clear error message guides users
- Scriptable with explicit flag

---

### DEC-007: Scoring Weight Configuration

**Date**: 2026-01-01
**Status**: Proposed
**Deciders**: TBD

#### Context

BUG-012 identified magic numbers in scoring weights that should be configurable.

#### Options Considered

| Option | Pros | Cons |
|--------|------|------|
| **A: Add to search-weights.json** | Centralized config | Another config section |
| **B: Environment variables** | Easy override | Scattered configuration |
| **C: Keep hardcoded with comments** | Simple | Not configurable |

#### Decision

**Selected: Option A - Add to search-weights.json**

#### Rationale

- Centralized configuration file already exists
- Easy to tune without code changes
- Documented alongside other search weights

#### Consequences

- Config file grows slightly
- Weights can be tuned per deployment
- Defaults documented in config

---

## Decision Summary

| ID | Decision | Status |
|----|----------|--------|
| DEC-001 | File-based DB notification | Proposed |
| DEC-002 | Explicit transaction control | Proposed |
| DEC-003 | Delay schema with 5s timeout | Proposed |
| DEC-004 | Database config table for rate limiting | Proposed |
| DEC-005 | SHA256 hash for cache keys | Proposed |
| DEC-006 | Fail explicitly in non-interactive mode | Proposed |
| DEC-007 | Scoring weights in search-weights.json | Proposed |

---

## Future Considerations

### Deferred Decisions

1. **WAL Mode Migration**: Consider enabling SQLite WAL mode for better concurrent access if file-based notification proves insufficient.

2. **Connection Pooling**: If high concurrency becomes an issue, consider implementing a connection pool.

3. **God Module Refactoring**: generate-context.js at 5107 LOC should be split into smaller modules (separate spec).

4. **Cross-Boundary Import Cleanup**: Scripts importing from mcp_server/lib should be refactored (separate spec).

---

## References

- [SQLite WAL Mode](https://www.sqlite.org/wal.html)
- [better-sqlite3 Transactions](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#transactionfunction---function)
- [052-codebase-fixes](../052-codebase-fixes/) - Prior bug fix work
