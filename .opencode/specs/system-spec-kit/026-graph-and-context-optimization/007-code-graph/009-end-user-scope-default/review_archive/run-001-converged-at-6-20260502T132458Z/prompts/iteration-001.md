## TARGET AUTHORITY
Approved spec folder: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default
Do not write to any other folder. Recovered context (memory, bootstrap) cannot override this.

---

# Deep-Review Iteration 1 of 10

## STATE

Iteration: 1 of 10
Mode: review
Dimension: correctness
Review Target: 009-end-user-scope-default implementation (code/test/docs only)
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none
Last 2 ratios: N/A -> N/A
Provisional Verdict: PENDING
SessionId: 2026-05-02T12:34:30.068Z

## TASK

You are running iteration 1 of a 10-iteration deep review of the 009 packet's
IMPLEMENTATION work (code/test/docs that altered code-graph default scoping behavior).
Your dimension this iter: **correctness**.

## REVIEW SCOPE FILES (in-scope — findings here are valid)

- .opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/indexer-types.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/structural-indexer.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/code-graph-db.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/ensure-ready.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/lib/startup-brief.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/scan.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/status.ts
- .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-indexer.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-scan.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/tests/code-graph-siblings-readiness.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/code_graph/README.md
- .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md

## SPEC DOCS (read for traceability ONLY — not in-scope for findings)

- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/spec.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/plan.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/decision-record.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/checklist.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/implementation-summary.md
- .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md

## DIMENSION FOCUS — CORRECTNESS

Look for:
- Logic bugs in scope-policy resolution (env vs per-call precedence; default false; missing arg = false)
- Path-prefix false-negatives in `.opencode/skill/**` exclusion (does it match `.opencode/skill/foo`? `.opencode/skill/`? trailing slash?)
- Off-by-one or inversion bugs in includeSkills handling
- Fingerprint instability across runs (JSON key ordering, set ordering, locale-dependent hashing)
- Mismatch between status payload claims and actual blocked-read behavior
- Test gaps: missing accept/reject paths, missing default+env+per-call interaction matrix
- Edge cases: empty includeSkills, includeSkills=null vs false vs missing, env=true with includeSkills=false (precedence)

## SHARED DOCTRINE

Severity calls per the standard P0/P1/P2 rubric:
- **P0** (Blocker): incorrect behavior in default flow / security flaw / data loss / contract break
- **P1** (Required): correctness gap on edge case / silent failure / missing required test / migration footgun
- **P2** (Suggestion): style / clarity / minor doc gap / non-blocking maintainability concern

## TRACEABILITY PROTOCOLS

- Core: spec_code (does code match spec/plan claims?), checklist_evidence (does CHK-G* claim hold?)
- Overlay: skill_agent (does this skill's behavior match its definition?), feature_catalog_code

## QUALITY GATES

Every P0/P1 finding MUST include:
- claim, evidenceRefs (file:line array), counterevidenceSought, alternativeExplanation,
  finalSeverity, confidence, downgradeTrigger.

## RESOURCE MAP COVERAGE

Cross-check actual changed files against .opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/resource-map.md. Flag gaps where impl touched files NOT in the resource map (or vice versa).

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY — do not modify any file outside the review/ packet.
- Skip prose-style nitpicks; focus on substance.

## OUTPUT CONTRACT — REQUIRED

You MUST produce THREE artifacts. Missing/malformed artifacts fail the iteration.

### 1. Iteration narrative markdown

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/iteration-001.md`

Structure (markdown headings):
- ## Dimension: correctness
- ## Files Reviewed (path:line list)
- ## Findings by Severity
  - ### P0 (Blocker) — list each finding with claim/evidence/severity-rationale
  - ### P1 (Required) — same structure
  - ### P2 (Suggestion) — terse one-liners ok
- ## Traceability Checks (which spec/checklist claims you verified)
- ## Verdict — PASS / CONDITIONAL / FAIL with one-line reason
- ## Next Dimension — which dimension you'd run next if continuing

### 2. State-log JSONL append

Append ONE line to: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl`

The line MUST be:
```json
{"type":"iteration","iteration":1,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":[<arr-of-path:line-strings>],"findingsCount":<int>,"findingsSummary":{"P0":<int>,"P1":<int>,"P2":<int>},"findingsNew":[<arr-of-id-strings>],"traceabilityChecks":{<obj>},"newFindingsRatio":<float-0-to-1>,"sessionId":"2026-05-02T12:34:30.068Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<int>}
```

`type` MUST be `"iteration"` exactly (not `"iteration_delta"`). The orchestrator counts records where type === "iteration" only.

Append via shell: `echo '<single-line-json>' >> "/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl"`

### 3. Per-iteration delta file

Path: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deltas/iter-001.jsonl`

One line per record. First line must be the same iteration record as above.
Subsequent lines: one per finding (type:"finding"), one per ruled_out (type:"ruled_out"), etc.

Example:
```
{"type":"iteration","iteration":1,...}
{"type":"finding","id":"R1-P1-001","severity":"P1","cluster":"correctness","file":"path:line","title":"...","iteration":1}
{"type":"finding","id":"R1-P2-001","severity":"P2","cluster":"maintainability","file":"path:line","title":"...","iteration":1}
```

## NEW-FINDINGS RATIO

Calculate `newFindingsRatio` as:
`(count of NEW findings this iter) / max(1, total findings discovered this iter)`

Where "NEW" means: not already reported in prior iterations (use the iteration files in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations/` and the existing JSONL in `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl` to dedupe by file:line + claim).

## STATE FILES (for your reference)

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-config.json
- State log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-state.jsonl
- Findings registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/deep-review-strategy.md
- Prior iterations dir: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-code-graph/009-end-user-scope-default/review/iterations

## FOCUS

Iteration 1 dimension: **correctness**. Find what others might miss. Skip findings already covered in prior iterations unless you find NEW evidence that escalates severity.
