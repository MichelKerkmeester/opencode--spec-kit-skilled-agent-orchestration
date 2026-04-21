# Deep Review Report: 004 Smart-Router Context Efficacy

## 1. Executive summary

Verdict: CONDITIONAL

Reason: No P0 findings were found, but the review found 6 active P1 findings and 4 active P2 advisories. Per the requested verdict rule, `P0 -> FAIL; >=5 P1 -> CONDITIONAL; else PASS`, this packet is conditional.

The research conclusions are directionally careful and do not overclaim live context savings. The release risk is mostly packet integrity: the phase root and `001-initial-research` child are structurally incomplete or stale, so resume, validation, and memory retrieval can point future work at the wrong state.

Counts:

| Severity | Count |
|----------|-------|
| P0 | 0 |
| P1 | 6 |
| P2 | 4 |

## 2. Scope

Reviewed target:

`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy`

Primary files reviewed:

| File | Role |
|------|------|
| `spec.md` | Phase root charter |
| `description.json` | Root memory description |
| `graph-metadata.json` | Root graph metadata |
| `001-initial-research/spec.md` | Advisor-hook efficacy research charter |
| `001-initial-research/research/research.md` | Advisor-hook efficacy synthesis |
| `002-skill-md-intent-router-efficacy/spec.md` | Intra-skill Smart Routing efficacy spec |
| `002-skill-md-intent-router-efficacy/plan.md` | 002 implementation plan |
| `002-skill-md-intent-router-efficacy/tasks.md` | 002 task list |
| `002-skill-md-intent-router-efficacy/checklist.md` | 002 verification checklist |
| `002-skill-md-intent-router-efficacy/implementation-summary.md` | 002 completion summary |
| `002-skill-md-intent-router-efficacy/research/research.md` | 002 synthesis |
| `002-skill-md-intent-router-efficacy/research/research-validation.md` | 002 validation matrix |

Out of scope:

- Production code edits.
- Git operations.
- Writes outside `review/**`.

## 3. Method

The loop ran 10 iterations with the requested rotation:

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

Evidence sources:

- Direct file reads of root and child packet docs.
- Root and recursive spec validation via `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh ... --strict`, which exited 2.
- Path existence checks for migrated related-document references.
- JSON and JSONL parsing of generated review artifacts after synthesis.

Convergence:

All dimensions were covered at least once. No P0 findings were found. The final two iterations produced no new findings, but the run stopped by the requested max iteration count rather than early convergence.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| None | - | No P0 findings found. | - |

### P1

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| DR-COR-001 | correctness | Root packet status and continuity point to already-completed work. | `spec.md:14-18`, `spec.md:40`, `001-initial-research/research/research.md:3-5`, `002-skill-md-intent-router-efficacy/spec.md:47-53`, `002-skill-md-intent-router-efficacy/implementation-summary.md:55-59` |
| DR-TRC-001 | traceability | Root Level 3 packet is missing required documents and anchors. | `spec.md:23`, `spec.md:38`, strict validator missing root `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, plus required anchors |
| DR-TRC-002 | traceability | `001-initial-research` declares Level 2 but lacks required scaffolding and structured anchors. | `001-initial-research/spec.md:1-5`, strict validator missing child `plan.md`, `tasks.md`, `checklist.md`, anchors, and template sections |
| DR-MNT-001 | maintainability | Root graph metadata indexes only `spec.md` and omits completed child evidence. | `graph-metadata.json:6-9`, `graph-metadata.json:31-49`, `002-skill-md-intent-router-efficacy/graph-metadata.json:43-55` |
| DR-MNT-002 | maintainability | Migrated identity still mixes `021` and `004` numbering surfaces. | `spec.md:4-7`, `spec.md:28-29`, `description.json:11-13`, `002-skill-md-intent-router-efficacy/description.json:15-20` |
| DR-TRC-003 | traceability | Root corpus reference resolves to a missing path after migration. | `spec.md:116-121`, path check shows `../research/...` missing and `../../research/...` exists |

### P2

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| DR-SEC-001 | security | Default-on plugin rollout lacks an explicit adversarial corpus gate in root requirements. | `spec.md:91-104`, `001-initial-research/research/research.md:35-37`, `001-initial-research/research/research.md:55-57` |
| DR-COR-002 | correctness | Implementation summary records strict validation without an explicit pass result. | `002-skill-md-intent-router-efficacy/implementation-summary.md:106-115`, current root validation exits 2 |
| DR-TRC-004 | traceability | Code-graph plugin reference remains TBD after the research resolved it. | `spec.md:121`, `001-initial-research/research/research.md:47-49` |
| DR-MNT-003 | maintainability | Follow-up recommendations are not mapped to owning packets or tasks. | `002-skill-md-intent-router-efficacy/research/research.md:85-92`, `002-skill-md-intent-router-efficacy/spec.md:159-165` |

## 5. Findings by dimension

Correctness:

| ID | Severity | Summary |
|----|----------|---------|
| DR-COR-001 | P1 | Stale root status/continuity can dispatch completed work. |
| DR-COR-002 | P2 | Validation evidence is ambiguous in the 002 implementation summary. |

Security:

| ID | Severity | Summary |
|----|----------|---------|
| DR-SEC-001 | P2 | Known adversarial prompt-corpus need is not an explicit root acceptance gate. |

Traceability:

| ID | Severity | Summary |
|----|----------|---------|
| DR-TRC-001 | P1 | Root Level 3 packet fails structural validation. |
| DR-TRC-002 | P1 | `001-initial-research` Level 2 shell fails structural validation. |
| DR-TRC-003 | P1 | Corpus link is wrong after migration. |
| DR-TRC-004 | P2 | Plugin reference remains TBD despite research answer. |

Maintainability:

| ID | Severity | Summary |
|----|----------|---------|
| DR-MNT-001 | P1 | Root graph metadata omits child evidence. |
| DR-MNT-002 | P1 | Migrated identity mixes old and new numbering. |
| DR-MNT-003 | P2 | Recommendations lack follow-up ownership. |

## 6. Adversarial self-check for P0

Hunter:

The strongest possible P0 argument is that a Level 3 root validation failure could block release readiness. The validator exits 2 and reports missing required docs, anchors, and section counts.

Skeptic:

This is a spec packet integrity failure, not evidence of a production security exploit, data loss, or broken runtime behavior. The child `002` packet largely validates and the research conclusions are careful about uncertainty.

Referee:

No P0 is justified. The validation failures are release-blocking in practice, but P1 is the right severity because remediation is documentation/metadata repair inside the packet rather than urgent production rollback.

## 7. Remediation order

1. Fix root Level 3 scaffolding: add or reconcile `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md`; add missing anchors and required sections.
2. Repair `001-initial-research` Level 2 scaffolding or explicitly downgrade/reclassify it if it is meant to be a lightweight research-only child.
3. Update root status, continuity, and next-safe action to reflect completed `001` and `002` research and the next telemetry/plugin step.
4. Repair migrated references: root corpus path, code-graph plugin reference, and phase back-references.
5. Regenerate or patch root `graph-metadata.json` and `description.json` so key/source docs include child synthesis, validation, checklist, and implementation summary.
6. Normalize numbering surfaces so primary ids use `004` while legacy `021` remains only in aliases/migration fields.
7. Convert follow-up recommendations into child packets or task ids, including the adversarial corpus gate for default-on plugin rollout.

## 8. Verification suggestions

After remediation, run:

```sh
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy --strict
```

Also verify:

```sh
python3 -m json.tool .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/description.json
python3 -m json.tool .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/004-smart-router-context-efficacy/graph-metadata.json
```

And confirm these references resolve from the root:

```sh
test -e .opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/019-system-hardening-pt-03/corpus/labeled-prompts.jsonl
test -e .opencode/plugins/spec-kit-compact-code-graph.js
test -e .opencode/plugins/spec-kit-compact-code-graph-bridge.mjs
```

## 9. Appendix

Iteration list:

| Iteration | Dimension | New findings | Churn |
|-----------|-----------|--------------|-------|
| 001 | correctness | DR-COR-001 | 0.24 |
| 002 | security | DR-SEC-001 | 0.08 |
| 003 | traceability | DR-TRC-001, DR-TRC-002 | 0.36 |
| 004 | maintainability | DR-MNT-001, DR-MNT-002 | 0.31 |
| 005 | correctness | DR-COR-002 | 0.07 |
| 006 | security | None | 0.00 |
| 007 | traceability | DR-TRC-003, DR-TRC-004 | 0.18 |
| 008 | maintainability | DR-MNT-003 | 0.06 |
| 009 | correctness | None | 0.00 |
| 010 | security | None | 0.00 |

Artifacts:

- `review/deep-review-config.json`
- `review/deep-review-state.jsonl`
- `review/deep-review-findings-registry.json`
- `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md`
- `review/deltas/iter-001.jsonl` through `review/deltas/iter-010.jsonl`
- `review/review-report.md`
