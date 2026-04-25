# 009 Impact Analysis — 02 (002-skill-graph-daemon-and-advisor-unification)

## Sub-packet Summary
- Sub-packet: `002-skill-graph-daemon-and-advisor-unification`
- Spec docs read: root `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `decision-record.md`, `checklist.md`, `battle-plan.md`, `scaffold-audit-2026-04-20.md` (depth 0); `001-validator-esm-fix/{spec,plan,tasks,implementation-summary,checklist,blocker}.md` (depth 1); `002-daemon-freshness-foundation/{spec,plan,tasks,implementation-summary,checklist,blocker}.md` (depth 1); `003-lifecycle-and-derived-metadata/{spec,plan,tasks,implementation-summary,checklist,blocker}.md` (depth 1); `004-native-advisor-core/{spec,plan,tasks,implementation-summary,checklist,blocker}.md` (depth 1); `005-mcp-advisor-surface/{spec,plan,tasks,implementation-summary,checklist,blocker}.md` (depth 1); `006-compat-migration-and-bootstrap/{spec,plan,tasks,implementation-summary,checklist,blocker}.md` (depth 1); `007-promotion-gates/{spec,plan,tasks,implementation-summary,checklist,blocker}.md` (depth 1)
- Work performed:
- Unified the advisor under `mcp_server/skill-advisor/` with daemon freshness, single-writer lease, generation/trust-state handling, and schema-backed status surfaces.
- Added lifecycle-derived metadata, additive schema-v2 migration/rollback, provenance fingerprints, trust lanes, anti-stuffing, and sanitizer-enforced write boundaries.
- Shipped the native TypeScript scorer with five-lane fusion, ambiguity handling, attribution, parity harnessing, and promotion-gate evaluation.
- Added the public MCP advisor tools `advisor_recommend`, `advisor_status`, and `advisor_validate` through the existing system-spec-kit dispatcher.
- Rewired compatibility surfaces so hooks, plugin bridge, and Python CLI probe native status first, delegate through `advisor_recommend`, and fall back safely when unavailable or disabled.
- Updated operator/bootstrap expectations around runtime hooks, disable flags, `--force-native` / `--force-local`, redirect metadata, and manual testing scenarios.
- Key surfaces touched: `hooks`, `advisor`, `daemon`, `renderer/status`, `plugin-loader`, `schema`, `wiring`, `docs`

## Files Requiring Updates
| Path | Category | Reason | Severity | Suggested Change |
|---|---|---|---|---|
| `.opencode/README.md` | `README` | The top-level OpenCode docs still describe Gate 2 as automatic via `skill_advisor.py` and still place the routing engine under `skill/scripts/`, but this packet moved the durable advisor surface to the native `mcp_server/skill-advisor/` package with hook-first/runtime-adapter delivery and MCP tools. | HIGH | Rewrite the Gate 2 and directory-structure sections to describe `advisor_recommend`/hook-first routing as primary, with `skill_advisor.py` as the compat shim inside `mcp_server/skill-advisor/`. |
| `.opencode/install_guides/SET-UP - AGENTS.md` | `Document` | The AGENTS setup guide still teaches Gate 2 as "run `skill_advisor.py`" and validates setup only through the script, but this packet shipped hook-first/native-first routing, daemon probing, native MCP delegation, and new compat controls. | HIGH | Update Gate 2 guidance to prefer the runtime hook brief when present, describe `skill_advisor.py` as fallback/diagnostic shim, and add native-tool/bootstrap verification plus `--force-native` / `--force-local` / disable-flag notes. |
| `.opencode/skill/system-spec-kit/README.md` | `README` | The Skill Advisor overview is current, but the workspace module profile still says `scripts/` remains CommonJS. Child `001-validator-esm-fix` explicitly flipped `scripts/package.json` to `"type": "module"`, so this README is now factually wrong. | HIGH | Correct the module-profile section to document `scripts/` as ESM and keep any Node interop notes aligned with the shipped validator migration. |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | `Skill` | The MCP server install verification step lists only memory/session/code-graph tools and does not tell operators to verify `advisor_recommend`, `advisor_status`, or `advisor_validate`, even though this packet added those public tools to the live dispatcher. | MED | Expand the verification step to mention the native advisor tools and point installers to the skill-advisor bootstrap/API docs when checking a fresh install. |

## Files Not Requiring Updates (from audit)
- The audited command docs under `.opencode/command/memory/**` and `.opencode/command/spec_kit/**` were checked and are orthogonal: this packet changed advisor routing and compat wiring, not command semantics.
- The audited agent stubs and the root `AGENTS.md` were checked and are either missing from disk or already aligned with hook-first Gate 2 fallback behavior.
- Most audited READMEs under `mcp_server/`, `scripts/`, `shared/`, and the root `README.md` were checked and already reflect the native skill-advisor package or do not document the changed surfaces directly.
- The audited root system-spec-kit manual-testing-playbook package was checked and left out because this packet's playbook changes landed in the separate skill-advisor package playbook, not the root playbook index.

## Evidence
- `.opencode/README.md`
  - Source change evidence: `006-compat-migration-and-bootstrap/implementation-summary.md:49-79` documents native-first routing through daemon probe -> `advisor_recommend` with Python fallback and new compat controls; `005-mcp-advisor-surface/implementation-summary.md:49-59` documents the additive MCP tool surface.
  - Target file line or section needing update: `.opencode/README.md:76-86` still places skill routing under `skill/scripts/`; `.opencode/README.md:113` still says agent routing is automatic via `skill_advisor.py`; `.opencode/README.md:273-276` and `.opencode/README.md:304-305` still define Gate 2 as running `skill_advisor.py`.
- `.opencode/install_guides/SET-UP - AGENTS.md`
  - Source change evidence: `006-compat-migration-and-bootstrap/implementation-summary.md:49-79` describes the new hook/plugin/Python-CLI flow, disable flag, and `--force-native` / `--force-local`; `005-mcp-advisor-surface/implementation-summary.md:49-59` defines the live native tools the compat layer delegates to.
  - Target file line or section needing update: `.opencode/install_guides/SET-UP - AGENTS.md:540-575` still frames Gate 2 purely as `skill_advisor.py`; `.opencode/install_guides/SET-UP - AGENTS.md:786-805` validates only the script path; `.opencode/install_guides/SET-UP - AGENTS.md:926` still says Gate 2 is "Run `skill_advisor.py`"; `.opencode/install_guides/SET-UP - AGENTS.md:1057-1068` and `.opencode/install_guides/SET-UP - AGENTS.md:1226` still troubleshoot/document only the script entrypoint.
- `.opencode/skill/system-spec-kit/README.md`
  - Source change evidence: `001-validator-esm-fix/implementation-summary.md:39-45` records the shipped `scripts/` ESM migration and Node 25-safe runtime changes.
  - Target file line or section needing update: `.opencode/skill/system-spec-kit/README.md:131-134` still states "`scripts/` remains CommonJS (`\"type\": \"commonjs\"`)".

## Uncertainty
- NEEDS VERIFICATION: the supplied audit file at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-hook-parity/path-references-audit.md` is headed `005 Release Cleanup Playbooks — Path References Audit` and its source inventory also points at `005-*` packets. I treated the listed audited paths as authoritative, but the packet/header mismatch means the audit artifact itself may be stale.
- NEEDS VERIFICATION: `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` is a broad server install guide, so its omission of the three advisor tools is clearly incomplete but may be intentionally non-exhaustive. I marked it `MED` rather than `HIGH` for that reason.
