## Packet 045/009: documentation-truth — Deep-review angle 9 (release-readiness)

### CRITICAL: Spec folder path

The packet folder for THIS audit is: `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth/` — write ALL packet files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, review-report.md) under that path. Do NOT ask for the spec folder; use this exact path.

READ-ONLY deep-review audit. Output: `review-report.md` with severity-classified P0/P1/P2 findings.

### Target surface

- `README.md` (root, post-042 refresh)
- `AGENTS.md`, `CLAUDE.md`
- `.opencode/skill/system-spec-kit/SKILL.md`, `ARCHITECTURE.md`, `README.md`
- `.opencode/skill/system-spec-kit/mcp_server/{README,INSTALL_GUIDE,ENV_REFERENCE}.md`
- `.opencode/skill/system-spec-kit/mcp_server/{handlers,lib,hooks/codex,hooks/copilot,skill_advisor,code_graph,matrix-runners,stress_test,schemas,tools}/README.md` (sub-folder READMEs)
- `.opencode/skill/system-spec-kit/feature_catalog/` and per-skill catalogs
- `.opencode/skill/system-spec-kit/manual_testing_playbook/` and per-skill playbooks
- `.opencode/skill/system-spec-kit/references/{config,hooks,templates}/`
- `.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md`

### Audit dimensions + truth-specific questions

For correctness: every "auto-managing" / "auto-fires" / "real-time" claim has a Trigger column or file:line citation; tool counts in docs match canonical source (`tool-schemas.ts`); feature catalog entries match actual MCP tools.

For security: docs don't expose secrets / credentials / internal paths inappropriately; install guides don't recommend insecure defaults.

For traceability: every claim has a citation OR is explicitly marked aspirational; classification (auto/half/manual) is consistent with 013's reality map.

For maintainability: evergreen-doc rule honored (no packet IDs in evergreen content); cross-references resolve.

### Specific questions

- Run the evergreen-grep across all evergreen docs. Are there any unexempted hits?

```bash
grep -rnE '\b0[0-9]{2}-[a-z-]+|\bpacket [0-9]{3}|\b03[0-9]/00[0-9]|\bF-013-[0-9]+|\bP1-[0-9]+|\bphase [0-9]{3}|\bin packet|\bvia packet' \
  AGENTS.md CLAUDE.md README.md \
  .opencode/skill/system-spec-kit/{SKILL,ARCHITECTURE,README}.md \
  .opencode/skill/system-spec-kit/mcp_server/{README,INSTALL_GUIDE,ENV_REFERENCE}.md \
  .opencode/skill/system-spec-kit/feature_catalog/**/*.md \
  .opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md \
  .opencode/skill/system-spec-kit/references/**/*.md \
  2>/dev/null
```

- Tool counts: `grep -c "name: '" tool-schemas.ts` + skill_advisor schemas. Does every doc that cites a count match this?
- Feature catalog completeness: every MCP tool registered in `tool-schemas.ts` has a feature_catalog entry? Walk through tool list, cross-check.
- Manual testing playbook: every operator-facing tool has a playbook entry? memory_retention_sweep, advisor_rebuild, etc.
- AGENTS.md auto-claim trigger column: every row has a non-empty Trigger? Caveat?

### Read also

- 040 evergreen-doc rule + audit-findings.md
- 042 root README refresh + verification-notes.md
- 037/002 feature catalog trio + 037/003 testing playbook trio
- 039 code_graph runtime catalog + playbook

### Output

Same 9-section review-report.md format. Severity rubric: P0=docs say feature exists that doesn't / silent feature gap, P1=stale numbers/claims/feature catalog drift, P2=cleanup.

### Packet structure (Level 2)

Same 7-file structure. Deps include 045 phase parent.

**Trigger phrases**: `["045-009-documentation-truth","docs truth audit","stale claims review","evergreen rule self-check"]`.

**Causal summary**: `"Deep-review angle 9: documentation truth — every claim verified against runtime; tool counts canonical; feature catalogs complete; evergreen-doc rule self-check; trigger columns populated."`.

### Constraints

READ-ONLY. Strict validator must exit 0. Cite file:line. DO NOT commit. Evergreen-doc rule (especially: don't reintroduce packet IDs in your own review-report.md narrative).

When done, last action: strict validator passing + review-report.md complete.
