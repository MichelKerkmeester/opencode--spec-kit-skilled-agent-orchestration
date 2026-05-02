You are running iteration 3 of a 5-iteration deep review on spec folder `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/`.

## Iteration 3 Dimension: TRACEABILITY

Audit traceability between the spec docs, the playbooks, and the underlying CLI skills they document. Read prior iterations first:
- `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/review/iterations/iteration-001.md` (correctness)
- `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/review/iterations/iteration-002.md` (security)

## Scope

1. **Prompt sync** (3-way): the structured `Prompt:` field in `## 2. SCENARIO CONTRACT` MUST equal the `Exact Prompt` cell in the `## 3. TEST EXECUTION` 9-column scenario row MUST equal any prompt text echoed in the root playbook category summary block. Spot-check 3 features per playbook.
2. **Source-anchor traceability** — the `## 4. SOURCE FILES` section in each per-feature file should reference real implementation/reference files in the corresponding cli-* skill (e.g. `references/cli_reference.md`, `assets/prompt_templates.md`). Verify random samples that the cited files exist and the cited line ranges are plausible.
3. **Cross-reference index** — every per-feature file in the root `MANUAL_TESTING_PLAYBOOK.md` `Feature File Index` section must link to an existing file. (iteration 1 already verified link integrity = 0 broken; verify the converse: every per-feature file is linked from the root.)
4. **ADR ↔ checklist ↔ implementation-summary consistency** — read the spec folder docs and verify:
   - ADR-001 (shared category invariants 01/06/07) is referenced from checklist CHK-040/041/042 + implementation-summary
   - ADR-002 (per-CLI ID prefixes CC/CX/CP/CG/CO) actually matches the prefixes used in playbooks
   - ADR-005 (dispatch via @write) matches the actual provenance documented in implementation-summary
   - implementation-summary.md claims (counts: 20+25+21+18+31=115; HVR reductions; 504 files renamed) match what `find`/`grep` actually report
5. **CLI skill ↔ playbook surface alignment** — for each cli-* skill, do the playbook scenarios actually cover the documented surface? Read `cli-claude-code/SKILL.md`, `cli-codex/SKILL.md`, etc., and check whether major features are missing from their playbook (e.g. an undocumented flag, an agent never exercised).
6. **Section-rename completeness audit** — the rename `## 2. CURRENT REALITY` → `## 2. SCENARIO CONTRACT` was claimed to cover 14 playbook trees + 5 source-of-truth files. Verify this claim by `grep`. Also verify the prose intro line under `## 2. SCENARIO CONTRACT` still makes sense ("Operators run the exact prompt and command sequence...").

## Severity contract

- **P0 (Blocker)**: prompt mismatch between SCENARIO CONTRACT and 9-column row, broken source anchor (cited file does not exist), ADR claim contradicted by reality, implementation-summary count off by >5%
- **P1 (Required)**: per-feature file not linked from root index, source anchor file exists but cited line range is wrong, ADR cross-link missing in checklist
- **P2 (Suggestion)**: minor wording divergence between summary and per-feature, opportunity to add a missing cross-link

## Method

Use Read + Grep + Glob. For prompt sync, extract the `- Prompt: ` line from a per-feature file and compare against the corresponding row in the per-feature 9-column table. For source anchors, sample 5 cited files per playbook and `test -f` them.

## Output (REQUIRED)

Write findings to `.opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/review/iterations/iteration-003.md` using the same template format. `[severity] [feature-id-or-file:line] description + remediation`. Read-only review.
