● skill(sk-code-review)

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Security review of feature catalog entries in
  │ .opencode/skill/system-spec-kit/feature_catalog focusing on secrets, unsafe patterns, and
  │ misleading security claims vs mcp_server" --threshold 0.8
  └ 43 lines...

I’m mapping the catalog entries to the server code now so I can check for security-only issues rather than general alignment. Next I’ll scan the requested sections in parallel and spot-check any security claims against `mcp_server/`.

● skill(sk-code-opencode)

● Read review_core.md
  │ .agents/skills/sk-code-review/references/review_core.md
  └ L1:220 (98 lines read)

● Read security_checklist.md
  │ .agents/skills/sk-code-review/references/security_checklist.md
  └ L1:220 (206 lines read)

● Read quick_reference.md
  │ .agents/skills/sk-code-review/references/quick_reference.md
  └ L1:220 (59 lines read)

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/1ef2a597-391e-4c74-981b-4e070db7a7ac/plan.md'
  │ <<'EOF'
  │ Security review plan
  │ 1. Inventory requested feature_catalog sections and relevant files.…
  └ 5 lines...

I’ve loaded the review baseline and OpenCode overlay. Now I’m inventorying the requested catalog slices and pulling the server-side code paths that back the main security claims so I can flag only real security issues.

● Search (grep)
  │ "api[_-]?key|secret|token|password|credential|private key|BEGIN .* PRIVATE KEY|sql
  │ injection|path
  │ traversal|unvalidated|sanitize|validation|guardrail|auth|authorization|tenant|shared
  │ memory|deny-by-default|containment|canonical|path\.resolve|path traversal|injection" in
  │ {01--retrieval,02--mutation,07--evaluation,08--bug-fixes-and-data-integrity,17--governance,18--u
  │ x-hooks}/**/*.md (.opencode/skill/system-spec-kit/feature_catalog)
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/07--evaluation/**/*.md"
  └ 2 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/01--retrieval/**/*.md"
  └ 11 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/02--mutation/**/*.md"
  └ 10 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/**/*.md"
  └ 11 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/17--governance/**/*.md"
  └ 4 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/**/*.md"
  └ 19 files found

● search security validation authorization tenant isolation canonical path containment input valida…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

The keyword sweep came back mostly quiet, so I’m switching to a file-by-file pass and targeted server spot-checks. I’m first sizing the documents so I can batch the reads efficiently and then I’ll verify the highest-risk claims in `mcp_server/`.

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

● Count lines in catalog files (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')
  │ sections = ['01--retrieval','02--mutation','07--evaluation','08--bug-fixes-and-data-integrity'…
  └ 64 lines...

● Explore Scout security risks
  │ Read governance 01 (shell)
  │   │ head -200 "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   Env/Public/.opencode/skill/system-
  │   │ spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md"
  │   └ 39 lines...
  └ Read governance 04 (shell)
      │ head -200 "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/04-shared-memory-r
      ollo
      │ ut-deny-by-default-membership-and-kill-switch.md"
      └ 70 lines...

● Search (grep)
  │ "security|secret|credential|token|password|api key|auth|authorization|tenant|shared memory|kill
  │ switch|deny-by-default|confirmname|audit|retention|provenance|canonical|containment|path|travers
  │ al|sanitize|validate|validation|guardrail|unsafe|inject|exposure|scope" in *.md
  │ (.opencode/skill/system-spec-kit/feature_catalog/17--governance)
  └ 47 lines found

● Search (grep)
  │ "security|secret|credential|token|password|api key|auth|authorization|tenant|shared memory|kill
  │ switch|deny-by-default|confirmname|audit|retention|provenance|canonical|containment|path|travers
  │ al|sanitize|validate|validation|guardrail|unsafe|inject|exposure|scope" in *.md
  │ (.opencode/skill/system-spec-kit/feature_catalog/02--mutation)
  └ 5 lines found

● Search (grep)
  │ "security|secret|credential|token|password|api key|auth|authorization|tenant|shared memory|kill
  │ switch|deny-by-default|confirmname|audit|retention|provenance|canonical|containment|path|travers
  │ al|sanitize|validate|validation|guardrail|unsafe|inject|exposure|scope" in *.md
  │ (.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks)
  └ 5 lines found

● Search (grep)
  │ "security|secret|credential|token|password|api key|auth|authorization|tenant|shared memory|kill
  │ switch|deny-by-default|confirmname|audit|retention|provenance|canonical|containment|path|travers
  │ al|sanitize|validate|validation|guardrail|unsafe|inject|exposure|scope" in *.md
  │ (.opencode/skill/system-spec-kit/feature_catalog/01--retrieval)
  └ 5 lines found

● Search (grep)
  │ "security|secret|credential|token|password|api key|auth|authorization|tenant|shared memory|kill
  │ switch|deny-by-default|confirmname|audit|retention|provenance|canonical|containment|path|travers
  │ al|sanitize|validate|validation|guardrail|unsafe|inject|exposure|scope" in *.md
  │ (.opencode/skill/system-spec-kit/feature_catalog/07--evaluation)
  └ 10 lines found

● Search (grep)
  │ "security|secret|credential|token|password|api key|auth|authorization|tenant|shared memory|kill
  │ switch|deny-by-default|confirmname|audit|retention|provenance|canonical|containment|path|travers
  │ al|sanitize|validate|validation|guardrail|unsafe|inject|exposure|scope" in *.md
  │ (.opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity)
  └ 34 lines found

I’ve narrowed it to the governance and UX hook entries that actually make security-relevant promises, plus a couple of path-safety/data-integrity docs. I’m now checking the concrete handlers and schemas they cite to see whether those claims really hold.

● Search (grep)
  │ "shared_memory_enable|shared_space|kill switch|killSwitch|deny-by-default|membership|confirmName
  │ |provenanceSource|provenanceActor|retentionPolicy|deleteAfter|validateGovernedIngest|audit
  │ trail|record deny|governance audit|tenantId|sharedSpaceId" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/governance/*.ts"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/handlers/*.ts"
  └ 31 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/hooks/**/*.ts"
  └ 4 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/utils/*path*.ts"
  └ 2 files found

● Read (Explore agent — Scout security risks)
  └ Running

● Read 03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/17--governance/03-hierarchical-scope-governance-
  │ governed-ingest-retention-and-audit.md
  └ L1:120 (62 lines read)

● Read 04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md
  │ .opencode/skill/system-spec-kit/feature_catalog/17--governance/04-shared-memory-rollout-deny-by-
  │ default-membership-and-kill-switch.md
  └ L1:120 (69 lines read)

● Read 03-checkpoint-delete-confirmname-safety.md
  │ .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/03-checkpoint-delete-confirmname-sa
  │ fety.md
  └ L1:220 (144 lines read)

● Read 07-mutation-response-ux-payload-exposure.md
  │ .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/07-mutation-response-ux-payload-exp
  │ osure.md
  └ L1:120 (50 lines read)

● Read 04-sha-256-content-hash-deduplication.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/04-sha-256-cont
  │ ent-hash-deduplication.md
  └ L1:120 (69 lines read)

● Read 06-guards-and-edge-cases.md
  │ .opencode/skill/system-spec-kit/feature_catalog/08--bug-fixes-and-data-integrity/06-guards-and-e
  │ dge-cases.md
  └ L1:120 (56 lines read)

● Search (grep)
  │ "validateGovernedIngest|provenanceSource|provenanceActor|retentionPolicy|deleteAfter|audit|share
  │ dSpaceId|tenantId|userId|agentId|sessionId"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 53 lines found

● Search (grep)
  │ "shared memory|killSwitch|isSharedMemoryEnabled|membership|sharedSpace|deny|allow|tenant
  │ alignment|shared_space" (.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts)
  └ 94 lines found

● Search (grep)
  │ "evaluateAccess|validateGovernedIngest|audit|deny|allow|sharedSpace|tenant|actor|session"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
  └ 5 lines found

● Search (grep)
  │ "sharedSpace|membership|killSwitch|allowedSharedSpaces|tenantId|userId|agentId|sessionId"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 14 lines found

● Search (grep)
  │ "confirmName|checkpoint.*delete|safetyConfirmationUsed"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
  └ 18 lines found

● Search (grep)
  │ "confirmName|shared_memory_enable|shared_space_upsert|shared_space_membership_set|shared_memory_
  │ status|provenanceSource|provenanceActor|retentionPolicy|deleteAfter"
  │ (.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts)
  └ 15 lines found

● Search (grep)
  │ "postMutationHooks|hint|cache|toolCacheInvalidated|contentHash|duplicate|no-op|payload"
  │ (.opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts)
  └ 11 lines found

● Search (grep)
  │ "canonical|containment|path traversal|isAllowed|resolve|approved roots|NNN-name"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/utils/path-security.ts)
  └ No matches found

● Read scope-governance.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts
  └ L1:320 (320 lines read)

● Read shared-spaces.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts
  └ L180:640 (461 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L730:820 (91 lines read)

● Read mutation-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts
  └ L1:200 (61 lines read)

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L680:980 (301 lines read)

● Read canonical-path.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts
  └ L1:220 (64 lines read)

● Read path-security.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/utils/path-security.ts
  └ L1:260 (11 lines read)

The first concrete discrepancy I’m checking is around shared-memory kill-switch wording versus the actual owner/admin bypass in code. I’m also pulling the scout agent’s pass now to see if it found any other security-only mismatches worth validating.

● Read (Explore agent — Scout security risks)
  └ idle

● Read shared-memory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts
  └ L1:320 (320 lines read)

● Read mutation-hooks.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
  └ L1:260 (106 lines read)

✗ Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/mcp_server/FEATURE_CATALOG.md
  └ Path does not exist

● Search (grep)
  │ "buildMutationHookFeedback|postMutationHooks|safetyConfirmationUsed|shared_space_kill_switch|byp
  │ assAvailabilityChecks" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 73 lines found

● Read 04-tier-based-bulk-deletion-memorybulkdelete.md
  │ .opencode/skill/system-spec-kit/feature_catalog/02--mutation/04-tier-based-bulk-deletion-memoryb
  │ ulkdelete.md
  └ L1:220 (160 lines read)

● Read 01-feature-flag-governance.md
  │ .opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md
  └ L1:120 (38 lines read)

● Read memory-bulk-delete.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts
  └ L1:260 (260 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L1:260 (257 lines read)

I’ve ruled out a couple of the scout’s looser candidates. The two remaining areas that still look security-relevant are raw error exposure in mutation UX payloads and whether the catalog overstates the shared-memory kill switch.

● Search (grep)
  │ "recordGovernanceAudit|GovernanceAudit|audit"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ No matches found

● Search (grep)
  │ "recordGovernanceAudit|audit"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ No matches found

● Search (grep)
  │ "recordGovernanceAudit|audit"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts)
  └ 19 lines found

● Read hooks-ux-feedback.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts
  └ L1:140 (132 lines read)

● Read 08-context-server-success-hint-append.md
  │ .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/08-context-server-success-hint-appe
  │ nd.md
  └ L1:120 (120 lines read)

I found another possible security-posture mismatch: the governance catalog says decisions are audited across ingest and retrieval, but the retrieval path doesn’t appear to write governance audit records at all. I’m doing one last call-site pass so I can separate that from the weaker, non-security candidates.

● Search (grep)
  │ "recordGovernanceAudit\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 12 lines found

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:220 (220 lines read)

● Read response-builder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
  └ L300:360 (61 lines read)

● Read shared-spaces.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts
  └ L380:430 (51 lines read)

17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md | Overstates audit coverage for governed retrieval | P2 | The entry says the feature governs ingest and retrieval and “keeps a record of every decision it makes” / “captures scope decisions” (`17--governance/03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md:10-12,18-26`). In code, governance audit writes are present for save/shared-space access (`mcp_server/handlers/memory-save.ts:709-721,733-743,935-948`; `mcp_server/lib/collab/shared-spaces.ts:505-536,530-612`), but there are no retrieval-side audit call sites in `mcp_server/handlers/memory-search.ts` or `mcp_server/lib/search/pipeline/stage1-candidate-gen.ts` (repo-wide `recordGovernanceAudit(` grep only hits save/shared-memory paths). This is a misleading security/auditability claim for retrieval operations.

18--ux-hooks/07-mutation-response-ux-payload-exposure.md | Exposes raw internal hook error strings in successful mutation responses | P2 | The catalog describes direct exposure of post-mutation UX payloads (`18--ux-hooks/07-mutation-response-ux-payload-exposure.md:10-18`). The implementation includes `postMutationHooks.errors` verbatim in response data and mirrors them into user-visible hints (`mcp_server/hooks/mutation-feedback.ts:42-57`; `mcp_server/handlers/save/response-builder.ts:308-343`; same pattern in `mcp_server/handlers/memory-bulk-delete.ts:228-255`). Tests explicitly assert raw error text is surfaced (`mcp_server/tests/hooks-ux-feedback.vitest.ts:48-60`). If hook failures contain internal path, cache, or backend error details, this becomes an information-disclosure surface.

SUMMARY: files checked 57, P0 0, P1 0, P2 2.

