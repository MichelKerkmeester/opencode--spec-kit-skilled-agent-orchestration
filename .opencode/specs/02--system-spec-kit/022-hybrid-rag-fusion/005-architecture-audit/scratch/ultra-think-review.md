● skill(sk-code--review)

I'll read the audit and ADR, extract the critical/high findings, then verify each claim against the cited code before ranking the fixes.

● Read research.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/research.md
  └ 944 lines read

● Read decision-record.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/decision-record
  │ .md
  └ 565 lines read

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/60519d8b-2b1b-40ba-b54d-3064bd15e480/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 10 lines...

I’ve got the audit inventory. Next I’m validating the critical/high claims in parallel against the cited code so the final ranking is evidence-based, not just a restatement of the report.

● Explore Validate data findings A
  └ Agent started in background with agent_id: validate-data-a. You can use read_...

● Explore Validate data findings B
  └ Agent started in background with agent_id: validate-data-b. You can use read_...

● Explore Validate pipeline contracts
  └ Agent started in background with agent_id: validate-pipeline-contracts. You c...

● Explore Validate security and duplication
  └ Agent started in background with agent_id: validate-security-dup. You can use...

● Explore Validate config and UX
  └ Agent started in background with agent_id: validate-config-ux. You can use re...

The validations are running in parallel. Once they’re back, I’ll reconcile overlaps, check ADR alignment, and turn the confirmed issues into a ranked fix list.

● Read (Explore agent — Validate security and duplication)
  └ idle

● Read (Explore agent — Validate data findings A)
  └ idle

● Read (Explore agent — Validate config and UX)
  └ idle

● Read (Explore agent — Validate data findings B)
  └ Running

● Read (Explore agent — Validate pipeline contracts)
  └ Running

A few validations came back cleanly, but the config/docs batch looks noisy. I’m tightening the uncertain areas and waiting on the remaining deep checks before I rank the fixes.

● Read (Explore agent — Validate data findings B)
  └ idle

● Read (Explore agent — Validate pipeline contracts)
  └ idle

Some of the delegated checks disagreed with the audit in ways that look suspicious, so I’m spot-checking the most important/disputed findings directly in the source before I finalize the review.

✗ Read ranking-contract.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/ranking-contract.ts
  └ Path does not exist

✗ Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-input-schemas.ts
  └ Path does not exist

✗ Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-input-schemas.ts
  └ Path does not exist

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ L42:90 (37 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L720:1065 (346 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L140:210 (71 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L543:720 (178 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L250:320 (71 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L300:355 (56 lines read)

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ L180:235 (56 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L1:120 (120 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L1:240 (240 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L255:335 (81 lines read)

● Read pe-orchestration.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts
  └ L90:140 (50 lines read)

● Read config.ts
  │ .opencode/skill/system-spec-kit/shared/config.ts
  └ L1:80 (47 lines read)

● Read config.ts
  │ .opencode/skill/system-spec-kit/mcp_server/core/config.ts
  └ L1:80 (80 lines read)

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L115:250 (136 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L100:185 (85 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L400:430 (31 lines read)

● Read eval-quality-proxy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-quality-proxy.ts
  └ L1:230 (214 lines read)

● Read retrieval-telemetry.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts
  └ L1:520 (520 lines read)

● Read factory.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/factory.ts
  └ L180:270 (91 lines read)

● Read eval-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts
  └ L1:45 (45 lines read)

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L615:640 (26 lines read)

● Read cli.ts
  │ .opencode/skill/system-spec-kit/mcp_server/cli.ts
  └ L45:70 (26 lines read)

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L300:340 (41 lines read)

● Read cli.ts
  │ .opencode/skill/system-spec-kit/mcp_server/cli.ts
  └ L345:360 (16 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2068:2182 (115 lines read)

● Read cli.ts
  │ .opencode/skill/system-spec-kit/mcp_server/cli.ts
  └ L480:505 (25 lines read)

● Search (grep)
  │ "ranking-contract" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 files found

● Search (glob)
  │ "**/125-hydra-roadmap-capability-flags.md" in .opencode/skill/system-spec-kit
  └ 1 file found

I’ve confirmed the biggest technical mismatches directly in code. I’m doing one last pass on the docs/config findings so I can separate true blockers from lower-severity drift.

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/README.md
  └ L820:890 (70 lines read)

● Read .env.example
  │ .opencode/skill/system-spec-kit/.env.example
  └ L1:120 (73 lines read)

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L570:585 (16 lines read)

● Read search-weights.json
  │ .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
  └ L1:30 (29 lines read)

● Read config.jsonc
  │ .opencode/skill/system-spec-kit/config/config.jsonc
  └ L1:30 (30 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L280:310 (31 lines read)

● Read feature-flag-reference-docs.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts
  └ L108:132 (23 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L380:398 (19 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/templates/README.md
  └ L82:95 (14 lines read)

● Read gate-enforcement.md
  │ .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md
  └ L60:75 (15 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L800:818 (19 lines read)

● Read paths.ts
  │ .opencode/skill/system-spec-kit/shared/paths.ts
  └ L1:40 (15 lines read)

● Read path-utils.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/path-utils.ts
  └ L1:100 (100 lines read)

● Read memory-crud-health.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
  └ L320:359 (40 lines read)

● Read backfill-frontmatter.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/backfill-frontmatter.ts
  └ L160:185 (26 lines read)

● Read memory-crud-utils.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-utils.ts
  └ L35:70 (35 lines read)

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L560:610 (51 lines read)

● Read voyage.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/providers/voyage.ts
  └ L1:150 (150 lines read)

● Read openai.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/providers/openai.ts
  └ L1:150 (150 lines read)

● Read score-resolution-consistency.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/score-resolution-consistency.vitest.ts
  └ L1:220 (128 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L815:835 (21 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L510:535 (26 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L735:790 (56 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L1058:1072 (14 lines read)

● Read ranking-contract.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/ranking-contract.ts
  └ L1:80 (64 lines read)

● Search (grep)
  │ "withSyncedScoreAliases\(|syncScoreAliasesInPlace\(|intentAdjustedScore|rrfScore"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 22 lines found

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L360:405 (46 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L620:650 (31 lines read)

● Read spec-folder-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts
  └ L1:220 (220 lines read)

● Read copilot-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "return \[\]|return null|return \{\}|return \{\s*exchanges:\s*\[\]" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 82 lines found

# Architecture Audit Review

_Read-only review; no code changes made._

## Validation Summary

I validated the **51 explicitly enumerated CRITICAL/HIGH findings** in `research.md` against the cited source. One meta-note: the report summary says **48 HIGH**, but the numbered findings enumerate **46 HIGH + 5 CRITICAL = 51** critical/high items.

- **Validated substantially as written:** 41
- **Validated, but with severity/scope adjustments:** 8
- **Questioned/overstated:** 2

### Most strongly validated findings

These held up cleanly on direct source review and should be treated as real defects:

- **F1.01** `handlers/save/pe-orchestration.ts:101-122` — supersession happens before replacement creation.
- **F1.02** `scripts/core/workflow.ts:2083-2106` — warning/simulation banners are prepended before byte-0 frontmatter.
- **F2.01** `stage1-candidate-gen.ts:281-285` + `hybrid-search.ts:557-1057` — Stage 1 still calls the legacy mini-pipeline, then Stages 2/3 process again.
- **F2.02** `pipeline/types.ts:58-67` + `stage3-rerank.ts:320-327` + `pipeline/ranking-contract.ts:39-53` — Stage 3 writes `score`, but downstream resolution still prefers Stage 2 aliases.
- **F2.03** `stage2-fusion.ts:382-389`, `639-641`, `165-173` — boosted scores can exceed normalized range before later clamping.
- **F3.04** `tool-schemas.ts:186-189` vs `schemas/tool-input-schemas.ts:162-168, 405-409` — `memory_save` advertises governance args that validation/whitelisting rejects.
- **F4.04 / F8.02** `shared/config.ts`, `shared/paths.ts`, `mcp_server/core/config.ts`, `vector-index-store.ts`, `eval-db.ts` — DB path resolution is both inconsistent and insufficiently contained.
- **F6.06** `lib/eval/eval-quality-proxy.ts` vs `lib/telemetry/retrieval-telemetry.ts` — same named metric, different semantics.
- **F9.09-F9.13** `shared/embeddings.ts`, `shared/embeddings/factory.ts`, `providers/openai.ts`, `providers/voyage.ts`, `vector-index-store.ts` — runtime failover/dimension handling is genuinely unsafe.

### Adjusted findings

These are real, but I would narrow or re-score them:

- **F1.01** remains serious, but the recommendation should explicitly require **one transaction**.
- **F1.07** is valid, but I would score it **Medium/High**, not an automatic High everywhere.
- **F1.08** is valid, but only on the **large-frontmatter detector-limit path**.
- **F1.13** is better described as “id-less rows bypass dedup” than a pure `Map<number, boolean>` bug.
- **F1.15** is valid, but the current precedence looks intentional; the fix needs an explicit rule change.
- **F3.04** is clearly valid for `memory_save`; the broader “tool catalog everywhere” wording is a bit too wide.
- **F4.02** is valid, but it is primarily a **cross-OS containment bug** rather than a conventional traversal exploit.
- **F9.02** is a strong operability issue, though less severe than the correctness/integrity defects above.

### Questioned / overstated

- **F8.01** — The split config situation is real, but `config/config.jsonc:4-6` already says only Section 1 is active. This is **documentation/UX debt**, not a hidden architectural contradiction.
- **F8.03** — Same story: `search-weights.json:7` explicitly says those multipliers are **reference/future-config only**. I would downgrade this from HIGH.

## Top 10 Actionable Improvements

| Rank | Improvement | Basis | Impact | Effort | Priority |
| --- | --- | --- | ---: | ---: | ---: |
| 1 | Fix the failing feature-flag docs test path | F8.13 | 3 | 1 | **3.00** |
| 2 | Fix CLI help/output so it stops advertising nonexistent `checkpoint restore` commands | F9.01 | 3 | 1 | **3.00** |
| 3 | Make MCP tool definitions, Zod schemas, and allowed-parameter lists derive from one source of truth; immediately fix `memory_save` governance args | F3.04, F8.08 | 5 | 2 | **2.50** |
| 4 | Preserve frontmatter at byte 0 by inserting warning/simulation banners after the frontmatter block | F1.02 | 5 | 2 | **2.50** |
| 5 | Make supersede-and-replace atomic: create the new row first, then supersede the old row inside the same transaction | F1.01 | 5 | 2 | **2.50** |
| 6 | Resync/clamp score aliases at Stage 2/3 boundaries so reranking actually affects final ordering | F2.02, F2.03 | 5 | 2 | **2.50** |
| 7 | Centralize DB path/env resolution and enforce containment in one shared validator | F4.04, F8.02 | 5 | 2 | **2.50** |
| 8 | Unify the quality-proxy metric into one canonical implementation used by both eval and telemetry | F6.06 | 4 | 2 | **2.00** |
| 9 | Close fail-open audit/health paths: mutation ledger, health diagnostics, and correction graph sync should surface partial failure explicitly | F1.10, F3.05, F3.07 | 4 | 2 | **2.00** |
| 10 | Add embedding dimension/runtime failover guardrails at provider init and DB init | F9.09-F9.13 | 5 | 3 | **1.67** |

### Strategic item just outside the top-10 by formula

- **F2.01** — Unwrap Stage 1 from `hybridSearch.searchWithFallback()` and finish the V2 pipeline separation.  
  Impact **5**, Effort **5**, Priority **1.00**.  
  This is the biggest architecture cleanup, but not the fastest fix.

## ADR Conflict Check

I found **no direct conflict** between the validated CRITICAL/HIGH findings and the accepted ADRs in `decision-record.md`.

### Findings that reinforce existing ADRs

- **ADR-003 (consolidate duplicate helper logic)** is reinforced by **F6.01**, **F6.06**, and parts of **F8.02**.
- **ADR-002 (transitional wrappers are not canonical)** is reinforced by the docs drift findings; the problem is not the ADR, it is that some docs/help text still imply the wrong canonical surface.

### Non-ADR contradictions

- **F8.11** is a real contradiction, but it is between `constitutional/gate-enforcement.md:66-68` and `templates/README.md:87-90`, not between code and an ADR.
- **F8.01** and **F8.03** are not ADR conflicts; both files explicitly label their reference-only status.

## Validated Strengths

These are worth preserving during remediation:

- The search pipeline has **explicit stage contracts and invariants** (`pipeline/orchestrator.ts`, `pipeline/types.ts`, `pipeline/ranking-contract.ts`) and corresponding regression tests (`tests/score-resolution-consistency.vitest.ts`).
- `scripts/utils/path-utils.ts` contains a **good canonical containment implementation** (`realpath`, relative containment checks, null-byte rejection). Weak callers should reuse this, not replace it.
- `lib/eval/eval-quality-proxy.ts` is a **clean, pure, well-documented metric implementation**. It should become the canonical version.
- Tool definitions are already **centralized structurally** in `tool-schemas.ts`; the main problem is drift from adjacent validation layers, not the absence of a schema system.
- The embeddings factory at least **logs dimension drift loudly** during fallback, which is much better than silently swapping models.

## Recommendations for Next Steps

1. **Do a focused hardening sprint on items 1-7 first.** They are localized, testable, and remove the highest-friction correctness and contract bugs.

2. **Add regression tests before broader refactors.** The must-have cases are:
   - frontmatter remains at byte 0
   - supersede/create atomicity
   - `memory_save` governance args accepted and validated
   - Stage 3 rerank changes final ordering
   - DB path containment and env precedence
   - CLI help path correctness
   - feature-flag docs test path correctness

3. **Open a separate design track for F2.01 and the embeddings dimension/failover cluster.** Both are real architecture issues, but they deserve bounded design work rather than opportunistic patching.

