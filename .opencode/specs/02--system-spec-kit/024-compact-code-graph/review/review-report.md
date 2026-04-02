# Review Report — Compact Code Graph (spec-024 rerun)

## 1. Executive Summary
- Verdict: `CONDITIONAL`
- Iterations executed: `20`
- Active findings: `P0=0 P1=7 P2=3`
- Rerun posture: fresh 20-iteration root-packet review using current-tree evidence, with archived reviews treated as reference-only.

## 2. Planning Trigger
- Use `/spec_kit:plan` if you want the active P1/P2 findings converted into remediation tasks.

## 3. Active Finding Registry
### P1-024-001: Root packet still points reviewers at non-existent hook/build/API paths
- Severity: `P1`
- Dimension: `D3 Traceability`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:172`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:180`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:99`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:229`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:230`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:56`
- Impact: Operators following the root packet land on stale or missing paths rather than the shipped hook surfaces, so packet-to-runtime traceability is broken.

### P1-024-002: Root packet records the resume-profile remediation as complete while the canonical wrapper still shows the stale call shape
- Severity: `P1`
- Dimension: `D3 Traceability`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:77`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:126`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/decision-record.md:97`
- Evidence: `.opencode/command/spec_kit/resume.md:259`
- Evidence: `.opencode/command/spec_kit/resume.md:354`
- Impact: The root packet marks a wrapper-level fix as shipped even though the wrapper doc still presents the older bare `memory_context({ mode: "resume" })` contract.

### P1-024-003: Deferred-item ledger is internally inconsistent about which remediation remains open
- Severity: `P1`
- Dimension: `D7 Completeness`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:301`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/plan.md:334`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/tasks.md:111`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/tasks.md:104`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/015-tree-sitter-migration/checklist.md:82`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/spec.md:108`
- Impact: The root packet cannot consistently tell reviewers which single deferred item still exists, so closure status is unreliable.

### P1-024-004: Canonical hookless recovery path suppresses the actual resume payload
- Severity: `P1`
- Dimension: `D6 Reliability`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:116`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:122`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md:584`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:58`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:59`
- Impact: The packet and public README frame `session_bootstrap` as the first-call recovery surface that returns context, but the implementation always forces minimal mode and skips memory resume content.

### P1-024-005: `code_graph_query` exposes an `edgeType` filter that the handler never honors
- Severity: `P1`
- Dimension: `D1 Correctness`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:645`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/README.md:1040`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:149`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:167`
- Impact: The structural-query surface advertises an option users cannot actually rely on, which is a direct command/runtime contract break.

### P2-024-006: Structural read paths can block on synchronous auto-reindex work
- Severity: `P2`
- Dimension: `D5 Performance`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:102`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:89`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:35`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts:203`
- Impact: Normal read-only graph queries may absorb up to 10 seconds of inline indexing work, coupling query latency to maintenance side effects.

### P2-024-007: Recovery guidance is still split between `session_resume` and `session_bootstrap` across active runtime surfaces
- Severity: `P2`
- Dimension: `D4 Maintainability`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/checklist.md:77`
- Evidence: `.opencode/command/spec_kit/resume.md:259`
- Evidence: `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml:79`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:662`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:679`
- Evidence: `.opencode/skill/system-spec-kit/references/config/hook_system.md:50`
- Impact: The current recovery story still requires maintainers to mentally reconcile multiple “first call” recommendations across wrappers, server hints, and docs.

### P1-024-008: Root packet overstates shipped compaction behavior as a true three-source merge
- Severity: `P1`
- Dimension: `D1 Correctness`
- Evidence: `.opencode/specs/02--system-spec-kit/024-compact-code-graph/implementation-summary.md:82`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:200`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:206`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:236`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:239`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:254`
- Impact: The implementation summary describes memory, structural, and semantic context as already merged into the compaction payload, but the live Claude path still feeds empty memory sections into the merger and appends surfaced memories only afterward.

### P1-024-009: Dispatch-time graph enrichment reflects arbitrary existing local paths back to callers
- Severity: `P1`
- Dimension: `D2 Security`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:327`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:332`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:337`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:347`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:357`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:467`
- Impact: A caller can probe whether guessed local files exist by passing path-like values and observing which ones are echoed back in dispatch metadata, creating a filesystem existence oracle outside the indexed workspace.

### P2-024-010: Compaction recovery sanitizer still allows most instruction-like transcript text to survive reinjection
- Severity: `P2`
- Dimension: `D2 Security`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:91`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts:97`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:227`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:231`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:67`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:72`
- Impact: Only a narrow set of system-like prefixes are stripped, so instruction-like transcript content can persist across compaction and be promoted back into model-visible recovery context.

## 4. Remediation Workstreams
- WS-1 Root packet truth-sync: repair stale path maps, wrapper-completion claims, and deferred-item bookkeeping.
- WS-2 Recovery contract: align `session_bootstrap`, `session_resume`, server hints, and wrapper docs to one explicit first-call story.
- WS-3 Structural-query contract: either implement `edgeType` or remove it from the public surface, and decouple read paths from inline reindex side effects.
- WS-4 Compaction/dispatch hardening: narrow path extraction to indexed scope and strengthen transcript reinjection sanitization.

## 5. Spec Seed
- The rerun confirms the next spec packet should be a remediation/closure packet rather than a new feature packet.

## 6. Plan Seed
- Start with the highest-severity packet/runtime contract drifts, then rerun deep review after each remediation wave.

## 7. Traceability Status
- Root packet and live runtime/doc surfaces still diverge on active claims; traceability remains an open release-readiness concern.

## 8. Deferred Items
- Advisory-only items can remain deferred only after the active P1 findings are truth-synced or fixed.

## 9. Audit Appendix
- 20 fresh iterations were recorded in `review/iterations/iteration-001.md` through `iteration-020.md`.
- JSONL state rebuilt for this rerun under `review/deep-research-state.jsonl`.
- Verdict rule: no P0, but active P1 findings remain, so the rerun stays CONDITIONAL.
