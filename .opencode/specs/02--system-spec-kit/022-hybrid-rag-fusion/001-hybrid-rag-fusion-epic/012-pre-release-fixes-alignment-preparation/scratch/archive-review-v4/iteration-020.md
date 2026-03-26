# Review Iteration 20: Final Regression Sweep

## Focus
Final regression sweep across all dimensions.

## Scope
- Workspace health gates: tests, lint, typecheck, validator
- Root spec truth and direct-phase status coherence
- 012 packet truthfulness across `spec.md`, `description.json`, and `implementation-summary.md`

## Findings

### P1-001 [P1] Release-readiness packet 012 still claims all gates are green, but the live workspace gates are red
- File: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md:156`
- Evidence: Phase 4 success criteria are all checked off, including claims that `validate.sh --recursive` exits with no errors, workspace verification passes, and a follow-up review is `100/100` with no active P0/P1 findings (`spec.md:156-164`). Current verification contradicts that state:
  - `npm run -s lint` exits `1` with an unused import in `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:29`.
  - `npm run -s typecheck` exits `1`; the failing leg is `mcp_server/lib/feedback/shadow-evaluation-runtime.ts:176` and `:195`.
  - `npm test` fails with `4` failing files, `20` failing tests, `307` passing files, and `8524` passing tests.
  - `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion` exits `2` with `RESULT: FAILED`.
- Recommendation: Downgrade 012 from "complete pending re-verification" to an in-progress release packet until the gates pass and the evidence sections are refreshed.

### P1-002 [P1] The root 022 coordination spec no longer matches the live direct-phase statuses
- File: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:100`
- Evidence: The phase map still says `010` is `Draft`, `013` is `Complete`, and `016-019` are `Complete` (`spec.md:100-109`), but the child specs say otherwise:
  - `010-template-compliance-enforcement/spec.md:26` -> `In Progress`
  - `013-agents-alignment/spec.md:18` -> `In Progress (lineage truth-reconciled; write-agent routing follow-up pending)`
  - `016-rewrite-memory-mcp-readme/spec.md:26` -> `In Progress (tasks tracker pending completion evidence)`
  - `017-update-install-guide/spec.md:26` -> `In Progress (tasks tracker pending completion evidence)`
  - `018-rewrite-system-speckit-readme/spec.md:26` -> `In Progress (tasks tracker pending completion evidence)`
  - `019-rewrite-repo-readme/spec.md:26` -> `In Progress (tasks tracker pending completion evidence)`
- Recommendation: Refresh the root phase map and any derived completion claims from the live child packet metadata before using the root packet as release evidence.

### P1-003 [P1] The Hydra truth-sync regression suite is failing because the documented runtime surface no longer exists as referenced
- File: `.opencode/skill/system-spec-kit/mcp_server/tests/hydra-spec-pack-consistency.vitest.ts:25`
- Evidence:
  - The test requires `mcp_server/lib/governance/retention.ts` to exist (`hydra-spec-pack-consistency.vitest.ts:25-32,86-94`).
  - The Hydra tasks packet still marks work against that exact path as complete (`.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/tasks.md:60-63`).
  - The file is gone from the runtime tree; `find .opencode/skill/system-spec-kit/mcp_server -maxdepth 2 -type f | rg 'retention'` returns no match.
  - This is one of the explicit failing tests in the current `npm test` run.
- Recommendation: Either restore the expected runtime surface or update the Hydra packet/tests together so the regression suite and documentation agree on the shipped path.

### P1-004 [P1] Spec validation still fails on documented integrity issues and missing successor links
- File: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/spec.md:162`
- Evidence:
  - 012 claims recursive validation exits `0` or `1` with no error-level issues (`spec.md:162`).
  - The current validator exits `2` and reports `RESULT: FAILED`.
  - Hard errors remain in spec integrity: missing markdown references from `review-report.md` to `021-remediation/spec.md`, `FEATURE_CATALOG.md`, `ARCHITECTURE.md`, and `environment_variables.md`.
  - Successor-link warnings remain across `015-manual-testing-per-playbook`, for example `001-retrieval/spec.md:30` has a successor row but the validator still reports successor-reference failures through phases `001` to `021`, plus `019-feature-flag-reference/spec.md:30` has no successor row at all.
- Recommendation: Re-run the validator only after cleaning the broken review-report references and the missing successor chain in the 015 packet family.

### P1-005 [P1] The 012 implementation summary is materially stale and overstates a previously green verification state
- File: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/implementation-summary.md:110`
- Evidence:
  - The summary still reports `ESLint Pass — 0 errors, 0 warnings`, `Tests ... 0 failed`, and a `267 passed` era snapshot (`implementation-summary.md:112-118`).
  - Live verification now shows lint exit `1`, typecheck exit `1`, validator exit `2`, and `npm test` failing with `20` failed tests.
  - The metadata also frames the work as `T01-T18 (P0+P1 scope)` (`implementation-summary.md:26`) while the 012 spec now claims the packet completed the much larger Phase 4 closure program through `T97` (`spec.md:156-161`).
- Recommendation: Rewrite the implementation summary so it either reflects the historical v1 remediation scope explicitly or captures the current full-tree remediation state truthfully.

### P2-001 [P2] `description.json` is identity-consistent but not status-bearing, so it cannot validate the spec's release posture
- File: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/description.json:1`
- Evidence: `description.json` correctly matches the packet id, slug, and title, but it carries no status or verification metadata. That means it does not contradict the spec, yet it also does not support the spec's strong "complete" and "100/100" posture.
- Recommendation: Keep it as a discovery artifact, but do not treat it as evidence that remediation is complete unless richer metadata is added intentionally.

## Quick Health Checks

### Tests
- `cd .opencode/skill/system-spec-kit && npm test`
- Result: FAIL
- Evidence: `4` failed files, `20` failed tests, `307` passed files, `8524` passed tests, `74` skipped, `26` todo. Notable failures include `tests/hydra-spec-pack-consistency.vitest.ts` and `tests/modularization.vitest.ts`.

### Lint
- `cd .opencode/skill/system-spec-kit && npm run -s lint`
- Result: FAIL
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:29` imports `AssistiveClassification` but only re-exports it, triggering `@typescript-eslint/no-unused-vars`.

### Typecheck
- `cd .opencode/skill/system-spec-kit && npm run -s typecheck`
- Result: FAIL
- Evidence:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:176` assigns a `(RankedItem | null)[]` pipeline to `RankedItem[]`.
  - `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts:195` uses a type predicate incompatible with the mapped item shape.

### Validator
- Prompt command result: `bash .opencode/skill/system-spec-kit/scripts/validate.sh ...` fails immediately because that path does not exist.
- Actual validator location: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Actual result: FAIL, exit `2`
- Evidence: `Summary: Errors: 1  Warnings: 49` and `RESULT: FAILED`.

## Cross-Cutting Review Notes

### Root spec truth
- The root count claims are still defensible if interpreted exactly as written:
  - `397` directories beneath the subtree = `find ... -mindepth 1 -type d | wc -l`
  - `21` top-level directories = `find ... -maxdepth 1 -type d | wc -l`
- The larger problem is status drift in the phase map, not the top-level counts.

### 012 spec coherence
- The packet tells a coherent remediation story, but it no longer tells the truth about current readiness.
- The strongest contradictions are the checked-off Phase 4 release criteria versus the live red health gates.

### Description.json consistency
- Packet identity metadata is consistent with the folder and title.
- It is neutral on remediation state.

### Implementation summary accuracy
- The summary is no longer accurate as a current-state document.
- It reads like a frozen historical snapshot but is positioned as the live implementation summary for the packet.

## Verdict Recommendation
**CONDITIONAL**

Rationale:
- No new exploitability or data-loss blocker was identified in this iteration, so I am not elevating this to `FAIL` under the P0-only rubric.
- Multiple P1 release-gate issues remain active: lint fails, typecheck fails, tests fail, validator fails, root-phase status truth has drifted, and 012 still over-claims closure.
- This packet should not be treated as release-ready or 100/100 until those P1 issues are cleared and the supporting docs are updated to match reality.
