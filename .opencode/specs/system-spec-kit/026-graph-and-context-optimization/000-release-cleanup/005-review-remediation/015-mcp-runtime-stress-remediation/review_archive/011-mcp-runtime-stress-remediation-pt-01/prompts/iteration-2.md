# Deep-Review Iteration Prompt Pack — 011 Iteration 2

**GATE 3 PRE-ANSWERED — A (Existing folder)**: `specs/system-spec-kit/026-graph-and-context-optimization/015-mcp-runtime-stress-remediation`. The loop manager has already authorized this spec folder for the entire deep-review session. DO NOT re-ask Gate 3. DO NOT request confirmation. DO NOT halt. Proceed directly to the review work.

**TARGET AUTHORITY**: All write paths in this prompt are pre-approved under spec folder `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/`. Write iteration-002.md, append to JSONL, write delta — these are the deliverables, not options.

You are dispatched as a LEAF deep-review agent. Iter-1 closed with `9/11 traceability checks PASS, 0 fail, 2 partial`, `0 P0/P1`, `2 P2`. The v1.0.2 verdict (6/7 PROVEN, 0 REGRESSION, 83.8%) appears to hold. Now perform the security pass with focus on the P0 cli-copilot Gate 3 fix proposal.

## STATE SUMMARY

```
Iteration: 2 of 7
Mode: review
Dimension: security (priority 2)
Review Target: specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation
Prior Findings (cumulative): P0=0 P1=0 P2=2
Dimension Coverage: 1 / 4 (correctness covered)
Coverage Age: 1
Last 2 ratios: N/A -> 1.0
Stuck count: 0
Provisional Verdict: PASS (with hasAdvisories=true if P2 stay; flip CONDITIONAL if security uncovers P1)
Resource Map Coverage: resource-map.md present; coverage gate active.
Last claim_adjudication_passed: true (no new P0/P1 in iter-1)
```

## ITERATION 2 FOCUS — SECURITY DEEP-DIVE

### S1. P0 cli-copilot Gate 3 BYPASS FIX VALIDATION (highest leverage)

The `011-post-stress-followup-research/` deep-research loop produced a P0 patch proposal: a Gate-3 bypass in the cli-copilot dispatch path lets recovered/bootstrap context override the workflow-approved spec folder, unilaterally enabling write-intent dispatch outside the approved scope.

The proposed fix lives in `.opencode/skill/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts` (and a helper `buildCopilotPromptArg`). Read the actual implementation and validate:

1. **Insertion point correctness**: Where exactly does the authority-token bind to the workflow-approved spec folder? An off-by-one (binding to the wrong scope variable) would reintroduce the bypass. Trace the variable from workflow input through helper invocation through copilot argv assembly.
2. **Plan-only safe-fail**: When `spec_folder` is missing/malformed/unresolved on a write-intent dispatch, does the helper enforce plan-only mode by replacing the prompt with a Gate-3 question AND stripping `--allow-all-tools`?
3. **TARGET AUTHORITY preamble**: Is it written to disk with the helper-emitted `promptFileBody`? Does the bare `@promptPath` argv reference work with copilot's read semantics?
4. **Recovered-context resistance**: When a recovered/bootstrap mention of a different folder appears INSIDE the prompt body, does the preamble override correctly anchor the model to the workflow-approved folder?
5. **Test coverage**: Is there a vitest file specifically for `buildCopilotPromptArg` covering the (a) approved happy path, (b) missing folder safe-fail, (c) recovered-context mention attack, (d) large-prompt @-wrapper mode?

If ANY of these is incorrect or untested, this becomes a P0 review finding (the proposed P0 fix is itself broken).

### S2. Daemon rebuild + restart contract (008-mcp-daemon-rebuild-protocol)

- Open `008-mcp-daemon-rebuild-protocol/` and the implementation summary.
- Validate: does the daemon rebuild actually happen at the documented entry point? Is there a stale-build window where the live probe could pass against an old binary?
- File watcher debounce (P2 follow-up): is the deferred fix scoped so it doesn't break attestation?

### S3. Memory-search refusal contract (009-memory-search-response-policy)

- Validate: when `cite_results` is true but quality is weak, does the refusal payload actually fire, or can the response leak unweighted results?
- Cross-check the live probe evidence: does it exercise both pass and refuse paths, or only pass?

### S4. Truncation contract (003-memory-context-truncation-contract)

- Validate token-budget enforcement: `preEnforcementTokens` is documented as working. Is there a code path where truncation can be bypassed (e.g., a streaming variant)?

### S5. CocoIndex fork semantics (004-cocoindex-overfetch-dedup)

- Soft-fork v0.2.3+spec-kit-fork.0.2.0 vendored. Does the fork enforce dedup at ingest, or only at query? An ingest-time bypass means cached vectors from before the fork can still over-fetch.
- OPP CocoIndex telemetry follow-up (planned in 015): is metadata passthrough wired correctly, or does it require ingest re-run?

### S6. Causal-graph window metrics (006)

- Default cap is detection-only. Is there a bypass where production tuning could silently exceed the cap without telemetry?

### S7. Intent classifier stability (007)

- v1 sorted-token heuristic shipped. Is there an injection vector where adversarial token ordering bypasses the heuristic? P3 v2 embedding-based paraphrase is deferred.

## CONSTRAINTS

- LEAF agent — DO NOT dispatch sub-agents.
- Target 9 tool calls; soft max 12; hard max 13.
- Review target is READ-ONLY.
- Cite EVERY P0/P1 with file:line evidence + claim-adjudication packet.
- Do NOT re-flag iter-1 P2 findings.
- This packet has 18 children — do NOT try to read all of them. Focus on the 7 remediation packets (003-009) at high level + the P0 fix (012/executor-config.ts) at deep level.

## OUTPUT CONTRACT

### 1. Iteration narrative markdown
Write to: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/015-mcp-runtime-stress-remediation/review/011-mcp-runtime-stress-remediation-pt-01/iterations/iteration-002.md`

Headings: `# Iteration 2 — Security`, `## Dimension`, `## Files Reviewed`, `## Findings — P0`, `## Findings — P1`, `## Findings — P2`, `## Traceability Checks`, `## Resource Map Coverage`, `## Claim Adjudication Packets`, `## Verdict`, `## Next Dimension`.

### 2. JSONL state log APPEND
```json
{"type":"iteration","iteration":2,"mode":"review","status":"complete","focus":"security","dimensions":["security"],"filesReviewed":<n>,"findingsCount":<n>,"findingsSummary":{"P0":<cumulative>,"P1":<cumulative>,"P2":<cumulative>},"findingsNew":{"P0":<new>,"P1":<new>,"P2":<new>},"traceabilityChecks":{"summary":{"required":<n>,"executed":<n>,"pass":<n>,"partial":<n>,"fail":<n>,"blocked":<n>,"notApplicable":<n>,"gatingFailures":<n>},"results":[]},"newFindingsRatio":<0..1>,"graphEvents":[],"timestamp":"<ISO_8601>","sessionId":"2026-04-28T14:30:00.000Z","generation":1}
```

### 3. Per-iteration delta
Write to: `.../deltas/iter-002.jsonl`

After completing, update strategy `<!-- ANCHOR:next-focus -->` to point iter-3 at traceability.

GO.
