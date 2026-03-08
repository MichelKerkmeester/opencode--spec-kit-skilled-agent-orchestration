# H06 TypeScript Standards Audit

Format: FILENAME | P0 | P1 | Issue count

| FILENAME | P0 | P1 | Issue count |
|---|---|---|---:|
| lib/cognitive/archival-manager.ts | FAIL | FAIL | 7 |
| lib/cognitive/attention-decay.ts | FAIL | PASS | 3 |
| lib/cognitive/co-activation.ts | PASS | FAIL | 2 |
| lib/cognitive/fsrs-scheduler.ts | FAIL | PASS | 4 |
| lib/cognitive/prediction-error-gate.ts | FAIL | PASS | 17 |
| lib/cognitive/pressure-monitor.ts | PASS | FAIL | 2 |
| lib/cognitive/rollout-policy.ts | PASS | PASS | 0 |
| lib/cognitive/temporal-contiguity.ts | FAIL | FAIL | 5 |
| lib/cognitive/tier-classifier.ts | FAIL | PASS | 1 |
| lib/cognitive/working-memory.ts | FAIL | PASS | 3 |
| lib/scoring/composite-scoring.ts | FAIL | FAIL | 17 |
| lib/scoring/confidence-tracker.ts | PASS | FAIL | 8 |
| lib/scoring/folder-scoring.ts | FAIL | PASS | 1 |
| lib/scoring/importance-tiers.ts | PASS | FAIL | 17 |
| lib/scoring/interference-scoring.ts | FAIL | FAIL | 6 |
| lib/scoring/mpab-aggregation.ts | FAIL | FAIL | 2 |
| lib/scoring/negative-feedback.ts | FAIL | FAIL | 6 |

## Detailed findings

### lib/cognitive/archival-manager.ts
- P0:
  - Header block missing/invalid (exact 3-line format required).
  - WHY-style comment without required AI- prefix (L94).
  - WHY-style comment without required AI- prefix (L296).
- P1:
  - Non-null assertion lacks required preceding AI-* justification comment (L449).
  - catch block missing 'instanceof' narrowing (L21).
  - catch block missing 'instanceof' narrowing (L43).
  - catch block missing 'instanceof' narrowing (L49).

### lib/cognitive/attention-decay.ts
- P0:
  - Header block missing/invalid (exact 3-line format required).
  - Commented-out code block detected (L5-L6).
  - Commented-out code block detected (L11-L14).

### lib/cognitive/co-activation.ts
- P1:
  - Non-null assertion lacks required preceding AI-* justification comment (L258).
  - catch block missing 'instanceof' narrowing (L134).

### lib/cognitive/fsrs-scheduler.ts
- P0:
  - Commented-out code block detected (L9-L12).
  - Commented-out code block detected (L18-L21).
  - Commented-out code block detected (L23-L25).
  - Commented-out code block detected (L33-L34).

### lib/cognitive/prediction-error-gate.ts
- P0:
  - Commented-out code block detected (L166-L168).
  - WHY-style comment without required AI- prefix (L52).
  - WHY-style comment without required AI- prefix (L67).
  - WHY-style comment without required AI- prefix (L220).
  - WHY-style comment without required AI- prefix (L232).
  - WHY-style comment without required AI- prefix (L246).
  - WHY-style comment without required AI- prefix (L250).
  - WHY-style comment without required AI- prefix (L254).
  - WHY-style comment without required AI- prefix (L257).
  - WHY-style comment without required AI- prefix (L261).
  - WHY-style comment without required AI- prefix (L264).
  - WHY-style comment without required AI- prefix (L274).
  - WHY-style comment without required AI- prefix (L288).
  - WHY-style comment without required AI- prefix (L311).
  - WHY-style comment without required AI- prefix (L322).
  - WHY-style comment without required AI- prefix (L341).
  - WHY-style comment without required AI- prefix (L349).

### lib/cognitive/pressure-monitor.ts
- P1:
  - Exported function missing explicit return type (L65).
  - Exported interface missing TSDoc (L5).

### lib/cognitive/rollout-policy.ts
- PASS: No P0/P1 issues detected.

### lib/cognitive/temporal-contiguity.ts
- P0:
  - Header block missing/invalid (exact 3-line format required).
- P1:
  - Exported function missing explicit return type (L52).
  - Exported function missing explicit return type (L102).
  - Exported function missing explicit return type (L144).
  - Exported function missing TSDoc (L31).

### lib/cognitive/tier-classifier.ts
- P0:
  - Commented-out code block detected (L295-L297).

### lib/cognitive/working-memory.ts
- P0:
  - Header block missing/invalid (exact 3-line format required).
  - Commented-out code block detected (L4-L5).
  - Commented-out code block detected (L8-L9).

### lib/scoring/composite-scoring.ts
- P0:
  - Commented-out code block detected (L22-L23).
  - Commented-out code block detected (L132-L133).
  - Commented-out code block detected (L414-L415).
  - Commented-out code block detected (L797-L799).
  - WHY-style comment without required AI- prefix (L397).
  - WHY-style comment without required AI- prefix (L420).
- P1:
  - Exported function missing explicit return type (L644).
  - Exported function missing explicit return type (L677).
  - Exported interface missing TSDoc (L42).
  - Exported interface missing TSDoc (L50).
  - Exported interface missing TSDoc (L61).
  - Exported interface missing TSDoc (L68).
  - Exported interface missing TSDoc (L75).
  - Exported interface missing TSDoc (L87).
  - Exported interface missing TSDoc (L100).
  - catch block missing 'instanceof' narrowing (L36).
  - catch block missing 'instanceof' narrowing (L537).

### lib/scoring/confidence-tracker.ts
- P1:
  - Exported interface missing TSDoc (L13).
  - Exported interface missing TSDoc (L21).
  - Exported interface missing TSDoc (L28).
  - catch block missing 'instanceof' narrowing (L155).
  - catch block missing 'instanceof' narrowing (L182).
  - catch block missing 'instanceof' narrowing (L212).
  - catch block missing 'instanceof' narrowing (L256).
  - catch block missing 'instanceof' narrowing (L294).

### lib/scoring/folder-scoring.ts
- P0:
  - Header block missing/invalid (exact 3-line format required).

### lib/scoring/importance-tiers.ts
- P1:
  - Exported interface missing TSDoc (L9).
  - Exported function missing TSDoc (L88).
  - Exported function missing TSDoc (L96).
  - Exported function missing TSDoc (L105).
  - Exported function missing TSDoc (L111).
  - Exported function missing TSDoc (L117).
  - Exported function missing TSDoc (L123).
  - Exported function missing TSDoc (L131).
  - Exported function missing TSDoc (L141).
  - Exported function missing TSDoc (L148).
  - Exported function missing TSDoc (L153).
  - Exported function missing TSDoc (L159).
  - Exported function missing TSDoc (L165).
  - Exported function missing TSDoc (L174).
  - Exported function missing TSDoc (L183).
  - Exported function missing TSDoc (L190).
  - Exported function missing TSDoc (L215).

### lib/scoring/interference-scoring.ts
- P0:
  - Header block missing/invalid (exact 3-line format required).
  - Commented-out code block detected (L153-L154).
- P1:
  - Exported function missing explicit return type (L101).
  - Exported function missing explicit return type (L150).
  - Exported function missing explicit return type (L258).
  - Non-null assertion lacks required preceding AI-* justification comment (L180).

### lib/scoring/mpab-aggregation.ts
- P0:
  - Commented-out code block detected (L112-L114).
- P1:
  - Exported function missing explicit return type (L141).

### lib/scoring/negative-feedback.ts
- P0:
  - Header block missing/invalid (exact 3-line format required).
  - Commented-out code block detected (L8-L9).
- P1:
  - Exported function missing explicit return type (L73).
  - Exported function missing explicit return type (L113).
  - Exported function missing explicit return type (L145).
  - Exported interface missing TSDoc (L136).

## Summary
- Files audited: 17
- P0 FAIL files: 12; P1 FAIL files: 10
- Total issues: 101
