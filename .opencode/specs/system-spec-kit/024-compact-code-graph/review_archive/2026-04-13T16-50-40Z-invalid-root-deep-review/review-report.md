# Review Report - 024 Compact Code Graph

## 1. Executive Summary
- Verdict: `CONDITIONAL`
- hasAdvisories: `true`
- Active findings: `P0=0`, `P1=6`, `P2=1`
- Iterations executed: `6`
- Stop reason: `converged`
- Review scope: root packet artifacts, child phase evidence, current runtime implementation/docs, and runtime agent/skill surfaces tied to context preservation, bootstrap, compact recovery, and structural priming.

## 2. Planning Trigger
- `/spec_kit:plan` is required before treating this packet as release-ready because six active P1 findings remain.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": {
    "P0": [],
    "P1": ["P1-001", "P1-002", "P1-003", "P1-004", "P1-005", "P1-006"],
    "P2": ["P2-001"]
  },
  "remediationWorkstreams": [
    "WS-1 Recovery API truth-sync",
    "WS-2 Root packet evidence repair",
    "WS-3 Hook safety and autosave hardening",
    "WS-4 Runtime guidance parity",
    "WS-5 Structural bootstrap budget enforcement",
    "WS-6 Advisory context-prime alignment"
  ],
  "specSeed": [
    "Update root packet evidence paths so checklist and implementation summary agree on shipped Phase 015/016 status.",
    "Truth-sync child packet 021 against the current bootstrap-first recovery contract.",
    "Clarify or implement the documented session_bootstrap response contract and structural token ceiling."
  ],
  "planSeed": [
    "Decide whether to implement missing runtime behavior or downgrade packet/doc claims for each active P1.",
    "Fix Claude/Gemini recovery surface parity before re-running deep review.",
    "Re-run this deep review after remediation with emphasis on root packet traceability and bootstrap contracts."
  ]
}
```

## 3. Active Finding Registry

### P1-001
- Title: `session_bootstrap` advertises recommended next actions that the handler never returns
- Dimension: `traceability`
- File: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:753`, `.opencode/skill/system-spec-kit/mcp_server/README.md:584`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:100`
- Evidence: public contract surfaces promise recommended next actions, while the live handler returns `resume`, `health`, `structuralContext`, and `hints` only.
- Impact: callers can rely on a documented response element that does not exist.
- Fix recommendation: emit an explicit `nextActions` payload or relax every public contract surface to the actual output shape.
- Disposition: `active`

### P1-002
- Title: Root checklist evidence still relies on a stale implementation summary
- Dimension: `correctness`
- File: `.opencode/specs/system-spec-kit/024-compact-code-graph/implementation-summary.md:110-111`, `.opencode/specs/system-spec-kit/024-compact-code-graph/checklist.md:162-177`
- Evidence: the root checklist cites `implementation-summary.md` as proof that Phase 015/016 follow-through shipped, while the same summary still marks those items deferred/partial.
- Impact: root packet verification evidence is internally inconsistent and cannot be trusted during resume/review flows.
- Fix recommendation: update the root implementation summary to reflect later phase completion or repoint checklist evidence to the child packets that now hold the true shipped status.
- Disposition: `active`

### P1-003
- Title: Gemini SessionStart compact recovery still lacks provenance fencing
- Dimension: `security`
- File: `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts:66-72`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:108-115`
- Evidence: Gemini SessionStart injects sanitized recovered compact text directly instead of wrapping it with the provenance fence used elsewhere.
- Impact: instruction-shaped recovered transcript text is reintroduced to the model with a weaker prompt-safety boundary than the packet claims.
- Fix recommendation: wrap Gemini SessionStart recovered compact payloads with the same provenance fence contract used on other compact recovery paths, or narrow the packet claims.
- Disposition: `active`

### P1-004
- Title: Claude stop-hook autosave can choose the wrong spec folder by transcript frequency
- Dimension: `reliability`
- File: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:53-80`, `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:229-302`
- Evidence: spec-folder autodetection selects the most frequent `specs/...` path in the transcript tail and feeds it into autosave without validating active-session ownership.
- Impact: cross-packet discussions can contaminate memory saves and future resume context with the wrong packet destination.
- Fix recommendation: derive autosave target from an explicit active-session state source, or validate the detected packet before persistence.
- Disposition: `active`

### P1-005
- Title: Phase 021 still publishes the superseded `session_resume()`-first recovery contract
- Dimension: `maintainability`
- File: `.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/spec.md:71-79`, `.opencode/specs/system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/implementation-summary.md:73-90`, `AGENTS.md:75-93`
- Evidence: Phase 021 still describes `session_resume()` as the first-turn recovery entry point, while root/runtime guidance has moved to `session_bootstrap()` first.
- Impact: the packet now contains two incompatible startup-recovery source-of-truth contracts.
- Fix recommendation: truth-sync Phase 021 as historical/superseded or update it to the current bootstrap-first contract.
- Disposition: `active`

### P1-006
- Title: Phase 027's hard structural bootstrap token ceiling is not enforced in code
- Dimension: `performance`
- File: `.opencode/specs/system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/spec.md:144-147`, `.opencode/specs/system-spec-kit/024-compact-code-graph/027-opencode-structural-priming/plan.md:88-93`, `.opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:159-193`
- Evidence: Phase 027 documents a 250-400 token target with a 500-token hard ceiling, but the shared structural builder and consuming handlers never measure or truncate to that limit.
- Impact: bootstrap/recovery surfaces can silently exceed the documented structural budget as payloads grow.
- Fix recommendation: enforce a real token or length budget on the shared structural contract path, or relax the packet language to best-effort guidance.
- Disposition: `active`

### P2-001
- Title: Runtime `context-prime` copies no longer share the structural Prime Package shape
- Dimension: `completeness`
- File: `.opencode/agent/context-prime.md:125-145`, `.claude/agents/context-prime.md:124-139`, `.codex/agents/context-prime.md:124-139`
- Evidence: the OpenCode agent includes an explicit `Structural Context` section while the Claude and Codex copies omit it.
- Impact: cross-runtime startup guidance is only partially mirrored and easier to drift over time.
- Fix recommendation: align the Claude/Codex copies with the OpenCode structural Prime Package, or document the intentional runtime divergence explicitly.
- Disposition: `active-advisory`

## 4. Remediation Workstreams
- WS-1 Recovery API truth-sync: resolve P1-001 by aligning `session_bootstrap` docs/schema/handler output.
- WS-2 Root packet evidence repair: resolve P1-002 by repairing checklist-to-summary evidence paths and root shipped-status bookkeeping.
- WS-3 Hook safety and autosave hardening: resolve P1-003 and P1-004 by fencing Gemini SessionStart compact payloads and validating stop-hook autosave targets.
- WS-4 Runtime guidance parity: resolve P1-005 by truth-syncing Phase 021 to the bootstrap-first contract.
- WS-5 Structural bootstrap budget enforcement: resolve P1-006 by implementing or relaxing the Phase 027 hard ceiling.
- WS-6 Advisory runtime agent alignment: resolve P2-001 if cross-runtime `context-prime` schema parity matters for maintenance burden.

## 5. Spec Seed
- Re-state the canonical recovery contract once: `session_bootstrap()` first on fresh hookless starts, `session_resume()` for detailed follow-up.
- Move evidence ownership for Phase 015/016 completion to the child packets or refresh the root implementation summary to current truth.
- Define whether structural bootstrap budgets are hard enforced runtime limits or documentation-only targets.
- Define how stop-hook autosave selects the authoritative packet when transcripts mention multiple spec folders.

## 6. Plan Seed
- Task 1: align `session_bootstrap` public contract surfaces with live output.
- Task 2: refresh root packet closeout evidence and Phase 021 recovery tables.
- Task 3: harden Gemini compact recovery provenance fencing and Claude stop-hook autosave destination selection.
- Task 4: add or relax structural contract token ceilings in Phase 027 and runtime code.
- Task 5: optionally align `context-prime` runtime copies once the P1 work is complete.

## 7. Traceability Status

### Core Protocols
- `spec_code`: `fail`
  - Evidence: P1-001, P1-003, P1-004, P1-005, P1-006.
- `checklist_evidence`: `fail`
  - Evidence: P1-002.

### Overlay Protocols
- `skill_agent`: `fail`
  - Evidence: P1-005, P2-001.
- `agent_cross_runtime`: `fail`
  - Evidence: P1-003, P2-001.
- `feature_catalog_code`: `pass`
  - Evidence: root feature catalog section 22 plus current leaf docs for auto-priming and session resume.
- `playbook_capability`: `pass`
  - Evidence: manual playbook section 22 plus scenarios 261 and 263.

## 8. Deferred Items
- P2-001 can remain deferred if the team accepts runtime-specific `context-prime` schema drift as maintenance debt rather than a release blocker.
- No additional blocker should be deferred until the active P1 set is resolved or intentionally downgraded with evidence.

## 9. Audit Appendix

### Convergence Summary
- Total iterations: `6`
- Stop reason: `converged`
- Coverage summary: all seven configured dimensions were covered by iteration 4; iteration 5 challenged the active registry with no downgrades or new findings; iteration 6 closed the remaining overlay protocols with pass evidence and no new findings.
- Registry outcome: `P0=0`, `P1=6`, `P2=1`

### Ruled-Out Claims
- `code_graph_query.edgeType` is not dead in the live handler.
- current wrapper/README/schema do not split bootstrap-first versus resume-follow-up ordering.
- Claude hook-state permissions and compact read/clear race fixes are live.
- structural read paths do not currently perform inline reindex work on read.
- Phase 028 does not over-claim broader startup/bootstrap remediation beyond startup-highlight quality fixes.
- the older feature-catalog index mismatch and playbook scenario input issue are no longer live in the current tree.

### Sources Reviewed
- Root packet: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`
- Child phases: `006-documentation-alignment`, `015-tree-sitter-migration`, `016-cross-runtime-ux`, `019-code-graph-auto-trigger`, `021-cross-runtime-instruction-parity`, `027-opencode-structural-priming`, `028-startup-highlights-remediation`
- Runtime/docs: `.opencode/command/spec_kit/resume.md`, `AGENTS.md`, `.opencode/skill/system-spec-kit/references/config/hook_system.md`, `.opencode/skill/system-spec-kit/mcp_server/README.md`
- Implementation: `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`, `code-graph/query.ts`, `code-graph/context.ts`, `ensure-ready.ts`, `session-snapshot.ts`, `startup-brief.ts`, Claude/Gemini compact/session hooks
- Overlay surfaces: feature catalog section 22, manual playbook section 22, `.opencode/agent/context-prime.md`, `.claude/agents/context-prime.md`, `.codex/agents/context-prime.md`, deep-review runtime docs

### Cross-Reference Appendix

#### Core Protocols
- `spec_code`: failed on bootstrap contract drift, hook/runtime parity drift, and structural-budget claim drift.
- `checklist_evidence`: failed on stale root implementation-summary evidence.

#### Overlay Protocols
- `skill_agent`: failed on stale Phase 021 recovery guidance and runtime `context-prime` schema drift.
- `agent_cross_runtime`: failed on Claude/Gemini compact recovery parity and runtime `context-prime` schema drift.
- `feature_catalog_code`: passed on current section-22 catalog coverage.
- `playbook_capability`: passed on current section-22 manual-playbook coverage.
