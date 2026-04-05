# Consistency Sweep: Checks 5-7

Generated: 2026-03-24

---

## Check 5: Quality Guards -- same 5 guards, same names

**Status:** CONSISTENT
**Files checked:** 6
**Mismatches found:** 0
**Fixes applied:** None

### Canonical (convergence.md section 10.4)

| # | Guard Name | Rule |
|---|-----------|------|
| 1 | Evidence Completeness | Every P0/P1 finding has `file:line` citation |
| 2 | Scope Alignment | All findings are within the declared review scope |
| 3 | No Inference-Only | No P0/P1 finding based solely on inference without code evidence |
| 4 | Severity Coverage | Security + Correctness dimensions have been reviewed |
| 5 | Cross-Reference (optional) | At least one multi-dimension iteration (5+ iterations only) |

### File-by-File Verification

| File | Guards Listed | Match? |
|------|-------------|--------|
| `convergence.md` section 10.4 (lines 748-758) | All 5, with pseudocode implementation (lines 760-801) | CANONICAL |
| `spec_kit_deep-research_review_auto.yaml` step_check_convergence (lines 297-302) | All 5, identical names and conditions | MATCH |
| `spec_kit_deep-research_review_confirm.yaml` step_check_convergence (lines 324-330) | All 5, identical names and conditions | MATCH |
| `quick_reference.md` Review Quality Guards table (lines 264-270) | All 5, slightly abbreviated descriptions | MATCH |
| `SKILL.md` section 4 rule 12 (line 240) | References research-mode guards (source diversity, focus alignment, no single-weak-source) -- not review guards. This is correct: SKILL.md rule 12 covers both modes generically | N/A (different mode) |
| `SKILL.md` section 6 Quality Gates table (line 336) | References research-mode guards. Review-mode guards are delegated to convergence.md section 10.4 | N/A (different mode) |
| `deep-review.md` (OpenCode agent) | Does not list 5 guards explicitly. Correct: guards are orchestrator-level, not agent-level | N/A (by design) |

### Notes

- Research mode uses 3 guards (section 2.4): Source Diversity, Focus Alignment, No Single-Weak-Source
- Review mode uses 5 guards (section 10.4): Evidence Completeness, Scope Alignment, No Inference-Only, Severity Coverage, Cross-Reference
- These are intentionally different guard sets for different modes
- All review-mode files that list the guards are consistent

---

## Check 6: Target Types -- 5 types consistent

**Status:** CONSISTENT
**Files checked:** 7
**Mismatches found:** 0
**Fixes applied:** None

### Canonical Types

`spec-folder`, `skill`, `agent`, `track`, `files`

### File-by-File Verification

| File | Types Listed | Match? |
|------|-------------|--------|
| `state_format.md` section 8 (line 538) | `spec-folder`, `skill`, `agent`, `track`, `files` | MATCH |
| `loop_protocol.md` section 6.1 (lines 549-552) | `spec-folder`, `skill`, `agent`, `track`, `files` (with scope discovery details) | MATCH |
| `review_auto.yaml` step_scope_discovery (lines 143-166) | `spec-folder`, `skill`, `agent`, `track`, `files` (with resolution logic) | MATCH |
| `review_confirm.yaml` user_inputs (line 30) | `[spec-folder\|skill\|agent\|track\|files]` | MATCH |
| `deep_review_strategy.md` (line 169) | References `config.reviewTargetType` -- no inline enum | N/A (defers to config) |
| `quick_reference.md` | No explicit target type enum in review section | N/A |
| `deep-research.md` Q1_type (lines 115-118) | A) spec-folder, B) skill, C) agent, D) track, E) files | MATCH |

---

## Check 7: Agent Cross-Runtime Consistency

**Status:** CONSISTENT
**Files checked:** 5
**Mismatches found:** 0
**Fixes applied:** None

### Comparison Matrix

| Attribute | OpenCode | ChatGPT | Claude | Codex | Agents/Gemini |
|-----------|----------|---------|--------|-------|---------------|
| **Path** | `.opencode/agent/deep-review.md` | `.opencode/agent/chatgpt/deep-review.md` | `.claude/agents/deep-review.md` | `.codex/agents/deep-review.toml` | `.agents/agents/deep-review.md` |
| **Tool budget target** | 9-12 | 9-12 | 9-12 | 9-12 | 9-12 |
| **Tool budget max** | 13 | 13 | 13 | 13 | 13 |
| **Tools (6)** | Read, Write, Edit, Bash, Grep, Glob | Read, Write, Edit, Bash, Grep, Glob | Read, Write, Edit, Bash, Grep, Glob | Read, Write, Edit, Bash, Grep, Glob | read_file, write_file, replace, run_shell_command, grep_search, list_directory |
| **No WebFetch** | Explicit deny | Explicit deny | Not in tools list | Not in tools list | Not in tools list |
| **No Task** | Explicit deny | Explicit deny | Not in tools list | Not in tools list | Not in tools list |
| **LEAF constraint** | Section 0 | Section 0 | Section 0 | Section 0 | Section 0 |
| **7-step workflow** | Section 1 | Section 1 | Section 1 | Section 1 | Section 1 |
| **Read-only target** | Section 4, Rule 10 | Section 4, Rule 10 | Section 4, Rule 10 | Section 4, Rule 10 | Section 4, Rule 10 |
| **10 sections** | 0-10 | 0-10 | 0-10 | 0-10 | 0-10 |
| **Model** | (not in frontmatter) | (not in frontmatter) | opus | gpt-5.4 (effort: high) | gemini-3.1-pro-preview |
| **Path convention ref** | `.opencode/agent/*.md` | `.opencode/agent/chatgpt/*.md` | `.claude/agents/*.md` | `.codex/agents/*.toml` | `.gemini/agents/*.md` |

### Semantic Differences (acceptable, runtime-specific)

1. **Gemini tool names**: Uses runtime-native names (`read_file`, `write_file`, `replace`, `run_shell_command`, `grep_search`, `list_directory`) instead of abstract names. These map 1:1 to the canonical 6 tools. This is expected for Gemini CLI compatibility.

2. **ChatGPT Codex Effort Calibration**: The ChatGPT variant includes one extra paragraph at line 60-61 about preferring lowest-effort paths for low-risk dimensions. Other runtimes do not have this. This is a ChatGPT/Codex-specific optimization hint and does not change the agent's semantic behavior.

3. **Codex TOML format**: Uses `developer_instructions` field wrapping all markdown content in triple-quoted string. Formatting difference only; content is identical.

4. **Model declarations**: Each runtime specifies its own model (opus, gpt-5.4, gemini-3.1-pro-preview). This is expected per-runtime configuration.

### Verified Consistent Across All 5 Runtimes

- LEAF-only constraint (Section 0)
- 7-step core workflow (Section 1): Read State, Determine Focus, Execute Review, Classify Findings, Write Findings, Update Strategy, Append JSONL
- Tool call budget: target 9-12, max 13
- Tools: 6 tools (Read/Write/Edit/Bash/Grep/Glob equivalents), no WebFetch, no Task
- Review target read-only (Section 4 + Rule 10)
- 10 numbered sections (0 through 10)
- Severity thresholds (P0/P1/P2)
- Adversarial self-check protocol (Section 5)
- Rules: 10 ALWAYS, 10 NEVER, 5 ESCALATE
- Output verification checklist (12 items)
- Anti-patterns table (8 entries)
- Summary box content
