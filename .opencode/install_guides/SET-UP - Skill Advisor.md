# SET-UP - Skill Advisor

Tune the OpenCode skill advisor scoring tables (TOKEN_BOOSTS, PHRASE_BOOSTS, derived triggers, CATEGORY_HINTS) so the advisor can route prompts to every skill in your repo.

> **Part of OpenCode Installation.** See the [Master Installation Guide](./README.md) for complete setup.
> **Command:** `/doctor:skill-advisor` (auto + confirm modes) — full reference in `.opencode/command/doctor/skill-advisor.md`.

---

## 0. AI-FIRST PROMPT

Paste this into your AI client to run a guided optimization:

```text
Run the skill-advisor command to tune my OpenCode skill advisor scoring system.

PREREQUISITE CHECK (verify before proceeding):
- [ ] At least one skill exists at .opencode/skill/<name>/SKILL.md
- [ ] system-spec-kit MCP server is built (dist/ exists)
- [ ] skill_graph_scan tool is in your tool list
- [ ] Baseline advisor tests pass before any changes

If any prerequisite fails: STOP and report which one. Do NOT proceed.

Steps:
1. Invoke /doctor:skill-advisor:confirm (interactive mode for first run).
2. At setup: scope=A (all), tests=A (run), apply=A (apply changes).
3. Walk me through Phase 0 → 1 → 2 → 3 → 4 with approval at each gate.
4. On success: summarize files modified and how to undo if needed.
5. On test failure: run the per-run rollback script that Phase 3 generated under <packet_scratch>/rollback-<timestamp>.sh
   (it restores only the exact files this run modified, so any unrelated WIP is preserved).
   The script also runs npm --prefix .opencode/skill/system-spec-kit/mcp_server run build at the end.
```

**Expected duration:** 5–10 minutes interactive | 1–2 minutes autonomous.

---

## 1. PREREQUISITES

| Requirement | Check |
| --- | --- |
| At least one skill exists | `ls .opencode/skill/*/SKILL.md` returns paths |
| MCP server is built | `ls .opencode/skill/system-spec-kit/mcp_server/dist/` shows JS |
| `skill_graph_scan` available | Tool appears in your AI client's tool list |
| Baseline tests pass | `npm --prefix .opencode/skill/system-spec-kit/mcp_server test -- skill_advisor` is green |

**Build first if needed:**
```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server install
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

---

## 2. RUN

| Use case | Command |
| --- | --- |
| First-time tuning | `/doctor:skill-advisor:confirm` |
| Re-tune after adding a skill | `/doctor:skill-advisor:auto` |
| Preview without writing | `/doctor:skill-advisor:auto --dry-run` |
| Tune one lane only | `/doctor:skill-advisor:auto --scope=explicit` (or `derived` / `lexical`) |
| Skip post-apply tests | `/doctor:skill-advisor:auto --skip-tests` (not recommended) |

**The five phases (see command markdown for full detail):**

```
Phase 0 Discovery → Phase 1 Analysis → Phase 2 Proposal
                                           ↓
                Phase 4 Verify ← Phase 3 Apply
```

The command rebuilds `dist/`, runs `skill_graph_scan`, and runs the advisor test suite as part of Phase 4.

---

## 3. WHAT IT TOUCHES

**Mutates only:**
- `lib/scorer/lanes/explicit.ts` (TOKEN_BOOSTS, PHRASE_BOOSTS)
- `lib/scorer/lanes/lexical.ts` (CATEGORY_HINTS)
- `.opencode/skill/<name>/graph-metadata.json` (derived.triggers, derived.keywords)

**Never touches:** any `SKILL.md` content, `weights-config.ts`, fusion scorer, daemon code.

---

## 4. VERIFY AFTER RUN

```bash
# Tests still green
npm --prefix .opencode/skill/system-spec-kit/mcp_server test -- skill_advisor

# Graph re-indexed (in your AI client)
skill_graph_status({})
# Expected: skill_count matches .opencode/skill/* count, lastScanAt is recent

# Optional: confirm a routing improvement
advisor_recommend({ prompt: "your test prompt", options: { topK: 3 } })
```

---

## 5. ROLLBACK

Phase 3 generates a per-run rollback script at `<packet_scratch>/rollback-<timestamp>.sh` (under `<spec-folder>/scratch/` or `.opencode/scratch/`) listing the exact files modified. Use it for clean recovery:

```bash
# 1. Run the per-run rollback script (restores only files modified by this run)
bash <packet_scratch>/rollback-<timestamp>.sh

# 2. Verify rollback
npm --prefix .opencode/skill/system-spec-kit/mcp_server test -- skill_advisor
```

**Why the per-run script and not `git checkout HEAD --`?** A broad `git checkout HEAD -- .opencode/skill/...` would discard any unrelated WIP in those paths. The per-run script restores only the files this command touched, leaving other changes intact.

**If the per-run script is unavailable** (e.g., the run failed before Phase 3 step 3 completed):

```bash
# Stash any unrelated WIP first to avoid loss
git stash push -m "skill-advisor-rollback-safety" -- \
  .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/ \
  .opencode/skill/*/graph-metadata.json

# Then restore
git restore --source=HEAD -- \
  .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/ \
  .opencode/skill/*/graph-metadata.json

npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

---

## 6. TROUBLESHOOTING

| Problem | Fix |
| --- | --- |
| `"no skills found"` | Create at least one skill via `/create:sk-skill` |
| `"graph health: missing"` | Run `skill_graph_scan({})` once, then re-run the command |
| Build fails after apply | Rollback (see Section 5), inspect diff in `<spec-folder>/scratch/skill-advisor-proposal-*.md` (or `.opencode/scratch/...` outside a spec folder) |
| Tests fail after apply | Rollback, then re-run with `--scope=derived` only |
| Command not found | Verify `.opencode/command/doctor/skill-advisor.md` exists; restart your AI client |
| Wrong skill in `advisor_recommend` | Stale graph index — run `skill_graph_scan({})` |
| Cannot parse `explicit.ts` | `git restore --source=HEAD -- .opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/explicit.ts` (restores from HEAD without affecting unrelated WIP) |
| MCP server missing | `npm --prefix .opencode/skill/system-spec-kit/mcp_server install && npm run build` |

---

## 7. RESOURCES

- **Command reference:** `.opencode/command/doctor/skill-advisor.md`
- **Workflow YAML:** `.opencode/command/doctor/assets/doctor_skill-advisor_{auto,confirm}.yaml`
- **Operator setup (advanced):** `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/SET-UP_GUIDE.md`
- **Native MCP install:** `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`
- **Related guides:** [SET-UP - Skill Creation](./SET-UP%20-%20Skill%20Creation.md) (run skill-advisor after creating a new skill)
