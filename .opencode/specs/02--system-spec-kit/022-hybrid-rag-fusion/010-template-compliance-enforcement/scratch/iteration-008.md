# Iteration 8: Implementation Blueprint -- Exact Diffs for 3-Layer Architecture

## Focus
Draft the exact changes needed for each enforcement layer. This is a pure synthesis iteration -- no new external research, only file-level diff specifications derived from the 7 prior iterations' findings, cross-referenced against current source code.

## Findings

### Finding 1: Layer 1 -- Shared Compliance Reference File (CREATE)

**File**: `.opencode/skill/system-spec-kit/references/template-compliance-contract.md`
**Action**: Create new file

This file serves as the canonical single-source-of-truth for template compliance contracts. All 4 CLI @speckit agent definitions reference it. The file contains:

1. Version metadata (for drift detection)
2. Level 2 contract (all 5 doc types) -- identical to the 49-line block in Section 3.5 of research.md
3. Level 3 addendum (decision-record.md parametric anchors)
4. Phase addenda note (handled automatically by validate.sh)
5. Enforcement directive (the single consolidated timing rule)

The exact content is the 49-line compact contract table from iteration 6 (research.md Section 3.5), wrapped with a version header:

```markdown
---
title: Template Compliance Contract
version: 1.0.0
generated_from: template-structure.js
last_synced: 2026-03-22
---

# Template Compliance Contract

> Canonical structural contract for all spec folder documents.
> Referenced by @speckit agent definitions across all CLIs.

## Enforcement Rule

After writing ANY spec folder .md file, immediately run:
`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <SPEC_FOLDER> --strict`
Fix ALL errors before proceeding to the next file or workflow step.

## Level 2 Contract (All 5 Document Types)

[...exact 49-line block from research.md Section 3.5...]

## Phase Addenda

Phase parent/child folders inherit the base contract above plus phase-specific
addenda (e.g., `phase-map` anchor). These are enforced automatically by
`validate.sh` via `inferPhaseSpecAddenda()` in `template-structure.js`.
No additional agent knowledge is needed -- just follow the base contract and
validate after writing.

## Sync Protocol

When templates in `templates/level_N/` change:
1. Run `node scripts/spec/template-structure.js contract <level> <basename>`
   for each changed doc type to extract the updated contract
2. Update this file with new headers/anchors
3. Update the inline compact contract in all 4 @speckit agent definitions
4. Bump the `version` and `last_synced` fields above
```

[SOURCE: Synthesis from iteration-006.md contract text + iteration-003.md contract engine analysis]

### Finding 2: Layer 1 -- @speckit Agent Definition Diff (EDIT)

**Files** (all 4 must be changed identically):
- `.claude/agents/speckit.md`
- `.opencode/agent/speckit.md`
- `.opencode/agent/chatgpt/speckit.md`
- `.codex/agents/speckit.toml` (TOML-escaped version)

**Exact diff for `.claude/agents/speckit.md`**:

**DELETE lines 318-339** (current partial scaffold):
```
### Inline Scaffold Contract

When drafting or updating `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, or `implementation-summary.md`:

1. Read the canonical template from `templates/level_N/`.
2. Copy the matching scaffold into the working prompt: H1, required ANCHOR tags, required H2 sequence, and checklist item format when relevant.
3. Keep custom sections only after the required template structure.
4. Run `scripts/spec/validate.sh [SPEC_FOLDER] --strict` before moving to the next workflow step.

#### Quick Reference: Level 2 spec.md scaffold

\`\`\`
# Feature Specification: [Title]
<!-- SPECKIT_LEVEL: 2 -->
<!-- ANCHOR:metadata --> ## 1. METADATA <!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem --> ## 2. PROBLEM & PURPOSE <!-- /ANCHOR:problem -->
<!-- ANCHOR:scope --> ## 3. SCOPE <!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements --> ## 4. REQUIREMENTS <!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria --> ## 5. SUCCESS CRITERIA <!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks --> ## 6. RISKS & DEPENDENCIES <!-- /ANCHOR:risks -->
<!-- ANCHOR:questions --> ## 10. OPEN QUESTIONS <!-- /ANCHOR:questions -->
\`\`\`
```

**REPLACE WITH** the full 49-line compact contract from research.md Section 3.5, plus a reference to the shared file:

```
### Template Compliance Contract

> Full reference: `.opencode/skill/system-spec-kit/references/template-compliance-contract.md`

#### Template Compliance Contract (Level 2)

MANDATORY: Every spec document MUST follow the exact anchor + header structure below.
Anchors use `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` pairs wrapping their H2 section.
Do NOT reorder, rename, or omit required sections. Custom sections go AFTER required ones.

[...all 5 doc type tables from Section 3.5...]

**Enforcement**: After writing ANY spec folder .md file, run `validate.sh [SPEC_FOLDER] --strict`. Fix ALL errors before proceeding.
```

**Additionally, fix the 3 conflicting timing directives**:

1. **Line 238** -- KEEP as-is (this is the correct per-write directive):
   `Run scripts/spec/validate.sh [SPEC_FOLDER] --strict immediately after each spec-doc write or update; if it fails, repair template drift before continuing`

2. **Line 325** -- CHANGE from "before moving to the next workflow step" to match line 238:
   `Run scripts/spec/validate.sh [SPEC_FOLDER] --strict immediately after each spec-doc write or update; if it fails, repair template drift before continuing`

3. **Line 109** -- ADD specificity: Change the workflow diagram step from:
   `VALIDATE: Run validate.sh` to:
   `VALIDATE: Run validate.sh --strict after EACH file write (not just at end)`

[SOURCE: .claude/agents/speckit.md:109,238,325 -- 3 conflicting directive locations]

### Finding 3: Layer 2 -- Post-Write Validate-and-Fix Loop Specification

**The exact agent instruction block** to embed in all @speckit agent definitions (Section 5 "ALWAYS" rules):

```markdown
### Post-Write Validation Protocol (MANDATORY)

After writing or editing ANY `.md` file inside a spec folder:

1. Run validation:
   ```bash
   bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <SPEC_FOLDER_PATH> --strict
   ```

2. Parse the exit code:
   - Exit 0: PASS. Proceed to next file or workflow step.
   - Exit 1: WARNINGS. Review warnings. If structural (TEMPLATE_HEADERS, ANCHORS_VALID), fix immediately. Other warnings may proceed.
   - Exit 2: ERRORS. MUST fix before proceeding. Do NOT write the next file until this one passes.

3. Fix loop (max 3 attempts):
   - Read the error output to identify which rule failed
   - Fix the specific structural issue (wrong header name, missing anchor, wrong order)
   - Re-run validate.sh
   - If 3 attempts fail, report the validation error and stop

4. Only after validate.sh returns exit 0 or exit 1 (warnings-only), proceed to the next file.
```

This replaces the 3 conflicting directives with a single unambiguous protocol. The max-3-attempts limit prevents infinite loops when the agent cannot determine the fix.

[SOURCE: Synthesis from iteration-005.md 3-layer architecture + pre-commit-spec-validate.sh exit code semantics]

### Finding 4: Layer 3 -- Pre-Commit Hook Installation (Zero Code Changes)

The pre-commit hook at `.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh` is **fully functional** (251 lines, 5 sections: config loading, staged file detection, folder age check, validation, main). The `.speckit-enforce.yaml` config exists with sensible defaults.

**Installation method** (choose one):

**Option A: Git hooks path (recommended)**
```bash
git config core.hooksPath .opencode/skill/system-spec-kit/scripts/spec/hooks
```
Then create the hooks directory with a symlink:
```bash
mkdir -p .opencode/skill/system-spec-kit/scripts/spec/hooks
ln -sf ../pre-commit-spec-validate.sh .opencode/skill/system-spec-kit/scripts/spec/hooks/pre-commit
```

**Option B: Direct symlink into .git/hooks**
```bash
ln -sf ../../.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh .git/hooks/pre-commit
```

**Option C: Wrapper script in .git/hooks**
```bash
cat > .git/hooks/pre-commit << 'HOOK'
#!/usr/bin/env bash
exec "$(git rev-parse --show-toplevel)/.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh" "$@"
HOOK
chmod +x .git/hooks/pre-commit
```

**Current `.speckit-enforce.yaml` is already configured**:
- `mode: warn` -- existing folders get warnings only (safe rollout)
- `new_folder_mode: block` -- new folders are blocked on errors (strict for new work)
- `created_after: 2026-03-22` -- progressive enforcement date

**No code changes needed to pre-commit-spec-validate.sh.** It already:
- Detects staged spec files via `git diff --cached`
- Walks up to find spec folders (via `find_spec_folder()`)
- Deduplicates folders
- Runs 6-rule fast subset via `SPECKIT_RULES` env var
- Applies mode-specific exit code logic
- Handles new vs existing folder enforcement levels

**One recommended config change**: After deployment stabilizes, change `.speckit-enforce.yaml` mode from `warn` to `block`:
```yaml
enforcement:
  mode: block          # was: warn
  new_folder_mode: block
  created_after: "2026-03-22"
```

[SOURCE: .opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh:1-251 + .speckit-enforce.yaml:1-23]

### Finding 5: validate.sh --fix Mode Feasibility Assessment

**Question**: Could validate.sh be enhanced with a `--fix` mode that auto-corrects common failures?

**Assessment**: Partially feasible, but the existing infrastructure is better suited.

**What already exists**:
- `progressive-validate.sh` has a Level 2 auto-fix stage with 3 fixers: `autofix_missing_dates()`, `autofix_heading_levels()`, `autofix_whitespace()`. These are low-impact cosmetic fixes.
- `quality-audit.sh` has `--fix` mode that delegates to `check-template-staleness.sh --auto-upgrade` for version stamp updates.

**What would be needed for structural auto-fix** (the high-impact cases):
1. **Missing anchors**: Detectable (ANCHORS_VALID already reports which are missing). Auto-fix: inject `<!-- ANCHOR:name -->` before the corresponding H2 and `<!-- /ANCHOR:name -->` before the next H2. FEASIBLE but fragile -- anchor placement depends on exact H2 text matching.
2. **Wrong header names**: Detectable (TEMPLATE_HEADERS reports `missing_header` and `extra_header`). Auto-fix: rename the H2 text from the "extra" name to the expected "missing" name. RISKY -- an "extra" header might be a custom section, not a renamed required one. Requires heuristic matching (Levenshtein distance, keyword overlap).
3. **Header reordering**: Detectable but auto-fix is DANGEROUS -- reordering sections means moving multi-line content blocks, which risks content corruption.

**Recommendation**: Do NOT add `--fix` to validate.sh. Instead:
- Layer 1 (contract injection) prevents most wrong-header and missing-anchor errors
- Layer 2 (post-write loop) lets the agent self-correct with error feedback
- `progressive-validate.sh` already handles the safe cosmetic fixes
- For structural fixes, the agent is a better fixer than a sed script because it understands content semantics

If a `--fix` mode is desired in the future, scope it to anchor injection only (the safest and most mechanical fix), and keep header renaming/reordering as agent-assisted.

[SOURCE: .opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh:293-458 (auto-fix helpers) + iteration-002.md gap taxonomy]

### Finding 6: Implementation Sequence with Effort Estimates

| Step | Action | Files Changed | Effort | Dependency |
|------|--------|--------------|--------|------------|
| 1 | Create shared compliance reference file | 1 new file | ~30 min | None |
| 2 | Replace spec.md-only scaffold with full contract in `.claude/agents/speckit.md` | 1 file, ~30 lines removed + ~55 lines added | ~20 min | Step 1 |
| 3 | Replicate to other 3 CLI agent defs | 3 files, same diff | ~15 min | Step 2 |
| 4 | Collapse 3 timing directives into 1 (in all 4 agent defs) | 4 files, 3 edits each | ~15 min | Step 2 |
| 5 | Add Post-Write Validation Protocol section (in all 4 agent defs) | 4 files, ~20 lines added | ~10 min | Step 4 |
| 6 | Install pre-commit hook (Option B or C) | 1 symlink or script | ~5 min | None |
| 7 | Test: create a Level 2 spec folder, verify 3-layer enforcement | End-to-end test | ~30 min | Steps 1-6 |
| **Total** | | **~13 file changes** | **~2 hours** | |

### Finding 7: Verification Checklist for Implementation

After implementing all layers, verify:

- [ ] New spec folder created by @speckit agent has 0 validate.sh errors on first write (Layer 1 effectiveness)
- [ ] Agent runs validate.sh after each file write (Layer 2 compliance -- check agent conversation log)
- [ ] `git commit` of spec folder files triggers pre-commit validation (Layer 3 activation)
- [ ] `git commit` with structural errors is blocked when `mode: block` is set (Layer 3 enforcement)
- [ ] Shared reference file version matches template-structure.js contract output (sync check)
- [ ] All 4 CLI agent definitions contain identical compact contract (no drift)
- [ ] Phase parent/child folders validate correctly (phase addenda merging works)

## Sources Consulted
- `.claude/agents/speckit.md`:109,238,318-339,325 (timing directives, current scaffold)
- `.opencode/skill/system-spec-kit/scripts/spec/pre-commit-spec-validate.sh`:1-251 (full hook source)
- `.speckit-enforce.yaml`:1-23 (enforcement config)
- `.opencode/skill/system-spec-kit/scripts/spec/progressive-validate.sh`:293-458 (auto-fix helpers)
- research.md Sections 3.5, 6.1-6.5 (prior iteration synthesis)
- Iterations 1-7 findings (accumulated research base)

## Assessment
- New information ratio: 0.43
- Questions addressed: Implementation blueprints for all 3 layers (synthesis of Q4, Q5, Q8)
- Questions answered: No new questions -- this is implementation specification from answered questions

## Reflection
- What worked and why: Pure synthesis from well-established prior findings. The 7 prior iterations provided complete coverage of the problem space, allowing this iteration to focus entirely on actionable implementation specifications without needing additional research.
- What did not work and why: N/A -- this was a synthesis iteration, not an exploration iteration. All source material was already available.
- What I would do differently: Could have included the Codex TOML-specific formatting for the contract injection, since `.codex/agents/speckit.toml` uses TOML syntax rather than markdown. That is a minor formatting concern left for the implementation phase.

## Recommended Next Focus
Two options for iteration 9:
1. **If convergence is near**: Draft the actual file content for the shared reference file (`.opencode/skill/system-spec-kit/references/template-compliance-contract.md`) as a complete, copy-pasteable artifact. This makes the research immediately actionable.
2. **If more depth is needed**: Investigate the Codex TOML agent format specifically, and explore whether a `generate-compliance-contract.sh` script could auto-generate the shared reference file from template-structure.js output (eliminating manual sync).
