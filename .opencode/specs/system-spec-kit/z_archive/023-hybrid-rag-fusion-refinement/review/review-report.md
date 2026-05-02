# Review Report — ESM Module Compliance (spec-023 rerun)

## 1. Executive Summary
- Verdict: `CONDITIONAL`
- Iterations executed: `20`
- Active findings: `P0=0 P1=5 P2=4`
- Rerun posture: fresh 20-iteration root-packet review using current-tree evidence, with archived reviews treated as reference-only.

## 2. Planning Trigger
- Use `/spec_kit:plan` if you want the active P1/P2 findings converted into remediation tasks.

## 3. Active Finding Registry
### P1-023-001: Scripts boundary still uses direct sibling imports instead of a consistently explicit interop seam
- Severity: `P1`
- Dimension: `D1 Correctness`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md:116`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/tasks.md:60`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/checklist.md:46`
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:59`
- Evidence: `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:16`
- Evidence: `.opencode/skill/system-spec-kit/scripts/evals/run-performance-benchmarks.ts:17`
- Impact: The packet claims the CommonJS scripts package now crosses a clean explicit interop boundary, but the current tree still contains direct sibling imports from a CommonJS package into migrated ESM packages.

### P1-023-002: Node 25 interoperability proof is recorded as shipped while package engines still advertise Node 20.11 as sufficient
- Severity: `P1`
- Dimension: `D1 Correctness`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md:46`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md:73`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md:84`
- Evidence: `.opencode/skill/system-spec-kit/scripts/package.json:7`
- Evidence: `.opencode/skill/system-spec-kit/shared/package.json:19`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/package.json:40`
- Impact: The runtime-compatibility story is internally inconsistent: the packet celebrates Node 25-native `require(esm)` proof, but the shipped manifests still promise a lower engine floor.

### P2-023-003: V-rule bridge is still optionally fail-open under an environment toggle
- Severity: `P2`
- Dimension: `D2 Security`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md:61`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:88`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/handlers/v-rule-bridge.ts:103`
- Impact: The packet implies the validator bridge now fails closed, but the current handler still permits an allow-by-default bypass when optional mode is enabled.

### P1-023-004: Root packet completion state is internally contradictory against the shipped implementation surfaces
- Severity: `P1`
- Dimension: `D3 Traceability`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md:35`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md:95`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md:100`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md:101`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md:102`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md:103`
- Impact: The root packet still contains pending-state language and draft child-phase references even though the implementation surfaces and summary describe completed migration work.

### P1-023-005: Standards-doc completion claim is sequenced inconsistently with the packet’s own verification timeline
- Severity: `P1`
- Dimension: `D3 Traceability`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/spec.md:126`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/plan.md:46`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/plan.md:47`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/tasks.md:71`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/tasks.md:75`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/checklist.md:78`
- Impact: REQ-007 says standards docs stay deferred until runtime proof passes, but the root packet records the standards sync as already complete in an earlier phase than the stated verification gate.

### P2-023-006: Phase-count bookkeeping drifts between five and six phases across root packet surfaces
- Severity: `P2`
- Dimension: `D3 Traceability`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md:3`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md:34`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md:36`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md:56`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/tasks.md:76`
- Evidence: `.opencode/specs/system-spec-kit/023-hybrid-rag-fusion-refinement/checklist.md:77`
- Impact: The packet does not maintain a stable count of migration phases, which weakens cross-surface traceability for closeout and review follow-through.

### P1-023-007: CLI `--session-id` save path is wired through the surface but dropped before workflow capture
- Severity: `P1`
- Dimension: `D6 Reliability`
- Evidence: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:398`
- Evidence: `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:562`
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:265`
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:589`
- Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:791`
- Evidence: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:832`
- Impact: The operator-facing flag suggests deterministic session targeting, but the current workflow never consumes it and may save against a different synthesized session id.

### P2-023-008: Startup and recovery guidance still diverges between `session_resume` and `session_bootstrap` entrypoints
- Severity: `P2`
- Dimension: `D4 Maintainability`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:662`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:679`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:680`
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:737`
- Impact: Non-hook clients still receive mixed recovery guidance from the runtime itself, which makes the intended first-call path harder to preserve consistently across wrappers and docs.

### P2-023-009: Folder-wide duplicate hashing adds avoidable latency to the hot save path
- Severity: `P2`
- Dimension: `D5 Performance`
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1447`
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1663`
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1669`
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:94`
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:105`
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:129`
- Impact: Each save still rescans and rehashes the whole target folder after preflight, so save latency grows with folder history even on the normal non-duplicate path.

## 4. Remediation Workstreams
- WS-1 Packet truth-sync: reconcile root status, phase counts, and standards-doc sequencing across spec/plan/tasks/checklist/implementation-summary.
- WS-2 Scripts boundary contract: either make the interop seam explicit in code/docs or narrow the packet claim to what the current tree actually guarantees.
- WS-3 Runtime/save-path semantics: honor explicit session targeting, clarify recovery-first-call guidance, and reduce duplicate hashing on the hot save path.
- WS-4 Security wording: truth-sync the V-rule bridge posture so docs match the optional fail-open runtime toggle.

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
