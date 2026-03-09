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

## DR-005: Quality Abort Threshold

**Context:** Memory output with very low quality scores wastes storage and produces misleading context for future sessions.

**Decision:** Set `QUALITY_ABORT_THRESHOLD` to 15 (configurable via `config.ts`). Non-simulation runs abort when the legacy quality score is below this threshold.

**Rationale:** 15 catches empty/template-only output while allowing sessions with minimal but real content to save. Made configurable so operators can tune without code changes.

**Alternatives Considered:**
- Threshold of 25: too aggressive, blocks legitimate low-activity sessions
- No threshold: allows garbage output to accumulate
- V2 score only: v2 scorer not yet calibrated for abort decisions

## DR-006: Alignment Blocking for Stateless Mode

**Context:** Stateless mode captures can match the wrong spec folder, contaminating unrelated memory files.

**Decision:** Block saves when captured file paths show less than 5% overlap with leaf-folder keywords from the target spec folder.

**Rationale:** 5% is permissive enough for exploration sessions that touch a few relevant files, while blocking captures that clearly targeted a different spec. Uses leaf-folder name keywords to avoid false positives from generic parent folder names.

**Alternatives Considered:**
- 10% threshold: too strict for broad file touches
- No blocking: allows cross-spec contamination
- Full path matching: too brittle, breaks on restructuring
