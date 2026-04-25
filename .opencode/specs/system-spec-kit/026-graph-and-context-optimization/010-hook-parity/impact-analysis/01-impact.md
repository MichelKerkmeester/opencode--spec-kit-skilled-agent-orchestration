# 009 Impact Analysis — 01 (001-skill-advisor-hook-surface)

## Sub-packet Summary
- Sub-packet: `001-skill-advisor-hook-surface`
- Spec docs read:
  - Depth 0 (8 docs): `battle-plan.md`, `checklist.md`, `decision-record.md`, `handover.md`, `implementation-summary.md`, `plan.md`, `spec.md`, `tasks.md`
  - Depth 1 (50 docs): packet docs under `001-initial-research/` and `002-009/`, plus `review/deep-review-strategy.md`, `review-archive-r01-copilot/deep-review-strategy.md`, `review-archive-r01-copilot/review-report.md`, `review-archive-r02-codex-copilot/deep-review-strategy.md`, and `review-archive-r02-codex-copilot/review-report.md`
  - Depth 2 (128 docs): nested research-wave docs under `001-initial-research/*/`, `review-archive-r01-copilot/iterations/` (40 docs), `review-archive-r02-codex-copilot/iterations/` (40 docs), and `review/iterations/` (38 docs)
  - Total markdown docs read: `186`
- Work performed:
  - Added the shared `advisor` envelope producer/source vocabulary and typed `AdvisorEnvelopeMetadata`, including prompt-derived provenance rejection at the shared-payload boundary.
  - Added `getAdvisorFreshness()` plus source-signature caching, generation-counter recovery, deleted/renamed-skill suppression, and fallback-state mapping.
  - Added `buildSkillAdvisorBrief()` prompt policy, exact HMAC prompt cache, stdin-based `skill_advisor.py` subprocess handling, and fail-open status mapping.
  - Added the pure renderer, observability/diagnostic schema, privacy audit, 10 canonical fixtures, 200-prompt parity harness, and timing/cache gates.
  - Shipped runtime adapters for Claude, Gemini, Copilot, and Codex, including Copilot wrapper fallback and Codex dynamic hook-policy detection plus Bash-only `PreToolUse`.
  - Published the operator reference/playbook and updated instruction surfaces so Gate 2 becomes hook-primary with `skill_advisor.py` fallback.
- Key surfaces touched: hooks, advisor, renderer, schema, cache/freshness, runtime wiring, docs

## Files Requiring Updates
| Path | Category | Reason | Severity | Suggested Change |
|---|---|---|---|---|
| `.opencode/README.md` | README | The repo overview still describes Gate 2 as explicit `skill_advisor.py` invocation and script-centric routing, while this packet ships automatic hook-based advisor surfacing across Claude, Gemini, Copilot, and Codex. | HIGH | Rewrite the Gate 2/onboarding text to describe the automatic hook brief as primary and the Python CLI as compatibility fallback. |
| `.opencode/skill/system-spec-kit/SKILL.md` | Skill | The skill-level startup/recovery section still says Codex participates through `SessionStart` startup hooks, but this packet finalized Codex as prompt-hook only with no lifecycle startup hook and explicit fallback behavior. | HIGH | Split prompt-hook vs lifecycle-hook behavior explicitly and remove Codex `SessionStart` / startup-hook wording. |
| `.opencode/skill/system-spec-kit/references/config/hook_system.md` | Skill | This is the authoritative runtime hook matrix; `006-009` defined prompt-time transports, Copilot's file-based prompt path, Codex no-lifecycle behavior, and runtime fallback semantics that must stay synchronized here. | HIGH | Keep the runtime matrix and fallback narrative aligned with the shipped adapter behavior, disable path, and recovery guidance. |
| `AGENTS.md` | AGENTS.md | `009` changes Gate 2 from script-first to hook-primary/fallback and depends on the prompt-vs-lifecycle runtime split; this instruction surface becomes wrong if it keeps pre-hook guidance. | HIGH | Keep Gate 2 and session-recovery rules anchored on hook brief primary, `skill_advisor.py` fallback, and the runtime matrix reference. |
| `.opencode/skill/system-spec-kit/README.md` | README | The package overview now needs to reflect hook-primary skill-advisor routing, the native/shim split, and Copilot's file-based prompt path that this packet formalized. | MED | Expand the Skill Advisor section with hook-brief/fallback semantics and point readers to the hook reference/playbook. |
| `.opencode/skill/system-spec-kit/mcp_server/**/README.md` | README | `009` explicitly updated the runtime hook README family under `mcp_server/hooks/` for Claude/Gemini/Copilot/Codex registration and fallback behavior, but the audit only captures them through a wildcard row. | MED | Refresh the runtime hook README family with Phase 020 registration snippets, Copilot wrapper notes, and Codex deferred `.codex` config guidance. |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | README | The MCP server README documents the native skill-advisor package and acts as an operator entrypoint; this packet adds runtime hook adapters, compatibility fallback behavior, and hook docs that the overview should surface. | MED | Add a short hook-surface summary and cross-links to the runtime hook READMEs and hook reference docs. |

## Files Not Requiring Updates (from audit)
- `Commands`: checked all audited `.opencode/command/memory/**`, `.opencode/command/spec_kit/**`, and command-asset rows; this sub-packet changed hook/runtime behavior, not command syntax or command-owned workflow YAML.
- `Agents` and `Documents`: checked `.opencode/agent/handover.md`, `.opencode/agent/speckit.md`, and `.opencode/install_guides/SET-UP - AGENTS.md`; they are orthogonal to advisor hook wiring, cache policy, and runtime transport semantics.
- `READMEs` and `Skills` covering memory storage, graph metadata, chunking, validation, scripts, templates, shared parsing, and unrelated feature-catalog/manual-testing topics were checked and deemed unaffected because this sub-packet did not change those subsystems.

## Evidence
- `.opencode/README.md`
  Source: `009-documentation-and-release-contract/implementation-summary.md:50-53,61-68,113-114`
  Target: `.opencode/README.md:113,273-276`
- `.opencode/skill/system-spec-kit/SKILL.md`
  Source: `008-codex-integration-and-hook-policy/implementation-summary.md:48-53,95-98,126` and `009-documentation-and-release-contract/implementation-summary.md:50-53`
  Target: `.opencode/skill/system-spec-kit/SKILL.md:731-745`
- `.opencode/skill/system-spec-kit/references/config/hook_system.md`
  Source: `007-gemini-copilot-hook-wiring/implementation-summary.md:53-55,76-79`, `008-codex-integration-and-hook-policy/implementation-summary.md:48-53,95-98`, and `009-documentation-and-release-contract/implementation-summary.md:50-53,64-68`
  Target: `.opencode/skill/system-spec-kit/references/config/hook_system.md:50-62`
- `AGENTS.md`
  Source: `009-documentation-and-release-contract/implementation-summary.md:50-53,61-68,113-116`
  Target: `AGENTS.md:55,92,177-178`

## Uncertainty
- NEEDS VERIFICATION: the requested audit file path resolves to a document titled `005 Release Cleanup Playbooks — Path References Audit`, and its rows point at `005-release-cleanup-playbooks`, not `010-hook-parity`. I used that exact file as instructed, but the mismatch means the audit may omit some direct 020/009 outputs such as `CLAUDE.md` and concrete hook README paths.
- NEEDS VERIFICATION: `.opencode/skill/system-spec-kit/mcp_server/**/README.md` is a wildcard audit row, so the impacted concrete files are inferred from `009-documentation-and-release-contract/implementation-summary.md:64-68` rather than enumerated one by one in the audit itself.
