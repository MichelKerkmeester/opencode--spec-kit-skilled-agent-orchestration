## Packet 037/004: sk-doc-template-alignment — Tier B doc audit

You are cli-codex (gpt-5.5 high fast) implementing **037/004-sk-doc-template-alignment**.

### Goal

Audit every doc touched by packets 031-036 for sk-doc template compliance. Fix any non-compliance. Skip docs that already pass. Out of scope: pre-existing drift in docs that 031-036 didn't touch.

### Read these first

- `.opencode/skill/sk-doc/SKILL.md` (the skill standards)
- `.opencode/skill/sk-doc/references/` (any embedded standard files — DQI rules, template specs, anchor conventions)
- `.opencode/skill/sk-doc/assets/` (templates for README, install guide, feature catalog, manual testing playbook, ASCII flowcharts)
- `.opencode/skill/sk-doc/references/hvr_rules.md` (high-value content rules)

### Files to audit (touched by 031-036)

Discover via git diff:

```bash
git --no-pager diff --name-only $(git --no-pager log --grep '026/031\|026/032\|026/033\|026/034\|026/035\|026/036' --format='%H' | tail -1)~1 HEAD -- '*.md' '*.txt' | sort -u
```

Expected coverage (~30 files):
- AGENTS.md
- .opencode/skill/system-spec-kit/SKILL.md
- .opencode/skill/system-spec-kit/mcp_server/README.md
- .opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md
- .opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md
- .opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md
- .opencode/skill/system-spec-kit/references/config/hook_system.md
- .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md
- .opencode/skill/system-spec-kit/ARCHITECTURE.md
- .opencode/command/memory/manage.md
- ... and any new READMEs introduced by 031-036

### sk-doc compliance checklist

For each markdown file, check:

#### Frontmatter (where applicable)
- `title:` non-empty, descriptive
- `template_source:` correct format `SPECKIT_TEMPLATE_SOURCE: <name> | <version>`
- `description:` 1-2 sentences, factual
- `trigger_phrases:` list of search-friendly phrases
- `importance_tier:` one of `important`, `normal`, `low`
- `_memory.continuity` block (for spec docs)

#### Body
- Anchor markers `<!-- ANCHOR:slug -->` and `<!-- /ANCHOR:slug -->` balanced
- Anchor slugs match sk-doc template's anchor list for the doc type
- Section headers match template (no extra/missing required sections)
- Markdown integrity: no broken wiki-links, no unclosed code fences, no orphan list items
- No emoji unless explicitly requested (per CLAUDE.md)
- Tables: well-formed, columns aligned
- Cross-refs: `file:line` format for source code refs

#### DQI (Document Quality Index)
- High-value content density (no padding, no stub paragraphs)
- Structured content (tables, lists, examples) where text would be ambiguous
- Examples for non-obvious concepts
- Honest about state ("aspirational", "in progress", "not yet implemented" where applicable)

### Implementation phases

#### Phase 1: Discovery
Run the git diff command. Write `audit-target-list.md` with all touched markdown files.

#### Phase 2: Audit pass
For each file: read it, check against the compliance checklist. Write `audit-findings.md` with PASS / FIX_APPLIED / DEFERRED findings per file.

#### Phase 3: Apply fixes
For FIX_APPLIED items: edit the file, fix the violation, re-audit.

#### Phase 4: Verify strict validator
Run strict validator on any spec folders touched (031-036 packets) — they should still pass after sk-doc alignment.

### Packet structure to create (Level 2)

7-file structure under `specs/system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/004-sk-doc-template-alignment/`.

PLUS: `audit-target-list.md` and `audit-findings.md` at packet root.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/037-followup-quality-pass/001-sk-code-opencode-audit"]`.

**Trigger phrases**: `["037-004-sk-doc-template-alignment","sk-doc audit","template alignment 031-036","DQI compliance"]`.

**Causal summary**: `"Audits ~30 docs touched by packets 031-036 against sk-doc templates. Fixes frontmatter, anchor markers, section headers, DQI compliance. Out-of-scope: pre-existing drift."`.

**Frontmatter**: compact rules.

### Constraints

- DOC-ONLY. No code changes.
- Strict validator MUST exit 0 on this packet.
- Read-only on sk-doc skill itself.
- Do NOT touch docs not touched by 031-036.
- DO NOT commit; orchestrator will commit.

When done, last action is strict validator passing. No narration; just write files and exit.
