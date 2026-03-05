# Historical Review: Specs 003–005

## Spec 002 – Index Tier Anomalies
### Completed work
- Delivered deterministic indexing through canonical-path dedup, merged-file gating, and normalized tier precedence across `memory-parser.ts`, `memory-index.ts`, and `importance-tiers.ts`; tests cover parser, handler, and tier utilities plus targeted regression/extended suites (`implementation-summary.md`). [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/implementation-summary.md`]
- Verification included targeted 52-test suite, extended 186-test parser/spec suite, scoped ESLint, and spec validation; documentation (plan, tasks, decision log) synchronized with delivery. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/implementation-summary.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/checklist.md`]

### Outstanding anomalies
- **P0 gap:** `CHK-011` (no console errors/warnings) remained unchecked, so CLI/handler logging still needs explicit confirmation before broader roll-out (`checklist.md`).
- **P1 gap:** `CHK-032` (confirming no unsafe filesystem traversal) was left unchecked despite canonicalization changes to the discovery path, so a focused review/test is still pending (`checklist.md`).
- **Meta limitations:** project-wide lint still failing outside this spec's touched files; historical duplicate-memory-row cleanup wasn’t addressed, leaving cleanup work for downstream efforts (`implementation-summary.md` limitations).
- **Deferred controls:** P1/P2 audit items (rollback procedure, monitoring/alerting/runbook, security/dependency reviews, OWASP/data handling, user-facing notes) remain open and should be tracked before productionizing the hybrid RAG logic (`checklist.md`).

## Spec 004 – Frontmatter Indexing
### Completed work
- Normalized frontmatter across template/spec/memory corpora, executed migration with apply/dry-run (idempotent: `changed 0` second pass), rebuilt indexes twice with `STATUS=OK`, and validated no generic `SESSION SUMMARY` leakage; build + template compose, migration dry-runs, frontmatter/backfill/security tests all passed (`implementation-summary.md`).
- Delivery ensured quality coverage via `npm run build`, template compose scripts, template/test suites, and migration/reindex reports (scratch artifacts hold proofs and audit notes).

### Outstanding anomalies
- Multiple deferred P2 controls remain: `CHK-052` (no summary saved to memory), `CHK-112` (load-style replay), `CHK-113` (performance delta docs), `CHK-124` (deployment runbook review), `CHK-132`/`CHK-133` (OWASP/data-handling reviews), and `CHK-142` (user-facing docs) are still open and flagged as out-of-scope by the remediation plan (`checklist.md`). [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/checklist.md`]
- Performance/monitoring/runbook items (`CHK-110`, `CHK-111`, `CHK-122`, `CHK-123`) were deferred with scope approval, so real-time observability and operational playbooks for normalization/rebuild remain to be created before releasing hybrid improvements (`checklist.md`). [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/checklist.md`]
- Known limitation: legacy archive invalid-anchor warnings persisted during reindex but were treated as non-blocking; cleanup and warning resolution still pending (`implementation-summary.md` limitations). [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md`]
- Sign-off rows (Technical Lead, Product Owner, QA) remain unchecked, so formal approvals haven’t been captured (`checklist.md`). [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/checklist.md`]

## Spec 002 – Auto-Detected Session Bug
### Completed work
- Confirmed session selection detector behavior via `test-folder-detector-functional.js` (32/0/0), verification of resume/handover command docs, and review gate (score 88/100) with no P0/P1 findings; no source change was needed beyond test coverage (`implementation-summary.md`).
- Validation includes spec folder validator command and confirmation that runtime/dist detector artifacts were already aligned, so the logic is stable for resumed sessions.

### Outstanding anomalies
- `CHK-052` (memory snapshot save) is the only P2 item still deferred because the pass intentionally skipped memory generation; capture the snapshot if future work requires a rollback/context trace (`checklist.md`).
- Known limitation: residual audit risk if future detector tweaks erode mtime resilience, so any refactor must rerun the regression suite to avoid ranking bias creep (`implementation-summary.md`).

## Contradictions or drift
- No contradictory requirements surfaced across specs; the remaining drifts are deferred validation/checklist controls and housekeeping items rather than conflicting decisions. [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/decision-record.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/decision-record.md`] [SOURCE: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-auto-detected-session-bug/spec.md`]

## Key files for reference
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/implementation-summary.md` (deterministic indexing/tier normalization + limitations)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-index-tier-anomalies/checklist.md` (remaining P0/P1/P2 controls and deferred compliance items)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/implementation-summary.md` (frontmatter normalization delivery, migration evidence, known limitations)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-frontmatter-indexing/checklist.md` (deferred load/perf/operational/compliance controls + sign-off)
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-auto-detected-session-bug/implementation-summary.md` (detector stabilization and review gate) 
- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-auto-detected-session-bug/checklist.md` (single deferred memory snapshot control)

## Dependency map into Spec 006
1. **Canonical path and tier determinism (Spec 002)** ensures hybrid RAG logic improvements can ingest fused index content without duplicating alias-root rows or mis-ranking tiers; controller and scoring layers in Spec 006 can assume unique canonical file sets and deterministic importance tiers.
2. **Frontmatter normalization/reindex (Spec 004)** provides cleaned metadata and migration artifacts so Spec 006’s logic enhancements can rely on consistent frontmatter across templates/memory records and use the refreshed index cache without encountering stale `SESSION SUMMARY` entries.
3. **Stable auto-detected session selection (Spec 002)** guarantees Spec 006 commands operate on the intended active non-archived specs, keeping detector behavior deterministic even with mtime noise and preventing hybrid logic from pulling archived context.
