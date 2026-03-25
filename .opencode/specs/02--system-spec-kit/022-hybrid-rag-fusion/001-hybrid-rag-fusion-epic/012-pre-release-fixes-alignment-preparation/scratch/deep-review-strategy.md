# Deep Review Strategy: v5 Release Readiness + Feature Catalog Alignment

## Review Target
`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion` (full track)
+ `.opencode/skill/system-spec-kit/feature_catalog/` (all snippets, master catalog, simple terms)

## Review Target Type
track

## Prior Review Context
- **v4 verdict**: CONDITIONAL (2 P1, 4 P2)
- **Open P1s**: T79 nextSteps completion detection bug, T37 root directory count drift
- **Open P2s**: ADV-001 eval path containment, ADV-002 Hydra drill, ADV-003 dir count drift, ADV-004 embedding config

## Dimensions
1. **correctness** (priority 1) — Logic, state flow, edge cases, error handling
2. **security** (priority 2) — Auth, input/output safety, data exposure, permissions
3. **traceability** (priority 3) — Spec/checklist alignment, cross-reference integrity, evidence coverage
4. **maintainability** (priority 4) — Patterns, documentation quality, safe follow-on change clarity

## Wave Structure (5 waves x 4 agents = 20 iterations)

### Wave 1: Correctness + P1 Verification (iterations 001-004)
- **001** (codex): MCP server code correctness — mcp_server/*.js
- **002** (codex): Scripts code correctness — scripts/dist/**/*.js
- **003** (copilot): Shared modules correctness — shared/**/*.js
- **004** (copilot): P1-001 (T79 nextSteps) + P1-002 (T37 count) verification

### Wave 2: Security + Traceability (iterations 005-008)
- **005** (codex): Full security audit — all code paths
- **006** (codex): spec_code protocol — spec claims vs implementation
- **007** (copilot): checklist_evidence protocol — [x] items vs cited evidence
- **008** (copilot): feature_catalog_code protocol — catalog claims vs code

### Wave 3: Feature Catalog Deep Verification (iterations 009-012)
- **009** (codex): feature_catalog.md categories 01-10 vs live code
- **010** (codex): feature_catalog.md categories 11-21 vs live code
- **011** (copilot): Snippet files 01-10 vs master catalog + code
- **012** (copilot): Snippet files 11-21 vs master catalog + code

### Wave 4: Simple Terms + Maintainability (iterations 013-016)
- **013** (codex): feature_catalog_in_simple_terms.md vs feature_catalog.md alignment
- **014** (codex): Code maintainability patterns review
- **015** (copilot): Playbook capability + sprint status verification
- **016** (copilot): Spec tree structure + directory count verification

### Wave 5: Final Sweep + Verdict (iterations 017-020)
- **017** (codex): Adversarial recheck of all prior findings
- **018** (codex): npm test + lint + typecheck regression
- **019** (copilot): Cross-reference comprehensive sweep
- **020** (copilot): Release readiness verdict with full evidence

## Convergence Parameters
- maxIterations: 20
- convergenceThreshold: 0.10
- stuckThreshold: 2

## Dimension Coverage
| Dimension | Status | Iterations | Findings |
|-----------|--------|-----------|----------|
| correctness | PENDING | — | — |
| security | PENDING | — | — |
| traceability | PENDING | — | — |
| maintainability | PENDING | — | — |

## Running Findings
| ID | Severity | Title | Dimension | Status |
|----|----------|-------|-----------|--------|
| (populated during review) | | | | |

## Known Context
Prior v4 review verified 56/58 v3 findings remediated. Two P1 items remain open:
1. T79: `determineSessionStatus()` asymmetric nextSteps detection in collect-session-data.js:270-283
2. T37: Root spec claims 397 dirs, live count showed 398

Feature catalog alignment was marked PASS in v4 but with limited depth. This v5 review performs comprehensive snippet-by-snippet verification.
