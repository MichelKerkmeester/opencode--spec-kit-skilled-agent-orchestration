# Iteration 3 — Traceability

## Dimension

D3 Traceability: spec/code alignment, checklist evidence, feature catalog consistency, manual playbook coverage, ADR mapping, cross-runtime path references, and test-to-invariant coverage.

## Files Reviewed

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/watcher.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/daemon/lease.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/derived/sync.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/schema-migration.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/01-five-lane-fusion.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/06-weights-config.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/06--mcp-surface/01-advisor-recommend.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/06--mcp-surface/03-advisor-validate.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/05--auto-update-daemon/003-daemon-lifecycle-shutdown.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/05--auto-update-daemon/005-rebuild-from-source.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/04--operator-h5/003-unavailable-daemon.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/03--compat-and-disable/004-daemon-absent-fallback.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts`

## Findings — P0

None.

## Findings — P1

### DR-008-D3-P1-001 — Active review invariants are not mapped to regression tests

The iteration prompt asked for a P1 if all four active issue invariants lacked test coverage. That condition holds.

Evidence:

- `advisor_recommend` only fail-opens for `freshness === 'absent'` before scoring; unavailable freshness continues into `scoreAdvisorPrompt()` via `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:161` and `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:195`.
- The handler tests cover disabled, absent, and stale states, but the direct MCP unavailable branch is absent from the adjacent coverage: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:238`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:249`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:338`.
- `skill_graph_scan` is registered as a public dispatcher path and calls the scan handler directly: `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:16`, `.opencode/skill/system-spec-kit/mcp_server/tools/skill-graph-tools.ts:53`.
- The scan handler indexes and publishes a live generation with no caller-authority input or check: `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:25`, `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:40`, `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:42`.
- Existing daemon tests cover watcher backoff, single-writer lease, and generation publication, but not concurrent corruption rebuild safety: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts:187`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts:307`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/daemon-freshness-foundation.vitest.ts:320`.
- Error-envelope coverage redacts prompt fields, but it does not assert filesystem path redaction for advisor diagnostics: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:355`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-status.vitest.ts:97`.

Concrete fix:

Add regression tests for the four active invariants: direct `advisor_recommend` unavailable fail-open, external/public `skill_graph_scan` rejection without trusted authority, concurrent corruption rebuild serialization, and advisor diagnostic filesystem-path redaction.

## Findings — P2

### DR-008-D3-P2-001 — The public scan authority boundary is under-specified in docs and playbooks

This is not a duplicate of DR-008-D2-P1-001's implementation bug. The traceability issue is that the packet never declares the authority contract the implementation should satisfy.

Evidence:

- `spec.md` names only `advisor_recommend`, `advisor_status`, and `advisor_validate` as the MCP advisor tools: `spec.md:76`.
- `REQ-006` likewise accepts only the three advisor tool contracts: `spec.md:116`.
- The actual public MCP schema exposes `skill_graph_scan` as a maintenance tool with only optional `skillsRoot` input and no authority/session/caller field: `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:673`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:676`.
- OP-003 instructs operators to call `skill_graph_scan({})` for corrupt-state recovery but has no negative scenario for an external or untrusted caller: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/04--operator-h5/003-unavailable-daemon.md:47`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/04--operator-h5/003-unavailable-daemon.md:50`.

Concrete fix:

Add a requirement and ADR note for maintenance-tool authority, then add a manual playbook negative test that an external caller cannot invoke `skill_graph_scan` to reindex/publish generation.

### DR-008-D3-P2-002 — Feature catalog and implementation disagree on the derived lane live weight

The catalog and implementation summary claim `derived_generated` is capped at `0.10`, but the canonical runtime config gives it `0.15`. That weakens traceability for REQ-004's generated-signal trust-lane contract.

Evidence:

- The implementation summary says native scoring uses `derived_generated (0.10)`: `implementation-summary.md:120`.
- The five-lane feature catalog repeats `derived_generated 0.10`: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/01-five-lane-fusion.md:3`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/01-five-lane-fusion.md:38`.
- The weights-config catalog also says `derived_generated: 0.10`: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/04--scorer-fusion/06-weights-config.md:31`.
- Runtime source of truth sets `DERIVED_GENERATED_WEIGHT = 0.15`: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts:8`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/weights-config.ts:11`.

Concrete fix:

Either restore the intended `0.10` cap in `weights-config.ts`, or update the implementation summary, feature catalog, and any acceptance text to document `0.15` as the shipped generated-lane cap.

### DR-008-D3-P2-003 — Promotion-gate traceability points to a missing named gate-bundle artifact

The packet claims a named promotion gate bundle, but the code surface reviewed exposes validation slices rather than the documented `lib/promotion/gate-bundle.ts` artifact with named failed gates.

Evidence:

- `implementation-summary.md` claims `lib/promotion/gate-bundle.ts` evaluates 12 named gates and produces named failed gates: `implementation-summary.md:129`.
- No `skill_advisor/lib/promotion/gate-bundle.ts` file exists in the reviewed runtime tree; the actual validation handler builds `slices` inline under corpus, holdout, parity, safety, and latency: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts:420`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts:453`.
- The only ADR collapses promotion gates into one implementation note and does not define the named gate-bundle contract: `decision-record.md:57`, `decision-record.md:59`.

Concrete fix:

Either add the missing promotion gate-bundle artifact with named gate results, or rewrite the spec/summary/catalog to say promotion is currently represented by `advisor_validate` slice outputs rather than a standalone gate bundle.

## Traceability Checks

### T1 — spec_code

Status: partial.

REQ mapping:

| Requirement | Implementation evidence | Status |
| --- | --- | --- |
| REQ-001 graph daemon refresh | `watcher.ts` discovers `SKILL.md` / `graph-metadata.json` / derived key files at lines 169-184 and publishes generation after reindex through `publishSkillGraphGeneration()` at lines 13 and 136-138 in tests. | pass |
| REQ-002 single writer lease | `lease.ts` stores one row per workspace and rejects held leases at lines 119-146; tests assert second writer rejection at `daemon-freshness-foundation.vitest.ts:307-315`. | pass |
| REQ-003 native safe decisions | `advisor-validate.ts` computes Python parity regressions at lines 235-247 and emits parity output at lines 436-445. | pass |
| REQ-004 derived metadata separated | `sync.ts` writes `trust_lane: 'derived_generated'` at lines 94-103. | pass with DR-008-D3-P2-002 weight drift |
| REQ-005 additive/reversible migration | `schema-migration.ts` preserves metadata spread and adds `schema_version: 2` / `derived` at lines 32-42; mixed-version readers remain routable at lines 45-57. | pass |
| REQ-006 advisor tool contracts | `tools/index.ts` registers `advisor_recommend`, `advisor_status`, `advisor_validate` at lines 53-67. | pass |
| REQ-007 compatibility shims | Evidence exists in implementation summary and compat package references, but root docs still cite stale legacy/hyphen paths; prior DR-008-D1-P2-002 covers the drift. | partial |
| REQ-008 promotion gates | `advisor_validate` exposes corpus/parity/safety/latency slices, but the named `gate-bundle.ts` implementation claimed by docs is missing. | partial, DR-008-D3-P2-003 |
| REQ-009 operator docs | Playbooks exist for corruption, restart, absent/unavailable behavior, but not external public scan authority. | partial, DR-008-D3-P2-001 |
| REQ-010 strict validation | Still open in `spec.md:125`, `plan.md:109`, and checklist `CHK-021`. | fail; prior DR-008-D1-P2-003 |

Seven shipped sub-tracks are visible in `implementation-summary.md:48-56`. Six have clear implementation footprints. Promotion gates are the weak one: validation slices exist, but the claimed named gate bundle does not.

### T2 — checklist_evidence

Status: fail.

Completed checklist items with no file:line citation: 16 of 16.

Examples:

- `CHK-001` cites `implementation-summary.md` without line anchor: `checklist.md:43`.
- `CHK-002` cites `plan.md` without line anchor: `checklist.md:44`.
- `CHK-003` cites ADR-001 through ADR-007, while `decision-record.md` contains only ADR-001 in the reviewed range: `checklist.md:45`, `decision-record.md:29`.
- `CHK-010` cites "children convergence log" without a line anchor: `checklist.md:53`.
- `CHK-023` cites "child 006 row", but the implementation summary row labels promotion gates as child 007: `checklist.md:67`, `implementation-summary.md:56`.
- `CHK-040` cites "current root docs" without file:line evidence: `checklist.md:85`.

Prior DR-008-D1-P2-001 already owns the finding. This iteration only quantifies it.

### T3 — feature_catalog_code

Status: fail.

Advisor catalog entries exist under `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/`. The MCP tool catalog is mostly consistent with the actual `advisor_*` tool surface, but scorer catalogs and docs disagree with runtime on `derived_generated` weight (`0.10` claimed vs `0.15` implemented). See DR-008-D3-P2-002.

The catalog set does not document `skill_graph_scan` as an advisor capability, which matches its location as a broader skill graph tool, but that leaves the public maintenance scan authority boundary undocumented alongside the advisor recovery playbooks.

### T4 — playbook_capability

Status: partial.

- Corrupt DB recovery: present in AU-005 and OP-003.
- Daemon restart: present in AU-003.
- Advisor unavailable mode: present in OP-003, partial in CP-004 for absent fallback.
- Public scan from external caller: missing. No playbook reviewed asserts that an external caller is blocked from `skill_graph_scan`, while OP-003 uses `skill_graph_scan({})` as a remediation step.

### T5 — hyphen_vs_underscore drift quantification

Status: fail, prior finding remains active.

Targeted drift count for runtime package paths in root docs: 6 instances of `mcp_server/skill-advisor` where runtime uses `mcp_server/skill_advisor`.

- `spec.md:32`
- `spec.md:91`
- `decision-record.md:39`
- `implementation-summary.md:44`
- `implementation-summary.md:114`
- `implementation-summary.md:120`

Related stale runtime reference: `spec.md:92` names `.opencode/skill/skill-advisor/scripts/skill_advisor.py`, while the shipped native shim is under `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`.

### T6 — ADR implementation

Status: partial.

`decision-record.md` contains only ADR-001. It maps to the self-contained package boundary and compatibility adapter strategy, but not to separate decisions for freshness, schema migration, promotion gates, public scan trust, or derived lane weight. Public MCP scan trust is implicit, not recorded.

### T7 — cross-runtime references

Status: partial.

The packet spans TypeScript MCP, Python shim, and plugin bridge, but docs mix current and stale paths:

- Current runtime directory exists as `.opencode/skill/system-spec-kit/mcp_server/skill_advisor`.
- Docs repeatedly cite `.opencode/skill/system-spec-kit/mcp_server/skill-advisor`.
- The plugin root `.opencode/plugins/spec-kit-skill-advisor.js` exists, while the implementation summary also discusses `spec-kit-skill-advisor-bridge.mjs`; the actual MCP bridge lives under `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`.

### T8 — test_invariant mapping

Status: fail.

All four requested invariant checks are missing direct regression coverage:

- `unavailableOutput()`/direct unavailable fail-open for `advisor_recommend`: missing.
- Public-scan auth boundary: missing.
- Corruption rebuild concurrency safety: missing.
- Filesystem path leakage in advisor diagnostics: missing.

This is logged as DR-008-D3-P1-001.

## Claim Adjudication Packets

### DR-008-D3-P1-001

- Claim: Tests cover the shipped advisor invariants.
- Evidence for claim: Handler tests cover happy path, disabled, absent, stale, cache, sanitization, and dispatcher registration.
- Counter-evidence: The active finding invariants requested for this pass are not directly tested; see `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:238`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:249`, `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts:338`, and `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts:25-48`.
- Adjudication: fail. New P1 because all four requested active invariants lack targeted regression tests.

### DR-008-D3-P2-001

- Claim: The public scan trust model is traceable.
- Evidence for claim: `skill_graph_scan` is documented as a maintenance tool and appears in operator recovery playbooks.
- Counter-evidence: Spec only declares the three advisor tools (`spec.md:76`, `spec.md:116`), schema exposes no caller-authority input (`tool-schemas.ts:673-681`), and OP-003 uses the scan with no external-caller negative scenario (`003-unavailable-daemon.md:47-52`).
- Adjudication: fail. New P2 under-specified contract/playbook gap.

### DR-008-D3-P2-002

- Claim: Feature catalog lane weights match runtime.
- Evidence for claim: Catalog and implementation summary agree with each other that derived generated weight is `0.10`.
- Counter-evidence: Runtime `weights-config.ts` sets `DERIVED_GENERATED_WEIGHT = 0.15`.
- Adjudication: fail. New P2 catalog/code drift.

### DR-008-D3-P2-003

- Claim: Promotion gates are implemented by the documented gate bundle.
- Evidence for claim: Implementation summary explicitly names `lib/promotion/gate-bundle.ts`.
- Counter-evidence: No such file exists in the reviewed `skill_advisor` tree; actual `advisor_validate` emits validation slices inline rather than named failed gates.
- Adjudication: fail. New P2 traceability gap.

## Verdict

CONDITIONAL.

Cumulative findings after iteration 3: P0=0, P1=3, P2=9. Traceability coverage is materially better after this pass, but the active P1 count increases because the requested test-invariant mapping failed for all four active issue classes.

## Next Dimension

D4 Maintainability.
