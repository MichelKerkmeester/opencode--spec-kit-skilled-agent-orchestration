# Deep Review Report: Graph Metadata Enrichment

## 1. Executive summary

**Verdict: CONDITIONAL.** The packet has no P0 blocker, but it has six active P1 findings and three P2 advisories. The review completed all 10 requested iterations across correctness, security, traceability, and maintainability, then stopped at `maxIterationsReached`.

The dominant risk is evidence drift: the packet claims completion from files and commands that are missing, stale, or no longer produce the recorded results. The packet should not be treated as cleanly closed until the P1 findings are remediated and the recorded validation evidence is refreshed.

## 2. Scope

Reviewed packet:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/004-graph-metadata-enrichment`

Primary reviewed files:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Read-only verification included replaying the strict packet validator, checking recorded command paths, checking the live `graph-metadata.json` count command, and reading the current `sk-deep-review` metadata example.

## 3. Method

The loop ran ten iterations and rotated dimensions in this order:

1. correctness
2. security
3. traceability
4. maintainability
5. correctness
6. security
7. traceability
8. maintainability
9. correctness
10. security

Each iteration read the current packet docs, compared evidence claims against current repository state, wrote an iteration narrative, appended a JSONL delta, updated the registry, and checked convergence. All four dimensions were covered at least twice, with correctness and security covered three times each.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| None | - | No P0 findings were identified. | - |

### P1

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| F001 | correctness | Packet completion depends on `review/deep-review-findings.md`, but that file was absent before this review created `review/`; strict validation fails on missing references to it. | `spec.md:51`, `spec.md:144`, `checklist.md:43`, `tasks.md:46` |
| F002 | correctness | The recorded compiler validation command is stale, and the current compiler validation path returns validation failure rather than the documented pass. | `spec.md:134`, `plan.md:109`, `checklist.md:68`, `implementation-summary.md:81` |
| F003 | correctness | The exact corpus-count command recorded as evidence now returns `22`, not `21`. | `checklist.md:65`, `tasks.md:106`, `implementation-summary.md:78` |
| F004 | traceability | Checklist evidence for `graph-metadata.json` key files does not match the actual `derived.key_files` array. | `checklist.md:57`, `graph-metadata.json:43`, `graph-metadata.json:64`, `graph-metadata.json:215` |
| F005 | traceability | Moved packet metadata still exposes `011-skill-advisor-graph` as current parent/owner context in places, while the active packet path is under `002-skill-advisor-graph`. | `description.json:2`, `description.json:18`, `decision-record.md:38`, `decision-record.md:136` |
| F006 | security | The recorded regression command writes outside the packet boundary and points at stale skill-advisor paths, contradicting the packet's scope claims. | `plan.md:123`, `tasks.md:109`, `checklist.md:78` |

### P2

| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| F007 | traceability | Timestamp terminology is split between `last_updated_at` guidance and packet graph metadata using `last_save_at`. | `spec.md:170`, `spec.md:210`, `graph-metadata.json:213` |
| F008 | maintainability | The packet hard-codes a point-in-time corpus count without defining an inclusion rule for fixtures. | `spec.md:147`, `implementation-summary.md:90`, `checklist.md:65` |
| F009 | maintainability | ADR-002 lacks the same anchor granularity and heading structure used by ADR-001. | `decision-record.md:29`, `decision-record.md:128` |

## 5. Findings by dimension

| Dimension | Findings | Summary |
|---|---|---|
| Correctness | F001, F002, F003 | Completion claims are contradicted by missing files, stale command paths, failing validation, and changed command output. |
| Security | F006 | No secret exposure found, but the packet's recorded regression command violates its own write-boundary story. |
| Traceability | F004, F005, F007 | Packet evidence, moved metadata, and timestamp terms are not internally consistent. |
| Maintainability | F008, F009 | Future updates will keep tripping over ambiguous corpus-count rules and uneven ADR structure. |

## 6. Adversarial self-check for P0

| Check | Result |
|---|---|
| Hunter | Searched for release-blocking security defects, data exposure, and destructive commands in the reviewed packet surface. None found. |
| Skeptic | Rechecked whether missing validation evidence should be P0. It blocks clean completion but does not itself create data loss, code execution, or an unrecoverable runtime failure, so P1 is appropriate. |
| Referee | No finding meets the P0 bar. Verdict remains `CONDITIONAL` because active P1 count is six. |

## 7. Remediation order

1. Restore or remove references to `review/deep-review-findings.md`, then rerun strict packet validation until `SPEC_DOC_INTEGRITY` passes.
2. Replace stale `.opencode/skill/skill-advisor/...` command paths with the current `system-spec-kit/mcp_server/skill-advisor/...` paths, then update every completion claim from current command output.
3. Fix the corpus-count evidence by either excluding fixtures explicitly or changing the packet to say exactly what corpus is counted.
4. Reconcile `checklist.md` CHK-014 with the actual `graph-metadata.json` key-file array, including whether the review baseline and all 21 live skill metadata files should be listed.
5. Normalize moved packet metadata and ADR owner text from `011-skill-advisor-graph` to the active `002-skill-advisor-graph` context where it is meant to describe the current location.
6. Move regression output to a packet-local or temporary output path, or document why writing under the skill tree is acceptable.
7. Clean up P2 advisories after the P1 evidence surface is trustworthy.

## 8. Verification suggestions

- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/004-graph-metadata-enrichment --strict`
- `find .opencode/skill -name graph-metadata.json | sort | wc -l`
- `find .opencode/skill -path '*/test-fixtures/*' -prune -o -name graph-metadata.json -print | sort | wc -l`
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py --validate-only`
- Run the regression harness only with an output path that stays inside the allowed review or packet scratch boundary.

## 9. Appendix

| Iteration | Dimension | New findings | Churn |
|---|---|---|---|
| 001 | correctness | F001, F002, F003 | 0.75 |
| 002 | security | F006 | 0.22 |
| 003 | traceability | F004, F005 | 0.55 |
| 004 | maintainability | F008, F009 | 0.12 |
| 005 | correctness | none | 0.04 |
| 006 | security | none | 0.03 |
| 007 | traceability | F007 | 0.09 |
| 008 | maintainability | none | 0.04 |
| 009 | correctness | none | 0.03 |
| 010 | security | none | 0.02 |

Artifact index:

- `deep-review-config.json`
- `deep-review-state.jsonl`
- `deep-review-findings-registry.json`
- `deep-review-strategy.md`
- `deep-review-dashboard.md`
- `iterations/iteration-001.md` through `iterations/iteration-010.md`
- `deltas/iter-001.jsonl` through `deltas/iter-010.jsonl`
