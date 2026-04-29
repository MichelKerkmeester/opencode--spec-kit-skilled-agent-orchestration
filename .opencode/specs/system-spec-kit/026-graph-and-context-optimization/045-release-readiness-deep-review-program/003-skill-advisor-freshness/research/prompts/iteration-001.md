## Packet 045/003: skill-advisor-freshness — Deep-review angle 3 (release-readiness)

### CRITICAL: Spec folder path

The packet folder for THIS audit is: `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/003-skill-advisor-freshness/` — write ALL packet files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, review-report.md) under that path. Do NOT ask for the spec folder; use this exact path.

READ-ONLY deep-review audit. Output: `review-report.md` with severity-classified P0/P1/P2 findings.

### Target surface

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/` (entire dir)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-rebuild.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-brief.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/skill-advisor-daemon*.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scoring/` (TOKEN_BOOSTS, PHRASE_BOOSTS tables)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/`

### Audit dimensions + advisor-specific questions

For correctness: daemon freshness detection logic; advisor_status diagnostic-only (no rebuild side effect); advisor_rebuild actually rebuilds; brief generation cache hit/miss correctness.

For security: scoring tables (TOKEN_BOOSTS / PHRASE_BOOSTS) are loaded from trusted sources only; no injection via crafted prompts.

For traceability: status output enumerates current state honestly (live / stale / cold-start fallback); rebuild logs reason.

For maintainability: daemon shutdown/restart cleanly; cache invalidation discipline.

### Specific questions

- Does `advisor_status` ever side-effect (mutate state)? It should be diagnostic-only per 034.
- Does `advisor_rebuild({force:true})` actually invalidate caches, or just trigger a soft refresh?
- Are TOKEN_BOOSTS and PHRASE_BOOSTS tables guaranteed-loaded before scoring? What happens if they're missing?
- Does the Codex hook freshness-smoke-check (from 034) correctly emit `stale: true, reason: "timeout-fallback"`?
- Is the Python compatibility shim (`skill_advisor.py`) functionally equivalent to the native TS path?
- Cache hit rate: under normal use, what fraction of advisor calls hit cache vs miss?

### Read also

- 008-skill-graph-daemon-and-advisor-unification (parent packet history at 026/008)
- 034 advisor_rebuild + freshness-smoke-check
- 045/005 cross-runtime hook parity (overlapping concerns; cite as cross-ref)

### Output

Same 9-section review-report.md format. Severity rubric: P0=silent stale-context fallback / scoring corruption, P1=missing rebuild path / freshness reporting bug, P2=optimization.

### Packet structure (Level 2)

Same 7-file structure. Deps include 045 phase parent.

**Trigger phrases**: `["045-003-skill-advisor-freshness","advisor freshness audit","daemon freshness review","advisor rebuild review"]`.

**Causal summary**: `"Deep-review angle 3: skill advisor freshness — daemon detection, status/rebuild split, scoring tables, brief cache, Codex cold-start fallback marker."`.

### Constraints

READ-ONLY. Strict validator must exit 0. Cite file:line. DO NOT commit. Evergreen-doc rule.

When done, last action: strict validator passing + review-report.md complete.
