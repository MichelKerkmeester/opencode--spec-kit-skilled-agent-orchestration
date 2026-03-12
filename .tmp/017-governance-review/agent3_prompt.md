TASK #3: Spec + Documentation Quality (sk-doc & Level 2 template alignment)
Depth: 1
Agent Tier: LEAF
Model Expectation: gpt-5.3-codex (xhigh)
Objective: Validate governance audit spec docs and related governance feature docs for structure, consistency, and quality.
Scope:
Spec folder docs:
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/017-governance/spec.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/017-governance/plan.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/017-governance/tasks.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/017-governance/checklist.md
- .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/013-code-audit-per-feature-catalog/017-governance/implementation-summary.md
Templates:
- .opencode/skill/system-spec-kit/templates/
Related docs:
- .opencode/skill/system-spec-kit/feature_catalog/17--governance/*.md
Boundary:
- Read-only analysis only.
- Do NOT modify files.
- Do NOT delegate any sub-task.
LEAF NESTING CONSTRAINT:
You are a LEAF agent at depth 1. Nested dispatch is illegal. You MUST NOT dispatch sub-agents or use any task/delegation mechanism. Execute directly and return findings.
Checks:
1. Frontmatter presence/quality for each doc (title, description, template source, trigger_phrases, importance_tier where applicable).
2. Required anchor comment coverage.
3. Presence of <!-- SPECKIT_LEVEL: 2 --> markers.
4. Level 2 addendum sections in spec/plan/checklist.
5. Cross-document consistency: scope, phase, completion status, evidence coherence.
6. Checklist evidence quality: specific and verifiable, not generic.
7. Implementation-summary pattern compliance.
8. Validate CHK-003 reference consistency around NEW-095+ vs NEW-063/NEW-064 and severity.
Output format:
- Verdict: PASS | WARN | FAIL
- Per-document conformance table
- Cross-doc inconsistencies
- Severity-ranked findings with file:line evidence
- Recommendation list
