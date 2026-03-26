# Deep Review Strategy: v6 Release Readiness + Feature Catalog Alignment

## Review Target
`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion` (full track)
+ `.opencode/skill/system-spec-kit/feature_catalog/` (all snippets, master catalog, simple terms)
+ `.opencode/skill/system-spec-kit/{mcp_server,scripts,shared}/` (runtime code)

## Review Target Type
track

## Prior Review Context
- **v5 verdict**: CONDITIONAL (0 P0, 10 P1, 11 P2)
- **Key open items**:
  - Root/epic/012 inventory count three-way mismatch (397 vs 398 vs 399)
  - Epic child-count mismatch (11 claimed vs 12 live)
  - 007 child packet validator debt (91 errors, 72 warnings recursive)
  - Score normalizer NaN corruption in fusion-lab.js:49-55
  - Snippet vs master catalog drift in categories 11-21
  - Shadow fusion flag default-ON vs documented default-OFF
  - 012 certification claim provisional while status says pending re-verification

## Dimensions
1. **correctness** (priority 1) — Logic, state flow, edge cases, error handling
2. **security** (priority 2) — Auth, input/output safety, data exposure, permissions
3. **traceability** (priority 3) — Spec/checklist alignment, cross-reference integrity, evidence coverage
4. **maintainability** (priority 4) — Patterns, documentation quality, safe follow-on change clarity

## Wave Structure (2 waves x 10 agents = 20 iterations)

### Wave 1: Correctness + Security + Feature Catalog Code (iterations 001-010)
- **001** (copilot GPT-5.4): MCP server correctness — core handlers (memory_save, memory_search, memory_context, memory_update, memory_delete)
- **002** (copilot GPT-5.4): MCP server correctness — pipeline/retrieval (search pipeline, fusion, scoring, graph channels)
- **003** (copilot GPT-5.4): Scripts correctness — memory scripts, validators, generate-context, extractors
- **004** (copilot GPT-5.4): Shared modules correctness — algorithms (fusion-lab, rrf-fusion, adaptive-fusion), scoring, normalization
- **005** (copilot GPT-5.4): Security audit — input validation, path traversal, data exposure, permissions across all code
- **006** (codex GPT-5.3): Feature catalog categories 01-07 vs live code (correctness + traceability)
- **007** (codex GPT-5.3): Feature catalog categories 08-14 vs live code (correctness + traceability)
- **008** (codex GPT-5.3): Feature catalog categories 15-21 vs live code (correctness + traceability)
- **009** (codex GPT-5.3): FEATURE_CATALOG_IN_SIMPLE_TERMS.md vs FEATURE_CATALOG.md alignment (section-by-section)
- **010** (codex GPT-5.3): Snippet files categories 01-10 internal consistency + code cross-reference

### Wave 2: Traceability + Maintainability + Verdict (iterations 011-020)
- **011** (copilot GPT-5.4): Snippet files categories 11-21 vs master catalog + code cross-reference
- **012** (copilot GPT-5.4): spec_code traceability — spec.md claims vs implementation across 022 tree
- **013** (copilot GPT-5.4): checklist_evidence traceability — [x] items vs cited evidence in 012 packet
- **014** (copilot GPT-5.4): Spec tree inventory + directory count verification (root/epic/012 alignment)
- **015** (copilot GPT-5.4): 007 child packet validator compliance + template migration assessment
- **016** (codex GPT-5.3): Code maintainability — patterns, dead code, tech debt in mcp_server + scripts
- **017** (codex GPT-5.3): npm test + TypeScript check + lint regression verification
- **018** (codex GPT-5.3): Cross-reference sweep — broken links, orphaned refs, stale paths
- **019** (codex GPT-5.3): Adversarial recheck — challenge all findings, test false positive rate
- **020** (codex GPT-5.3): Release readiness verdict — comprehensive evidence-backed final assessment

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
| (none yet) | — | — | — | — |

## Known Context
Prior v5 review ran 21 iterations (20 + 1 follow-up) and returned CONDITIONAL verdict with 0 P0, 10 P1, 11 P2 active findings. Key unresolved areas:
1. Inventory count mismatches between root/epic/012 packets
2. 007 child packet family validator debt (91 errors, 72 warnings)
3. Score normalizer NaN risk in fusion-lab.js
4. Feature catalog snippet drift in categories 11-21
5. 012 packet internal truth/integrity gaps (plan.md, research.md stale)

This v6 review aims to determine current release readiness after any fixes applied since v5.

## What Worked
(none yet)

## What Failed
(none yet)

## Exhausted Approaches
(none yet)

## Next Focus
Wave 1: Correctness + Security + Feature Catalog Code verification (iterations 001-010)
