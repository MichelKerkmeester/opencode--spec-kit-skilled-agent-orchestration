# Deep Review Report

## 1. Executive summary

- **Verdict:** CONDITIONAL
- **Stop reason:** `maxIterationsReached`
- **Iterations completed:** 10
- **Active findings:** 0 P0, 6 P1, 1 P2
- **hasAdvisories:** true

This review did not find a blocker-grade security or correctness failure, but it did find repeated packet-root drift between the packet's claimed closeout state and the live root docs/metadata. The root packet still carries stale lineage metadata after the `010` to `001` renumbering, overstates its own refresh completion, and leaves documented graph-metadata limits unenforced or inconsistent with the shipped parser/schema.

## 2. Scope

Reviewed packet root:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Reviewed referenced implementation surfaces:

- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts`
- `AGENTS.md` (level contract reference)

## 3. Method

The loop ran 10 iterations, rotating dimensions in the required order:

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

Each iteration re-read the persisted review state, targeted one dimension, wrote an iteration narrative, appended a JSONL delta, and updated the append-only state log. Security received three separate clean passes to challenge any candidate blocker finding before synthesis.

## 4. Findings by severity

### P0

| ID | Title | Dimension | Evidence | Notes |
|---|---|---|---|---|
| None | None | — | — | No blocker-grade defect survived adversarial re-check. |

### P1

| ID | Title | Dimension | Evidence | Notes |
|---|---|---|---|---|
| F001 | Root packet lineage still points at the pre-renumbering parent in canonical docs | traceability | `spec.md:6`; `description.json:15-20`; `graph-metadata.json:3-5` | Canonical packet surfaces disagree on the live parent lineage after migration. |
| F002 | Packet closeout surfaces overstate root refresh completion | traceability | `tasks.md:13`; `checklist.md:15`; `implementation-summary.md:25-26` | The packet claims the root docs were refreshed even though stale lineage remains in the root packet. |
| F003 | Documented 16-entity cap drifts from live parser behavior | correctness | `spec.md:29-30`; `graph-metadata-parser.ts:897-912` | The packet documents `entities` max 16, while the parser currently returns up to 24. |
| F004 | Documented derived-field caps are not enforced by the schema validator | correctness | `spec.md:27-30`; `graph-metadata-schema.ts:36-49` | Oversized arrays can still validate even if current derivation usually emits smaller values. |
| F005 | Level-3 root packet is missing the required decision record surface | maintainability | `spec.md:3-4`; `AGENTS.md:260-265` | The packet cannot recover architecture/migration rationale from its root docs alone. |
| F006 | Derived key_files still store the same parser file under mixed path formats | maintainability | `spec.md:37-40`; `graph-metadata.json:41-45` | Non-canonical duplicates remain in the root packet's generated metadata. |

### P2

| ID | Title | Dimension | Evidence | Notes |
|---|---|---|---|---|
| F007 | Derived entity list still contains low-signal heading fragments | correctness | `graph-metadata.json:126-177` | Quality debt rather than a blocker, but it still weakens search usefulness. |

## 5. Findings by dimension

### Correctness

- F003 — documented `entities` cap (16) disagrees with parser output cap (24).
- F004 — schema validation does not enforce the packet's documented derived-field caps.
- F007 — derived entity output still includes low-signal heading fragments.

### Security

- No active findings.
- Three separate passes did not find secret exposure, command-shaped payload leakage, or a blocker-grade trust-boundary issue in the packet-root surfaces.

### Traceability

- F001 — canonical packet surfaces disagree on the live parent lineage after the phase renumbering.
- F002 — checklist/tasks/implementation-summary overstate completion because the root packet still carries stale lineage metadata.

### Maintainability

- F005 — the level-3 packet is missing `decision-record.md`.
- F006 — `derived.key_files` still contain mixed-format duplicate references for the same parser file.

## 6. Adversarial self-check for P0

No P0 finding survived adversarial review.

- The stale lineage fields (F001/F002) are serious packet-traceability defects, but they do not create runtime corruption or security exposure on their own.
- The parser/schema contract drift (F003/F004) is correctness debt, but the reviewed evidence does not show an active production outage tied to this packet root.
- The maintainability defects (F005/F006/F007) raise remediation priority, not blocker-grade severity.

Result: **0 confirmed P0**.

## 7. Remediation order

1. Fix root packet lineage consistency: align `spec.md` and `description.json` with the live `001-search-and-routing-tuning` parent and re-save the packet.
2. Remove the unsupported completion claims in `tasks.md`, `checklist.md`, and `implementation-summary.md` until the root packet is actually refreshed.
3. Add the missing root `decision-record.md` for this level-3 packet.
4. Decide the canonical limits for derived arrays, then enforce them consistently in both the parser and schema.
5. Canonicalize `derived.key_files` so the same file cannot appear under mixed path formats.
6. Tighten derived-entity filtering so heading fragments do not survive into packet metadata.

## 8. Verification suggestions

- Re-run `generate-description.ts` for this packet and confirm `description.json.parentChain` matches the current path segments.
- Re-run the graph-metadata backfill and confirm the root packet no longer contains mixed-format duplicate `key_files`.
- Add/extend tests to pin the intended caps for `entities`, `trigger_phrases`, `key_topics`, and `key_files`.
- Add a packet-level regression that fails if level-3 root packets are missing `decision-record.md`.
- Re-check the packet closeout docs only after the root packet metadata is refreshed and validated.

## 9. Appendix

### Iteration list

| Iteration | Dimension | New findings | Ratio |
|---|---|---:|---:|
| 001 | correctness | 1 P1 | 1.00 |
| 002 | security | 0 | 0.00 |
| 003 | traceability | 1 P1 | 0.50 |
| 004 | maintainability | 1 P1 | 0.33 |
| 005 | correctness | 1 P1 | 0.25 |
| 006 | security | 0 | 0.00 |
| 007 | traceability | 1 P1 | 0.20 |
| 008 | maintainability | 1 P1 | 0.17 |
| 009 | correctness | 1 P2 | 0.03 |
| 010 | security | 0 | 0.00 |

### Delta churn

- Rolling tail: `0.20 -> 0.17 -> 0.03 -> 0.00`
- Coverage: 4/4 dimensions reviewed at least once
- Terminal condition: max iterations reached before the open P1 set converged
