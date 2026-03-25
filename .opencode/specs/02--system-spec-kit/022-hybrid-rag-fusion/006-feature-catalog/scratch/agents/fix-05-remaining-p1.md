● skill(system-spec-kit)

I’m verifying the current docs against the live implementation first, then I’ll patch only the stale statements and broken anchors.

● Read feature_catalog.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md
  └ L1:260 (175 lines read)

● Read feature_catalog_in_simple_terms.md
  │ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
  └ L1:260 (225 lines read)

● Read 07-namespace-management-crud-tools.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.
  │ md
  └ L1:240 (62 lines read)

● Read 09-correction-tracking-with-undo.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md
  └ L1:240 (50 lines read)

● Read 11-session-recovery-memory-continue.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-memory-continu
  │ e.md
  └ L1:260 (69 lines read)

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Create session plan file (shell)
  │ mkdir -p
  │ '/Users/michelkerkmeester/.copilot/session-state/fefb7868-2ba5-4126-84fa-1d85897f3f28' && cat
  │ >
  │ '/Users/michelkerkmeester/.copilot/session-state/fefb7868-2ba5-4126-84fa-1d85897f3f28/plan.md'
  │ <<'EOF'…
  └ 8 lines...

● search session recovery resume mode implementation memory continue tool handler current behavior …
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

● skill(sk-doc)

I’ve confirmed the broken TOCs. Now I’m checking the live shared-memory, corrections, and resume-mode code paths so the wording matches runtime behavior instead of older assumptions.

● Read continue.md
  │ .opencode/command/memory/continue.md
  └ L1:260 (260 lines read)

● Search (grep)
  │ "^##\s+[0-9]+\.\s+" (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md)
  └ 21 lines found

● Search (grep)
  │ "^##\s+[0-9]+\.\s+"
  │ (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md)
  └ 21 lines found

● Search (grep)
  │ "\[[^\]]+\]\(([^)#]+)\)"
  │ (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md)
  └ No matches found

● Search (grep)
  │ "resume|systemPromptContext|anchors|next-steps|blockers|summary|1200|minState|enableDedup|useDec
  │ ay" in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read shared-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
  └ L1:260 (260 lines read)

● Read shared-spaces.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts
  └ L1:320 (320 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:340 (340 lines read)

● Search (grep)
  │ "shared_space_upsert|shared_space_membership_set|actorUserId|actorAgentId|owner" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read corrections.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/learning/corrections.ts
  └ L1:320 (320 lines read)

● Search (grep)
  │ "correction|undo_correction|record_correction|SPECKIT_RELATIONS" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read lifecycle-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts
  └ L1:260 (66 lines read)

● Read memory-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts
  └ L1:260 (77 lines read)

I’ve got the key mismatch on shared-memory actors. Next I’m narrowing the resume-mode details and the corrections wiring so the final wording is precise, not hand-wavy.

● Search (grep)
  │ "shared_space_upsert|shared_space_membership_set|actorUserId|actorAgentId|shared_memory_enable|s
  │ hared_memory_status" (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 20 lines found

● Read shared.md
  │ .opencode/command/memory/shared.md
  └ L1:260 (260 lines read)

● Search (grep)
  │ "mode === 'resume'|resume|systemPromptContext|anchors|next-steps|blockers|summary|includeContent
  │ |minState|enableDedup|useDecay"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 70 lines found

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L1:320 (320 lines read)

● Search (grep)
  │ "memory_context\(|mode: 'resume'|anchors: \[|summary|blockers|next-steps|specFolder|manual|auto"
  │ (.opencode/command/memory/continue.md)
  └ 35 lines found

● Search (grep)
  │ "record_correction\(|undo_correction\(|get_correction|memory_corrections|SPECKIT_RELATIONS" in
  │ **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 89 lines found

● Search (grep)
  │ "memory_corrections|record_correction|undo_correction|corrections" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/tools)
  └ No matches found

● Search (grep)
  │ "\]\([^)]*--[^)]*\.md\)"
  │ (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md)
  └ No matches found

I’ve pinned down the last behavior mismatch: `/memory:continue` exposes `memory_stats`, but the live recovery chain is `memory_context` → `CONTINUE_SESSION.md` → anchored `memory_search` → `memory_list`. I’m patching the docs to say that plainly.

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L520:660 (141 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L1110:1145 (36 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L430:478 (49 lines read)

● Read shared-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
  └ L248:420 (173 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/learning/index.ts
  └ L1:220 (51 lines read)

● Search (grep)
  │ "memory_stats" (.opencode/command/memory/continue.md)
  └ 1 line found

● Search (grep)
  │ "memory_stats" in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 49 lines found

● Search (grep)
  │ "\[[^\]]+\]\([^)]*\.md\)"
  │ (.opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md)
  └ No matches found

I’ve got the exact text changes lined up now. I’m doing a single surgical patch across the five requested files, then I’ll run focused checks and show the diffs file by file.

● Edit
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-t
  │ ools.md
  │ Edit
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md
  └ Edit .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-memory-co
    ntinue.md

The patch is in. I’m running a couple of narrow checks now: TOC-to-heading validation, stale-phrase searches, and a clean diff check before I show you the per-file changes.

● Search (grep)
  │ "#(?:1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21)--" in feature_catalog*.md
  │ (.opencode/skill/system-spec-kit/feature_catalog)
  └ No matches found

● Search (grep)
  │ "exactly one actor identity|acting caller|during the learning pipeline|uses 4 shared MCP
  │ tools|system health context during recovery" in
  │ {01--retrieval/11-session-recovery-memory-continue.md,02--mutation/07-namespace-management-crud-
  │ tools.md,02--mutation/09-correction-tracking-with-undo.md}
  │ (.opencode/skill/system-spec-kit/feature_catalog)
  └ No matches found

● Validate TOC anchors and diff cleanliness (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ files = [
  │ Path('/Users/michelkerkmeester/MEGA/Development/Opencode …
  └ 46 lines...

Validation passed. I’m surfacing the diffs for the five requested files so you can review each remediation directly.

● Show diff feature_catalog_in_simple_terms.md
  │
  │ 11
  │ 12     ## TABLE OF CONTENTS
  │ 13
  │ 14 -   - [1. OVERVIEW](#1--overview)
  │ 15 -   - [2. RETRIEVAL](#2--retrieval)
  │ 16 -   - [3. MUTATION](#3--mutation)
  │ 17 -   - [4. DISCOVERY](#4--discovery)
  │ 18 -   - [5. MAINTENANCE](#5--maintenance)
  │ 19 -   - [6. LIFECYCLE](#6--lifecycle)
  │ 20 -   - [7. ANALYSIS](#7--analysis)
  │ 21 -   - [8. EVALUATION](#8--evaluation)
  │ 22 -   - [9. BUG FIXES AND DATA INTEGRITY](#9--bug-fixes-and-data-integrity)
  │ 23 -   - [10. EVALUATION AND MEASUREMENT](#10--evaluation-and-measurement)
  │ 24 -   - [11. GRAPH SIGNAL ACTIVATION](#11--graph-signal-activation)
  │ 25 -   - [12. SCORING AND CALIBRATION](#12--scoring-and-calibration)
  │ 26 -   - [13. QUERY INTELLIGENCE](#13--query-intelligence)
  │ 27 -   - [14. MEMORY QUALITY AND INDEXING](#14--memory-quality-and-indexing)
  │ 28 -   - [15. PIPELINE ARCHITECTURE](#15--pipeline-architecture)
  │ 29 -   - [16. RETRIEVAL ENHANCEMENTS](#16--retrieval-enhancements)
  │ 30 -   - [17. TOOLING AND SCRIPTS](#17--tooling-and-scripts)
  │ 31 -   - [18. GOVERNANCE](#18--governance)
  │ 32 -   - [19. UX HOOKS](#19--ux-hooks)
  │ 33 -   - [20. SPEC KIT PHASE WORKFLOWS](#20--spec-kit-phase-workflows)
  │ 34 -   - [21. FEATURE FLAG REFERENCE](#21--feature-flag-reference)
  │ 14 +   - [1. OVERVIEW](#1-overview)
  │ 15 +   - [2. RETRIEVAL](#2-retrieval)
  │ 16 +   - [3. MUTATION](#3-mutation)
  │ 17 +   - [4. DISCOVERY](#4-discovery)
  │ 18 +   - [5. MAINTENANCE](#5-maintenance)
  │ 19 +   - [6. LIFECYCLE](#6-lifecycle)
  │ 20 +   - [7. ANALYSIS](#7-analysis)
  │ 21 +   - [8. EVALUATION](#8-evaluation)
  │ 22 +   - [9. BUG FIXES AND DATA INTEGRITY](#9-bug-fixes-and-data-integrity)
  │ 23 +   - [10. EVALUATION AND MEASUREMENT](#10-evaluation-and-measurement)
  │ 24 +   - [11. GRAPH SIGNAL ACTIVATION](#11-graph-signal-activation)
  │ 25 +   - [12. SCORING AND CALIBRATION](#12-scoring-and-calibration)
  │ 26 +   - [13. QUERY INTELLIGENCE](#13-query-intelligence)
  │ 27 +   - [14. MEMORY QUALITY AND INDEXING](#14-memory-quality-and-indexing)
  │ 28 +   - [15. PIPELINE ARCHITECTURE](#15-pipeline-architecture)
  │ 29 +   - [16. RETRIEVAL ENHANCEMENTS](#16-retrieval-enhancements)
  │ 30 +   - [17. TOOLING AND SCRIPTS](#17-tooling-and-scripts)
  │ 31 +   - [18. GOVERNANCE](#18-governance)
  │ 32 +   - [19. UX HOOKS](#19-ux-hooks)
  │ 33 +   - [20. SPEC KIT PHASE WORKFLOWS](#20-spec-kit-phase-workflows)
  │ 34 +   - [21. FEATURE FLAG REFERENCE](#21-feature-flag-reference)
  │ 35
  │ 36     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog_in_simple_terms.md

● Show diff feature_catalog.md
  │
  │   11
  │   12     ## TABLE OF CONTENTS
  │   13
  │   14 -   - [1. OVERVIEW](#1--overview)
  │   15 -   - [2. RETRIEVAL](#2--retrieval)
  │   16 -   - [3. MUTATION](#3--mutation)
  │   17 -   - [4. DISCOVERY](#4--discovery)
  │   18 -   - [5. MAINTENANCE](#5--maintenance)
  │   19 -   - [6. LIFECYCLE](#6--lifecycle)
  │   20 -   - [7. ANALYSIS](#7--analysis)
  │   21 -   - [8. EVALUATION](#8--evaluation)
  │   22 -   - [9. BUG FIXES AND DATA INTEGRITY](#9--bug-fixes-and-data-integrity)
  │   23 -   - [10. EVALUATION AND MEASUREMENT](#10--evaluation-and-measurement)
  │   24 -   - [11. GRAPH SIGNAL ACTIVATION](#11--graph-signal-activation)
  │   25 -   - [12. SCORING AND CALIBRATION](#12--scoring-and-calibration)
  │   26 -   - [13. QUERY INTELLIGENCE](#13--query-intelligence)
  │   27 -   - [14. MEMORY QUALITY AND INDEXING](#14--memory-quality-and-indexing)
  │   28 -   - [15. PIPELINE ARCHITECTURE](#15--pipeline-architecture)
  │   29 -   - [16. RETRIEVAL ENHANCEMENTS](#16--retrieval-enhancements)
  │   30 -   - [17. TOOLING AND SCRIPTS](#17--tooling-and-scripts)
  │   31 -   - [18. GOVERNANCE](#18--governance)
  │   32 -   - [19. UX HOOKS](#19--ux-hooks)
  │   33 -   - [20. SPEC KIT PHASE WORKFLOWS](#20--spec-kit-phase-workflows)
  │   34 -   - [21. FEATURE FLAG REFERENCE](#21--feature-flag-reference)
  │   14 +   - [1. OVERVIEW](#1-overview)
  │   15 +   - [2. RETRIEVAL](#2-retrieval)
  │   16 +   - [3. MUTATION](#3-mutation)
  │   17 +   - [4. DISCOVERY](#4-discovery)
  │   18 +   - [5. MAINTENANCE](#5-maintenance)
  │   19 +   - [6. LIFECYCLE](#6-lifecycle)
  │   20 +   - [7. ANALYSIS](#7-analysis)
  │   21 +   - [8. EVALUATION](#8-evaluation)
  │   22 +   - [9. BUG FIXES AND DATA INTEGRITY](#9-bug-fixes-and-data-integrity)
  │   23 +   - [10. EVALUATION AND MEASUREMENT](#10-evaluation-and-measurement)
  │   24 +   - [11. GRAPH SIGNAL ACTIVATION](#11-graph-signal-activation)
  │   25 +   - [12. SCORING AND CALIBRATION](#12-scoring-and-calibration)
  │   26 +   - [13. QUERY INTELLIGENCE](#13-query-intelligence)
  │   27 +   - [14. MEMORY QUALITY AND INDEXING](#14-memory-quality-and-indexing)
  │   28 +   - [15. PIPELINE ARCHITECTURE](#15-pipeline-architecture)
  │   29 +   - [16. RETRIEVAL ENHANCEMENTS](#16-retrieval-enhancements)
  │   30 +   - [17. TOOLING AND SCRIPTS](#17-tooling-and-scripts)
  │   31 +   - [18. GOVERNANCE](#18-governance)
  │   32 +   - [19. UX HOOKS](#19-ux-hooks)
  │   33 +   - [20. SPEC KIT PHASE WORKFLOWS](#20-spec-kit-phase-workflows)
  │   34 +   - [21. FEATURE FLAG REFERENCE](#21-feature-flag-reference)
  │   35
  │   36     ---
  │   37
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │   43
  │   44     | Audit phase | Catalog coverage |
  │   45     |---|---|
  │   46 -  | `020-feature-flag-reference` | Covered by [`19--feature-flag-reference/`](19--feature-
  │         flag-reference/01-1-search-pipeline-features-speckit.md) via slug match
  │         (`feature-flag-reference`) |
  │   47 -  | `021-remediation-revalidation` | Covered as cross-category remediation records (for
  │         example: [08--bug-fixes-and-data-integrity/06](08--bug-fixes-and-data-integrity/06-guard
  │         s-and-edge-cases.md),
  │         [14--pipeline-architecture/07](14--pipeline-architecture/07-search-pipeline-safety.md),
  │         [16--tooling-and-scripts/05](16--tooling-and-scripts/05-code-standards-alignment.md)) |
  │   48 -  | `022-implement-and-remove-deprecated-features` | Covered by implementation/deprecation
  │          closure records
  │         ([16--tooling-and-scripts/04](16--tooling-and-scripts/04-dead-code-removal.md),
  │         [17--governance/02](17--governance/02-feature-flag-sunset-audit.md)) |
  │   46 +  | `020-feature-flag-reference` | Covered by [`19--feature-flag-reference/`](19--feature-
  │         flag-reference/01-1-search-pipeline-features-speckit.md) via slug match
  │         (`feature-flag-reference`). See [`19--feature-flag-reference/08-audit-phase-020-mapping-
  │         note.md`](19--feature-flag-reference/08-audit-phase-020-mapping-note.md). |
  │   47 +  | `021-remediation-revalidation` | Covered as cross-category remediation records (for
  │         example: [08--bug-fixes-and-data-integrity/06](08--bug-fixes-and-data-integrity/06-guard
  │         s-and-edge-cases.md),
  │         [14--pipeline-architecture/07](14--pipeline-architecture/07-search-pipeline-safety.md),
  │         [16--tooling-and-scripts/05](16--tooling-and-scripts/05-code-standards-alignment.md)).
  │         See [`20--remediation-revalidation/01-category-stub.md`](20--remediation-revalidation/01
  │         -category-stub.md). |
  │   48 +  | `022-implement-and-remove-deprecated-features` | Covered by implementation/deprecation
  │          closure records
  │         ([16--tooling-and-scripts/04](16--tooling-and-scripts/04-dead-code-removal.md),
  │         [17--governance/02](17--governance/02-feature-flag-sunset-audit.md)). See
  │         [`21--implement-and-remove-deprecated-features/01-category-stub.md`](21--implement-and-r
  │         emove-deprecated-features/01-category-stub.md). |
  │   49
  │   50     ### Command-Surface Contract
  │   51
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │  128
  │  129     #### Source Files
  │  130
  │  131 -   - `mcp_server/tools/memory-tools.ts`
  │  132 -   - `mcp_server/tool-schemas.ts`
  │  133 -   - `mcp_server/schemas/tool-input-schemas.ts`
  │  134 -   - `mcp_server/README.md`
  │  131 +  See [`01--retrieval/10-fast-delegated-search-memory-quick-search.md`](01--retrieval/10-f
  │         ast-delegated-search-memory-quick-search.md) for full implementation and test file
  │         listings.
  │  132
  │  133     ---
  │  134
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 3881
  │ 3882     ---
  │ 3883
  │ 3884 +   ### Template compliance contract enforcement
  │ 3885 +
  │ 3886 +   #### Description
  │ 3887 +
  │ 3888 +  Template compliance contract enforcement is a 3-layer defense-in-depth system that helps
  │          spec folder documents pass structural validation on first write. It gives `@speckit`
  │         agents the exact required structure before they write, validates immediately after
  │         write, and backs that with section-depth minimums so thin documents do not slip through
  │         on headings alone.
  │ 3889 +
  │ 3890 +   #### Current Reality
  │ 3891 +
  │ 3892 +  The canonical structural contract lives in
  │         `references/validation/template_compliance_contract.md`. A compact anchor-to-H2 contract
  │          is embedded in all five CLI `@speckit` agent definitions so each runtime knows the
  │         required section order, anchors, and minimum structure before writing spec folder
  │         markdown.
  │ 3893 +
  │ 3894 +  After any spec folder `.md` write, the workflow runs `validate.sh --strict` against the
  │         spec folder. Exit code `2` flags concrete violations for repair, while the contract's
  │         section-count minimums provide a third safeguard against documents that are structurally
  │          valid but not substantive enough for their level.
  │ 3895 +
  │ 3896 +   #### Source Files
  │ 3897 +
  │ 3898 +  See [`16--tooling-and-scripts/18-template-compliance-contract-enforcement.md`](16--tooli
  │         ng-and-scripts/18-template-compliance-contract-enforcement.md) for full implementation
  │         and verification file listings.
  │ 3899 +
  │ 3900 +   ---
  │ 3901 +
  │ 3902     ## 18. GOVERNANCE
  │ 3903
  │ 3904     ### Feature flag governance
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 3937
  │ 3938    **Phase 017 update:** The legacy V1 pipeline code was removed, leaving the 4-stage
  │         pipeline as the only supported path. `SPECKIT_PIPELINE_V2` remains part of historical
  │         audit context but is no longer consumed by runtime code.
  │ 3939
  │ 3925 -  **Sprint 8 update:** Flag graduation and dead code removal have been completed. The
  │         Sprint 8 comprehensive remediation removed a large dead-code slice including: dead
  │         feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag
  │         functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state
  │         (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in
  │         `working-memory.ts`) and dead functions/exports (`computeCausalDepth` single-node
  │         variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`).
  │         `isInShadowPeriod` in learned feedback remains active as Safeguard #6. See
  │         [Comprehensive remediation (Sprint 8)](#comprehensive-remediation-sprint-8) for the full
  │          accounting.
  │ 3940 +  **Sprint 8 update:** Flag graduation and dead code removal have been completed. The
  │         Sprint 8 comprehensive remediation removed a large dead-code slice including: dead
  │         feature flag branches in `hybrid-search.ts` (RSF and shadow-scoring), dead feature flag
  │         functions (`isShadowScoringEnabled`, `isRsfEnabled`), dead module-level state
  │         (`stmtCache`, `lastComputedAt`, `activeProvider`, `flushCount`, 3 dead config fields in
  │         `working-memory.ts`) and dead functions/exports (`computeCausalDepth` single-node
  │         variant, `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, `logCoActivationEvent`).
  │         `isInShadowPeriod` in learned feedback remains active as Safeguard #6. See Comprehensive
  │          remediation (Sprint 8) for the full accounting.
  │ 3941
  │ 3942     #### Source Files
  │ 3943
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 4550    | `MCP_CHARS_PER_TOKEN` | `4` | number | `lib/validation/preflight.ts` |
  │         Characters-per-token ratio used for save-time token budget estimation during pre-flight
  │         validation. The same ratio is also shared by the quality loop when trimming to its
  │         default token budget. |
  │ 4551    | `MCP_DUPLICATE_THRESHOLD` | `0.95` | number | `lib/validation/preflight.ts` | Cosine
  │         similarity threshold above which a new memory is considered a near-duplicate of an
  │         existing one during pre-flight validation. Duplicates above this threshold are rejected
  │         by the quality gate Layer 3. |
  │ 4552    | `MCP_MAX_CONTENT_LENGTH` | `250000` | number | `lib/validation/preflight.ts` | Maximum
  │          allowed content length in characters for a memory file. Files exceeding this limit are
  │         rejected at pre-flight validation before any embedding generation or database writes. |
  │
  │ 4538 -  | `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum
  │         token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight validation
  │         warns when a memory exceeds this limit. |
  │ 4553 +  | `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum
  │         token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight hard-fails
  │         with PF020 (`TOKEN_BUDGET_EXCEEDED`) when a memory exceeds this limit. |
  │ 4554    | `MCP_MIN_CONTENT_LENGTH` | `10` | number | `lib/validation/preflight.ts` | Minimum
  │         content length in characters for a valid memory file. Files shorter than this are
  │         rejected at pre-flight. The quality gate Layer 1 requires at least 50 characters, so
  │         this lower floor catches truly empty files. |
  │ 4555    | `MCP_TOKEN_WARNING_THRESHOLD` | `0.8` | number | `lib/validation/preflight.ts` |
  │         Fraction of `MCP_MAX_MEMORY_TOKENS` at which a token budget warning is emitted. At 0.8,
  │         a warning fires when estimated tokens exceed 80% of the max. |
  │ 4556
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 4600     | Name | Default | Type | Source File | Description |
  │ 4601     |---|---|---|---|---|
  │ 4602    | `COHERE_API_KEY` | _(none)_ | string | `tests/search-limits-scoring.vitest.ts` | API
  │         key for the Cohere reranker provider. When present, the cross-encoder reranker uses
  │         Cohere's rerank API. Falls back to local or Voyage reranker when absent. |
  │ 4588 -  | `EMBEDDING_DIM` | _(provider default)_ | number | `lib/search/vector-index-store.ts` |
  │          Compatibility check for the stored vector dimension. Runtime dimension selection comes
  │         from the active provider profile (Voyage 1024, OpenAI 1536, local 768 fallback); the env
  │          var only short-circuits confirmation when explicitly set to `'768'`. |
  │ 4603 +  | `EMBEDDING_DIM` | _(provider default)_ | number | `lib/search/vector-index-store.ts`,
  │         `shared/embeddings/factory.ts` | Compatibility check and startup override for the stored
  │          vector dimension. Any positive explicit `EMBEDDING_DIM` value is honored first;
  │         otherwise runtime dimension selection comes from the active provider profile (Voyage
  │         1024, OpenAI 1536, local 768 fallback). |
  │ 4604    | `EMBEDDINGS_PROVIDER` | `'auto'` | string | `shared/embeddings/factory.ts` | Selects
  │         the embedding provider. Valid values include `'auto'`, `'openai'`, `'hf-local'`, and
  │         `'voyage'`. In `'auto'` mode, resolution precedence is explicit `EMBEDDINGS_PROVIDER` ->
  │          `VOYAGE_API_KEY` -> `OPENAI_API_KEY` -> local fallback. |
  │ 4605    | `OPENAI_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the
  │         OpenAI embeddings provider. Required when `EMBEDDINGS_PROVIDER` is `'openai'` or when
  │         `'auto'` mode selects OpenAI as the available provider. |
  │ 4591 -  | `RERANKER_LOCAL` | `false` | boolean | `lib/search/local-reranker.ts` | **IMPLEMENTED
  │         (Sprint 019).** When set to `'true'` (strict string equality, not truthy), enables the
  │         local GGUF reranker via `node-llama-cpp`. Requires model file on disk and sufficient
  │         total system memory (8GB default, 2GB with custom `SPECKIT_RERANKER_MODEL`). Sequential
  │         per-candidate inference; expect 200-400ms for top-20 on Apple Silicon (CHK-113). Falls
  │         back silently to algorithmic RRF scoring on any precondition failure. |
  │ 4606 +  | `RERANKER_LOCAL` | `false` | boolean | `lib/search/local-reranker.ts` | **IMPLEMENTED
  │         (Sprint 019).** When set to `'true'` (strict string equality, not truthy), enables the
  │         local GGUF reranker via `node-llama-cpp`. Requires model file on disk and sufficient
  │         total system memory (8GB default, 2GB with custom `SPECKIT_RERANKER_MODEL`). Sequential
  │         per-candidate inference; expect 200-400ms for top-20 on Apple Silicon (CHK-113). Falls
  │         back to the original candidate ordering on precondition failure or runtime inference
  │         error. |
  │ 4607    | `VOYAGE_API_KEY` | _(none)_ | string | `tests/embeddings.vitest.ts` | API key for the
  │         Voyage AI embeddings and reranker provider. In `'auto'` mode, Voyage is preferred over
  │         OpenAI when this key is present. |
  │ 4608
  │ 4609     #### Source Files
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md

● Show diff 07-namespace-management-crud-tools.md
  │
  │ 15
  │ 16     **SHIPPED.** All 4 tools are live at L5 under `/memory:shared`:
  │ 17
  │ 18 -  - **`shared_space_upsert`** -- Creates or updates a shared-memory space. Requires
  │       `spaceId`, `tenantId`, `name`, and exactly one actor identity (`actorUserId` or
  │       `actorAgentId`). Supports optional rollout parameters (`rolloutEnabled`, `rolloutCohort`,
  │       `killSwitch`). The first successful create for a new space auto-grants `owner` access to
  │       the acting caller. Later updates require the acting caller to already hold `owner` access.
  │
  │ 18 +  - **`shared_space_upsert`** -- Creates or updates a shared-memory space. Requires
  │       `spaceId`, `tenantId`, and `name`. `actorUserId` and `actorAgentId` are optional
  │       corroboration hints, not the authority for the mutation. If a hint is supplied, at most
  │       one may be provided and it must match the single shared-memory admin identity configured
  │       on the server. Supports optional rollout parameters (`rolloutEnabled`, `rolloutCohort`,
  │       `killSwitch`). The first successful create for a new space auto-grants `owner` access to
  │       that server-configured admin identity. Later updates require that same identity to already
  │        hold `owner` access.
  │ 19
  │ 20 -  - **`shared_space_membership_set`** -- Controls user/agent access with a deny-by-default
  │       model. Requires `spaceId`, `tenantId`, `subjectType` (`user` or `agent`), `subjectId`,
  │       `role` (`owner`, `editor`, or `viewer`), and exactly one actor identity (`actorUserId` or
  │       `actorAgentId`). The actor must already own the target space. This tool manages
  │       individual-level membership, not spec-folder participation.
  │ 20 +  - **`shared_space_membership_set`** -- Controls user/agent access with a deny-by-default
  │       model. Requires `spaceId`, `tenantId`, `subjectType` (`user` or `agent`), `subjectId`, and
  │        `role` (`owner`, `editor`, or `viewer`). `actorUserId` and `actorAgentId` remain optional
  │        corroboration hints only; when present, at most one may be sent and it must match the
  │       server-configured shared-memory admin identity that actually authorizes the mutation. That
  │        admin identity must already own the target space. This tool manages individual-level
  │       membership, not spec-folder participation.
  │ 21
  │ 22    - **`shared_memory_status`** -- Reports whether shared memory is enabled and which
  │       shared-space IDs are accessible for the provided scope. Accepts optional scope filters:
  │       `tenantId`, `userId`, `agentId`. Returns `enabled`, `allowedSharedSpaceIds`, and the
  │       echoed scope IDs.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/07-namespace-management-crud-tools.
    md

● Show diff 09-correction-tracking-with-undo.md
  │
  │ 15
  │ 16     ## 2. CURRENT REALITY
  │ 17
  │ 18 -  The corrections module (`lib/learning/corrections.ts`) tracks inter-memory relationship
  │       signals during the learning pipeline. When a memory supersedes, deprecates, refines, or
  │       merges with another, the correction is recorded with before/after stability scores and
  │       applied penalty/boost values. Four correction types are supported: `superseded`,
  │       `deprecated`, `refined`, and `merged`.
  │ 18 +  The corrections module (`lib/learning/corrections.ts`) implements inter-memory
  │       relationship recording and stability-adjustment logic as a library module. When a caller
  │       invokes it, a correction can record before/after stability scores plus applied
  │       penalty/boost values for four correction types: `superseded`, `deprecated`, `refined`, and
  │        `merged`.
  │ 19
  │ 20    Each correction adjusts the stability scores of both the original and correcting memories:
  │        the original receives a penalty while the correction receives a boost. Stability changes
  │       are tracked in a `StabilityChanges` structure for audit purposes. The feature is gated by
  │       `SPECKIT_RELATIONS` (default `true`). When disabled, relational learning corrections are
  │       skipped and no stability adjustments are applied.
  │ 21
  │ 22 -  Undo is part of the live behavior, not just the schema. `undo_correction()` runs inside a
  │       transaction with three steps:
  │ 22 +  This module is implemented and tested, but it is **not** currently wired to any MCP tool
  │       endpoint or mutation-handler hot path. `record_correction()`, `undo_correction()`, and the
  │        correction history/stat helpers are exported through `lib/learning/index.ts`, yet no
  │       handler or tool dispatcher calls them today. Treat the behavior below as library
  │       capability rather than live end-user MCP behavior.
  │ 23 +
  │ 24 +  Undo logic exists in the module. `undo_correction()` runs inside a transaction with three
  │       steps:
  │ 25
  │ 26    1. **Stability rollback** -- restores the pre-correction stability values for both the
  │       original memory and the correcting memory using the `before_stability` and
  │       `after_stability` values stored on the correction row at record time.
  │ 27    2. **`is_undone` marking** -- sets `is_undone = 1` and records `undone_at =
  │       datetime('now')` on the correction row so the correction is permanently flagged as
  │       reversed without deleting the audit trail.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/09-correction-tracking-with-undo.md

● Show diff 11-session-recovery-memory-continue.md
  │
  │  7
  │  8     ## 1. OVERVIEW
  │  9
  │ 10 -  When a session is interrupted by a crash, context compaction, or timeout,
  │       `/memory:continue` reconstructs the most likely previous session state and routes the user
  │        to the best next step. It is one of the 6 shipped memory commands and uses 4 shared MCP
  │       tools borrowed from `/memory:analyze` and `/memory:manage`.
  │ 10 +  When a session is interrupted by a crash, context compaction, or timeout,
  │       `/memory:continue` reconstructs the most likely previous session state and routes the user
  │        to the best next step. It is one of the 6 shipped memory commands and exposes 4 shared
  │       MCP tools borrowed from `/memory:analyze` and `/memory:manage`.
  │ 11
  │ 12     ---
  │ 13
  │ 14     ## 2. CURRENT REALITY
  │ 15
  │ 16 -   **SHIPPED.** `/memory:continue` is live and uses 4 shared MCP tools:
  │ 16 +   **SHIPPED.** `/memory:continue` is live and exposes 4 shared MCP tools:
  │ 17
  │ 18 -  - **`memory_context`** (from `/memory:analyze`) -- Called in `resume` mode as the primary
  │       recovery path. Uses anchors `["state", "next-steps", "summary", "blockers"]` with a
  │       1200-token budget, `minState=WARM`, `includeContent=true`, dedup and decay both disabled.
  │ 18 +  - **`memory_context`** (from `/memory:analyze`) -- Called in `resume` mode as the primary
  │       recovery path. In `mcp_server/handlers/memory-context.ts`, resume mode is a dedicated
  │       `memory_search`-backed strategy with anchors `["state", "next-steps", "summary",
  │       "blockers"]`, default `limit=5`, a 1200-token budget, `minState=WARM`,
  │       `includeContent=true`, and both dedup and decay disabled. When auto-resume is enabled and
  │       the caller resumes a reusable working-memory session, `systemPromptContext` is injected
  │       before token-budget enforcement.
  │ 19    - **`memory_search`** (from `/memory:analyze`) -- Fallback for thin summaries when
  │       `memory_context` returns the right folder but insufficient state detail. Uses the same
  │       resume anchors.
  │ 20    - **`memory_list`** (from `/memory:manage`) -- Recent-candidate discovery when no clear
  │       session candidate exists. Returns the 5 most recently updated memories.
  │ 21 -  - **`memory_stats`** (from `/memory:manage`) -- Available for system health context during
  │        recovery.
  │ 21 +  - **`memory_stats`** (from `/memory:manage`) -- Exposed on the command surface, but not
  │       part of the primary recovery chain documented in the live `/memory:continue` workflow.
  │ 22
  │ 23     ### Recovery Modes
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/11-session-recovery-memory-continu
    e.md

Done.

- `feature_catalog.md`: fixed all 21 TOC anchors from `#N--slug` to `#N-slug`.
- `feature_catalog_in_simple_terms.md`: applied the same 21 TOC fixes; checked category-doc links and found no broken markdown links to patch.
- `02--mutation/07-namespace-management-crud-tools.md`: corrected actor wording to match code. The server-configured shared-memory admin is authoritative; `actorUserId`/`actorAgentId` are optional corroboration hints.
- `02--mutation/09-correction-tracking-with-undo.md`: clarified the corrections module exists and is tested, but is not wired to any MCP tool/handler path.
- `01--retrieval/11-session-recovery-memory-continue.md`: aligned resume-mode wording with live `mcp_server` behavior and noted `memory_stats` is exposed, not part of the primary recovery chain.

Validated with TOC checks and `git diff --check`.

