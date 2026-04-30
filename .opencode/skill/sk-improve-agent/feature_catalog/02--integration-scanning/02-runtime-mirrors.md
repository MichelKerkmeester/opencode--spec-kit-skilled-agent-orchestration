---
title: "Runtime mirrors"
description: "Measures whether the runtime-specific agent mirrors still reflect the canonical agent body."
---

# Runtime mirrors

## 1. OVERVIEW

Measures whether the runtime-specific agent mirrors still reflect the canonical agent body.

This feature covers the parity check that keeps integration consistency from depending only on the canonical `.opencode/agent/*.md` file.

---

## 2. CURRENT REALITY

The scanner uses signal matching instead of byte equality. It strips frontmatter from the canonical and mirror files, extracts up to three emphasized lines longer than twenty characters from the canonical body, and marks a mirror `aligned` when at least two of those signals appear in the mirror body. Missing files are marked `missing`, and one-or-zero signal hits are marked `diverged`.

The live mirror set is narrower than some of the prose references around it. `scan-integration.cjs` currently checks `.claude/agents/{name}.md`, `.codex/agents/{name}.toml`, and `.agents/agents/{name}.md`. `mirror_drift_policy.md` still mentions `.gemini/agents/` as a follow-up review surface, but that directory is not part of the scanner's hardcoded mirror templates today.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs` | Scanner | Defines the mirror templates and the 2-of-3 signal-matching parity check. |
| `.opencode/skill/sk-improve-agent/references/integration_scanning.md` | Reference | Describes the mirror sync statuses and signal-matching algorithm. |
| `.opencode/skill/sk-improve-agent/references/mirror_drift_policy.md` | Policy reference | Defines how mirror drift is reviewed after canonical change. |
| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | Scoring consumer | Converts missing or diverged mirrors into the integration score penalty. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/references/benchmark_operator_guide.md` | Operator reference | Documents the mirror-score weighting used when benchmark runs include integration data. |
| `.opencode/skill/sk-improve-agent/references/no_go_conditions.md` | Safety reference | Treats undocumented mirror drift as a blocker for safe loop expansion. |

---

## 4. SOURCE METADATA

- Group: Integration scanning
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--integration-scanning/02-runtime-mirrors.md`
