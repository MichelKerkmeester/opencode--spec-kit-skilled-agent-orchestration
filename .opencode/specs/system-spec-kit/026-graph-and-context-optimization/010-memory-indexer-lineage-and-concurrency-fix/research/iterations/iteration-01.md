## Iteration 01

### Focus
Packet-level restatement of the recent fix packet: what exactly changed, which failure modes it targeted, and which verification gap still remains open.

### Findings
- The packet narrows the remediation to two defects: cross-file PE `UPDATE`/`REINFORCE` decisions causing `E_LINEAGE`, and scan-originated transactional rechecks causing `candidate_changed` during `memory_index_scan`. (`spec.md §2. PROBLEM & PURPOSE`)
- The intended fix shape is explicitly surgical: preserve PE search/scoring, downgrade unsafe cross-file decisions at orchestration time, and thread a scan-only `fromScan: true` flag so normal `memory_save` behavior stays unchanged. (`plan.md §1. SUMMARY`, `plan.md §3. ARCHITECTURE`)
- The code-level acceptance story is incomplete by design: focused regressions, `typecheck`, `build`, and packet validation passed, but the live packet rerun on `026/009-hook-daemon-parity` is still blocked on an MCP restart plus embedding availability. (`tasks.md §Phase 3: Verification`, `implementation-summary.md §Verification`, `checklist.md §Testing`)
- The packet's own decision log records that A+B1 eliminated `E_LINEAGE` but increased `candidate_changed`, which is why B2 replaced B1 before this research phase started. (`implementation-summary.md §Key Decisions`)

### New Questions
- Where is the cross-file downgrade enforced in code, and does it preserve same-file `UPDATE`/`REINFORCE` behavior?
- How does canonical-path handling behave when older rows do not yet have `canonical_file_path` populated?
- Exactly which transactional check is skipped when `fromScan` is true, and what still runs?
- What concurrency protection remains once the scan path bypasses that transactional recheck?

### Status
new-territory
