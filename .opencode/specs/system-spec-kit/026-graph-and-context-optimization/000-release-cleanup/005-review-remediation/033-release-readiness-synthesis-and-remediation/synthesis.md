---
title: "Synthesis: 046 Release Readiness Aggregate"
description: "Aggregate verdict and remediation backlog for packet 045's ten release-readiness review reports."
trigger_phrases:
  - "033-release-readiness-synthesis-and-remediation"
  - "release-readiness aggregate"
  - "P0 fixes implementation"
  - "release blocker remediation"
importance_tier: "important"
contextType: "synthesis"
---
# Synthesis: 046 Release Readiness Aggregate

## 1. Aggregate Verdict

Packet 045 produced **6 FAIL** and **4 CONDITIONAL** verdicts across ten review angles.

| Subsystem | Report | Verdict | P0 | P1 | P2 |
|-----------|--------|---------|----|----|----|
| workflow | 045/001 | FAIL | 1 | 3 | 1 |
| memory | 045/002 | CONDITIONAL | 0 | 3 | 1 |
| skill-advisor | 045/003 | CONDITIONAL | 0 | 1 | 2 |
| code-graph | 045/004 | FAIL | 1 | 2 | 1 |
| hooks | 045/005 | FAIL | 1 | 3 | 2 |
| schema | 045/006 | FAIL | 1 | 4 | 2 |
| deep-loop | 045/007 | FAIL | 1 | 2 | 1 |
| validator | 045/008 | FAIL | 3 | 1 | 2 |
| docs | 045/009 | CONDITIONAL | 0 | 6 | 1 |
| operability | 045/010 | CONDITIONAL | 0 | 3 | 2 |

Total findings: **P0=8**, **P1=28**, **P2=15**.

Release decision: **BLOCKED** at synthesis time because P0 findings existed. After Phase 2 remediation, the implemented blockers are ready for verification, but release remains conditional on final build, strict validators, and operator decisions listed below.

## 2. P0 Findings Registry

| ID | Subsystem | File:line Evidence | Description | Recommended Remediation | Effort |
|----|-----------|--------------------|-------------|--------------------------|--------|
| 045/001-P0-1 | workflow | `tool-schemas.ts:281`, `memory-crud-delete.ts:71` | `memory_delete({id})` could delete without confirmation | Require `confirm:true` for single and bulk deletes, update tests | Small |
| 045/004-P0-1 | code-graph | `ensure-ready.ts:309`, `ensure-ready.ts:334` | Readiness debounce could hide fresh-to-stale file changes | Remove unsafe cached fresh result for graph reads and add regression coverage | Small |
| 045/005-P0-1 | hooks | `.github/hooks/superset-notify.json:18` | Copilot checked-in wrapper bypassed Spec Kit context scripts | Route checked-in wrapper through Spec Kit Copilot writer scripts | Medium |
| 045/006-P0-1 | schema | `lifecycle-tools.ts:66` | `session_health` bypassed strict schema validation | Validate `session_health` args before handler dispatch | Small |
| 045/007-P0-1 | deep-loop | `spec_kit_deep-review_auto.yaml:445`, `spec_kit_deep-research_auto.yaml:451` | Max-iteration caps could become BLOCKED or CONTINUE | Make max-iteration terminal and record failed gates as evidence | Medium |
| 045/008-P0-1 | validator | `template-structure.js:190`, `check-anchors.sh:128` | Strict mode accepted headers/anchors hidden in fenced code blocks | Strip fenced blocks before structural header and anchor parsing | Medium |
| 045/008-P0-2 | validator | `check-spec-doc-integrity.sh:82` | Phase-parent prose mentions of `.md` files became missing-file errors | Validate explicit Markdown links, not every backticked prose token | Small |
| 045/008-P0-3 | validator | `check-template-headers.sh:73` | Documented custom research sections failed strict validation | Treat custom extra headers as valid packet extensions | Small |

## 3. P1 Findings Registry

| ID | Subsystem | File:line Evidence | Description | Recommended Remediation | Effort |
|----|-----------|--------------------|-------------|--------------------------|--------|
| 045/001-P1-1 | workflow | `spec_kit_plan_auto.yaml:616`, `spec_kit_complete_auto.yaml:1080` | Auto modes contain waits/pauses | Move waits to confirm variants | Medium |
| 045/001-P1-2 | workflow | `memory/save.md:120`, `memory/manage.md:37` | Memory commands lack YAML contracts | Decide YAML assets versus markdown-only validator | Large |
| 045/001-P1-3 | workflow | `memory/save.md:130`, `memory/save.md:341` | `/memory:save` default contract contradicts itself | Pick plan-only or mutation-first default | Medium |
| 045/002-P1-1 | memory | `memory-crud-health.ts:379`, `vector-index-queries.ts:1285` | `memory_health` can overstate consistency | Add structured consistency status | Medium |
| 045/002-P1-2 | memory | `memory-retention-sweep.vitest.ts:180` | Retention/save race test is not true multi-writer coverage | Add file-backed multi-connection fixture | Medium |
| 045/002-P1-3 | memory | `embedding-cache.ts:45`, `vector-index-mutations.ts:590` | Retention embedding-cache policy undefined | Decide delete versus reusable cache contract | Medium |
| 045/003-P1-1 | skill-advisor | `advisor-tool-schemas.ts:115`, `advisor-rebuild.ts:57` | `advisor_rebuild` could not target diagnosed workspace | Add `workspaceRoot` input and test | Small |
| 045/004-P1-1 | code-graph | `code_graph/README.md:58` | Readiness/trust-state vocabulary drift | Align README vocabulary | Small |
| 045/004-P1-2 | code-graph | `code-graph-degraded-sweep.vitest.ts:181` | Missing same-root fresh-then-edit coverage | Add targeted freshness regression | Small |
| 045/005-P1-1 | hooks | `run-output/latest/*live-cli.jsonl:1` | No normal-shell live runtime verdicts | Run hook tests outside sandbox | Operator |
| 045/005-P1-2 | hooks | `skill-advisor-hook.md:66`, plugin transform source | OpenCode output shape doc drift | Update hook reference | Small |
| 045/005-P1-3 | hooks | `hooks/codex/README:63`, `.codex/settings.json:3` | Codex README snippet stale | Align README with template and hooks.json caveat | Small |
| 045/006-P1-1 | schema | `tool-schemas.ts:645`, `tool-input-schemas.ts:632` | `code_graph_verify` missing Zod schema | Add schema and allowed-parameter entry | Small |
| 045/006-P1-2 | schema | `save/types.ts:286`, `tool-input-schemas.ts:237` | `memory_save` hidden planner inputs | Decide public versus internal-only inputs | Medium |
| 045/006-P1-3 | schema | `scope-governance.ts:225`, `memory-ingest.ts:36` | Governed ingest policy uneven | Decide scan/ingest governance boundary | Medium |
| 045/006-P1-4 | schema | `context-server.ts:943`, `context-server.ts:1010` | Raw args influence pre-dispatch behavior | Validate earlier at server boundary | Medium |
| 045/007-P1-1 | deep-loop | `post-dispatch-validate.ts:27`, review YAML | Deep-review failure taxonomy drift | Port audited executor wrappers and reason lists | Medium |
| 045/007-P1-2 | deep-loop | `prompt_pack_iteration.md.tmpl:70`, validator | Review JSONL schema incomplete | Align prompt pack and full schema validation | Medium |
| 045/008-P1-1 | validator | `validate.sh:299`, `validate.sh:574` | JSON output omits details | Add details/remediation to JSON result objects | Medium |
| 045/009-P1-1 | docs | `ENV_REFERENCE.md:128`, `ARCHITECTURE.md:404` | Evergreen docs contain packet-history references | Replace with current-runtime anchors | Medium |
| 045/009-P1-2 | docs | `memory_system.md:101`, `SKILL.md:571` | Tool counts cite old totals | Update to 50 local plus 4 advisor tools | Small |
| 045/009-P1-3 | docs | `tool-schemas.ts:680` | Skill Graph tools lack catalog entries | Add feature catalog entries | Medium |
| 045/009-P1-4 | docs | `tool-schemas.ts:692`, `tool-schemas.ts:851` | Playbook misses Skill Graph and coverage-graph reads | Add manual playbook scenarios | Medium |
| 045/009-P1-5 | docs | `skill_advisor/README.md:38`, `advisor-rebuild.ts:7` | Advisor docs omit `advisor_rebuild` | Update README/install guide lists | Small |
| 045/009-P1-6 | docs | `README.md:1318`, generated indexes | Local markdown links broken | Repair generated/root links | Medium |
| 045/010-P1-1 | operability | package engines, install guide, doctor YAML | Node prerequisite drift accepts Node 18 | Align Node floor to `>=20.11.0` | Small |
| 045/010-P1-2 | operability | `.vscode/mcp.json:3`, doctor scripts | Doctor misreads VS Code `servers` key | Support both config shapes or migrate config | Medium |
| 045/010-P1-3 | operability | `005-memory-indexer-invariants` strict failure | Legacy packet strict validation fails | Migrate legacy headings or define grandfather policy | Medium |

## 4. P2 Findings Registry

Deferred P2s: checkpoint-delete matrix wording, BM25 derived-index hardening, Python fallback parity labeling, scorer weight doc drift, readiness-contract comment cleanup, Gemini event naming, OpenCode no-prompt diagnostics, schema README count drift, strict-off guardrails, stale coverage-graph target path, link-validation scoping, evergreen grep allowlist, stale feature-flag notes, and permissive runtime config context.

Implemented P2 during Phase 2: code-graph readiness-contract comments were updated with the four-state trust vocabulary.

## 5. Sequenced Remediation Plan

### Tier alpha: P0 fixes

| Fix | Target | Type | Effort | Phase 2 Status |
|-----|--------|------|--------|----------------|
| Require `confirm:true` for `memory_delete({id})` | `tool-schemas.ts`, `tool-input-schemas.ts`, `memory-crud-delete.ts` | Code/test | Small | Done |
| Remove unsafe readiness debounce | `code_graph/lib/ensure-ready.ts`, `tests/ensure-ready.vitest.ts` | Code/test | Small | Done |
| Wire checked-in Copilot hook through Spec Kit scripts | `.github/hooks/superset-notify.json`, `.github/hooks/spec-kit-copilot-hook.sh` | Code/config | Medium | Done |
| Validate `session_health` args | `tools/lifecycle-tools.ts`, `tests/tool-input-schema.vitest.ts` | Code/test | Small | Done |
| Make max-iteration terminal | deep-review/research YAML assets | Workflow doc | Medium | Done |
| Ignore fenced structural content | validator JS and shell rules | Code/test | Medium | Done |
| Fix phase-parent `.md` prose false positives | `check-spec-doc-integrity.sh` | Code | Small | Done |
| Allow custom packet headers | `check-template-headers.sh` | Code | Small | Done |

### Tier beta: P1 quick wins

| Fix | Target | Type | Effort | Phase 2 Status |
|-----|--------|------|--------|----------------|
| Add `advisor_rebuild.workspaceRoot` | advisor schema, descriptor, handler, test | Code/test | Small | Done |
| Add `code_graph_verify` Zod schema | `tool-input-schemas.ts`, test | Code/test | Small | Done |
| Align code graph README vocabulary | `code_graph/README.md` | Doc | Small | Done |
| Add same-root freshness regression | `tests/ensure-ready.vitest.ts` | Test | Small | Done |

### Tier gamma: P1 design calls

| Fix | Target | Type | Effort | Decision Needed |
|-----|--------|------|--------|-----------------|
| Memory command YAML contracts | `/memory:*` command architecture | Design/doc | Large | YAML assets or markdown-only validator |
| `/memory:save` default mode | `memory/save.md`, skill docs | Design/doc | Medium | Plan-only or mutation-first |
| Embedding-cache retention | cache/governance paths | Design/code | Medium | Delete derived cache or document reuse |
| Governed ingest surfaces | scan/ingest schemas | Design/code | Medium | Maintenance exception or governed metadata |
| Server-boundary validation order | `context-server.ts` | Design/code | Medium | Central validation now or phased refactor |
| Normal-shell hook verdicts | hook test evidence | Operator | Operator | Run outside sandbox |

### Tier delta: P2 polish

Defer P2 cleanup to backlog unless bundled naturally with a Tier alpha or beta change.

## 6. Open Questions for Operator

1. Should `/memory:*` commands remain markdown-only with a dedicated inline-workflow validator, or move to YAML assets like `/spec_kit:*`?
2. Should `/memory:save` default to plan-only or mutation-first?
3. Should ephemeral governed retention delete embedding-cache rows by content hash, or document embedding cache as reusable derived data with TTL/health exposure?
4. Should `memory_index_scan` and `memory_ingest_start` accept governance metadata, or be documented as operator-maintenance paths outside governed ingest?
5. Should raw MCP tool args be validated once at the server boundary before session priming, with module dispatchers consuming parsed args?
6. Can an operator run `npm --prefix .opencode/skill/system-spec-kit/mcp_server run hook-tests` from a normal shell to produce live runtime hook verdicts?
