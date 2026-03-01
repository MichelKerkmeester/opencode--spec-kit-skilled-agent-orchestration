# T066 User Satisfaction Survey -- Execution Template and Scoring Worksheet

Status: AWAITING HUMAN EXECUTION (T066 open/pending, blocked on T065)
Prepared: 2026-02-19
Blocking: CHK-163, CHK-164, CHK-184 (SC-005)

Success criterion: average continuity score >= 4.0/5.0
Results file (to create after survey): scratch/phase3-user-survey-results.md

---

## 1. Survey Administration

Target participants: 20 users minimum (active MCP session users post-100% rollout)
Survey format: self-reported, 5-point Likert scale (1 = strongly disagree, 5 = strongly agree)
Distribution method: (select one: direct message / email / embedded prompt / other)
Collection window: 7 days after T065 100% rollout confirmed

Administered by: _______________
Survey open date: _______________
Survey close date: _______________
Actual responses received: _______________

---

## 2. Survey Instrument

Instructions to participants:
  "You are participating in a brief evaluation of the memory continuity feature.
   Please rate each statement on a scale of 1-5.
   1 = Strongly Disagree, 2 = Disagree, 3 = Neutral, 4 = Agree, 5 = Strongly Agree
   Your responses are anonymous and will be used to guide rollout decisions."

### Dimension 1: Continuity (Primary Gate -- target avg >= 4.0/5.0)

C1. When I resume a session, the assistant remembers relevant context from earlier work.
    Rating: 1 / 2 / 3 / 4 / 5

C2. I spend less time re-explaining prior context compared to before.
    Rating: 1 / 2 / 3 / 4 / 5

C3. The assistant picks up where I left off without requiring manual context re-loading.
    Rating: 1 / 2 / 3 / 4 / 5

### Dimension 2: Relevance

R1. The memories surfaced during my sessions are relevant to my current task.
    Rating: 1 / 2 / 3 / 4 / 5

R2. The assistant does not surface irrelevant or distracting past context.
    Rating: 1 / 2 / 3 / 4 / 5

### Dimension 3: Performance

P1. Response times feel the same as or better than before this feature was enabled.
    Rating: 1 / 2 / 3 / 4 / 5

P2. I have not experienced slowness or timeouts related to memory retrieval.
    Rating: 1 / 2 / 3 / 4 / 5

### Dimension 4: Trust

T1. I am comfortable with how the system stores and uses my session context.
    Rating: 1 / 2 / 3 / 4 / 5

T2. I trust the memory feature to handle my work context safely.
    Rating: 1 / 2 / 3 / 4 / 5

### Open Feedback

Q10. What works well about the memory continuity feature?
     (free text)

Q11. What could be improved?
     (free text)

Q12. Any concerns about privacy or data handling?
     (free text)

---

## 3. Scoring Worksheet

Complete this section after survey closes.

### Per-Response Tally

Response ID | C1 | C2 | C3 | Continuity Avg | R1 | R2 | P1 | P2 | T1 | T2 | Overall Avg
------------|----|----|----|-----------------|----|----|----|----|----|----|-----------
001         |    |    |    |                 |    |    |    |    |    |    |
002         |    |    |    |                 |    |    |    |    |    |    |
003         |    |    |    |                 |    |    |    |    |    |    |
004         |    |    |    |                 |    |    |    |    |    |    |
005         |    |    |    |                 |    |    |    |    |    |    |
006         |    |    |    |                 |    |    |    |    |    |    |
007         |    |    |    |                 |    |    |    |    |    |    |
008         |    |    |    |                 |    |    |    |    |    |    |
009         |    |    |    |                 |    |    |    |    |    |    |
010         |    |    |    |                 |    |    |    |    |    |    |
011         |    |    |    |                 |    |    |    |    |    |    |
012         |    |    |    |                 |    |    |    |    |    |    |
013         |    |    |    |                 |    |    |    |    |    |    |
014         |    |    |    |                 |    |    |    |    |    |    |
015         |    |    |    |                 |    |    |    |    |    |    |
016         |    |    |    |                 |    |    |    |    |    |    |
017         |    |    |    |                 |    |    |    |    |    |    |
018         |    |    |    |                 |    |    |    |    |    |    |
019         |    |    |    |                 |    |    |    |    |    |    |
020         |    |    |    |                 |    |    |    |    |    |    |

### Aggregate Scores

| Dimension | Items | Sum | N Responses | Average | Gate | Status |
|-----------|-------|-----|-------------|---------|------|--------|
| Continuity (PRIMARY) | C1+C2+C3 | | | | >= 4.0 | [ ] PASS / [ ] FAIL |
| Relevance | R1+R2 | | | | informational | -- |
| Performance | P1+P2 | | | | informational | -- |
| Trust | T1+T2 | | | | informational | -- |
| Overall | all 9 | | | | informational | -- |

### Continuity Gate Calculation

  Total C1+C2+C3 scores across all responses: _______
  Divide by (3 x N responses): _______
  Continuity average: _______  (gate: >= 4.0/5.0)

  Gate result: [ ] PASS (>= 4.0)  [ ] FAIL (< 4.0)

---

## 4. Results Output File

After completing the worksheet above, create scratch/phase3-user-survey-results.md
with the following minimum content:

  # Phase 3 User Satisfaction Survey Results

  Administered: [dates]
  Responses: [N]

  ## Primary Gate: Continuity

  Continuity average: [X.XX] / 5.0
  Gate (>= 4.0): [PASS / FAIL]

  ## Dimension Averages

  | Dimension | Average |
  |-----------|---------|
  | Continuity | X.XX |
  | Relevance | X.XX |
  | Performance | X.XX |
  | Trust | X.XX |
  | Overall | X.XX |

  ## CHK-163 Evidence

  Survey completed [date]. Results file: scratch/phase3-user-survey-results.md

  ## CHK-164 Evidence

  Continuity avg = [X.XX]; gate >= 4.0: [PASS / FAIL]

  ## SC-005 Evidence (CHK-184)

  User satisfaction continuity score: [X.XX] / 5.0; gate: [PASS / FAIL]

---

## 5. Escalation Procedure (if gate fails)

If continuity average < 4.0/5.0:
  1. Review Q10/Q11 free-text responses for failure patterns.
  2. Identify top 2-3 specific friction points.
  3. File improvement items in tasks.md under a new QP-5 quality phase.
  4. Repeat survey after targeted fixes (minimum 14-day re-evaluation window).
  5. Do NOT close CHK-163/164/184 until gate passes.

---

## NOTES

Surveyor notes / observations:
  ________________________________________________________________
  ________________________________________________________________
