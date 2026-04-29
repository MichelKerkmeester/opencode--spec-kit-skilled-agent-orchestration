## Packet 040: evergreen-doc-packet-id-removal — Tier B doc rule + audit + fix

You are cli-codex (gpt-5.5 high fast) implementing **040-evergreen-doc-packet-id-removal**.

### Goal

Operator's directive: **READMEs and other evergreen-type documents must NEVER reference spec/phase numbers.** Packet IDs (031, 032, ..., 037/005) rot when packets get renumbered, archived, or consolidated. Evergreen docs describe runtime state — not the packet history that produced it.

Two-part task:
1. **Update sk-doc skill** with this rule so future docs don't make this mistake.
2. **Audit + fix all recently-touched evergreen docs** that violate the rule.

### Document classes (the new rule)

| Class | Examples | Packet IDs allowed? |
|-------|----------|---------------------|
| **Spec docs** (packet-local) | spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, decision-record.md, handover.md, research-report.md, audit-findings.md, migration-plan.md | YES — they're packet-local; references are fine |
| **Evergreen docs** (runtime state) | README.md (any folder), INSTALL_GUIDE.md, ARCHITECTURE.md, SKILL.md, AGENTS.md, CLAUDE.md, references/**/*.md, feature_catalog/**/*.md, manual_testing_playbook/**/*.md, ENV_REFERENCE.md | **NO** — describe runtime state by feature/file:line, never by packet number |

The rule (for evergreen docs):
- ❌ "Added in packet 033"
- ❌ "Closes 013 P1-1"
- ❌ "Per 037/005 migration"
- ❌ "Shipped via 028"
- ✅ "Defined at `mcp_server/handlers/memory-retention-sweep.ts:42`"
- ✅ "Run `npm run stress` from `mcp_server/`"
- ✅ "See `references/config/hook_system.md` for the hook contract"

### Read these first

- `.opencode/skill/sk-doc/SKILL.md` (where the new rule needs to be added)
- `.opencode/skill/sk-doc/references/` (any existing rule files — DQI, anchor conventions)
- `.opencode/skill/sk-doc/assets/` (templates — README, install guide, feature catalog, manual testing playbook)

### Implementation

#### Phase 1: Update sk-doc with the new rule

Add a new rule to sk-doc. Suggested location: a new file `.opencode/skill/sk-doc/references/evergreen_packet_id_rule.md` (referenced from SKILL.md), OR inline in `SKILL.md`'s standards section, OR appended to the existing DQI rules file. Use whichever pattern sk-doc already uses for adjacent rules.

The rule should include:
- The two doc classes (spec-local vs evergreen)
- Examples of GOOD and BAD references (per the table above)
- Self-check: search for `\b\d{3}-[a-z-]+\b`, `\b03[0-9]/00[0-9]\b`, "P1-N", "F-013-NNN" patterns in evergreen docs at audit time
- Migration guidance: when removing packet IDs, replace with feature-name + file:line OR "see X for details"

Update sk-doc's templates (`assets/`) for README, install guide, feature catalog, and manual testing playbook to call out this rule prominently in the author-instructions section.

#### Phase 2: Audit pass

Discover candidate violations across recently-touched evergreen docs. Use git history scope of last 50 commits OR specifically the last 14 commits (031-039 era):

```bash
# Most recently touched evergreen-class docs
git --no-pager log --name-only --since='2026-04-29' --pretty=format:'' | \
  grep -E '(README|INSTALL_GUIDE|ARCHITECTURE|SKILL|ENV_REFERENCE)\.md|/feature_catalog/|/manual_testing_playbook/|/references/' | \
  grep -v '/specs/' | sort -u

# Plus repo-level
echo AGENTS.md CLAUDE.md
```

For each candidate evergreen doc, scan for packet-ID references:

```bash
grep -nE '\b0[0-9]{2}-[a-z-]+|\bpacket [0-9]{3}|\b03[0-9]/00[0-9]|\bF-013-[0-9]+|\bP1-[0-9]+|\bphase [0-9]{3}|\bfrom packet|\bin packet|\bvia packet' <FILE>
```

Write `audit-findings.md` at packet root with per-file findings: PASS / VIOLATION_FIXED / VIOLATION_DEFERRED.

#### Phase 3: Apply fixes

For each VIOLATION:
- If a phrase like "Added in packet 033" appears, rewrite as "Sweeps memory_index rows where delete_after has expired — see `mcp_server/handlers/memory-retention-sweep.ts`"
- If a sentence references "Closes 013 P1-1", rewrite as the actual content the rule encodes (e.g., "Code-graph freshness: read-path self-heal via `code_graph/lib/ensure-ready.ts`; manual full repair via `code_graph_scan`")
- If a doc has a "Recent changes" or "History" section that references packet IDs, EITHER strip it (evergreen docs don't need history sections) OR move it into the corresponding spec-local `implementation-summary.md`

Be surgical. Do not rewrite paragraphs that are already evergreen-clean.

#### Phase 4: Self-check

Run the audit grep again across all evergreen docs. Confirm zero remaining violations.

```bash
grep -rnE '\b0[0-9]{2}-[a-z-]+|\bpacket [0-9]{3}|\b03[0-9]/00[0-9]|\bF-013-[0-9]+|\bP1-[0-9]+|\bphase [0-9]{3}|\bfrom packet|\bin packet|\bvia packet' \
  AGENTS.md CLAUDE.md \
  .opencode/skill/system-spec-kit/{SKILL,ARCHITECTURE,README}.md \
  .opencode/skill/system-spec-kit/mcp_server/{README,INSTALL_GUIDE,ENV_REFERENCE}.md \
  .opencode/skill/system-spec-kit/mcp_server/**/README.md \
  .opencode/skill/system-spec-kit/feature_catalog/**/*.md \
  .opencode/skill/system-spec-kit/manual_testing_playbook/**/*.md \
  .opencode/skill/system-spec-kit/references/**/*.md \
  2>/dev/null | head -30
```

If the grep is empty: PASS. If hits remain: fix or document why (e.g., a legitimate reference to a public command name that happens to look like a packet ID).

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/040-evergreen-doc-packet-id-removal/`.

PLUS: `audit-findings.md` at packet root.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/004-sk-doc-template-alignment","system-spec-kit/026-graph-and-context-optimization/038-stress-test-folder-completion","system-spec-kit/026-graph-and-context-optimization/039-code-graph-catalog-and-playbook"]`. (Picks up after 038 + 039 land so it can audit their output too.)

**Trigger phrases**: `["040-evergreen-doc-packet-id-removal","evergreen doc rule","no packet ids in readmes","sk-doc evergreen rule","packet id audit"]`.

**Causal summary**: `"Adds the evergreen-doc no-packet-IDs rule to sk-doc skill (new reference + template hint). Audits ~30+ evergreen docs touched recently for violations; applies fixes by replacing packet-ID references with feature-name + file:line citations or removing history sections that don't belong in runtime docs."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- DOC-ONLY. No code changes.
- Strict validator MUST exit 0.
- Spec-local docs (spec.md/plan.md/tasks.md/etc.) ARE NOT in scope — keep their packet-ID refs.
- DO NOT touch `specs/**` doc content (those are packet-local).
- DO touch `.opencode/specs/**` only if a NEW evergreen doc was inadvertently placed there (rare).
- DO NOT commit; orchestrator will commit.
- If a "violation" is actually a fair reference (e.g., a feature catalog entry that legitimately points to where a feature is documented in a spec), document and keep — but explicitly state why in audit-findings.md.
- Self-check grep must be empty (or have explicit documented exceptions) before claiming PASS.

When done, last action is strict validator passing + self-check grep empty. No narration; just write files and exit.
