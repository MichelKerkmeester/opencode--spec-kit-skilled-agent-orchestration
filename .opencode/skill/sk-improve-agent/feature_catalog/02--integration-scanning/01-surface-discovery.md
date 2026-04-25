---
title: "Surface discovery"
description: "Discovers the repo surfaces that define an agent beyond its canonical markdown file."
---

# Surface discovery

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Discovers the repo surfaces that define an agent beyond its canonical markdown file.

This feature covers the repository scan that feeds integration consistency scoring and gives operators a concrete list of what would drift if the canonical agent changed.

---

## 2. CURRENT REALITY

`scan-integration.cjs` inventories the canonical `.opencode/agent/{name}.md` file, runtime mirrors, improve-command markdown, YAML workflow assets, skill references, global docs, and one skill-advisor lookup. Command markdown is scanned for `@{agent}` dispatch, while YAML is scanned for either `@{agent}` or bare agent-name references.

The discovery map includes the consolidated advisor script at `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`, so the skill-advisor surface is registered from its self-contained package location.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/scripts/scan-integration.cjs` | Scanner | Walks the repo and collects canonical, mirror, command, YAML, skill, global-doc, and skill-advisor surfaces. |
| `.opencode/skill/sk-improve-agent/references/integration_scanning.md` | Reference | Documents the intended scan taxonomy and output summary fields. |
| `.opencode/command/improve/agent.md` | Command | Uses the integration report as part of loop setup and review. |
| `.opencode/skill/sk-improve-agent/scripts/score-candidate.cjs` | Scoring consumer | Converts the scan results into the integration dimension score. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/references/evaluator_contract.md` | Contract reference | Locks the scanner into the integration-consistency dimension and its weighted contribution. |
| `.opencode/skill/sk-improve-agent/references/target_onboarding.md` | Operator reference | Requires the integration scan before new targets enter the loop. |

---

## 4. SOURCE METADATA

- Group: Integration scanning
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--integration-scanning/01-surface-discovery.md`
