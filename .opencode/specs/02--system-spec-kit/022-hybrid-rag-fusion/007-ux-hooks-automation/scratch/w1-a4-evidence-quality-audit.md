# Evidence Quality Audit — 007 UX Hooks

## Summary
- Total unchecked: 10
- Evidence exists (needs linking): 7
- Evidence missing (needs creation): 3

---

## Detailed Item Analysis

### CHK-001 [P0] Requirements documented in spec.md
- **Status:** EVIDENCE_EXISTS
- **Required evidence:** Specific file path and section references showing requirements are documented
- **Found at:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-ux-hooks-automation/spec.md:99-125` — Section 4 "REQUIREMENTS" contains REQ-001 through REQ-007 with acceptance criteria, plus 7 acceptance scenarios
- **Action needed:** Replace generic boilerplate evidence with: `[EVIDENCE: spec.md §4 REQUIREMENTS defines REQ-001 through REQ-007 (lines 99-125) with P0/P1 priorities, acceptance criteria per requirement, and 7 acceptance scenarios covering mutation hooks, checkpoint safety, health repair, schema alignment, duplicate-save no-op, envelope hints, and manual playbook coverage]`

---

### CHK-002 [P0] Technical approach defined in plan.md
- **Status:** EVIDENCE_EXISTS
- **Required evidence:** Specific file path and section references showing technical approach
- **Found at:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-ux-hooks-automation/plan.md:55-71` — Section 3 "ARCHITECTURE" defines the shared mutation post-hook pattern, key components (Post-Mutation Hook Wrapper, Mutation Feedback Hook Module, Response Hint Hook Module, Health Repair Path, Checkpoint Delete Safety Layer, Context Server Success Adapter), and data flow; Section 4 "IMPLEMENTATION PHASES" (lines 75-110) defines 4 phases all marked complete
- **Action needed:** Replace generic boilerplate evidence with: `[EVIDENCE: plan.md §3 ARCHITECTURE (lines 55-71) defines shared mutation post-hook pattern with 6 key components and data flow; §4 IMPLEMENTATION PHASES (lines 75-110) defines 4 phases (Setup, Core Implementation, Verification, Review-Driven Fixes) all marked [x] complete]`

---

### CHK-003 [P1] Dependencies identified and available
- **Status:** EVIDENCE_EXISTS
- **Required evidence:** Specific reference to dependency section with status assessment
- **Found at:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-ux-hooks-automation/plan.md:128-135` — Section 6 "DEPENDENCIES" lists 2 dependencies: "Existing spec_kit command files" (Internal, Green) and "Hook interfaces used by commands" (Internal, Yellow with mitigation noted)
- **Action needed:** Replace generic boilerplate evidence with: `[EVIDENCE: plan.md §6 DEPENDENCIES (lines 128-135) identifies 2 internal dependencies: spec_kit command files (Green) and hook interfaces (Yellow, requires normalization before broad rollout); Definition of Ready (line 45) marks "Dependencies identified" as [x]]`

---

### CHK-011 [P0] No console errors or warnings
- **Status:** EVIDENCE_MISSING
- **Required evidence:** Evidence that runtime MCP server paths produce no unexpected stdout/stderr warnings. The current evidence explicitly admits "stderr still reported 3008 orphaned entries and an embedding dimension mismatch warning" which contradicts the claim.
- **Found at:** Partial evidence exists — `tests/stdio-logging-safety.vitest.ts` (lines 50-57) verifies no `console.log/info/debug` or `process.stdout.write` in runtime source files (excluding cli.ts, tests, dist). The `context-server.ts` file uses only `console.error` and `console.warn` (stderr-safe). However, the checklist's own AUDIT comment correctly identifies the contradiction: stderr warnings for orphaned entries and embedding dimension mismatch are active runtime warnings.
- **Action needed:** This item cannot be honestly checked without qualification. The evidence should document: (1) stdout pollution is eliminated (proven by `tests/stdio-logging-safety.vitest.ts` passing), (2) stderr warnings (3008 orphaned entries, 1024-vs-768 embedding mismatch) are operational signals outside this phase's scope per Known Limitations 1 and 2 in implementation-summary.md. Recommend rewriting evidence as: `[EVIDENCE: stdout pollution eliminated — tests/stdio-logging-safety.vitest.ts passes (no console.log/info/debug in runtime sources); context-server.ts uses only console.error/console.warn (stderr-safe); CAVEAT: stderr reports 3008 orphaned entries and embedding dimension mismatch which are pre-existing operational signals outside phase 007 scope (see implementation-summary.md Known Limitations 1-2)]` and marking with a scope-limited pass or requesting user approval to defer the stderr warnings.

---

### CHK-031 [P0] Input validation implemented
- **Status:** EVIDENCE_EXISTS
- **Required evidence:** Specific file:line references for input validation across handler, schema, tool-schema, and type layers
- **Found at:**
  - Handler: `handlers/checkpoints.ts:277-286` — validates `confirmName` is present, is a string, and exactly matches `name`
  - Schema: `schemas/tool-input-schemas.ts:232` — `confirmName: z.string().min(1)` (Zod validation)
  - Schema required fields: `schemas/tool-input-schemas.ts:368` — `checkpoint_delete: ['name', 'confirmName']`
  - Tool schema: `tool-schemas.ts:297-302` — `confirmName` property defined with `required: ['name', 'confirmName']`
  - Type layer: `tools/types.ts:180` — `confirmName: string` in type definition
  - Test coverage: `tests/handler-checkpoints.vitest.ts`, `tests/tool-input-schema.vitest.ts`, `tests/mcp-input-validation.vitest.ts` all contain `confirmName` validation tests
  - Security: `handlers/memory-crud-health.ts` contains `sanitizeErrorForHint()` for path/stack stripping
- **Action needed:** Replace generic boilerplate evidence with: `[EVIDENCE: confirmName enforced at 4 layers — handler (checkpoints.ts:277-286, rejects missing/non-matching confirmName), Zod schema (tool-input-schemas.ts:232, z.string().min(1)), tool-schema (tool-schemas.ts:297-302, required field), type (tools/types.ts:180); tested in handler-checkpoints.vitest.ts, tool-input-schema.vitest.ts, mcp-input-validation.vitest.ts; sanitizeErrorForHint() in memory-crud-health.ts strips paths and stack traces per Phase 4 M1+M2]`

---

### CHK-032 [P1] Auth/authz working correctly
- **Status:** EVIDENCE_EXISTS
- **Required evidence:** Confirmation that auth/authz is genuinely N/A for this phase scope
- **Found at:** No auth/authz code exists in any of the files touched by this phase. Grep for "auth", "authz", "authentication", "authorization" returns zero matches in `hooks/` directory and `handlers/checkpoints.ts`. The spec.md scope (lines 54-68) explicitly limits scope to mutation hooks, UX hints, and checkpoint safety — no auth flows are in scope or out of scope (they simply don't apply).
- **Action needed:** The existing evidence text is actually correct in substance ("N/A in scope for phase 007-ux-hooks-automation"). Replace with specific reference: `[EVIDENCE: N/A — spec.md §3 scope (lines 54-68) covers mutation hooks, UX hints, and checkpoint safety only; grep for auth/authz patterns across all touched hooks/ and handler files returns zero matches; no auth code paths introduced or modified]`

---

### CHK-041 [P1] Code comments adequate
- **Status:** EVIDENCE_EXISTS
- **Required evidence:** Evidence that touched files have adequate inline comments for non-obvious logic
- **Found at:**
  - `hooks/mutation-feedback.ts:1-3` — module header comment
  - `hooks/response-hints.ts:1-3` — module header comment; lines 38-39 — convergence loop explanation comment; lines 52-54 — serialization trade-off explanation (added in Phase 4 review per m2+m3 findings)
  - `handlers/checkpoints.ts:273` — JSDoc for `handleCheckpointDelete`; lines 197-199 — T102 FIX comment explaining index rebuild after restore; line 212 — AI-GUARD comment for non-fatal failure
  - `hooks/memory-surface.ts` — Phase 4 single-process assumption comment (per s3 finding)
  - `context-server.ts` — file-watcher try/catch and latency warning comments (Phase 4 M3+m10)
- **Action needed:** Replace generic boilerplate evidence with: `[EVIDENCE: response-hints.ts:38-39 documents convergence loop rationale, :52-54 documents serialization trade-off (Phase 4 m2+m3); checkpoints.ts:197-199 documents T102 index rebuild fix, :212 AI-GUARD non-fatal note, :273 JSDoc for delete handler; memory-surface.ts has single-process assumption comment (Phase 4 s3); hooks follow existing project MODULE header convention]`

---

### CHK-042 [P2] README updated (if applicable)
- **Status:** EVIDENCE_EXISTS
- **Required evidence:** The hooks README documents the new modules and their contracts
- **Found at:** `hooks/README.md` — Section 2 "IMPLEMENTED STATE" (lines 37-54) lists all main exports including `buildMutationHookFeedback(operation, hookResult)` and `appendAutoSurfaceHints(result, autoSurfacedContext)`; documents data shapes for mutation hook feedback (cache clear booleans, invalidated tool-cache count, operation latency) and auto-surface response hints (enriches MCP JSON envelope `hints` and `meta.autoSurface`)
- **Action needed:** Replace generic boilerplate evidence with: `[EVIDENCE: hooks/README.md §2 IMPLEMENTED STATE (lines 37-54) documents buildMutationHookFeedback and appendAutoSurfaceHints exports with data shape descriptions for mutation feedback (cache clear booleans, latency) and response hints (MCP JSON envelope enrichment); updated during Phase 3 to correct export drift per implementation-summary.md]`

---

### CHK-050 [P1] Temp files in scratch/ only
- **Status:** EVIDENCE_MISSING
- **Required evidence:** The evidence claims "phase scratch directory contains only `.gitkeep`" but the scratch directory actually contains `codex-review-report.md` (10563 bytes, Mar 8) and `review-report.md` (11297 bytes, Mar 7) in addition to `.gitkeep`
- **Found at:** `scratch/` contains: `.gitkeep`, `codex-review-report.md`, `review-report.md` — these are legitimate scratch/temp files (review reports from Phase 4 review agents)
- **Action needed:** The evidence text is factually wrong and must be corrected. The item itself may actually be satisfied since the review reports ARE in scratch/ (which is the correct location for temp files). Update evidence to: `[EVIDENCE: scratch/ contains codex-review-report.md (Phase 4 review output) and review-report.md (Phase 4 review output) plus .gitkeep; all temp artifacts are correctly placed in scratch/ rather than in spec root or memory/]`

---

### CHK-051 [P1] scratch/ cleaned before completion
- **Status:** EVIDENCE_MISSING
- **Required evidence:** Either scratch/ is cleaned to just `.gitkeep`, or there is a documented reason to retain the files
- **Found at:** `scratch/` still contains `codex-review-report.md` and `review-report.md` — these were not cleaned
- **Action needed:** Two options: (1) Delete the review report files from scratch/ leaving only `.gitkeep`, then update evidence to `[EVIDENCE: scratch/ contains only .gitkeep after cleanup]`; OR (2) Document a reason to retain them and mark with user approval, e.g., `[EVIDENCE: scratch/ retains codex-review-report.md and review-report.md as Phase 4 review artifacts for audit trail; retained with user approval per [date]]`. Note: the review reports may have ongoing reference value for the deferred review findings mentioned in implementation-summary.md Known Limitation 4.

---

## Classification Summary

| CHK ID  | Priority | Classification    | Effort to Fix |
|---------|----------|-------------------|---------------|
| CHK-001 | P0       | EVIDENCE_EXISTS   | Evidence text rewrite only |
| CHK-002 | P0       | EVIDENCE_EXISTS   | Evidence text rewrite only |
| CHK-003 | P1       | EVIDENCE_EXISTS   | Evidence text rewrite only |
| CHK-011 | P0       | EVIDENCE_MISSING  | Needs scope-qualified pass or user approval to defer stderr warnings |
| CHK-031 | P0       | EVIDENCE_EXISTS   | Evidence text rewrite only |
| CHK-032 | P1       | EVIDENCE_EXISTS   | Evidence text rewrite only (N/A confirmation) |
| CHK-041 | P1       | EVIDENCE_EXISTS   | Evidence text rewrite only |
| CHK-042 | P2       | EVIDENCE_EXISTS   | Evidence text rewrite only |
| CHK-050 | P1       | EVIDENCE_MISSING  | Evidence text is factually wrong; item may be satisfied (files are correctly in scratch/) |
| CHK-051 | P1       | EVIDENCE_MISSING  | Requires either file cleanup or documented retention decision |

## Key Findings

1. **7 of 10 items have existing evidence that just needs proper file:line linking.** The 2026-03-08 audit correctly identified that evidence was "generic boilerplate" but the underlying implementation work is complete and verifiable.

2. **CHK-011 is the only genuinely problematic P0 item.** The stderr warnings (orphaned entries, embedding dimension mismatch) are real and acknowledged in implementation-summary.md Known Limitations. This needs a scope-qualified pass rather than a clean check.

3. **CHK-050/CHK-051 have contradictory evidence text** (claims ".gitkeep only" when review reports exist). CHK-050 may actually be satisfied since files ARE in scratch/. CHK-051 requires a cleanup decision.

4. **No source file modifications needed** to fix 7 of the 10 items — only checklist.md evidence text updates.
