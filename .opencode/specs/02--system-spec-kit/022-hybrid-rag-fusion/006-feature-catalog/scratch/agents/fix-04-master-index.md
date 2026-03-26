● skill(system-spec-kit)

I’m reading the master index and the source entries side by side, then I’ll patch only the broken/missing index rows and verify the updated links/text.

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1:260 (190 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L3860:3965 (106 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L4500:4615 (116 lines read)

● Read 10-fast-delegated-search-memory-quick-search.md
  │ .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/10-fast-delegated-search-memory-qu
  │ ick-search.md
  └ L1:120 (57 lines read)

● Read 18-template-compliance-contract-enforcement.md
  │ .opencode/skill/system-spec-kit/feature_catalog/16--tooling-and-scripts/18-template-compliance-c
  │ ontract-enforcement.md
  └ L1:120 (68 lines read)

● Read 08-audit-phase-020-mapping-note.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-ma
  │ pping-note.md
  └ L1:120 (10 lines read)

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md
  └ L1:120 (14 lines read)

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-
  │ category-stub.md
  └ L1:120 (13 lines read)

I found the exact remediation areas. Next I’m checking the section structure and the source flag docs so the master index matches the shipped per-file content, then I’ll patch and show the diff.

● Search (grep)
  │ "^## |^### " (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 5 lines found

● Search (grep)
  │ "comprehensive remediation sprint 8"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ No matches found

● Read 03-3-mcp-configuration.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuratio
  │ n.md
  └ L1:140 (40 lines read)

● Read 05-5-embedding-and-api.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-ap
  │ i.md
  └ L1:180 (39 lines read)

✗ Read plan.md
  │ ~/.copilot/session-state/47c2aa34-d663-4cdd-a29d-b4bfb85c5dc1/plan.md
  └ Path does not exist

● Edit
  └ Create ~/.copilot/session-state/47c2aa34-d663-4cdd-a29d-b4bfb85c5dc1/plan.md

I’ve narrowed the issue pattern: one retrieval entry and one tooling entry are missing their per-feature file links, while the two new audit-phase stub files belong in the audit mapping table, not as new top-level sections. I’m confirming exact insertion points now.

● Search (grep)
  │ "Fast delegated search|Template Compliance Contract Enforcement|Audit Phase Coverage Notes|##
  │ 21\. FEATURE FLAG REFERENCE|## 20\."
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 4 lines found

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L3700:3815 (116 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L4380:4665 (68 lines read)

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Fix documentation issues in
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md by adding missing catalog
  │ links, removing a broken internal anchor link, and aligning feature-flag reference descriptions
  │ with source docs" --threshold 0.8
  └ 43 lines...

● skill(sk-doc)

I’ve got the source-of-truth text for the three drifted flags. I’m doing one last pass over the tooling section order so the new entry lands in the least surprising place, then I’ll patch the file in one shot.

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L3280:3890 (235 lines read)

● Read feature_catalog_creation.md
  │ .agents/skills/sk-doc/references/specific/feature_catalog_creation.md
  └ L1:180 (179 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L3810:3888 (78 lines read)

● Read plan.md
  │ ~/.copilot/session-state/47c2aa34-d663-4cdd-a29d-b4bfb85c5dc1/plan.md
  └ L1:120 (5 lines read)

I’ve got a clean patch plan now: three small text corrections, one broken-link flattening, two direct feature-file links, and two audit-mapping stub links plus the missing tooling subsection. Applying that as a single surgical edit.

● Edit
  └ Edit .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md

Patch is in. I’m doing a quick verification pass on the edited ranges plus a doc validation run so I can hand back the exact diff confidently.

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L42:140 (98 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L3870:3960 (91 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L4532:4594 (63 lines read)

● Search (grep)
  │ "10-fast-delegated-search-memory-quick-search|18-template-compliance-contract-enforcement|08-aud
  │ it-phase-020-mapping-note|20--remediation-revalidation/01-category-stub|21--implement-and-remove
  │ -deprecated-features/01-category-stub|#comprehensive-remediation-sprint-8"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 5 lines found

● Validate doc and show diff (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && python3
  │ '.agents/skills/sk-doc/scripts/validate_document.py'
  │ '.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md' && git --no-pager diff --
  │ '.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md'
  └ 89 lines...

I’ve verified the edits and the document validator passes cleanly. I’m surfacing the focused diffs now so you can see exactly what changed without paging through the whole 4.6k-line file.

● Show diff FEATURE_CATALOG.md
  │
  │ 128
  │ 129     #### Source Files
  │ 130
  │ 131 -   - `mcp_server/tools/memory-tools.ts`
  │ 132 -   - `mcp_server/tool-schemas.ts`
  │ 133 -   - `mcp_server/schemas/tool-input-schemas.ts`
  │ 134 -   - `mcp_server/README.md`
  │ 131 +  See [`01--retrieval/10-fast-delegated-search-memory-quick-search.md`](01--retrieval/10-fa
  │        st-delegated-search-memory-quick-search.md) for full implementation and test file
  │        listings.
  │ 132
  │ 133     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md

● Show diff FEATURE_CATALOG.md
  │
  │ 43
  │ 44     | Audit phase | Catalog coverage |
  │ 45     |---|---|
  │ 46 -  | `020-feature-flag-reference` | Covered by [`19--feature-flag-reference/`](19--feature-fl
  │       ag-reference/01-1-search-pipeline-features-speckit.md) via slug match
  │       (`feature-flag-reference`) |
  │ 47 -  | `021-remediation-revalidation` | Covered as cross-category remediation records (for
  │       example: [08--bug-fixes-and-data-integrity/06](08--bug-fixes-and-data-integrity/06-guards-
  │       and-edge-cases.md),
  │       [14--pipeline-architecture/07](14--pipeline-architecture/07-search-pipeline-safety.md),
  │       [16--tooling-and-scripts/05](16--tooling-and-scripts/05-code-standards-alignment.md)) |
  │ 48 -  | `022-implement-and-remove-deprecated-features` | Covered by implementation/deprecation
  │       closure records
  │       ([16--tooling-and-scripts/04](16--tooling-and-scripts/04-dead-code-removal.md),
  │       [17--governance/02](17--governance/02-feature-flag-sunset-audit.md)) |
  │ 46 +  | `020-feature-flag-reference` | Covered by [`19--feature-flag-reference/`](19--feature-fl
  │       ag-reference/01-1-search-pipeline-features-speckit.md) via slug match
  │       (`feature-flag-reference`). See [`19--feature-flag-reference/08-audit-phase-020-mapping-no
  │       te.md`](19--feature-flag-reference/08-audit-phase-020-mapping-note.md). |
  │ 47 +  | `021-remediation-revalidation` | Covered as cross-category remediation records (for
  │       example: [08--bug-fixes-and-data-integrity/06](08--bug-fixes-and-data-integrity/06-guards-
  │       and-edge-cases.md),
  │       [14--pipeline-architecture/07](14--pipeline-architecture/07-search-pipeline-safety.md),
  │       [16--tooling-and-scripts/05](16--tooling-and-scripts/05-code-standards-alignment.md)). See
  │        [`20--remediation-revalidation/01-category-stub.md`](20--remediation-revalidation/01-cate
  │       gory-stub.md). |
  │ 48 +  | `022-implement-and-remove-deprecated-features` | Covered by implementation/deprecation
  │       closure records
  │       ([16--tooling-and-scripts/04](16--tooling-and-scripts/04-dead-code-removal.md),
  │       [17--governance/02](17--governance/02-feature-flag-sunset-audit.md)). See
  │       [`21--implement-and-remove-deprecated-features/01-category-stub.md`](21--implement-and-rem
  │       ove-deprecated-features/01-category-stub.md). |
  │ 49
  │ 50     ### Command-Surface Contract
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md

● Show diff FEATURE_CATALOG.md
  │
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
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md

● Show diff FEATURE_CATALOG.md
  │
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
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md

Fixed `FEATURE_CATALOG.md` and showed the focused diff hunks.

I added links for all 5 missing catalog files:
`01--retrieval/10...`, `16--tooling-and-scripts/18...`, `19--feature-flag-reference/08...`, `20--remediation-revalidation/01...`, and `21--implement-and-remove-deprecated-features/01...`.

I also removed the broken `#comprehensive-remediation-sprint-8` anchor by flattening it to plain text, and corrected the drifted flag rows for `MCP_MAX_MEMORY_TOKENS`, `EMBEDDING_DIM`, and `RERANKER_LOCAL` to match the per-flag docs.

Validation passed with `python3 .agents/skills/sk-doc/scripts/validate_document.py .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md`.

