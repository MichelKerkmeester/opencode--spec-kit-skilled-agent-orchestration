# Deep Review Strategy

## Scope
50 deep-review iterations across all active phases under 026-graph-and-context-optimization.

## Allocation
| Phase | Iterations |
|---|---:|
| 001-research-graph-context-systems | 2 |
| 002-implement-cache-warning-hooks | 2 |
| 003-memory-quality-issues | 3 |
| 004-agent-execution-guardrails | 1 |
| 005-code-graph-upgrades | 2 |
| 006/001-gate-a-prework | 2 |
| 006/002-gate-b-foundation | 3 |
| 006/003-gate-c-writer-ready | 4 |
| 006/004-gate-d-reader-ready | 3 |
| 006/005-gate-e-runtime-migration | 3 |
| 006/006-gate-f-archive-permanence | 2 |
| 006/007-sk-system-speckit-revisit | 2 |
| 006/008-cmd-memory-speckit-revisit | 2 |
| 006/009-readme-alignment-revisit | 2 |
| 006/010-remove-shared-memory | 3 |
| 006/011-spec-folder-graph-metadata | 4 |
| 006/012-mcp-config-and-feature-flag-cleanup | 2 |
| 006/013-dead-code-and-architecture-audit | 3 |
| 006/014-playbook-prompt-rewrite | 2 |
| 006/015-full-playbook-execution | 3 |

## Dimension cycle
1. Packet doc completeness
2. Status accuracy
3. Cross-reference integrity
4. Code correctness
5. Test coverage
6. Dead code and stale references
7. README and doc accuracy
8. graph-metadata accuracy
9. Strict validation compliance
10. Typecheck and build verification

## Outcome
The review converged on documentation and validator integrity drift, not TypeScript runtime defects. The repair work fell into six buckets:
1. Restore spec-doc structure expectations: _memory continuity blocks, metadata anchors, and template-source markers inside the validator scan window.
2. Repair recursive phase-link chains: root 026 ordering, 003 child handoff, 006 gate adjacency, and 007-009 revisit packet back-references.
3. Replace dead legacy memory and review-report links with canonical packet docs.
4. Add anchored citation bodies to research docs so spec-doc sufficiency checks pass on research packets.
5. Correct stale 006 execution-map links and resource-map references to live architecture docs.
6. Tighten Gate E continuity frontmatter fields to satisfy the compact non-narrative contract.

## Verification outcome
- mcp-server workspace typecheck: pass
- scripts workspace typecheck: pass
- 026 recursive strict validation: pass
- 001, 003, and 006 strict validation reruns: pass
