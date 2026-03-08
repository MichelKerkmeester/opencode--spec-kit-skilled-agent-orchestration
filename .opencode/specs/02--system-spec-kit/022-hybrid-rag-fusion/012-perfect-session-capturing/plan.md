# Plan: Perfect Session Capturing

## Approach

Five-phase approach: spec setup → 25-agent deep audit → synthesis → implementation → documentation.

## Phase A: Spec Folder Setup (Level 3) ✅

Create L3 spec documentation in `012-perfect-session-capturing/`.

## Phase B: 25-Agent Deep Audit

### Stream 1: Deep Analysis — 5 Codex Agents (GPT-5.4 xhigh)

Cross-cutting architectural analysis across the entire pipeline.

| Agent | Focus |
|-------|-------|
| X01 | Data Flow & Architecture — map complete data flow, identify data loss points |
| X02 | Quality & Scoring — audit both quality scorers, calibration, false positives/negatives |
| X03 | Error Handling & Edge Cases — 0 messages, 1000 messages, corrupted JSON, concurrent writes |
| X04 | Template & Output Quality — compare template vs actual output, find artifacts |
| X05 | Security & Reliability — path sanitization, session ID, atomicity, TOCTOU races |

### Stream 2: File-Level Verification — 20 Copilot Agents (GPT-5.3-Codex)

Each agent audits 1-2 specific files, reading every line and reporting issues.

| Agent | Files | Focus |
|-------|-------|-------|
| C01 | opencode-capture.ts | Timestamp matching, output truncation, buildExchanges |
| C02 | collect-session-data.ts (1-400) | Config, types, learning index, preflight/postflight |
| C03 | collect-session-data.ts (400-837) | collectSessionData(), task regex, completion % |
| C04 | data-loader.ts | Priority chain, path sanitization, error handling |
| C05 | input-normalizer.ts | transformOpencodeCapture(), decision regex, confidence |
| C06 | workflow.ts (1-300) | runWorkflow(), data loading, session collection |
| C07 | workflow.ts (300-600) | Semantic summary, tree thinning, template rendering |
| C08 | workflow.ts (600+) | Quality scoring, file writing, indexing, error recovery |
| C09 | session-extractor.ts | Tool counting, context type, importance tier, session ID |
| C10 | file-extractor.ts | File extraction from 4 sources, dedup, MAX_FILES |
| C11 | decision-extractor.ts | Decision cue regex, sentence extraction, confidence |
| C12 | conversation-extractor.ts | Message assembly, phase classification, tool detection |
| C13 | diagram-extractor.ts | Phase extraction, ASCII art, flowchart generation |
| C14 | quality-scorer.ts (v1) | 6-dimension scoring, threshold calibration |
| C15 | quality-scorer.ts (v2) | Rule V1-V9, penalty/bonus math, flag emission |
| C16 | template-renderer.ts | Mustache rendering, placeholder suppression |
| C17 | file-writer.ts | Atomic write, placeholder validation, substance check |
| C18 | tree-thinning.ts | Token estimation, merge threshold, data preservation |
| C19 | config.ts + contamination-filter.ts | Config loading, denylist patterns |
| C20 | generate-context.ts + folder-detector.ts | CLI parsing, spec folder resolution |

## Phase C: Synthesis & Remediation Manifest

Parse all 25 scratch files, deduplicate findings, create prioritized remediation manifest (P0-P3).

## Phase D: Implementation (Fixes)

- D1: Critical Fixes (P0) — correctness, data loss, security
- D2: Quality Fixes (P1) — scoring, contamination, dedup
- D3: Design Improvements (P2) — configurability, phase detection
- D4: Build & Validate — `npx tsc --build`, regression test

## Phase E: Documentation Update

Update tasks.md, checklist.md, create implementation-summary.md, save memory context.

## Critical Files

| File | LOC | Expected Changes |
|------|-----|-----------------|
| opencode-capture.ts | 539 | Timestamp matching, truncation, validation |
| collect-session-data.ts | 836 | Task regex, learning formula, completion % |
| input-normalizer.ts | 499 | Decision regex, confidence, verify recent fix |
| workflow.ts | 950 | Quality gates, semantic summary, error recovery |
| session-extractor.ts | 478 | Session ID (crypto), phase detection |
| quality-scorer.ts (v1) | 146 | Threshold calibration |
| quality-scorer.ts (v2) | 127 | Rule tuning, bonus math |
| contamination-filter.ts | 61 | Expand denylist (7 → 25+) |
| config.ts | 273 | Add configurability for hardcoded values |
| decision-extractor.ts | 400 | Cue regex, sentence extraction |

## Verification

1. `npx tsc --build` — zero compilation errors
2. Run `generate-context.js` on 3 spec folders — verify quality scores improve
3. Run `validate.sh` on 012 spec folder — expect exit 0
4. Manually inspect generated memory files for quality
5. Verify session ID uses crypto (not Math.random)
6. Verify contamination filter covers 25+ patterns
