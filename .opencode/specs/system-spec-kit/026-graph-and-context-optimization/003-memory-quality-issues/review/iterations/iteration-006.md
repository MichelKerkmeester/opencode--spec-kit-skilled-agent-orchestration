# Review Iteration 6: D6 Reliability — Phase 4 heuristics + Phase 5 dry-run

## Focus

Reliability audit of Phase 4 PR-7 (predecessor discovery), PR-9 (post-save reviewer) failure handling, and Phase 5 PR-10 dry-run fixture stability.

## Scope

- Review target: Phase 4 (4 artifacts) + Phase 5 partial (spec/plan/checklist/implementation-summary/pr11-defer-rationale + scratch/pr10-dry-run-report.json) + code
- Dimension: reliability

## Reviewer Backend

- **cli-codex** `/opt/homebrew/bin/codex exec`
- Model: `gpt-5.4`, reasoning=`high`, service_tier=`fast`, sandbox=`read-only`
- **NOTE: First attempt stalled at ~19 min with 0.19 s CPU time (likely transient network/rate-limit). Killed and retried; retry completed in 194 s.**

## Findings

### P1-009: Predecessor discovery can fabricate lineage from an unrelated older sibling

- **Dimension**: reliability
- **Severity**: P1
- **File**: `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:56`
- **Evidence**: `hasContinuationSignal()` only checks regex hits in title/summary, and candidate ranking at lines 126-143 and 196-223 uses only `sourceMatch` plus timestamp, with no title/topic affinity guard.
- **Impact**: In a mixed-topic `memory/` folder, a continuation-shaped save with no `_sourceSessionId` can auto-link the newest readable sibling even when it is unrelated, which violates the Phase 4 "do not guess" contract and writes incorrect `supersedes` lineage into the saved artifact.
- **Hunter**: A folder with one older valid memory and one new unrelated "extended" save will attach that older session id.
- **Skeptic**: Ambiguity only protects exact timestamp ties.
- **Referee**: The implementation never checks semantic/topic continuity before `workflow.ts:1388` persists the result — real reliability bug.
- **Recommendation**: Require a stronger predecessor gate before auto-linking: explicit source-session match, normalized title-family match, or a deterministic same-thread token, and otherwise leave `supersedes` empty.
- **Final severity**: P1
- **Confidence**: 0.94

```json
{"type":"claim-adjudication","claim":"find-predecessor-memory.ts ranks candidates by sourceMatch + timestamp with no title/topic affinity guard, so a continuation-shaped save in a mixed-topic folder can auto-link an unrelated older sibling and write incorrect supersedes lineage.","evidenceRefs":[".opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:56",".opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:126",".opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:196",".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1388"],"counterevidenceSought":"Checked for ambiguity guards, topic affinity checks, and source-session equality short-circuit. Only exact timestamp ties are protected.","alternativeExplanation":"Folders are assumed to be single-topic in practice. Rejected because the Phase 4 spec explicitly names 'mixed-topic folders' as a reliability risk and the implementation does not guard against it.","finalSeverity":"P1","confidence":0.94,"downgradeTrigger":"Evidence of an upstream caller that only invokes predecessor discovery in verified single-topic folders, OR a Phase 4 spec revision removing the mixed-topic guard requirement."}
```

### P1-010: Reviewer skip paths are downgraded to informational completion instead of a reliability signal

- **Dimension**: reliability
- **Severity**: P1
- **File**: `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:559`
- **Evidence**: A saved-file read failure returns `SKIPPED` at lines 559-562, and the workflow logs any non-`REJECTED`/non-`ISSUES_FOUND` result as `info` at `workflow.ts:1909` and only aborts on `REJECTED` at line 1935.
- **Impact**: If the post-save reviewer cannot read the just-written file, or is misclassified out of JSON mode, the save proceeds to indexing and completion without a warning/error-grade signal, so operators can miss that the guardrail never actually ran.
- **Hunter**: Transient filesystem/readback problems after Step 9 produce `SKIPPED`.
- **Skeptic**: stdout does print a skipped banner.
- **Referee**: Machine-visible outcome is still informational and non-blocking, so automated monitoring and callers can treat reviewer outage as success.
- **Recommendation**: Promote unexpected `SKIPPED` states to warning/error in the workflow, and treat readback failure after a successful write as a hard reliability fault rather than a benign skip.
- **Final severity**: P1
- **Confidence**: 0.91

```json
{"type":"claim-adjudication","claim":"post-save reviewer SKIPPED results on readback failure are logged as 'info' and never block the save, so a reviewer outage after a successful write is indistinguishable from a successful guardrail pass.","evidenceRefs":[".opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:559",".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1909",".opencode/skill/system-spec-kit/scripts/core/workflow.ts:1935"],"counterevidenceSought":"Checked whether there is an alerting path or warning-level log for unexpected SKIPPED. Only a stdout banner; no structured warning or metric increment.","alternativeExplanation":"SKIPPED is intentionally benign for non-JSON saves. Rejected because a post-write readback failure is distinct from a deliberate skip and should be treated as reliability-critical.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Evidence that unexpected SKIPPED emits a warning metric/log that automated monitoring can consume, OR a spec revision classifying readback-failure SKIPPED as acceptable."}
```

### P2-008: PR-10 evidence is a drifting repo snapshot, and Phase 5 docs still describe an unshipped apply mode

- **Dimension**: reliability
- **Severity**: P2
- **File**: `.opencode/skill/system-spec-kit/scripts/memory/migrate-historical-json-mode-memories.ts:703`
- **Evidence**: The CLI walks the live project tree and stamps `generatedAt` into the report at lines 703-769, while Phase 5 still advertises `dry-run/apply/report` in `005-operations-tail-prs/spec.md:162` and `005-operations-tail-prs/plan.md:104`, but the shipped summary says dry-run only at `005-operations-tail-prs/implementation-summary.md:41`.
- **Impact**: The only approved historical-migration evidence can silently change as the repo memory corpus changes, and operators reading Phase 5 spec/plan can still believe an `--apply` path exists when the implementation/checklist say it does not. No PR-10 test coverage was found under `.opencode/skill/system-spec-kit/scripts/tests`.
- **Recommendation**: Add a fixture-locked PR-10 test/report harness, and reconcile Phase 5 spec/plan wording so every phase-local document reflects the shipped dry-run-only contract.
- **Final severity**: P2

## Cross-Reference Results

### Core Protocols

- **spec_code** — **fail**: Phase 4 docs promise ambiguity-safe, non-guessing predecessor discovery, but the implementation still picks any best older sibling by timestamp; Phase 5 spec/plan also still mention `--apply` although the shipped contract is dry-run only.
- **checklist_evidence** — partial: Phase checklists record build + live dry-run artifact evidence, but that evidence is not fixture-stable and does not prove a reproducible PR-10 classification surface.

## Ruled Out

- **SaveMode refactor residual branches** — no remaining `_source === 'file'` branching in the core workflow/reviewer path.
- **Composite blocker behavior** — multiple guardrail findings escalate to `REJECTED`, and the workflow does stop on that status.
- **PR-11 concurrency hardening silent half-ship** — PR-11 is explicitly deferred rather than silently half-shipped.

## Sources Reviewed

- Phase 4: spec.md, plan.md, checklist.md, implementation-summary.md
- Phase 5: implementation-summary.md, pr11-defer-rationale.md, spec.md, plan.md, checklist.md, scratch/pr10-dry-run-report.json
- Code: find-predecessor-memory.ts, save-mode.ts, post-save-review.ts, workflow.ts, collect-session-data.ts
- Tests: memory-quality-phase4-pr7.test.ts, memory-quality-phase4-pr9.test.ts

## Assessment

- Confirmed findings: 3
- New findings ratio: 1.00
- noveltyJustification: Surfaced false-positive lineage selection, reviewer outage handling, and PR-10 evidence stability — all net-new to this reliability pass.
- Dimensions addressed: reliability
- Verdict this iteration: **FAIL** (2 P1 reliability bugs with shipped code evidence, 1 P2)
- Cumulative: P0=0 P1=10 P2=8

## Reflection

- **What worked (retry)**: Second attempt completed in 194 s. Same prompt, same invocation — first attempt stall was transient.
- **What failed (first attempt)**: ~19-minute stall with 0.19 s CPU time before kill. Likely network/rate-limit stall inside codex → OpenAI API. Reported to user per instructions.
- **Next adjustment**: Iter 7 (D7 Completeness) should focus on parent packet closure completeness + Phase 6/7 readiness + out-of-scope drift acknowledgement. Expected overlap with P1-007 (parent plan/tasks superseded) and P1-006 (Phase 5 closed despite blockers).
