## Packet 046: release-readiness-synthesis-and-remediation — Tier B synthesis + Tier C implementation

You are cli-codex (gpt-5.5 high fast) implementing **046-release-readiness-synthesis-and-remediation**.

### CRITICAL: Spec folder path

The packet folder is: `specs/system-spec-kit/026-graph-and-context-optimization/046-release-readiness-synthesis-and-remediation/` — write ALL packet files there. Do NOT ask for the spec folder.

### Goal

Two-phase packet:
1. **Synthesis (Phase 1)**: Roll up the 10 review-reports from packet 045's children into a single aggregate verdict + ranked remediation backlog. Classify findings by severity (P0/P1/P2), by subsystem, and by effort.
2. **Remediation (Phase 2)**: Implement fixes for ALL P0 findings + as many P1 findings as feasible in this run. Produce code/doc changes; keep them surgical; verify build + strict validators after each change.

### Read these first (the 10 review-reports)

- `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/001-workflow-correctness/review-report.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/review-report.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/003-skill-advisor-freshness/review-report.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/004-code-graph-readiness/review-report.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/005-cross-runtime-hook-parity/review-report.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/006-mcp-tool-schema-governance/review-report.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/007-deep-loop-workflow-integrity/review-report.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/008-validator-spec-doc-integrity/review-report.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/009-documentation-truth/review-report.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/010-upgrade-safety-operability/review-report.md`

Plus:
- `.opencode/skill/sk-deep-review/SKILL.md` (severity rubric reference)
- `.opencode/skill/sk-doc/references/global/evergreen_packet_id_rule.md` (honor in any new docs)

### Phase 1: Synthesis

Produce `synthesis.md` at packet root with:

#### Section 1: Aggregate verdict
- 6 FAIL / 4 CONDITIONAL across 10 angles
- Total findings: count P0, P1, P2 across all 10
- Per-subsystem breakdown: workflow / memory / skill-advisor / code-graph / hooks / schema / deep-loop / validator / docs / operability
- Release decision: BLOCKED (any P0) / CONDITIONAL (P1 only) / READY (zero issues)

#### Section 2: P0 findings registry (release blockers)
Aggregate every P0 finding across the 10 reports. For each:
- ID (e.g., 045/001-P0-1)
- Subsystem
- File:line evidence
- Description
- Recommended remediation
- Estimated effort to fix

#### Section 3: P1 findings registry (required pre-release)
Same shape; aggregate every P1.

#### Section 4: P2 findings registry (nice-to-have)
Brief list; defer most to follow-up.

#### Section 5: Sequenced remediation plan
Tier the remediation work:
- Tier α: P0 fixes (must complete in Phase 2 of this packet)
- Tier β: P1 quick wins (small doc/contract fixes; complete in Phase 2 if time)
- Tier γ: P1 design calls (require operator decision; defer to packets 047+)
- Tier δ: P2 polish (defer to backlog)

For each Tier, list specific fixes with file:line targets, expected effort, and whether they're code or doc.

#### Section 6: Open questions for operator
Any remediation decision that requires explicit operator approval (e.g., "should advisor_status auto-rebuild on stale, or stay diagnostic?") — list these for the operator to answer separately.

### Phase 2: Remediation (P0 + Tier β P1 quick wins)

Apply fixes inline. Be surgical. For each fix:
- Apply minimal Edit to the target file
- Re-run any affected tests
- Re-run strict validator on affected packets
- Document the fix in `remediation-log.md` at packet root

If a P0 requires a design decision before fixing (e.g., "memory_delete needs confirmation gate but the gate semantics are not yet defined"), document in synthesis.md Section 6 (open questions) and DO NOT apply a hasty fix.

After applying fixes:
- `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` — must pass
- `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run <affected-test-files>` — must pass
- Strict validators on touched spec packets: must pass

### Packet structure to create (Level 2)

7-file structure under this packet folder:
- spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json
- PLUS: `synthesis.md` and `remediation-log.md` at packet root

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program"]`.

**Trigger phrases**: `["046-release-readiness-synthesis-and-remediation","release-readiness aggregate","P0 fixes implementation","release blocker remediation"]`.

**Causal summary**: `"Synthesizes the 10 review-reports from 045 into aggregate verdict + sequenced remediation backlog. Implements P0 fixes + Tier β P1 quick wins. Documents open questions for operator decision on Tier γ items."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- Phase 1 is READ-ONLY synthesis.
- Phase 2 mutates source code/docs — be surgical; revert if a fix breaks build/tests.
- Strict validator MUST exit 0 on this packet.
- All builds + affected tests MUST pass after Phase 2.
- DO NOT commit; orchestrator commits.
- Honor evergreen-doc rule in any new docs.
- If a P0 needs operator decision before code change, leave it as an open question and don't apply hasty fix.

When done, last action: strict validator + build + tests passing. No narration; just write files and exit.
