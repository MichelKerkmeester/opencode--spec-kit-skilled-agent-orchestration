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
- **009** (codex): FEATURE_CATALOG.md categories 01-10 vs live code
- **010** (codex): FEATURE_CATALOG.md categories 11-21 vs live code
- **011** (copilot): Snippet files 01-10 vs master catalog + code
- **012** (copilot): Snippet files 11-21 vs master catalog + code

### Wave 4: Simple Terms + Maintainability (iterations 013-016)
- **013** (codex): FEATURE_CATALOG_IN_SIMPLE_TERMS.md vs FEATURE_CATALOG.md alignment
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
| traceability | IN PROGRESS | 021 | Structural validator blockers confirmed across `007-evaluation` through `012-query-intelligence` |
| maintainability | IN PROGRESS | 021 | Template migration debt confirmed as follow-on maintainability risk |

## Running Findings
| ID | Severity | Title | Dimension | Status |
|----|----------|-------|-----------|--------|
| P1-021-001 | P1 | Level 2 specs vs Level 3 plan/tasks/checklist split in `007` slice | traceability | active |
| P1-021-002 | P1 | Missing required anchors across `007` child docs | traceability | active |
| P1-021-003 | P1 | Stale implementation-summary Spec Folder metadata in `007` child docs | traceability | active |

## Known Context
Prior v4 review verified 56/58 v3 findings remediated. Two P1 items remain open:
1. T79: `determineSessionStatus()` asymmetric nextSteps detection in collect-session-data.js:270-283
2. T37: Root spec claims 397 dirs, live count showed 398

Feature catalog alignment was marked PASS in v4 but with limited depth. This v5 review performs comprehensive snippet-by-snippet verification.

## Follow-up Iterations
- **021**: Packet-local validator/truth sweep for `012-pre-release-fixes-alignment-preparation` found three active P1s concentrated in `plan.md` and `research.md`, with `review-report.md` and `checklist.md` now materially aligned to the narrowed blocker set.

## What Worked
- **021**: Fresh packet-level validator rerun plus direct line audit isolated the still-active integrity failures without re-reporting already-reconciled checklist/report issues.

## What Failed
- **021**: Relying on the original v5 synthesis alone was misleading because the live packet changed after that synthesis completed.

## Next Focus
- Repair `plan.md` and `research.md` so the 012 packet itself reaches warning-only validation, then reassess whether the recursive `007` child-packet debt is the sole remaining release blocker.

## What Worked
- Iteration 021: slicing recursive validator output to `007-evaluation` through `012-query-intelligence` exposed the repeated child-packet blocker pattern quickly.

## What Failed
- Iteration 021: umbrella-only `007` review is no longer sufficient once phase links are fixed; the remaining release debt lives in child packet templates.

## Exhausted Approaches
- BLOCKED: reviewing only umbrella metadata or phase-link contracts for `007`; that path no longer changes the release decision without child packet normalization.

## Next Focus
- Confirm whether `001`-`006` and `013`-`022` show the same Level/anchor/template migration debt, then decide whether batch normalization or explicit historical downgrade is the smallest honest release path.
