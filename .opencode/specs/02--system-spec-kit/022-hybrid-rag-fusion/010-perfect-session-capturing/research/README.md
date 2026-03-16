# Research: 010-perfect-session-capturing

> 13 research items (R-01 through R-13) spanning 18 agent runs across 4 AI providers.

## Directory Structure

```
research/
├── research-pipeline-improvements.md   Main synthesis (R-01–R-13, 523 lines)
├── analysis-summary.md                 Executive summary of initial 5-agent analysis
├── compliance-manifest.md              Post-QA compliance findings
├── remediation-manifest.md             Remediation tracking
├── README.md                           This file
│
├── analysis/                           5 deep-dive analysis reports
│   └── analysis-X01.md ... X05.md      Pipeline analysis agents (Wave 1)
│
├── audits/                             20 code audit reports
│   └── audit-C01.md ... C20.md         Comprehensive code audits (Wave 2)
│
├── qa/                                 23 QA validation reports
│   └── qa-01-*.md ... qa-23-*.md       QA validation agents (Wave 3)
│
├── fixes/                              7 fix specifications
│   └── fix-01-*.md ... fix-07-*.md     Concrete fix proposals with code
│
└── agent-outputs/
    └── stateless-research/             52 individual agent output files
        ├── R01-R10 + RCA               R-series agent raw outputs
        └── audit-QA*                   Detailed QA audit sub-reports
```

## Research Timeline

| Phase | Items | Agents | Model | Method |
|-------|-------|--------|-------|--------|
| Wave 1: Analysis | X01–X05 | 5 | GPT-5.4 | cli-copilot (high reasoning) |
| Wave 2: Audits | C01–C20 | 20 | GPT-5.4 | cli-copilot (high reasoning) |
| Wave 3: QA | qa-01–qa-23 | 23 | GPT-5.4 | cli-copilot (high reasoning) |
| R-01–R-10 | Synthesis | 10 | GPT-5.4 | cli-copilot (high reasoning) |
| R-11 | Source fidelity | 1 | GPT-5.4 | cli-codex (xhigh reasoning) |
| R-12 | Template compliance | 4 | Opus 4.6 | Claude Code (Explore+Plan agents) |
| R-13 | Auto-detection + regression | 5 | Opus 4.6 | Claude Code (research agents) |

## Key Document

**`research-pipeline-improvements.md`** is the authoritative synthesis. It contains:
- Executive summary with 7 cross-cutting themes
- Priority matrix (P0/P1/P2) with 21 improvement items
- 13 detailed R-series findings with file:line citations
- Implementation sequence (Phases A0 through D)
- 10 decision points for user input
- Agent execution summary with token/time stats

## What Remains in scratch/

- 4 scripts (`launch-*.sh`, `corpus-contract-scan.mjs`) — operational tools
- 35 agent sandbox directories — Codex CLI working artifacts with `manifest.json`/`summary.md`
- `legacy-memory-quarantine/` — quarantined bad memory files (evidence)
