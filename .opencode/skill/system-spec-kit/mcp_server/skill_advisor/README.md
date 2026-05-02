---
title: "Skill Advisor Package"
description: "Native skill routing package for advisor MCP tools, hooks, scoring, validation and Python compatibility."
trigger_phrases:
  - "skill advisor"
  - "advisor_recommend"
  - "gate 2 routing"
  - "skill advisor hook"
---

# Skill Advisor Package

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ARCHITECTURE](#2--architecture)
- [3. DIRECTORY TREE](#3--directory-tree)
- [4. KEY FILES](#4--key-files)
- [5. BOUNDARIES AND FLOW](#5--boundaries-and-flow)
- [6. ENTRYPOINTS](#6--entrypoints)
- [7. VALIDATION](#7--validation)
- [8. RELATED](#8--related)

<!-- /ANCHOR:table-of-contents -->

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

`skill_advisor/` owns native Gate 2 skill routing for Spec Kit. It contains the scorer, daemon freshness checks, MCP handlers, runtime hook rendering, validation bundle and Python compatibility scripts.

Current state:

- Native MCP tools are the primary runtime surface.
- Python scripts remain a compatibility path for callers that cannot use MCP tools directly.
- Public responses stay prompt-safe and expose skill labels, scores, thresholds and trust metadata.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

```text
╭────────────────────────────────────────────────────────────────╮
│ Skill Advisor                                                  │
╰────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
│ MCP callers  │ ───▶ │ handlers/    │ ───▶ │ lib/scorer/      │
│ Hook callers │      │ tools/       │      │ lib/freshness/   │
└──────┬───────┘      └──────┬───────┘      └────────┬─────────┘
       │                     │                       │
       ▼                     ▼                       ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────────┐
│ compat/      │      │ schemas/     │      │ daemon + graph   │
│ scripts/     │      │ docs/tests   │      │ metadata         │
└──────────────┘      └──────────────┘      └──────────────────┘

Dependency direction:
handlers → lib → schemas
compat → handlers and lib
scripts call the native package first, then Python fallback when needed
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:directory-tree -->
## 3. DIRECTORY TREE

```text
skill_advisor/
├── README.md
├── INSTALL_GUIDE.md
├── SET-UP_GUIDE.md
├── bench/                    # Latency and scorer measurement helpers
├── compat/                   # Stable package entrypoints for external callers
├── daemon/                   # Watcher and freshness process code
├── docs/                     # Operator notes and alignment records
├── feature_catalog/          # Current feature inventory
├── handlers/                 # MCP handler implementations
├── lib/                      # Scorer, freshness, lifecycle and rendering logic
├── manual_testing_playbook/  # Manual scenario package
├── schemas/                  # Tool and metadata contracts
├── scripts/                  # Python shim, regression and bench scripts
├── tests/                    # Vitest and compatibility coverage
└── tools/                    # MCP tool descriptors
```

<!-- /ANCHOR:directory-tree -->

---

<!-- ANCHOR:key-files -->
## 4. KEY FILES

| File | Role |
|---|---|
| `handlers/advisor-recommend.ts` | Scores prompts and returns prompt-safe recommendations. |
| `handlers/advisor-status.ts` | Reports freshness, trust state and generation metadata. |
| `handlers/advisor-rebuild.ts` | Rebuilds the advisor index from source metadata. |
| `handlers/advisor-validate.ts` | Runs corpus, holdout, parity, safety and latency checks. |
| `compat/index.ts` | Stable native compatibility entrypoint. |
| `scripts/skill_advisor.py` | Python shim for runtimes that need CLI output. |
| `lib/scorer/` | Five-lane scoring and ambiguity handling. |
| `lib/freshness/` | Freshness, trust and cache state logic. |

<!-- /ANCHOR:key-files -->

---

<!-- ANCHOR:boundaries-and-flow -->
## 5. BOUNDARIES AND FLOW

Boundaries:

- This package owns advisor routing only.
- It may read skill metadata, graph metadata and advisor cache state.
- It must not own code graph indexing or memory retrieval behavior.
- Runtime plugins should import `dist/skill_advisor/compat/index.js`, not private compiled handler files.

Control flow:

```text
╭────────────────────╮
│ prompt or command  │
╰─────────┬──────────╯
          ▼
┌────────────────────┐
│ MCP tool or shim   │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ schema validation  │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ scorer + freshness │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ prompt-safe brief  │
└────────────────────┘
```

<!-- /ANCHOR:boundaries-and-flow -->

---

<!-- ANCHOR:entrypoints -->
## 6. ENTRYPOINTS

| Entrypoint | Use |
|---|---|
| `advisor_recommend` | Runtime skill recommendation. |
| `advisor_status` | Freshness and trust inspection. |
| `advisor_rebuild` | Index rebuild after skill metadata changes. |
| `advisor_validate` | Release and regression validation. |
| `scripts/skill_advisor.py` | CLI compatibility and hook fallback. |

<!-- /ANCHOR:entrypoints -->

---

<!-- ANCHOR:validation -->
## 7. VALIDATION

Run from the repository root:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
(cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill_advisor/tests/ --reporter=default)
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

<!-- /ANCHOR:validation -->

---

<!-- ANCHOR:related -->
## 8. RELATED

| Document | Role |
|---|---|
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Setup, rollback and operator checks. |
| [Feature catalog](./feature_catalog/feature_catalog.md) | Current feature inventory. |
| [Manual testing playbook](./manual_testing_playbook/manual_testing_playbook.md) | Manual validation scenarios. |
| [Hook reference](../../references/hooks/skill-advisor-hook.md) | Runtime hook contract. |

<!-- /ANCHOR:related -->
