# Audit C-08: Protocol & Ledger Alignment
## Summary
| Metric | Value |
|--------|-------|
| Protocol scenarios | 4 |
| Ledger entries | 2 |
| Matched | 4 |
| Orphaned | 2 |

## Issues [ISS-C08-NNN]
### ISS-C08-001
- The review protocol lists `M-001`, `M-002`, `M-003`, and `M-004` as the mandatory playbook flows (`manual_testing_playbook/review_protocol.md:43-49`).
- All four IDs appear in the playbook with the same numbering, titles, and order (`manual_testing_playbook/manual_testing_playbook.md:398-431`).
- Result: there is no scenario-ID mismatch between the review protocol and the playbook.

### ISS-C08-002
- The ledger is not complete as a dispatched-agent log. It captures only two aggregate runtime summaries (`Run A` and `Run B`) with capacity and saturation data, not the actual dispatched agents, per-wave assignments, or scenario ranges (`manual_testing_playbook/subagent_utilization_ledger.md:3-28`).
- This is incomplete against the ledger's own merged rule set, which requires explicit scenario IDs/ranges per wave plus a recorded utilization report (`manual_testing_playbook/subagent_utilization_ledger.md:30-37`).
- The playbook also defines an explicit `@review` handoff in `M-004`, but no ledger row records that agent dispatch (`manual_testing_playbook/manual_testing_playbook.md:425-431`).

### ISS-C08-003
- There are no ledger rows for named runtimes that are absent from the broader playbook corpus: `Codex 5.3 xhigh` and `Gemini 3.1 Pro Preview` are both named in the playbook introduction (`manual_testing_playbook/manual_testing_playbook.md:3-10`).
- However, both ledger entries are orphaned from the review protocol itself because `review_protocol.md` contains no runtime identifiers, wave IDs, or other keys that connect a protocol execution to `Run A` or `Run B` (`manual_testing_playbook/review_protocol.md:1-49`, `manual_testing_playbook/subagent_utilization_ledger.md:3-28`).
- Result: there is no end-to-end traceability path from a review-protocol execution to a specific ledger entry.

### ISS-C08-004
- Formatting is only partially consistent. Both documents use a top-level title plus Markdown sections/tables, but they do not share a common traceability schema: the review protocol is rule/bullet based while the ledger is run-log based (`manual_testing_playbook/review_protocol.md:3-49`, `manual_testing_playbook/subagent_utilization_ledger.md:3-37`).
- File/path naming is inconsistent and currently broken:
  - `review_protocol.md` refers to `manual-test-playbooks.md` and a `manual-testing-playbook/` directory that do not exist in the checked-in folder (`manual_testing_playbook/review_protocol.md:4,34,40,44`).
  - `subagent_utilization_ledger.md` likewise points at `manual-testing-playbook/memory/...` sources that are not present under the actual `manual_testing_playbook/` directory (`manual_testing_playbook/subagent_utilization_ledger.md:5-6,19-20`).
- The actual files in this folder use underscores (`manual_testing_playbook.md`, `review_protocol.md`, `subagent_utilization_ledger.md`), so cross-document reference formatting is out of sync with the repository structure.
