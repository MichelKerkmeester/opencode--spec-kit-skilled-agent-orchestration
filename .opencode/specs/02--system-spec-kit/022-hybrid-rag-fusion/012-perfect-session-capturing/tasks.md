# Tasks: Perfect Session Capturing

## Phase A: Spec Folder Setup
- [x] A1: Create description.json
- [x] A2: Create spec.md
- [x] A3: Create plan.md
- [x] A4: Create tasks.md
- [x] A5: Create checklist.md
- [x] A6: Create decision-record.md

## Phase B: 25-Agent Deep Audit
- [ ] B1: Create launch-session-audit.sh script
- [ ] B2: Launch Stream 1 (X01-X05) — Codex deep analysis agents
- [ ] B3: Launch Stream 2 (C01-C20) — Copilot file-level verification agents
- [ ] B4: Verify all 25 scratch files collected

## Phase C: Synthesis & Remediation Manifest
- [ ] C1: Parse all 25 scratch files, extract FINDING blocks
- [ ] C2: Create scratch/remediation-manifest.md (P0-P3 prioritized)
- [ ] C3: Create scratch/analysis-summary.md (statistics, patterns)

## Phase D: Implementation
- [ ] D1: Critical Fixes (P0) — correctness, data loss, security
- [ ] D2: Quality Fixes (P1) — scoring, contamination, dedup
- [ ] D3: Design Improvements (P2) — configurability, patterns
- [ ] D4: Build & validate (`npx tsc --build`, regression test)

## Phase E: Documentation
- [ ] E1: Update tasks.md with concrete items from manifest
- [ ] E2: Update checklist.md with verification results
- [ ] E3: Create implementation-summary.md
- [ ] E4: Save memory context via generate-context.js
