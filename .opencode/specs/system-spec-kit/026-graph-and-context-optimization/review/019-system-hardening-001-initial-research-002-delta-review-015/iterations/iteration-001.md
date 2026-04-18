# Iteration 001

## Focus

Read the 015 combined review report, index the 242 deduplicated findings by severity/theme, and batch-audit the P0 plus the first representative P1 set most likely affected by phase 016/017/018 primitives (`predecessor CAS`, `caller-context`, `readiness-contract`, `shared-provenance`, `retry-budget`).

## Actions Taken

1. Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/015-deep-review-and-remediation/review-report.md` and confirmed the source tally is `1 P0 / 114 P1 / 133 P2 = 242 deduped findings`.
2. Verified the current reconsolidation bridge on main at `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:342-387`.
3. Verified the current reconsolidation regression coverage at `.opencode/skill/system-spec-kit/mcp_server/tests/reconsolidation-bridge.vitest.ts:390-458`.
4. Mapped the current replacement primitives from `.opencode/skill/system-spec-kit/mcp_server/README.md:532-536`, `:591-595`, and `:1186-1190`.
5. Queried post-2026-04-16 history with `git log --oneline -S <key-text>` to locate addressing commits for the reconsolidation path and successor primitives.

## Findings Batch-Audited

- `P0 / cross-cutting / Governed save-time reconsolidation can cross scope boundaries and then persist the survivor without governance metadata.`  
  Classification: `ADDRESSED`  
  Addressing commit: `104f534bd0 fix(016): P0-B composite — transactional reconsolidation with predecessor CAS + complement window closure`  
  Current-main evidence: `findScopeFilteredCandidates()` now reads stored governed scope for candidate IDs and suppresses mismatched rows before merge (`reconsolidation-bridge.ts:342-387`), and the conflict store path re-applies governance metadata to the persisted survivor (`reconsolidation-bridge.vitest.ts:390-400`).

- `P1 / cross-cutting / reconsolidation-bridge.vitest.ts never exercises the planner-default safety branch it claims to protect.`  
  Classification: `ADDRESSED`  
  Addressing commit: `0ac9cdcbaa fix(017): T-PIN-GOD-01 + T-RCB-DUP-01 — extract runEnrichmentStep + runAtomicReconsolidationTxn (R4-P2-001, R4-P2-003)`  
  Current-main evidence: the suite now covers typed stale-predecessor conflict handling and asserts that no ledger mutation happens on failure (`reconsolidation-bridge.vitest.ts:409-458`).

- `P1 / cross-cutting / /spec_kit:resume session detection can disclose cross-scope memory metadata before a folder is resolved.`  
  Classification: `SUPERSEDED`  
  Replacement design: phase 017 moved the trust boundary from folder-first session lookup to transport-bound auth. The current runtime docs state that `session_resume` binds `args.sessionId` to transport caller context (`README.md:591-595`) and identifies `lib/context/caller-context.ts` as the canonical primitive (`README.md:1187`).

- `P1 / cross-cutting / The 250 ms dispatch graph-context timeout does not actually cap tool-call latency.`  
  Classification: `UNVERIFIED`  
  Reason: phase 017 introduced a shared code-graph readiness contract (`README.md:532-536`, `:1186`), so the exact path reviewed in 015 may no longer be authoritative.  
  Re-audit path: inspect current `context-server.ts` graph-context dispatch path and compare it to `lib/code-graph/readiness-contract.ts`.

- `P1 / cross-cutting / Absolute specFolder values let the resume handlers read markdown outside the packet roots.`  
  Classification: `UNVERIFIED`  
  Reason: the sampled phase 017 primitive (`caller-context`) hardens session identity, not obviously path normalization.  
  Re-audit path: inspect current `lib/resume/resume-ladder.ts` absolute-path handling on main.

- `P1 / cross-cutting / session_resume(minimal) does not honor its published minimal-mode contract.`  
  Classification: `UNVERIFIED`  
  Reason: the public surface description changed in phase 017 (`README.md:591-595`), but handler parity was not directly re-read in this iteration.  
  Re-audit path: compare `handlers/session-resume.ts` against `tool-schemas.ts`.

- `P1 / cross-cutting / skill_graph_scan lets callers escape the documented skill root and turn skill_graph_status into a persistent filesystem-hash DoS.`  
  Classification: `UNVERIFIED`  
  Reason: this batch prioritized the reconsolidation + runtime-trust primitives; no current `skill_graph_scan` handler read was performed yet.  
  Re-audit path: inspect `skill_graph_scan` path validation on current main.

- `P1 / cross-cutting / Published schema contract is not the runtime contract for later tool families.`  
  Classification: `UNVERIFIED`  
  Reason: the shared readiness contract reduces one class of drift (`README.md:534`, `:1186`), but the broader schema/runtime mismatch claim still needs a direct handler/schema diff.  
  Re-audit path: compare `tool-schemas.ts`, `tool-input-schemas.ts`, and the affected handlers.

- `P1 / cross-cutting / False-positive hook coverage (hook-session-start tests mostly assert serialized helpers rather than the runtime path).`  
  Classification: `UNVERIFIED`  
  Reason: phase 018's shared-provenance surface (`README.md:1188-1189`) changes the recovery/hook stack, but I did not yet re-read the current `hook-session-start` tests.  
  Re-audit path: inspect `tests/hook-session-start.vitest.ts` and the current Claude/Gemini/Copilot hook entrypoints.

- `P1 / cross-cutting / hook_system.md overstates Codex runtime parity.`  
  Classification: `UNVERIFIED`  
  Reason: this is a doc/runtime parity claim adjacent to the shared-provenance work, but not proven resolved by the sampled primitive docs alone.  
  Re-audit path: inspect `references/config/hook_system.md` against current Codex runtime behavior.

- `P1 / cross-cutting / Root docs under-specify @context agent LEAF-only guardrail.`  
  Classification: `UNVERIFIED`  
  Reason: likely doc drift rather than a phase 017 primitive fix; not re-read in this iteration.  
  Re-audit path: compare current root runtime docs against the active `@context` agent definitions.

## Tally Progress

- Source report baseline: `242` deduplicated findings total (`1 P0 / 114 P1 / 133 P2`).
- Audited in this iteration: `11` findings (`1 P0 + 10 P1`).
- Iteration-1 sample tally: `ADDRESSED=2`, `STILL_OPEN=0`, `SUPERSEDED=1`, `UNVERIFIED=8`.
- Remaining unaudited findings after this pass: `231`.

## Questions Answered

- `Q2`: initial verdict for the 015 P0 is `ADDRESSED`, not still open. The strongest evidence is the post-015 reconsolidation rewrite (`104f534bd0`) plus current-main scope-filtering and metadata-persistence checks.

## Questions Remaining

- `Q1`: full `ADDRESSED / STILL_OPEN / SUPERSEDED / UNVERIFIED` tally for all `242` deduplicated findings is not complete yet.
- `Q3`: the `114` P1 findings still need a broader cluster-by-cluster audit against the 016/017/018 primitives.
- `Q4`: the `133` P2 findings have not been sampled yet.
- `Q5`: the residual backlog for a 015 Workstream 0+ restart cannot be narrowed until the resume/path/schema clusters are re-audited on current main.

## Next Focus

Read the current `session-resume`, `resume-ladder`, and graph-context handlers directly so iteration 002 can convert the large `UNVERIFIED` bucket into hard `SUPERSEDED` vs `STILL_OPEN` verdicts, then expand the audit to the first P2 sample.
