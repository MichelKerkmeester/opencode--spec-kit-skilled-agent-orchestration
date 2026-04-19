---
title: Deep Research Strategy — Q4 NFKC Robustness (RR-1)
description: Runtime strategy for 019/001/003 RR-1 research session.
---

# Deep Research Strategy - Q4 NFKC Robustness

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Research session investigating NFKC canonical-equivalence attack surface on sanitizer chain introduced by phase 016 T-SAN-01/02/03.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Q4 NFKC robustness research for canonical-equivalence attacks on `sanitizeRecoveredPayload`, `trigger-phrase-sanitizer`, and Gate 3 classifier. Unicode 15/16 drift. Cross-platform normalization. CVE corpus. Produce residual-threat inventory + hardening proposals.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What are the exact canonical-equivalence pairs used in NFKC normalization by Node.js/V8 in the current repo runtime? Enumerate character classes.
- [ ] Q2: Can attacker-controlled strings survive NFKC and bypass the trigger-phrase-sanitizer lexical filter? Produce proof-of-concept constructions.
- [ ] Q3: Can attacker-controlled payloads survive `sanitizeRecoveredPayload` and either (a) fail downstream Zod validation or (b) PASS validation with unintended content?
- [ ] Q4: Round-trip stability: input → NFKC → serialize → deserialize → NFKC — does it produce identical output across macOS/Linux/Windows + Unicode 15 vs 16?
- [ ] Q5: What concrete hardening mitigations are feasible? Extended normalization (e.g., NFKD+NFKC chained), post-normalization deny-list for high-risk equivalence classes, or ASCII-only Gate 3 trigger enforcement?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Implementing hardening (sibling implementation child handles that).
- Non-Unicode attack surfaces (XSS, SQL injection, prototype pollution).
- Formal verification of normalization correctness.

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Residual-threat inventory has ≥10 concrete constructions with severity classifications.
- All 5 questions answered.
- Max iterations 18 reached.
- Stuck: 3 iters < 0.05 newInfoRatio.
- P0 surfaced (practical exploit): halt research, dispatch hotfix child.

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1: What are the exact canonical-equivalence pairs used in NFKC normalization by Node.js/V8 in the current repo runtime? Enumerate character classes.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

Phase 016 T-SAN-01/02/03 added NFKC normalization at three surfaces:
- Gate 3 prompt classifier (`gate-3-classifier.ts`)
- `sanitizeRecoveredPayload` (memory-save path)
- `trigger-phrase-sanitizer.ts`

018 spec §3.2 Out of Scope explicitly deferred this research. 018 Wave B added parse/schema split + merge-preserving repair helper but didn't address canonical-equivalence attack surface.

NFKC (Normalization Form Compatibility Composition) collapses canonical-equivalent characters (e.g., `ﬀ` → `ff`). Known attack vectors:
- Cyrillic vs Latin lookalikes (survive NFKC)
- Fullwidth Latin → ASCII (collapsed)
- Mathematical alphanumerics → ASCII
- Ligatures decomposed
- Hangul Jamo composed
- Combining marks normalized

Node.js 25.x uses ICU-provided normalization. Unicode tables version bundled with Node runtime.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 18 (higher budget because adversarial research)
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 30 minutes
- Executor: cli-codex gpt-5.4 high fast (timeout 1800s)
- Started: 2026-04-18T19:14:43Z
<!-- /ANCHOR:research-boundaries -->
