---
title: "Deep Review Report: Upgrade Safety Operability"
description: "Read-only release-readiness audit of upgrade safety and operability. CONDITIONAL verdict: 0 P0, 3 P1, 2 P2 across correctness, security, traceability, and maintainability."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: review-report-core | v2.2 -->"
trigger_phrases:
  - "045-010-upgrade-safety-operability"
  - "upgrade safety audit"
  - "operability review"
  - "install guide review"
  - "doctor mcp install review"
importance_tier: "important"
contextType: "review"
---
# Deep Review Report: Upgrade Safety Operability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: review-report-core | v2.2 -->

---

## 1. Executive Summary

Verdict: **CONDITIONAL**. I found no P0 release blockers: current package scripts expose `npm test`, `npm run stress`, and `npm run hook-tests`; the stress-test relocation has no source references to the old paths; DB schema code has transaction rollback plus checkpoint tooling; and the hydra migration slice passes.

The release is not operability-clean yet. Three P1 gaps need remediation before calling the upgrade path ready: Node prerequisite drift lets install/doctor guidance accept unsupported Node versions, doctor falsely reports VS Code/Copilot MCP wiring as missing, and an existing older spec folder no longer passes strict validation under the current validator. Two P2 advisories cover stale feature-flag notes and permissive checked-in runtime config posture.

---

## 2. Planning Trigger

Plan a focused remediation pass before release sign-off. The highest-value work is small and concrete: align the Node floor to `>=20.11.0`, teach doctor to understand VS Code's `servers` key or migrate that config, and decide whether legacy template-header deviations should be grandfathered or migrated.

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence |
|----|----------|-----------|-------|----------|
| UPGRADE-SAFETY-001 | P1 | Correctness | Install and doctor prerequisites still accept Node 18 even though the packages require Node >=20.11.0 | `.opencode/skill/system-spec-kit/package.json:11-13`, `.opencode/skill/system-spec-kit/mcp_server/package.json:46-48`, `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:19`, `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md:155-158`, `.opencode/command/doctor/assets/doctor_mcp_install.yaml:149-158`, `.opencode/skill/system-spec-kit/scripts/setup/install.sh:24` |
| UPGRADE-SAFETY-002 | P1 | Traceability | Doctor can falsely diagnose VS Code/Copilot MCP servers as missing because it checks `mcpServers` while the checked-in config uses `servers` | `.vscode/mcp.json:3-45`, `.opencode/command/doctor/scripts/mcp-doctor.sh:481-486`, `.opencode/command/doctor/scripts/mcp-doctor-lib.sh:187-207`; live `mcp-doctor.sh --json` returned 33 pass, 6 warn, 0 fail, including four `.vscode/mcp.json` "not wired" warnings |
| UPGRADE-SAFETY-003 | P1 | Correctness | Backwards-compat strict validation fails for existing packet `026/005-memory-indexer-invariants` | `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md:447-455`, `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:73-75`, `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh:127-130`; strict validator exits 2 with template-header warnings |
| UPGRADE-SAFETY-004 | P2 | Maintainability | Feature-flag defaults are accurate in ENV_REFERENCE but stale in installer/config notes | `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:355`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:387`, `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:411`, `.opencode/skill/system-spec-kit/scripts/setup/install.sh:197`, `.codex/config.toml:24`, `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:30-34`, `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:96-101` |
| UPGRADE-SAFETY-005 | P2 | Security | Checked-in runtime config examples are more permissive than the install guide posture and deserve explicit context | `.codex/config.toml:3-4`, `.gemini/settings.json:14-16`; install guide itself does not recommend `--allow-all-tools` in the audited surface |

---

## 4. Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Prerequisite alignment | UPGRADE-SAFETY-001 | Update install guide, doctor workflows, install script, and debug docs to require Node `>=20.11.0`; make doctor fail or warn specifically for unsupported Node versions below that floor. |
| Doctor config parser | UPGRADE-SAFETY-002 | Support both `.vscode/mcp.json` shapes (`servers` and `mcpServers`) or migrate the checked-in VS Code config and docs to the shape doctor expects. Re-run `mcp-doctor.sh --json` until false VS Code warnings disappear. |
| Legacy validation policy | UPGRADE-SAFETY-003 | Either migrate old packet decision-record headings to the current template contract or add a validator grandfathering rule for legacy authored sections. |
| Env default notes | UPGRADE-SAFETY-004 | Replace stale notes claiming `SPECKIT_EXTENDED_TELEMETRY` default ON and `SPECKIT_ADAPTIVE_FUSION` default OFF; keep ENV_REFERENCE as the source to match. |
| Runtime security posture | UPGRADE-SAFETY-005 | Add context that checked-in permissive configs are local/developer profiles, or split safer default examples from power-user profiles. |

---

## 5. Spec Seed

### Problem
The install, diagnostic, and validation surfaces have small but operator-visible drift from the current runtime contract.

### Scope
- Align Node prerequisite docs and doctor checks with package engines.
- Repair VS Code/Copilot MCP config detection.
- Decide legacy strict-validation compatibility policy.
- Correct stale feature-flag notes outside ENV_REFERENCE.
- Add security context around permissive checked-in runtime profiles.

### Acceptance Criteria
- Install guide, doctor install/debug assets, and setup script all require Node `>=20.11.0`.
- `mcp-doctor.sh --json` no longer warns that `.vscode/mcp.json` lacks servers that are present under `servers`.
- `026/005-memory-indexer-invariants` strict validation either passes or is explicitly classified under a legacy compatibility policy.
- Feature-flag defaults match source code in installer/config notes.
- Security-sensitive runtime configs are documented as deliberate local profiles, not general install defaults.

---

## 6. Plan Seed

1. Patch the Node minimum in install guide, doctor workflows, setup script, and debug docs.
2. Update doctor config parsing to handle VS Code `servers`, then re-run the doctor JSON diagnostic.
3. Fix or grandfather the legacy decision-record template-header deviations that break strict validation.
4. Patch stale feature-flag notes in setup/config surfaces.
5. Add a short security note for permissive checked-in runtime profiles.
6. Re-run `npm --prefix .opencode/skill/system-spec-kit/mcp_server run test:hydra:phase1`, `mcp-doctor.sh --json`, the legacy strict validator, and the packet validator.

---

## 7. Traceability Status

| Question | Status | Evidence |
|----------|--------|----------|
| Orphan imports from `tests/search-quality` or `tests/code-graph-degraded-sweep` after 038? | Pass | Source search under `.opencode/skill/system-spec-kit/mcp_server` returned no matches for old path patterns. Current stress config includes `mcp_server/stress_test/**/*.{vitest,test}.ts` at `.opencode/skill/system-spec-kit/mcp_server/vitest.stress.config.ts:13-15`, and stress README documents the new folders at `.opencode/skill/system-spec-kit/mcp_server/stress_test/README.md:29-34`. |
| Is `npm run hook-tests` reachable post-044? | Pass with environment caveat | `.opencode/skill/system-spec-kit/mcp_server/package.json:27` defines `hook-tests` and points at the 043 runner. Latest live CLI run-output records sandbox skips, not script absence, for the runtime cells in `specs/system-spec-kit/026-graph-and-context-optimization/043-hook-plugin-per-runtime-testing/run-output/latest/*live-cli.jsonl:1`. |
| Can a fresh install reach current DB schema? | Pass | `create_schema` creates or upgrades the memory schema at `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:2324-2344`; `SCHEMA_VERSION` is 27 at `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:425-426`. |
| Can an old DB upgrade cleanly? | Partial | Migrations run transactionally with rollback on failure at `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1324-1339`, and tests cover v14 rollback, v22, v23, v25, plus v21 checkpoints at `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:32-50`, `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:57-128`, `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-schema-migration-refinements.vitest.ts:139-168`, `.opencode/skill/system-spec-kit/mcp_server/tests/migration-checkpoint-scripts.vitest.ts:12-18`. I did not find a named 026/005-era DB fixture. |
| Does `doctor:mcp_install` install four native MCP servers in order, with verification? | Partial | The workflow lists the four servers and installs each in plan order with post-install health checks at `.opencode/command/doctor/assets/doctor_mcp_install.yaml:203-214`, then verifies with `mcp-doctor.sh --json` at `.opencode/command/doctor/assets/doctor_mcp_install.yaml:251-260`. It inherits the Node 18 prerequisite drift in UPGRADE-SAFETY-001. |
| What does `doctor:mcp_debug` surface? | Partial | It captures JSON status, pass/warn/fail counts, warning/failure lists, repair prompts, and re-verification flow at `.opencode/command/doctor/assets/doctor_mcp_debug.yaml:99-180`; the shell script checks Node, native `better-sqlite3`, module markers, DB path, server start, and config wiring at `.opencode/command/doctor/scripts/mcp-doctor.sh:108-112`, `.opencode/command/doctor/scripts/mcp-doctor.sh:165-190`, `.opencode/command/doctor/scripts/mcp-doctor.sh:210-230`, `.opencode/command/doctor/scripts/mcp-doctor.sh:481-486`. Gaps: Node floor and VS Code schema detection. |
| Are env var default-state docs accurate? | Pass for ENV_REFERENCE, fail for notes | ENV_REFERENCE matches asked defaults: retention sweep ON at `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:355`, extended telemetry OFF at `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:387`, file watcher OFF at `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:411`. Stale notes are tracked in UPGRADE-SAFETY-004. |
| Do existing spec folders still validate cleanly? | Fail | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants --strict` exits 2 with non-blocking template-header warnings promoted by strict mode. |

---

## 8. Deferred Items

- No target code or docs were remediated because the packet is a read-only audit.
- The doctor run produced warnings for `cocoindex_code` status and sequential-thinking package cache in addition to the VS Code false warnings. I did not promote those because they may reflect local environment state rather than release logic.
- `npm run hook-tests` was not rerun in this sandbox because latest live CLI output already shows sandbox skipping; package-script reachability is still proven by the script entry and runner path.
- DB migration evidence is stronger than a pure absence gap, but release readiness would benefit from a frozen old-DB fixture representing the 026/005 era.

---

## 9. Audit Appendix

### Commands Run

| Check | Result |
|-------|--------|
| `npm --prefix .opencode/skill/system-spec-kit/mcp_server run test:hydra:phase1` | PASS: 4 test files, 14 tests. Covers memory-roadmap flags, state baseline, migration checkpoint scripts, and vector-index schema compatibility. |
| `bash .opencode/command/doctor/scripts/mcp-doctor.sh --json` | WARN: 33 pass, 6 warn, 0 fail. Four warnings were false `.vscode/mcp.json` wiring reports caused by the `servers` versus `mcpServers` mismatch. |
| Old stress path search under `mcp_server` | PASS: no source matches for `tests/search-quality`, `tests/code-graph-degraded-sweep`, or equivalent old import patterns. |
| `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants --strict` | FAIL as audit evidence: exit 2 due template-header warnings in `specs/system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/decision-record.md`. |
| Security-sensitive install scan | PASS for install guide: no `--allow-all-tools` guidance found. Advisory remains for checked-in permissive runtime configs. |

### DB Evidence

| Surface | Evidence |
|---------|----------|
| Current schema | `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:425-426` sets `SCHEMA_VERSION = 27`. |
| Upgrade transaction | `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1324-1339` wraps migrations in a transaction and rethrows after rollback. |
| Version gate | `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts:1348-1376` creates `schema_version`, migrates to current, validates compatibility, and writes version 27. |
| Checkpoint rollback tooling | `.opencode/skill/system-spec-kit/mcp_server/tests/migration-checkpoint-scripts.vitest.ts:49-73` validates checkpoint creation and metadata; `.opencode/skill/system-spec-kit/mcp_server/tests/migration-checkpoint-scripts.vitest.ts:76-90` begins restore-overwrite coverage. |

### Relocation Evidence

| Surface | Evidence |
|---------|----------|
| Stress config | `.opencode/skill/system-spec-kit/mcp_server/vitest.stress.config.ts:13-15` includes only `mcp_server/stress_test/**/*.{vitest,test}.ts`. |
| Stress README | `.opencode/skill/system-spec-kit/mcp_server/stress_test/README.md:29-34` lists current stress subfolders; `.opencode/skill/system-spec-kit/mcp_server/stress_test/README.md:42-59` documents current commands. |
| Matrix runners | `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md:30-42` documents the current matrix runner path and quickstart. |
| Package scripts | `.opencode/skill/system-spec-kit/mcp_server/package.json:27-30` exposes `hook-tests`, `stress`, `stress:harness`, and `stress:matrix`. |

### Verdict

CONDITIONAL: 0 P0, 3 P1, 2 P2. Release readiness should wait for prerequisite alignment, doctor config detection repair, and an explicit legacy strict-validation compatibility decision.
