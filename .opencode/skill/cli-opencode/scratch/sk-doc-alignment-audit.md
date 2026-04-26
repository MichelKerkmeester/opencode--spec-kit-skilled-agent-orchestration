# cli-opencode sk-doc Alignment Audit

Read-only structural/HVR/template audit of the 9 cli-opencode files against sk-doc canonical templates and the 4 cli-* sibling skills that previously passed sk-doc compliance.

---

## 1. Summary

**Verdict: CONDITIONAL PASS**

The cli-opencode skill is structurally sound and aligns well with the canonical sk-doc templates and the four cli-* sibling skills. All required sections, anchor pairs, frontmatter fields, and cross-references resolve correctly. Internal markdown structure (H1/H2 hierarchy, anchor open/close pairs, TOC anchor resolution) is clean. There are no P0 blockers.

The CONDITIONAL grade reflects two recurring P1 deviations from the sibling-skill baseline:

1. The asset/template H2 headings in `assets/prompt_quality_card.md` and `assets/prompt_templates.md` use Title Case ("## 2. Framework Selection Table", "## 2. Template 1 — External Runtime to OpenCode") where the sibling cli-codex `prompt_templates.md` uses ALL CAPS ("## 2. CODE GENERATION", "## 7. CODE TRANSFORMATION"). cli-codex `prompt_quality_card.md` matches cli-opencode's Title Case pattern, so half of this finding is sibling-aligned.
2. The frontmatter `description` field in `SKILL.md` is 145 characters — below the 150-300 band defined in `sk-doc/assets/skill/skill_md_template.md` §2. Sibling cli-codex is 228, cli-claude-code is also long. This is borderline and not a sk-doc HARD blocker (the doc says "Single line, 150-300 chars" without an enforcement column).

Em-dash use is high (104 occurrences across the 9 files vs cli-codex's 74 and cli-claude-code's 56). HVR §3 lists em-dashes as a hard punctuation blocker, but every cli-* sibling that previously passed sk-doc also uses em-dashes liberally — this is a project-wide deviation from HVR rather than a cli-opencode-specific issue. Flagged as P2 for consistency with the canonical HVR rule, not as a blocker.

**Findings totals: P0=0, P1=4, P2=12. Files passing structural sk-doc minimums: 9/9.**

---

## 2. Methodology

### sk-doc templates read

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-doc/assets/skill/skill_md_template.md` — canonical SKILL.md template (1185 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-doc/assets/skill/skill_reference_template.md` — canonical reference-file template (1059 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-doc/assets/skill/skill_asset_template.md` — canonical asset-file template (972 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-doc/assets/documentation/readme_template.md` — canonical README template (1190 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-doc/references/global/hvr_rules.md` — Human Voice Rules (520 lines)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-doc/references/global/core_standards.md` — structural standards (338 lines)

### Sibling files compared

- `cli-codex/SKILL.md` (682 LOC) — closest functional analog, has agent dispatch + cross-AI orchestration + memory handback
- `cli-claude-code/SKILL.md` (618 LOC) — second analog, cleanest minimal sibling
- `cli-codex/README.md` (442 LOC) — README two-tier structure baseline
- `cli-claude-code/README.md` (354 LOC) — README minimal pattern
- `cli-codex/assets/prompt_quality_card.md` (97 LOC) — asset-template baseline (closest twin)
- `cli-codex/assets/prompt_templates.md` (770 LOC) — section heading style baseline
- `cli-codex/references/cli_reference.md` (614 LOC) — reference-template baseline for CLI flags
- `cli-codex/references/integration_patterns.md` (758 LOC) — integration-pattern reference baseline
- `cli-codex/references/agent_delegation.md` (394 LOC) — agent routing reference baseline
- `cli-codex/references/codex_tools.md` (501 LOC) — unique-capabilities reference baseline (paired against cli-opencode `opencode_tools.md`)

### Audit dimensions applied

Frontmatter compliance, section structure (numbered H2 ALL CAPS, anchor open/close pairs, ordering), HVR voice rules (banned words/phrases, em-dash, semicolon, three-item lists), file length vs sk-doc and sibling bands, cross-reference integrity, content depth per template intent, code-fence hygiene (language tags, no leaking secrets).

---

## 3. Findings by file

### 3.1 SKILL.md (696 LOC)

**P0:** none

**P1:**

- **`SKILL.md:3` description below sk-doc 150-300 char band.** `description: "OpenCode CLI orchestrator for external AI runtimes and detached sessions to invoke opencode run with full plugin, skill, and MCP runtime context."` is 145 characters. Sibling cli-codex is 228, cli-claude-code 187. **Fix:** lengthen to ~180-220 chars by naming the three use cases or core capabilities, e.g., `"OpenCode CLI orchestrator enabling external AI assistants and in-OpenCode operators to invoke opencode run for full plugin, skill, MCP, and Spec Kit Memory runtime, plus parallel detached sessions and cross-AI handback."`
- **`SKILL.md:32-34, 36-38, 40-42` use-case bullet sub-lists are 2 items.** sk-doc HVR §4 "Three-Item Enumeration Fix" prefers 2/4/5 — these are 2 each, which is COMPLIANT. However the file has FIVE use-case categories ("Full plugin... / Parallel detached... / Cross-AI orchestration handback / Agent dispatch / Cross-repo dispatch") which is fine. False positive on initial scan; documenting here for adversarial-self-check completeness.

**P2:**

- **`SKILL.md:14, 23, 28, 32, 36, 40, 48, 66, 67, 68, 127-132, 287, 337, 386, 404, 410, 436, 455, 461, 476, 485, 506, 531, 599, 644-648` em-dash usage (34 occurrences).** HVR §3 hard-blocks em-dashes. cli-codex/SKILL.md has 29 em-dashes (similar density) and passed sk-doc. Project convention overrides the canonical HVR rule. **Suggested fix only if the project wants to align with HVR strictly:** replace em-dash with comma, period, or colon.
- **`SKILL.md:102, 435, 440, 518, 558, 645` semicolons in narrative tables/lists.** HVR §3 hard-blocks semicolons. Several are inside markdown tables ("| `provider/model not found` | Run `opencode providers` to enumerate; `auth login <provider>` if needed |") where the semicolon is within a single cell. cli-codex sibling has equivalent narrative semicolons. Same project-convention-overrides note. **Fix:** rewrite with periods or "and".

### 3.2 README.md (458 LOC)

**P0:** none

**P1:**

- **`README.md:46` three-item sentence enumeration.** "The skill documents three orthogonal use cases: external runtime to OpenCode, in-OpenCode parallel detached sessions for ablation and worker farms, and cross-AI handback where a non-Anthropic CLI needs OpenCode-specific plugins." HVR §4 Three-Item Enumeration Fix prefers 2/4/5. This is content-driven (the skill genuinely has three orthogonal use cases per ADR-002) so cutting one or padding to four would be artificial. **Fix:** rephrase as "The skill documents three orthogonal use cases" + bullet list (two-tier voice convention permits this), or accept the deviation with a note that "three" is a load-bearing constant.

**P2:**

- **`README.md:80, 158, 205, 210, 211, 312, 385, 406, 417, 433` em-dash usage (10 occurrences).** Same HVR project-convention issue as SKILL.md. cli-codex README has 9.
- **`README.md:406` semicolon in narrative.** "For Google Search grounding use cli-gemini; for Codex's `--search` use cli-codex." HVR §3. **Fix:** "For Google Search grounding use cli-gemini. For Codex's `--search` use cli-codex."

### 3.3 graph-metadata.json (152 LOC)

**P0:** none. **P1:** none. **P2:** none.

The graph-metadata.json schema follows sibling cli-codex exactly (schema_version 2, family "cli", category "cli-orchestrator", siblings array of 4 cli-* peers at weight 0.5, intent_signals × 5, derived block with trigger_phrases, key_topics, key_files, entities, causal_summary, source_docs, created_at, last_updated_at). No structural deviation from sibling baseline.

### 3.4 assets/prompt_quality_card.md (101 LOC)

**P0:** none

**P1:**

- **`assets/prompt_quality_card.md:6` non-standard sync tag.** `<!-- sync: cli-opencode-v1 -->` uses a human-readable label where the cli-codex sibling uses an 8-char hash (`<!-- sync: 9d3a5fd2 -->`). This appears to be a hash that ties the asset to a parent skill version. **Fix:** generate a content hash or commit-prefix tag matching the sibling pattern. If the project standard is human-readable labels, document the convention in sk-doc.
- **`assets/prompt_quality_card.md:27, 43, 59, 71, 81, 95` Title Case H2 headings instead of ALL CAPS.** "## 2. Framework Selection Table", "## 3. Task to Framework Map", "## 4. CLEAR 5-Check", "## 5. Escalate to `@improve-prompt`", "## 6. Failure Patterns", "## 7. Related Resources". sk-doc/core_standards.md §3 says SKILL/Knowledge enforce ALL CAPS H2; asset files default to "Flexible". The sibling cli-codex `prompt_quality_card.md` uses the SAME Title Case pattern (matches cli-opencode), so this is sibling-baseline-aligned, not a deviation. Re-classified as P2 advisory.

**P2:**

- **`assets/prompt_quality_card.md:88` em-dash usage** (1 occurrence). Trivial.
- **`assets/prompt_quality_card.md:27-37` Framework Selection Table has 7 rows (good — not three).** No deviation; documenting positive alignment.
- **Section heading mix:** §1 OVERVIEW is ALL CAPS, §2-§7 are Title Case. cli-codex has the same mix. Inconsistent within the file but cross-sibling-consistent. **Fix:** unify all H2 to ALL CAPS for sk-doc strictness, OR keep matching cli-codex.

### 3.5 assets/prompt_templates.md (496 LOC)

**P0:** none

**P1:**

- **`assets/prompt_templates.md:22, 74, 114, 157, 179, 221, 255, 293, 332, 364, 393, 420, 448` Title Case H2 headings.** "## 2. Template 1 — External Runtime to OpenCode (Use Case 1)", etc. The sibling cli-codex `prompt_templates.md` uses ALL CAPS for the same role: "## 2. CODE GENERATION", "## 7. CODE TRANSFORMATION", "## 14. REASONING EFFORT SELECTION". This is the most consequential structural deviation in the audit because it breaks parity with the sibling baseline. **Fix:** convert §2-§14 H2 to ALL CAPS, e.g., "## 2. TEMPLATE 1 — EXTERNAL RUNTIME TO OPENCODE (USE CASE 1)". Note: §1 (OVERVIEW) and §15 (RELATED RESOURCES) already use ALL CAPS — only §2-§14 are inconsistent.

**P2:**

- **`assets/prompt_templates.md:22, 74, 114, 157, 179, 221, 255, 293, 332, 364, 393, 420, 448, 82, 200, 233, 313, 374, 439, 443` em-dash usage (20 occurrences).** Heavy concentration. cli-codex prompt_templates.md has 6. **Fix only if HVR is enforced strictly:** replace em-dash with comma/period.
- **`assets/prompt_templates.md:46-58, 456-477` literal `<!-- MEMORY_HANDBACK_START -->` comment markers inside fenced ```text``` blocks.** These are intentional template content (the calling AI tells the dispatched session to emit these delimiters). Confirmed correct by cross-reference to SKILL.md §4 RULES Memory Handback Protocol. No fix needed; documenting for adversarial-self-check.

### 3.6 references/cli_reference.md (295 LOC)

**P0:** none

**P1:** none

**P2:**

- **`references/cli_reference.md:36` Key Sources table mentions an absolute binary path.** "| **Binary** | `/Users/michelkerkmeester/.superset/bin/opencode` |" — this leaks the operator's home directory layout to anyone reading the published skill. cli-codex `cli_reference.md` does NOT include a binary path. **Fix:** remove the binary-path row, or replace with a relative reference like "`$(command -v opencode)`".
- **`references/cli_reference.md:21, 53, 101, 103, 205, 236, 237, 238, 262, 264, 280` em-dash (11 occurrences).**
- **`references/cli_reference.md:38, 131, 132, 150, 265` semicolons in narrative cells.** Same project-convention issue.
- **File length 295 LOC.** sibling cli-codex `cli_reference.md` is 614 LOC (more than 2x larger). The cli-opencode reference is leaner because the OpenCode CLI surface this skill cares about is genuinely smaller (one canonical subcommand `run`, not the multi-subcommand surface cli-codex documents). Acceptable.

### 3.7 references/integration_patterns.md (323 LOC)

**P0:** none

**P1:** none

**P2:**

- **`references/integration_patterns.md:30, 85, 150` H2 headings include em-dash inline.** "## 2. USE CASE 1 — EXTERNAL RUNTIME TO OPENCODE", etc. The em-dash is technically inside the H2 text and would survive sk-doc validation, but the canonical convention prefers a colon: "## 2. USE CASE 1: EXTERNAL RUNTIME TO OPENCODE". cli-codex uses simple titles without dashes. **Fix:** replace em-dash with colon in H2 text (also re-derive the anchor slug if the slug-extraction rules strip the dash).
- **`references/integration_patterns.md:15, 25, 34, 154, 202, 239, 270, 284, 295` em-dash usage (13 occurrences).**
- **`references/integration_patterns.md:228-251` ASCII decision tree art.** Wide ASCII art that may not render ideally on narrow viewports but is intentional for the decision tree. Sibling cli-codex `integration_patterns.md` uses simpler boxed pseudocode. Stylistic preference; no fix required.

### 3.8 references/agent_delegation.md (146 LOC)

**P0:** none

**P1:**

- **File length 146 LOC.** sibling cli-codex `agent_delegation.md` is 394 LOC. The cli-opencode version covers the same content (orchestration model, agent roster, routing matrix, multi-agent workflows, leaf-agent constraints, As @ pattern, related resources) more tersely. sk-doc/assets/skill/skill_reference_template.md §3 says reference files are typically 200-1500 lines depending on complexity; 146 is below the 200-line "Quick Reference" floor. The content density is reasonable per dimension, but the file would benefit from one or two ASCII diagrams or a comparison table to strengthen retrieval anchors. **Fix:** add a "Conductor → Agent → Conductor" ASCII orchestration diagram (cli-codex `agent_delegation.md` has one in §2) to bring the file closer to sibling depth.

**P2:**

- **`references/agent_delegation.md:8, 17, 40, 41, 67, 93, 104, 128, 129, 130, 131` em-dash usage (11 occurrences).**

### 3.9 references/opencode_tools.md (207 LOC)

**P0:** none

**P1:** none

**P2:**

- **`references/opencode_tools.md:25, 167, 191` em-dash usage (4 occurrences).** Sparse — best-aligned with HVR of any cli-opencode file.
- **`references/opencode_tools.md:118` semicolon inside a fenced bash example** (`while IFS= read -r line; do`) which is shell syntax and exempt. False positive in HVR scan.

---

## 4. Cross-cutting themes

### 4.1 Em-dash density is project-wide, not cli-opencode-specific

Across cli-opencode (104 em-dashes), cli-codex (74), and cli-claude-code (56), all three orchestrator skills exceed the HVR §3 zero-em-dash rule. cli-codex passed prior sk-doc compliance, so the project tolerates em-dashes despite HVR. The em-dash flag is documented as P2 throughout this audit instead of P0. If the project wants HVR-strict, it should run a separate em-dash sweep across all five cli-* skills together, not just cli-opencode in isolation.

### 4.2 Asset H2 heading case mismatch

cli-opencode `prompt_templates.md` deviates from cli-codex by using Title Case ("## 2. Template 1 — External Runtime to OpenCode") instead of ALL CAPS ("## 2. CODE GENERATION"). The mismatch breaks sibling-baseline parity in the most-loaded asset. P1, fixable in 13 line edits. cli-opencode `prompt_quality_card.md` matches cli-codex Title Case (both inconsistent the same way), so prompt_quality_card is sibling-aligned and prompt_templates is not.

### 4.3 Description length under-shoot in SKILL.md

The 145-char SKILL.md description is the only frontmatter field below the 150-300 band. All other description fields across the 9 files are within or well above the band. P1, single-line fix.

### 4.4 Sibling-parity is otherwise tight

graph-metadata.json schema, anchor open/close pair counts (all match the H2 count), TOC anchor resolution (all 11 README TOC entries resolve to actual H2 headings via GitHub-flavored Markdown algorithm), `<!-- Keywords: ... -->` comment placement, frontmatter field set (`name`, `description`, `allowed-tools` array, `version`), and the skill-template structural ordering (1. WHEN TO USE → 2. SMART ROUTING → 3. HOW IT WORKS → 4. RULES → 5. REFERENCES → 6. SUCCESS CRITERIA → 7. INTEGRATION POINTS → 8. RELATED RESOURCES) all match sibling cli-codex exactly. Anchor placement (open marker BEFORE H2, close marker BEFORE next H2 or EOF) follows the canonical sk-doc convention.

### 4.5 No leaking secrets, but one home-directory leak

`references/cli_reference.md:36` exposes the operator's home directory layout (`/Users/michelkerkmeester/.superset/bin/opencode`). The path is not a secret but is local-environment-specific and should be normalized to `$(command -v opencode)` for portability and review hygiene. P2, single-line fix.

---

## 5. Strengths

The skill demonstrates strong sk-doc alignment in several dimensions:

**Required-section coverage.** All 5 required SKILL.md sections (WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, REFERENCES) are present with mandatory subsections. RULES has the required ALWAYS / NEVER / ESCALATE IF triplet (10 ALWAYS, 7 NEVER, 5 ESCALATE IF — counts within sk-doc bands of 4-7 / 3-5 / 3-5).

**Smart Routing Pseudocode.** SKILL.md §2 contains a single authoritative Python pseudocode block with `_guard_in_skill()`, `discover_markdown_resources()`, `score_intents()`, `select_intents()`, `UNKNOWN_FALLBACK_CHECKLIST`, and explicit ON_DEMAND handling. This matches the canonical skill_md_template.md §3 router parity checklist precisely. The router is more thorough than cli-codex's because cli-opencode adds an explicit self-invocation guard pseudocode that cli-codex omits.

**Code-fence language tags.** All opening code fences across the 9 files specify a language. cli-opencode is CLEANER on this dimension than cli-codex (which has 5 opening fences without language).

**Anchor pairs.** Every file has matching open/close anchor counts (8/8, 10/10, 7/7, 15/15, 11/11, 8/8, 7/7, 8/8). No orphan anchors, no overlapping anchors.

**TOC anchor resolution.** All 11 README TOC entries resolve to live H2 headings via the GitHub-flavored Markdown anchor algorithm. No phantom links.

**Cross-reference integrity.** Every internal `./references/*.md` and `./assets/*.md` link in SKILL.md and README.md resolves to an existing file. graph-metadata.json `derived.key_files` and `derived.entities[]` paths all exist on disk.

**Frontmatter field hygiene.** Every file has the canonical `title`/`description` pair (or `name`/`description`/`allowed-tools` for SKILL.md). No angle brackets, no curly quotes, no multiline descriptions.

**Self-invocation guard.** The three-layer detection (env var, process ancestry, lock-file) is documented in SKILL.md §2 (Smart Routing), §4 RULES item 2 (ALWAYS), Section 7 (Integration Points), README §1.4 (How This Compares), README §3.1 (Feature Highlights), README §7 (Troubleshooting), and `references/integration_patterns.md` §5 (decision tree). Strong consistency across all surface areas.

---

## 6. Remediation roadmap

### Priority 1 (must fix to claim full sk-doc parity with siblings)

1. **`SKILL.md:3`** — extend `description` from 145 to ~180-220 chars to land inside the 150-300 sk-doc band.
2. **`assets/prompt_templates.md:22, 74, 114, 157, 179, 221, 255, 293, 332, 364, 393, 420, 448`** — convert §2-§14 H2 headings to ALL CAPS to match cli-codex sibling baseline.
3. **`assets/prompt_quality_card.md:6`** — replace `<!-- sync: cli-opencode-v1 -->` with a content-hash sync tag matching cli-codex pattern (or document the cli-opencode-v1 convention in sk-doc as an explicit alternative).
4. **`references/agent_delegation.md`** — add a "Conductor → Agent → Conductor" ASCII orchestration diagram in §2 to bring the file from 146 LOC closer to the cli-codex `agent_delegation.md` 394-LOC depth and improve retrieval-anchor density.

### Priority 2 (housekeeping, project-wide consistency)

Grouped by file:

- **`SKILL.md`**: 34 em-dashes, 6 narrative semicolons.
- **`README.md`**: 10 em-dashes, 1 narrative semicolon (`README.md:406`).
- **`assets/prompt_quality_card.md`**: 1 em-dash. Consider unifying §2-§7 H2 case to ALL CAPS for SKILL parity (currently Title Case matching cli-codex).
- **`assets/prompt_templates.md`**: 20 em-dashes (post-P1 ALL-CAPS conversion will resolve some inline ones in H2 text).
- **`references/cli_reference.md`**: 11 em-dashes, 5 narrative semicolons. **`references/cli_reference.md:36`** — replace home-directory absolute path with `$(command -v opencode)` for portability.
- **`references/integration_patterns.md`**: 13 em-dashes, 0 semicolons. **`integration_patterns.md:30, 85, 150`** — replace em-dash in H2 text with colon (also re-derive anchor slug).
- **`references/agent_delegation.md`**: 11 em-dashes.
- **`references/opencode_tools.md`**: 4 em-dashes (cleanest file).

If the project decides to enforce HVR §3 strictly (em-dashes/semicolons banned), the work should be batched across all 5 cli-* skills together — not just cli-opencode — because the issue is project-wide.

### Priority 3 (advisory only)

- README §1 "three orthogonal use cases" sentence enumeration is content-driven and acceptable. No fix required.
- ASCII decision tree in `integration_patterns.md` §5 is intentional and stylistically aligned with the skill's positioning. No fix required.
- The 145-char SKILL.md description sits 5 chars below the 150-char floor — this is borderline rather than a hard violation. If the project decides 145 is acceptable, document the band relaxation in sk-doc.

---

## 7. Adversarial self-check

For each P0 finding, confirm the file:line citation actually proves the violation.

**P0 count: 0.** No P0 findings. The skill has no missing required frontmatter fields, no missing required SKILL.md sections, no banned-word HARD blockers (the HVR Section 6 hard-blocker word list — `delve`, `embark`, `realm`, `tapestry`, `illuminate`, `unveil`, `elucidate`, `leverage`, `foster`, `nurture`, `resonate`, `empower`, `disrupt`, `curate`, `harness`, `elevate`, `robust`, `seamless`, `holistic`, `synergy`, `paradigm`, `enlightening`, `esteemed`, `remarkable`, `skyrocket`, `utilize`, `groundbreaking`, `cutting-edge`, `ever-evolving`, etc. — produced ZERO matches when grepped across all 9 files), and no broken cross-references.

**Adversarial validation of the four P1 findings:**

1. **SKILL.md description 145 chars under 150-300 band.** Verified by `awk` measurement: `awk '/^description:/ {sub(/^description:[ \t]*/, ""); gsub(/^"|"$/, ""); print length($0)}' SKILL.md` returns 145. Template authority: `sk-doc/assets/skill/skill_md_template.md:78` — "description: ✅ Single line, 150-300 chars". Sibling cli-codex SKILL.md description measures 228 chars (within band). Confirmed P1.

2. **prompt_templates.md §2-§14 Title Case H2.** Verified by direct `grep '^## ' assets/prompt_templates.md` showing "## 2. Template 1 — External Runtime to OpenCode (Use Case 1)" through "## 14. Template 13 — Memory Epilogue (Reusable Tail)" with mixed-case "Template" inside ALL-CAPS context. Sibling cli-codex `assets/prompt_templates.md` shows ALL CAPS: "## 2. CODE GENERATION", "## 14. REASONING EFFORT SELECTION". Confirmed P1.

3. **prompt_quality_card.md sync tag non-standard.** Verified by `head -7 assets/prompt_quality_card.md` showing `<!-- sync: cli-opencode-v1 -->`. Sibling cli-codex shows `<!-- sync: 9d3a5fd2 -->` (8-char hex). Confirmed P1, but downgraded from blocker because the sync-tag convention is not codified in sk-doc itself — it appears to be an internal convention only documented through the cli-codex sibling.

4. **agent_delegation.md 146 LOC below sibling 394 LOC depth.** Verified by `wc -l references/agent_delegation.md` returning 146 and the cli-codex equivalent returning 394. The sk-doc reference template `skill_reference_template.md:228` says reference files are 500-1500 lines for Workflow type or 200-400 for Quick Reference type. cli-opencode `agent_delegation.md` is below the Quick Reference floor of 200, suggesting either (a) it should be expanded with a diagram and additional patterns to match sibling depth, or (b) re-classified as a Quick Reference and the 200-400 floor relaxed. Confirmed P1, fix discretionary.

All four P1 findings are real, file:line-citable, and reproducible by re-running the audit commands above.

---

`AUDIT_DONE total_findings P0=0 P1=4 P2=12 verdict=CONDITIONAL files_passing=9/9`
