# Iteration 019 - Cross-cutting spec-to-code alignment (D3 + D5)

## Scope

Cross-cutting release-readiness sample across the highest-risk 022 phases, focusing on:

- canonical count claims vs live filesystem state
- spec-to-command / spec-to-code alignment for the memory surface
- whether Hydra/session/template phases are describing shipped behavior or only planned behavior

I sampled **19 concrete claims** from the requested phases and traced each to live filesystem/code.

## Overall assessment

**REQUEST_CHANGES**

The repo still contains multiple **canonical count-drift and cross-doc drift** issues in root/umbrella packets. The strongest release-readiness risk is not missing implementation everywhere; it is that several authoritative specs now make **mutually inconsistent** and **filesystem-inaccurate** claims about subtree size, feature/playbook denominators, and template-enforcement completion.

## Highest-signal findings

### P1 - Canonical root facts are no longer true on disk

The root 022 packet still claims `119` numbered spec directories in metadata/executive summary, `118` in `REQ-002`/acceptance scenarios, and direct-child counts such as `007=21` and `015=19`, but the live tree now reports **122 numbered directories under 022**, **22 direct children under `007`**, and **22 direct children under `015`**. This is root-packet drift, not a one-off typo. Sources: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:3-4,20,38-41,121-122,218,238`; live counts from 2026-03-24 filesystem walk.

### P1 - Feature catalog / playbook denominator drift propagates across phases

`006-feature-catalog`, `015-manual-testing-per-playbook`, and the root 022 packet all repeat the `222 feature files` / `233 scenario files` story, but the live tree is currently **220 snippet files / 221 markdown files** under `feature_catalog/` and **230 scenario files / 231 markdown files** under `manual_testing_playbook/`. This means umbrella packets are anchoring verification and coverage claims to stale denominators. Sources: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md:38-41`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/spec.md:45-49`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-manual-testing-per-playbook/spec.md:39-43,156-157`; live counts from 2026-03-24 filesystem walk.

### P1 - Template-compliance phase is internally inconsistent and still not CLI-parity complete

`010-template-compliance-enforcement/spec.md` claims a **2-layer** enforcement architecture and points to all CLI `@speckit` definitions plus the shared contract file, but `implementation-summary.md` still says **not yet implemented** and calls it **3-layer**. The shared contract file exists, and four primary agent definitions (`claude`, `opencode`, `chatgpt`, `codex`) contain the expected post-write validation loop, but `.gemini/agents/speckit.md` does **not** carry the same synchronized contract markers (`template-compliance-contract`, `validate.sh --strict run after each file write`, `Max 3 fix attempts per file`). Sources: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/spec.md:3,43,52-76,87-99`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-template-compliance-enforcement/implementation-summary.md:3-4,34,77-78`; `.opencode/skill/system-spec-kit/references/template-compliance-contract.md:22-30,171-185`; `.claude/agents/speckit.md:443-447,513-518`; `.gemini/agents/speckit.md:238-239,326,438-439`.

### P1 - 001 epic canonical docs disagree on sprint-subtree size

The 001 epic spec consistently says the epic tracks **11 live sprint folders**, and the phase map lists 11 sprint rows (`001`..`011`). But the 001 implementation summary says the parent now records the **live 10-sprint subtree**. Live directory state shows **11 sprint-labeled children** plus an additional non-sprint child folder (`012-pre-release-fixes-alignment-preparation`), so the implementation summary is stale and the parent packet is no longer internally self-consistent. Sources: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md:3,20,41,54,64,93-103,115,188,212,232-233`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/implementation-summary.md:31`; live direct-child listing from 2026-03-24 filesystem walk.

### P2 - JSON-primary deprecation is a posture shift, not full path removal

Phase 017 is actually careful about this: it says routine positional/stateless saves are rejected unless `--recovery` is supplied, not that the old path is entirely gone. The loader still explicitly enforces structured JSON input and still documents recovery-oriented behavior. So any release statement that implies the old capture path was fully removed would overclaim the shipped posture. Sources: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-json-primary-deprecation/spec.md:42-44,52-59,82-85,101-111,170-171`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/017-json-primary-deprecation/implementation-summary.md:34-39,66-68,90-91`; `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:8,65-67`.

### P2 - Exact "41 documented features" architecture claim is not canonical in current 005 docs

I could not find the exact `41 documented features` claim in the current canonical `005-architecture-audit` spec/implementation-summary. What *is* verifiable is that the core architecture-enforcement surfaces the phase claims are present: boundary checks, handler-cycle checks, and source/dist alignment checks all exist as concrete scripts. Sources: `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/spec.md:22-26,60-65,92-103`; `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/implementation-summary.md:38-52,62-68`; `.opencode/skill/system-spec-kit/scripts/evals/check-architecture-boundaries.ts:1-16`; `.opencode/skill/system-spec-kit/scripts/evals/check-handler-cycles-ast.ts:1-8`; `.opencode/skill/system-spec-kit/scripts/evals/check-source-dist-alignment.ts:1-18`.

## Sampled claim trace (19 claims)

| # | Phase | Claim | Source | Live verification | Verdict |
|---|-------|-------|--------|-------------------|---------|
| 1 | Root 022 | `19` direct phases under `022` | `spec.md:3-4,20,89-109` | Live root directory contains `001` through `019` as direct numbered phase folders | PASS |
| 2 | Root 022 | `119` numbered spec directories on disk / `118` in acceptance criteria | `spec.md:3-4,20,38,121-122,218,238` | Recursive filesystem count under `022` returns **122** numbered directories | FAIL |
| 3 | Root 022 | Direct child count `007=21` | `spec.md:39` | `007-code-audit-per-feature-catalog` currently has **22** direct numbered children (`001`..`022`) | FAIL |
| 4 | Root 022 | Direct child count `008=6` | `spec.md:39` | `008-hydra-db-based-features` currently has **6** direct numbered children | PASS |
| 5 | Root 022 | Direct child count `009=20` | `spec.md:39`; root impl summary `implementation-summary.md:31-35` | `009-perfect-session-capturing` currently has **20** direct numbered children (`000`..`019`) | PASS |
| 6 | Root 022 | Direct child count `011=1` | `spec.md:39` | `011-skill-alignment` currently has **1** direct numbered child (`001-post-session-capturing-alignment`) | PASS |
| 7 | Root 022 | Direct child count `015=19` | `spec.md:39` | `015-manual-testing-per-playbook` currently has **22** direct numbered children (`001`..`022`, including both `019` and `020`) | FAIL |
| 8 | Root 022 | Feature catalog count `222` | `spec.md:40` | `feature_catalog/` has **220 snippet files** (excluding `feature_catalog.md`) and **221 total markdown files** | FAIL |
| 9 | 001 epic | `11 live sprint folders` | `001.../spec.md:3,20,41,54,64,115,188,212,232` | Phase map and live folder names confirm **11 sprint-labeled children** (`001`..`011`); note there is also an extra non-sprint direct child `012-pre-release-fixes-alignment-preparation` | PASS with nuance |
| 10 | 001 epic | Parent records the `live 10-sprint subtree` | `001.../implementation-summary.md:31` | Contradicted by 001 spec + live directory state showing **11** sprint children | FAIL |
| 11 | 006 feature catalog | Live filesystem count is `222` feature catalog snippet files | `006.../spec.md:45-49` | Current live count is **220 snippet files** / **221 markdown files** | FAIL |
| 12 | 006 feature catalog | Live filesystem count is `233` manual testing playbook scenario files | `006.../spec.md:45-49` | Current live count is **230 scenario files** / **231 markdown files** | FAIL |
| 13 | 012 command alignment | Repo ships `33 MCP tools` | `012.../spec.md:22-33,63-66,129-132`; `012.../implementation-summary.md:27-37` | `tool-schemas.ts` contains **33** tool `name:` definitions | PASS |
| 14 | 012 command alignment | Repo ships `6` memory commands | `012.../spec.md:22-33,68-74,129-132`; `012.../implementation-summary.md:27-37,57-64` | `.opencode/command/memory/` contains six command docs: `analyze`, `continue`, `learn`, `manage`, `save`, `shared` (plus `README.txt`) | PASS |
| 15 | 008 hydra | Governed retrieval scope survives across `memory_context`, `memory_search`, `memory_quick_search` | `008.../implementation-summary.md:35-38` | `tool-schemas.ts` exposes `tenantId`, `userId`, `agentId`, and `sharedSpaceId` on `memory_context` and `memory_search`, and governed retrieval params on `memory_quick_search` | PASS |
| 16 | 008 hydra | Shared-space safety rails: explicit actor identity, owner-only updates, bootstrap owner grant | `008.../implementation-summary.md:35-38` | `handlers/shared-memory.ts` enforces exactly one actor identity (`resolveAdminActor()`), owner auth on update (`assertSharedSpaceAccess(..., 'owner')`), and owner bootstrap on first create (`upsertSharedMembership(... role: 'owner')`) | PASS |
| 17 | 009 session capturing / 017 child | JSON-primary deprecation complete | `017-json-primary-deprecation/spec.md:42-44,52-59,82-85,101-111,170-171`; impl summary `:34-39,66-68,90-91` | Live code enforces structured JSON input (`NO_DATA_FILE`, JSON mode guidance) but the spec explicitly keeps stateless capture behind `--recovery`; this is a **recovery-only gating change**, not full path removal | PARTIAL / terminology-sensitive |
| 18 | 010 template compliance | `2-layer` enforcement architecture is shipped across agent defs | `010.../spec.md:3,43,52-76,87-99` | Shared contract file exists and 4 primary agent defs contain the post-write validation loop, but `.gemini/agents/speckit.md` lacks the same synchronized contract markers; `implementation-summary.md` still says not implemented / `3-layer` | FAIL / PARTIAL |
| 19 | 005 architecture audit | Exact `41 documented features` metric | Requested spot check; not found in canonical `005` docs | Exact metric not recoverable from current canonical docs. However, core enforcement claims are backed by concrete scripts: `check-architecture-boundaries.ts`, `check-handler-cycles-ast.ts`, `check-source-dist-alignment.ts` | UNVERIFIABLE metric, core enforcement PASS |

## Confirmed implementation-backed claims

These sampled claims *did* trace cleanly to live code/filesystem state:

- `022` really does have **19** direct numbered phases.
- `009-perfect-session-capturing` really does have **20** direct numbered children.
- `008-hydra-db-based-features` really does have **6** direct numbered children.
- `011-skill-alignment` really does have **1** direct numbered child.
- `012-command-alignment` really does line up with a **33-tool**, **6-command** live memory surface.
- Hydra governance/safety-rail code does exist in the runtime: governed retrieval parameters are exposed in schemas and shared-space admin enforcement is implemented in `handlers/shared-memory.ts`.

## Release-readiness takeaways

1. **Root and umbrella docs need another truth-sync pass before release sign-off.** The largest drift is in authoritative denominator/count claims, not in the runtime command surface.
2. **Do not describe phase 017 as full removal of the old capture path.** The shipped posture is JSON-primary / recovery-only, not hard deletion.
3. **Do not mark template-compliance enforcement as fully closed across CLIs until Gemini parity is reconciled and the 010 implementation summary is updated.**
4. **Use live filesystem counts, not inherited prose, for 022 / 006 / 015.** The stale 222/233/118/119 numbers are now cross-propagating between packets.

