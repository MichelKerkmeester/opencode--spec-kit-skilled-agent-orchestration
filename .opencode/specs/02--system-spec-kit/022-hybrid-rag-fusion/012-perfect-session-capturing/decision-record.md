# Decision Record: Perfect Session Capturing

## DR-001: 25-Agent Audit Strategy

**Context:** Pipeline spans 18 files / 6,400 LOC — too large for single-pass review.

**Decision:** Use 25 parallel agents: 5 cross-cutting architectural analysts (Codex GPT-5.4 xhigh) + 20 file-level verifiers (Copilot GPT-5.3-Codex).

**Rationale:** Cross-cutting agents find systemic issues (data flow gaps, scoring miscalibration), file-level agents find line-specific bugs. Combined coverage exceeds single-agent capacity.

**Alternatives Considered:**
- Single sequential review: too slow, context window limits
- 5 agents only: insufficient file-level coverage
- 50 agents: diminishing returns, synthesis overhead

## DR-002: Fix Prioritization (P0-P3)

**Decision:** Four-tier prioritization based on impact:
- P0: Correctness bugs, data loss, security vulnerabilities
- P1: Quality degradation, wrong scores, content leakage
- P2: Design improvements, configurability, coverage gaps
- P3: Cosmetic, documentation, consistency

**Rationale:** Ensures critical fixes ship first. P3 items deferred if time-constrained.

## DR-003: Crypto-based Session IDs

**Decision:** Replace `Math.random()` with `crypto.randomBytes()` for session ID generation.

**Rationale:** `Math.random()` is not cryptographically secure. While session IDs are not security-critical in this context, using weak randomness is a code quality issue that could become a vulnerability if session IDs are ever used for access control.

## DR-004: Configurable Pipeline Constants

**Decision:** Move hardcoded magic numbers (truncation limits, timestamp tolerance, MAX_FILES, quality thresholds) to `config.ts` with sensible defaults.

**Rationale:** Enables tuning without code changes. Current hardcoded values are scattered across 8+ files with no documentation of why specific values were chosen.
