# Deep Review Report - 001-fix-delivery-progress-confusion

## 1. Executive summary
**Verdict:** `CONDITIONAL`  
**Scope:** packet docs (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `description.json`, `graph-metadata.json`) plus the referenced router/prototype/test implementation surfaces.  
**Finding counts:** P0 `0`, P1 `6`, P2 `1`.  
**hasAdvisories:** `true`.

The runtime change itself is stable: the delivery/progress routing logic, prototype library, and focused Vitest coverage all behaved as intended. The packet is held at CONDITIONAL because its traceability and documentation surfaces were not fully repaired after the phase renumbering. The most important issues are a missing research reference, stale code-locus evidence, stale parentChain metadata, stale continuity timestamps, missing template/anchor surfaces, and unchecked evidence-marker drift in the checklist.

## 2. Scope
Reviewed files:

| Surface | Files |
|---|---|
| Packet docs | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` |
| Packet metadata | `description.json`, `graph-metadata.json` |
| Runtime evidence | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/routing-prototypes.json`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` |

Out of scope: changing reviewed production files, generating new packet docs outside `review/`, or remediating the findings during this loop.

## 3. Method
1. Initialized a fresh review packet under `review/` and rotated one dimension per iteration: correctness, security, traceability, maintainability.
2. Read the target packet docs and metadata, then cross-checked the live runtime files they reference.
3. Ran the focused router test suite to validate the claimed runtime behavior.
4. Replayed packet-local traceability by checking cited paths, cited code loci, metadata lineage, continuity timestamps, and strict packet validation output.
5. Repeated stabilization passes until iteration 010, where the hard cap ended the loop with open P1 findings still present.

## 4. Findings by severity
### P0
| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| None | — | No blocker-level correctness or security defect was confirmed. | — |

### P1
| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| F001 | traceability | Packet rationale cites a missing research source. | `plan.md:13-16`, `tasks.md:6-8`, `checklist.md:7`, `decision-record.md:7` |
| F002 | traceability | Packet evidence still points at stale `content-router.ts` line ranges. | `plan.md:13-16`, `tasks.md:6-7`, `checklist.md:7`, `decision-record.md:8`, `content-router.ts:404-423`, `content-router.ts:965-993` |
| F003 | traceability | `description.json.parentChain` still carries the legacy `010-search-and-routing-tuning` slug. | `description.json:14-20`, `generate-description.ts:75-88`, `memory-parser.ts:532-565` |
| F004 | traceability | Continuity frontmatter lags the packet metadata refresh by eight days. | `implementation-summary.md:12-16`, `graph-metadata.json:191-203` |
| F005 | maintainability | Core packet docs still miss required template, anchor, and `_memory` surfaces. | `spec.md:1-24`, `plan.md:1-25`, `tasks.md:1-14`, `checklist.md:1-16`, `decision-record.md:1-10` |
| F006 | traceability | Completed checklist claims are not backed by structured evidence markers. | `checklist.md:7-13` |

### P2
| ID | Dimension | Finding | Evidence |
|---|---|---|---|
| F007 | maintainability | `decision-record.md` still advertises `status: planned` after packet completion. | `decision-record.md:1-4`, `spec.md:2-7`, `tasks.md:2-3` |

## 5. Findings by dimension
### Correctness
- No correctness defect was found in the live router implementation. The delivery cue bundle and `strongDeliveryMechanics` guard are present at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:404-423,965-993`.
- The focused test suite passed, and the prototype boundary assertions still keep `ND-03`/`ND-04` on `narrative_delivery` and `NP-05` on `narrative_progress` (`content-router.vitest.ts:535-557`).

### Security
- No in-scope security vulnerability was identified. The reviewed surfaces are deterministic routing heuristics, metadata files, and tests; they do not introduce secret handling, auth boundaries, or privileged mutation paths.

### Traceability
- The packet's cited research path is missing (F001).
- The packet still cites obsolete router line numbers even though the current logic moved (F002).
- Packet metadata and continuity surfaces are stale after the renumbering/refresh sequence (F003, F004).
- The checked checklist claims are not expressed with current evidence markers, so the packet fails its own checklist-evidence gate (F006).

### Maintainability
- Five packet docs are still outside the current Level 2 template contract and fail strict validation due to missing template source headers, machine-owned anchors, and `_memory` blocks (F005).
- `decision-record.md` still declares `planned`, which is minor but misleading state drift once the packet is otherwise complete (F007).

## 6. Adversarial self-check for P0
I re-read the strongest candidate P0 area—the runtime router change itself—against the live implementation and focused tests. The live code contains the intended delivery cues and guarded progress floor (`content-router.ts:404-423,965-993`), and the targeted Vitest suite passes end-to-end. No correctness or security issue justified escalation to P0 after that re-check.

## 7. Remediation order
1. **Restore the packet's evidence chain.** Repoint the packet away from the missing `../research/research.md` reference or recreate the missing research artifact, then update all stale `content-router.ts` loci to current lines.
2. **Repair metadata lineage.** Regenerate `description.json` so `parentChain` matches the current `001-search-and-routing-tuning` path, then refresh continuity so `implementation-summary.md` matches the latest packet save time.
3. **Bring the packet docs back onto the Level 2 template contract.** Add the missing template source headers, required anchors, and `_memory` blocks to the five major docs.
4. **Rebuild checklist evidence.** Convert the checked checklist claims into current, explicit evidence markers so the strict checklist-evidence gate passes.
5. **Clean minor state drift.** Flip `decision-record.md` from `planned` to a completion-aligned status once the packet is otherwise coherent.

## 8. Verification suggestions
- Re-run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` after the packet docs are repaired.
- Re-run `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/content-router.vitest.ts --reporter=dot` after any evidence-line refresh to confirm the runtime surface remains stable.
- Rebuild packet metadata (`description.json`, `graph-metadata.json`, continuity frontmatter) in one pass and confirm that the parent chain, continuity timestamps, and checklist evidence all agree.

## 9. Appendix
### Iteration list
| Iteration | Dimension | New findings | Ratio | Notes |
|---|---|---|---|---|
| 001 | correctness | 0/0/0 | 0.00 | Runtime behavior matched the packet claim set. |
| 002 | security | 0/0/0 | 0.00 | No in-scope security defect surfaced. |
| 003 | traceability | 0/3/0 | 0.68 | Missing research source, stale loci, stale parentChain found. |
| 004 | maintainability | 0/1/1 | 0.22 | Template/anchor drift and minor ADR status drift found. |
| 005 | correctness | 0/0/0 | 0.00 | No new correctness delta. |
| 006 | security | 0/0/0 | 0.00 | Stop vote blocked by open traceability issues. |
| 007 | traceability | 0/2/0 | 0.35 | Stale continuity and missing checklist evidence markers found. |
| 008 | maintainability | 0/0/0 | 0.00 | No new maintainability delta after validator replay. |
| 009 | correctness | 0/0/0 | 0.00 | Stop vote blocked again by evidence-gate failures. |
| 010 | security | 0/0/0 | 0.00 | Loop ended at max iterations with open P1 findings. |

### Delta churn
- New findings ratio series: `0.00 -> 0.00 -> 0.68 -> 0.22 -> 0.00 -> 0.00 -> 0.35 -> 0.00 -> 0.00 -> 0.00`
- Blocked-stop events: iterations `006`, `009`
- Final coverage: correctness `100%`, security `100%`, traceability `100%`, maintainability `100%`
