## Packet 045/001: workflow-correctness — Deep-review angle 1 (release-readiness)

### CRITICAL: Spec folder path

The packet folder for THIS audit is: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/001-workflow-correctness/` — write ALL packet files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, review-report.md) under that path. Do NOT ask for the spec folder; use this exact path.

You are cli-codex (gpt-5.5 high fast) implementing a **deep-review** of one release-readiness angle: **workflow correctness for the canonical /spec_kit:* and /memory:* commands**.

This is a READ-ONLY audit packet. Output: a `review-report.md` with severity-classified P0/P1/P2 findings.

### Target surface

The 7 canonical commands and their YAML/markdown contracts:
- `/spec_kit:plan` (`.opencode/command/spec_kit/plan.md` + `assets/spec_kit_plan_*.yaml`)
- `/spec_kit:implement` (`.opencode/command/spec_kit/implement.md` + `assets/spec_kit_implement_*.yaml`)
- `/spec_kit:complete` (`.opencode/command/spec_kit/complete.md` + `assets/spec_kit_complete_*.yaml`)
- `/spec_kit:resume` (`.opencode/command/spec_kit/resume.md` + `assets/spec_kit_resume_*.yaml`)
- `/memory:save` (`.opencode/command/memory/save.md` + `assets/memory_save_*.yaml`)
- `/memory:search` (`.opencode/command/memory/search.md` + `assets/memory_search_*.yaml`)
- `/memory:manage` (`.opencode/command/memory/manage.md` + `assets/memory_manage_*.yaml`)

### Audit dimensions (standard 4)

For each command:
1. **Correctness**: does the YAML workflow produce the documented artifacts? Does each gate fire as documented?
2. **Security**: does the workflow respect Gate 3 (spec folder) hard-block? Are there bypass paths?
3. **Traceability**: every step has a clear input/output contract; no orphan branches
4. **Maintainability**: workflow steps are coherent; no copy-paste drift between auto/confirm modes

### Specific questions

- Does each command's auto vs confirm mode behave identically except for the approval gates?
- Are required-binding checks (preflight_contract) in place at INIT?
- Does `/spec_kit:resume` correctly choose the right canonical-doc-ladder based on phase-parent detection?
- Does `/memory:save` actually call generate-context.js (not just claim to)?
- Are there any workflow steps that reference deprecated paths (e.g., post-038 stress_test/ migration)?

### Adversarial check

For any "auto-fires" claim in the YAML, find the actual trigger and confirm it. For any documented gate, find a code path that could bypass it.

### Read these first

- `.opencode/command/spec_kit/*.md` and `.opencode/command/spec_kit/assets/*.yaml`
- `.opencode/command/memory/*.md` and `.opencode/command/memory/assets/*.yaml`
- `.opencode/skill/system-spec-kit/SKILL.md`
- `.opencode/skill/sk-deep-review/SKILL.md` (for review methodology + severity rubric)
- 035 + 043 + 044 findings for prior knowledge of workflow integrity

### Output contract

Produce `review-report.md` at packet root following sk-deep-review's 9-section structure:
1. Executive Summary
2. Verdict (PASS / CONDITIONAL / FAIL with hasAdvisories)
3. Findings Registry (P0/P1/P2 classification with file:line evidence)
4. Per-Dimension Coverage (correctness / security / traceability / maintainability)
5. Cross-System Insights
6. Top Workstreams (highest-leverage remediation)
7. Convergence Audit
8. Sources
9. Open Questions

Severity rubric:
- P0: blocks release (functional bug, security gap, data loss path)
- P1: required pre-release (significant doc/contract drift, broken workflow path)
- P2: nice-to-have (cleanups, optional improvements)

### Packet structure to create (Level 2)

7-file structure under this packet folder:
- spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json
- PLUS: review-report.md at packet root

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program"]`.

**Trigger phrases**: `["045-001-workflow-correctness","workflow correctness audit","spec_kit memory commands review","release-readiness workflow"]`.

**Causal summary**: `"Deep-review angle 1: audits 7 canonical /spec_kit:* and /memory:* commands for correctness, security, traceability, maintainability. Severity-classified P0/P1/P2 findings with file:line evidence."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- READ-ONLY across the codebase. No code or config mutations.
- Strict validator MUST exit 0 on this packet.
- Severity classification MUST follow sk-deep-review rubric.
- Every finding MUST cite file:line.
- DO NOT commit; orchestrator will commit.

When done, last action is strict validator passing + review-report.md complete with severity-classified findings. No narration; just write files and exit.
