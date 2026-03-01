# FSRS Algorithm Research: Complete Technical Analysis

> **Research ID**: FSRS-2026-001
> **Status**: COMPLETE
> **Date**: 2026-01-27
> **Purpose**: Deep analysis of FSRS algorithm for AI memory system adaptation

---

## Executive Summary

FSRS (Free Spaced Repetition Scheduler) is a machine-learning-optimized spaced repetition algorithm that models human memory through three core variables: **Stability (S)**, **Difficulty (D)**, and **Retrievability (R)**. Unlike static algorithms like SM-2, FSRS uses 19-21 trained parameters to predict memory decay and schedule optimal review intervals.

**Key Findings for AI Memory Systems:**
1. Stability maps directly to memory **confidence/durability**
2. Difficulty represents **complexity/learning cost**
3. Retrievability provides **real-time recall probability**
4. The forgetting curve model enables **predictive memory decay**
5. Parameter optimization framework enables **personalization**

---

## 1. Core Memory Model: DSR (Difficulty-Stability-Retrievability)

### 1.1 The Three Components

| Variable | Symbol | Range | Description |
|----------|--------|-------|-------------|
| **Retrievability** | R | [0, 1] | Probability of successful recall at current moment |
| **Stability** | S | [0, +inf) | Days until R drops from 100% to 90% |
| **Difficulty** | D | [1, 10] | Inherent complexity of the information |

### 1.2 Variable Behavior

```
R = f(time, S)     # Changes continuously with time
S = f(S_prev, D, R, Grade)  # Updates only after reviews
D = f(D_prev, Grade)  # Updates only after reviews
```

**Critical Insight**: R is the only variable that changes between reviews. S and D are static until the next review event.

---

## 2. The Forgetting Curve

### 2.1 Power-Law Decay (FSRS v4.5+)

The forgetting curve follows a power function:

```
R(t, S) = (1 + FACTOR * t/S)^DECAY
```

**Constants (FSRS v4.5):**
- `DECAY = -0.5`
- `FACTOR = 19/81` (ensures R(S, S) = 0.9)

**Implementation:**
```typescript
const DECAY = -0.5;
const FACTOR = 19 / 81;

function retrievability(t: number, s: number): number {
  return Math.pow(1 + FACTOR * (t / s), DECAY);
}
```

### 2.2 FSRS-6 Trainable Decay

FSRS-6 introduces a trainable decay parameter:

```
R(t, S) = (1 + factor * t/S)^(-w[20])
```

Where `factor = 0.9^(-1/w[20]) - 1` to ensure R(S,S) = 90%

**Insight**: This allows the forgetting curve shape to be personalized per user.

### 2.3 Interval Calculation

Given desired retention R_d (typically 0.9), the optimal interval is:

```
I(R_d, S) = (S / FACTOR) * (R_d^(1/DECAY) - 1)
```

**Implementation:**
```typescript
function interval(desiredRetention: number, stability: number): number {
  return (stability / FACTOR) * (Math.pow(desiredRetention, 1 / DECAY) - 1);
}
```

**When R_d = 0.9**: Interval = Stability (by definition)

---

## 3. Stability Updates

### 3.1 Initial Stability (First Review)

Initial stability is directly mapped from the first grade:

```
S_0(G) = w[G-1]
```

| Grade | Parameter | Typical Value |
|-------|-----------|---------------|
| Again (1) | w[0] | 0.40255 |
| Hard (2) | w[1] | 1.18385 |
| Good (3) | w[2] | 3.173 |
| Easy (4) | w[3] | 15.69105 |

**Implementation:**
```typescript
function initialStability(grade: Grade): number {
  const W = [0.40255, 1.18385, 3.173, 15.69105];
  return W[grade - 1];
}
```

### 3.2 Stability After Successful Review

For grades Hard, Good, or Easy:

```
S'_r(D, S, R, G) = S * (e^(w[8]) * (11-D) * S^(-w[9]) * (e^(w[10]*(1-R)) - 1) * grade_modifier + 1)
```

**Grade Modifiers:**
- Hard: `w[15]` (typically < 1, e.g., 0.2315)
- Good: `1.0`
- Easy: `w[16]` (typically > 1, e.g., 2.9898)

**Component Breakdown:**

| Factor | Formula | Effect |
|--------|---------|--------|
| Difficulty Bonus | `11 - D` | Higher D = smaller stability gain |
| Stability Decay | `S^(-w[9])` | Diminishing returns at high S |
| Retrievability Bonus | `e^(w[10]*(1-R)) - 1` | Lower R = bigger gain (spacing effect) |

**Implementation:**
```typescript
function stabilityAfterSuccess(d: number, s: number, r: number, grade: Grade): number {
  const hardPenalty = grade === Grade.Hard ? W[15] : 1;
  const easyBonus = grade === Grade.Easy ? W[16] : 1;

  const difficultyFactor = 11 - d;
  const stabilityFactor = Math.pow(s, -W[9]);
  const retrievabilityFactor = Math.exp(W[10] * (1 - r)) - 1;

  const sinc = Math.exp(W[8]) * difficultyFactor * stabilityFactor *
               retrievabilityFactor * hardPenalty * easyBonus + 1;

  return s * sinc;
}
```

### 3.3 Stability After Failure (Lapse)

When grade = Again:

```
S'_f(D, S, R) = w[11] * D^(-w[12]) * ((S+1)^(w[13]) - 1) * e^(w[14]*(1-R))
```

**Constraint**: `S'_f <= S` (stability cannot increase on failure)

**Implementation:**
```typescript
function stabilityAfterFailure(d: number, s: number, r: number): number {
  const newStability = W[11] *
    Math.pow(d, -W[12]) *
    (Math.pow(s + 1, W[13]) - 1) *
    Math.exp(W[14] * (1 - r));

  return Math.min(newStability, s);  // Cannot exceed previous stability
}
```

### 3.4 Same-Day Review Stability (FSRS-5+)

For reviews within the same day:

```
S'(S, G) = S * e^(w[17] * (G - 3 + w[18]))
```

**Implementation:**
```typescript
function sameDayStability(s: number, grade: Grade): number {
  return s * Math.exp(W[17] * (grade - 3 + W[18]));
}
```

---

## 4. Difficulty Updates

### 4.1 Initial Difficulty

```
D_0(G) = w[4] - e^(w[5] * (G-1)) + 1
```

**Clamped to [1, 10]**

**Implementation:**
```typescript
function initialDifficulty(grade: Grade): number {
  const d = W[4] - Math.exp(W[5] * (grade - 1)) + 1;
  return clamp(d, 1, 10);
}
```

### 4.2 Difficulty Update (Three-Step Process)

**Step 1: Grade-based change**
```
delta_D = -w[6] * (G - 3)
```

| Grade | delta_D Effect |
|-------|----------------|
| Again (1) | +2 * w[6] |
| Hard (2) | +1 * w[6] |
| Good (3) | 0 |
| Easy (4) | -1 * w[6] |

**Step 2: Linear damping (prevents runaway)**
```
D' = D + delta_D * (10 - D) / 9
```

**Step 3: Mean reversion (prevents "ease hell")**
```
D'' = w[7] * D_0(4) + (1 - w[7]) * D'
```

**Implementation:**
```typescript
function updateDifficulty(d: number, grade: Grade): number {
  const deltaD = -W[6] * (grade - 3);
  const linearDamped = d + deltaD * ((10 - d) / 9);
  const meanReverted = W[7] * initialDifficulty(Grade.Easy) + (1 - W[7]) * linearDamped;
  return clamp(meanReverted, 1, 10);
}
```

---

## 5. State Machine

### 5.1 Card States

```typescript
enum State {
  New = 0,        // Never reviewed
  Learning = 1,   // Initial learning phase
  Review = 2,     // Long-term review
  Relearning = 3  // Re-learning after lapse
}
```

### 5.2 Grade Ratings

```typescript
enum Rating {
  Again = 1,  // Forgot
  Hard = 2,   // Difficult recall
  Good = 3,   // Normal recall
  Easy = 4    // Easy recall
}
```

### 5.3 State Transition Diagram

```
                     +--------+
                     |  New   |
                     +--------+
                         |
                         | (first review)
                         v
                    +----------+
              +---> | Learning | <---+
              |     +----------+     |
              |          |           |
        Again |    Good/Easy         | Again
              |          |           |
              |          v           |
              |     +--------+       |
              +---- | Review | ------+
                    +--------+
                         |
                         | Again
                         v
                   +-----------+
                   | Relearning|
                   +-----------+
                         |
                    Good/Easy
                         |
                         v
                    +--------+
                    | Review |
                    +--------+
```

### 5.4 State Transition Rules

| Current State | Rating | Next State |
|---------------|--------|------------|
| New | Any | Learning |
| Learning | Again | Learning (reset steps) |
| Learning | Hard | Learning (stay) |
| Learning | Good/Easy | Review (graduate) |
| Review | Again | Relearning |
| Review | Hard/Good/Easy | Review |
| Relearning | Again | Relearning (reset steps) |
| Relearning | Good/Easy | Review |

### 5.5 Learning Steps

The Learning and Relearning states use fixed intervals before graduation:

```typescript
interface SchedulerConfig {
  learning_steps: Duration[];      // e.g., [1min, 10min]
  relearning_steps: Duration[];    // e.g., [10min]
}
```

**Behavior:**
- Each "Good" moves to next step
- Final step "Good" graduates to Review
- "Again" resets to first step
- "Easy" immediately graduates

---

## 6. Complete Algorithm Implementation

### 6.1 Data Structures

```typescript
interface Card {
  due: Date;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  reps: number;
  lapses: number;
  state: State;
  last_review?: Date;
}

interface MemoryState {
  stability: number;
  difficulty: number;
}

interface ReviewLog {
  rating: Rating;
  state: State;
  due: Date;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  last_elapsed_days: number;
  scheduled_days: number;
  review: Date;
}

interface SchedulingInfo {
  card: Card;
  review_log: ReviewLog;
}
```

### 6.2 Constants and Parameters

```typescript
// FSRS-5 Default Parameters (19 weights)
const DEFAULT_PARAMETERS: number[] = [
  0.40255,   // w[0]: S_0(Again)
  1.18385,   // w[1]: S_0(Hard)
  3.173,     // w[2]: S_0(Good)
  15.69105,  // w[3]: S_0(Easy)
  7.1949,    // w[4]: D_0 base
  0.5345,    // w[5]: D_0 grade factor
  1.4604,    // w[6]: D update grade factor
  0.0046,    // w[7]: D mean reversion
  1.54575,   // w[8]: S_r base multiplier
  0.1192,    // w[9]: S_r stability decay
  1.01925,   // w[10]: S_r retrievability factor
  1.9395,    // w[11]: S_f base
  0.11,      // w[12]: S_f difficulty factor
  0.29605,   // w[13]: S_f stability factor
  2.2698,    // w[14]: S_f retrievability factor
  0.2315,    // w[15]: Hard penalty
  2.9898,    // w[16]: Easy bonus
  0.51655,   // w[17]: Same-day base
  0.6621,    // w[18]: Same-day grade offset
];

const DECAY = -0.5;
const FACTOR = 19 / 81;
const DEFAULT_DESIRED_RETENTION = 0.9;
```

### 6.3 Core Functions

```typescript
class FSRS {
  private w: number[];
  private desiredRetention: number;

  constructor(
    parameters: number[] = DEFAULT_PARAMETERS,
    desiredRetention: number = 0.9
  ) {
    this.w = parameters;
    this.desiredRetention = desiredRetention;
  }

  // Forgetting curve
  retrievability(elapsedDays: number, stability: number): number {
    if (stability <= 0) return 0;
    return Math.pow(1 + FACTOR * (elapsedDays / stability), DECAY);
  }

  // Optimal interval for desired retention
  interval(stability: number): number {
    const interval = (stability / FACTOR) *
      (Math.pow(this.desiredRetention, 1 / DECAY) - 1);
    return Math.max(1, Math.round(interval));
  }

  // Initial stability from first grade
  initStability(grade: Rating): number {
    return this.w[grade - 1];
  }

  // Initial difficulty from first grade
  initDifficulty(grade: Rating): number {
    const d = this.w[4] - Math.exp(this.w[5] * (grade - 1)) + 1;
    return this.clampD(d);
  }

  // Update difficulty after review
  nextDifficulty(d: number, grade: Rating): number {
    const deltaD = -this.w[6] * (grade - 3);
    const dPrime = d + deltaD * ((10 - d) / 9);
    const dFinal = this.w[7] * this.initDifficulty(Rating.Easy) +
                   (1 - this.w[7]) * dPrime;
    return this.clampD(dFinal);
  }

  // Stability after successful review
  nextRecallStability(d: number, s: number, r: number, grade: Rating): number {
    const hardPenalty = grade === Rating.Hard ? this.w[15] : 1;
    const easyBonus = grade === Rating.Easy ? this.w[16] : 1;

    const sinc = Math.exp(this.w[8]) *
      (11 - d) *
      Math.pow(s, -this.w[9]) *
      (Math.exp(this.w[10] * (1 - r)) - 1) *
      hardPenalty * easyBonus + 1;

    return s * sinc;
  }

  // Stability after forgetting
  nextForgetStability(d: number, s: number, r: number): number {
    const sNew = this.w[11] *
      Math.pow(d, -this.w[12]) *
      (Math.pow(s + 1, this.w[13]) - 1) *
      Math.exp(this.w[14] * (1 - r));

    return Math.min(sNew, s);  // Cannot exceed previous
  }

  // Combined stability update
  nextStability(d: number, s: number, r: number, grade: Rating): number {
    if (grade === Rating.Again) {
      return this.nextForgetStability(d, s, r);
    }
    return this.nextRecallStability(d, s, r, grade);
  }

  // Same-day review stability
  shortTermStability(s: number, grade: Rating): number {
    return s * Math.exp(this.w[17] * (grade - 3 + this.w[18]));
  }

  private clampD(d: number): number {
    return Math.max(1, Math.min(10, d));
  }

  // Main review function
  reviewCard(card: Card, rating: Rating, reviewTime: Date = new Date()): SchedulingInfo {
    const elapsedDays = card.last_review
      ? (reviewTime.getTime() - card.last_review.getTime()) / (1000 * 60 * 60 * 24)
      : 0;

    let newCard = { ...card };
    let newS: number;
    let newD: number;
    let newState: State;

    if (card.state === State.New) {
      // First review
      newS = this.initStability(rating);
      newD = this.initDifficulty(rating);
      newState = rating === Rating.Again ? State.Learning : State.Review;
    } else {
      // Subsequent reviews
      const r = this.retrievability(elapsedDays, card.stability);

      // Check if same-day review
      const isSameDay = elapsedDays < 1;

      if (isSameDay) {
        newS = this.shortTermStability(card.stability, rating);
      } else {
        newS = this.nextStability(card.difficulty, card.stability, r, rating);
      }
      newD = this.nextDifficulty(card.difficulty, rating);

      // State transitions
      if (rating === Rating.Again) {
        newState = card.state === State.Review ? State.Relearning : State.Learning;
        newCard.lapses++;
      } else {
        newState = State.Review;
      }
    }

    newCard.stability = newS;
    newCard.difficulty = newD;
    newCard.state = newState;
    newCard.reps++;
    newCard.last_review = reviewTime;
    newCard.elapsed_days = elapsedDays;

    // Calculate next interval
    const nextInterval = this.interval(newS);
    newCard.scheduled_days = nextInterval;
    newCard.due = new Date(reviewTime.getTime() + nextInterval * 24 * 60 * 60 * 1000);

    const reviewLog: ReviewLog = {
      rating,
      state: card.state,
      due: card.due,
      stability: card.stability,
      difficulty: card.difficulty,
      elapsed_days: elapsedDays,
      last_elapsed_days: card.elapsed_days,
      scheduled_days: card.scheduled_days,
      review: reviewTime,
    };

    return { card: newCard, review_log: reviewLog };
  }
}
```

---

## 7. Parameter Optimization

### 7.1 Loss Function

FSRS uses **binary cross-entropy** loss for optimization:

```
L = -[y * log(R_pred) + (1-y) * log(1 - R_pred)]
```

Where:
- `y` = actual outcome (1 = recall, 0 = forgot)
- `R_pred` = predicted retrievability

### 7.2 Training Process

1. **Data**: Time-series review logs with outcomes
2. **Method**: Backpropagation Through Time (BPTT)
3. **Objective**: Maximum Likelihood Estimation (MLE)

```
Collect review history →
Initialize parameters →
Forward pass (compute predictions) →
Compute loss →
Backward pass (gradients) →
Update parameters →
Repeat until convergence
```

### 7.3 Parameter Constraints

| Parameter | Range | Purpose |
|-----------|-------|---------|
| w[0-3] | (0, +inf) | Initial stabilities |
| w[4] | [1, 10] | D_0 base |
| w[5-18] | varies | Various modifiers |

---

## 8. Key Algorithmic Principles

### 8.1 The Spacing Effect

**Lower retrievability at review = greater stability increase**

The term `e^(w[10]*(1-R)) - 1` amplifies stability gain when R is low. This encodes the psychological finding that harder recalls strengthen memory more.

### 8.2 Difficulty Penalty

**Higher difficulty = smaller stability increase**

The term `(11 - D)` reduces stability gains for difficult cards. D=10 gives only 10% of the benefit compared to D=1.

### 8.3 Diminishing Returns

**High stability cards grow slower**

The term `S^(-w[9])` ensures that already-stable memories gain less from each review, preventing runaway intervals.

### 8.4 Mean Reversion

**Difficulty naturally drifts toward moderate values**

The mean reversion term prevents "ease hell" where cards get permanently stuck at high difficulty.

### 8.5 Overdue Handling

**Late reviews produce bounded gains, not linear**

Unlike SM-2, FSRS caps the benefit of overdue reviews through the retrievability formula, preventing artificially inflated intervals.

---

## 9. Mapping to AI Memory Systems

### 9.1 Stability as Memory Confidence

| FSRS Concept | AI Memory Mapping |
|--------------|-------------------|
| S (stability) | Confidence/durability score |
| Higher S | More reliable/established memory |
| S decay | Natural confidence erosion |

**Use Case**: Track how "established" a memory is. High stability = high confidence in retrieval.

### 9.2 Difficulty as Memory Complexity

| FSRS Concept | AI Memory Mapping |
|--------------|-------------------|
| D (difficulty) | Complexity/learning cost |
| Higher D | Requires more reinforcement |
| D update | Adapts based on retrieval success |

**Use Case**: Some memories are inherently harder to maintain (complex relationships, nuanced concepts).

### 9.3 Retrievability as Access Probability

| FSRS Concept | AI Memory Mapping |
|--------------|-------------------|
| R (retrievability) | Current recall probability |
| R decay | Memory fades without access |
| R threshold | Minimum acceptable confidence |

**Use Case**: Predict whether a memory will be successfully retrieved given time elapsed.

### 9.4 Adaptive Scheduling for Memory Maintenance

```typescript
interface AIMemoryItem {
  content: any;
  stability: number;      // How durable is this memory?
  difficulty: number;     // How complex is this memory?
  lastAccessed: Date;     // When was it last used?
  accessCount: number;    // How often has it been accessed?
}

class AIMemoryScheduler {
  private fsrs: FSRS;

  // When should this memory be reinforced?
  getMaintenanceDate(memory: AIMemoryItem): Date {
    const interval = this.fsrs.interval(memory.stability);
    return new Date(memory.lastAccessed.getTime() + interval * 24 * 60 * 60 * 1000);
  }

  // What's the current confidence in this memory?
  getConfidence(memory: AIMemoryItem): number {
    const elapsed = (Date.now() - memory.lastAccessed.getTime()) / (1000 * 60 * 60 * 24);
    return this.fsrs.retrievability(elapsed, memory.stability);
  }

  // Should we prioritize this memory for refresh?
  needsRefresh(memory: AIMemoryItem, threshold: number = 0.9): boolean {
    return this.getConfidence(memory) < threshold;
  }

  // Update memory after successful access
  recordAccess(memory: AIMemoryItem, success: boolean): AIMemoryItem {
    const rating = success ? Rating.Good : Rating.Again;
    const result = this.fsrs.reviewCard(
      this.memoryToCard(memory),
      rating
    );
    return this.cardToMemory(result.card, memory.content);
  }
}
```

### 9.5 Priority Queue for Memory Maintenance

```typescript
class MemoryMaintenanceQueue {
  private memories: AIMemoryItem[] = [];
  private scheduler: AIMemoryScheduler;

  // Get memories most in need of reinforcement
  getUrgentMemories(limit: number = 10): AIMemoryItem[] {
    return this.memories
      .map(m => ({ memory: m, confidence: this.scheduler.getConfidence(m) }))
      .sort((a, b) => a.confidence - b.confidence)
      .slice(0, limit)
      .map(item => item.memory);
  }

  // Get memories due for scheduled maintenance
  getDueMemories(now: Date = new Date()): AIMemoryItem[] {
    return this.memories.filter(m =>
      this.scheduler.getMaintenanceDate(m) <= now
    );
  }
}
```

---

## 10. Implementation Checklist

### 10.1 Core Components

- [ ] Forgetting curve function (power-law)
- [ ] Interval calculation from stability
- [ ] Initial stability/difficulty from first grade
- [ ] Stability update (success path)
- [ ] Stability update (failure path)
- [ ] Difficulty update with mean reversion
- [ ] State machine (New/Learning/Review/Relearning)
- [ ] Same-day review handling

### 10.2 Data Structures

- [ ] Card/MemoryItem with S, D, state
- [ ] Review log for history
- [ ] Scheduling result with next interval

### 10.3 Optional Enhancements

- [ ] Learning/relearning steps (fixed intervals)
- [ ] Interval fuzzing (randomization)
- [ ] Maximum interval cap
- [ ] Parameter optimization from history

---

## 11. Formula Quick Reference

### Core Formulas (FSRS v4.5/v5)

```
# Forgetting Curve
R(t, S) = (1 + (19/81) * t/S)^(-0.5)

# Interval
I(R_d, S) = (S * 81/19) * (R_d^(-2) - 1)

# Initial Stability
S_0(G) = w[G-1]

# Initial Difficulty
D_0(G) = w[4] - e^(w[5] * (G-1)) + 1

# Stability After Success
S'_r = S * (e^w[8] * (11-D) * S^(-w[9]) * (e^(w[10]*(1-R)) - 1) * grade_mod + 1)

# Stability After Failure
S'_f = w[11] * D^(-w[12]) * ((S+1)^w[13] - 1) * e^(w[14]*(1-R))

# Difficulty Update
D' = w[7] * D_0(4) + (1-w[7]) * (D - w[6]*(G-3) * (10-D)/9)
```

### Default Parameters (FSRS-5)

```
w = [0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604,
     0.0046, 1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605,
     2.2698, 0.2315, 2.9898, 0.51655, 0.6621]
```

---

## Sources

- [The Algorithm - FSRS4Anki Wiki](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm)
- [ABC of FSRS - FSRS4Anki Wiki](https://github.com/open-spaced-repetition/fsrs4anki/wiki/abc-of-fsrs)
- [The Mechanism of Optimization - FSRS4Anki Wiki](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-mechanism-of-optimization)
- [Implementing FSRS in 100 Lines](https://borretti.me/article/implementing-fsrs-in-100-lines)
- [A Technical Explanation of FSRS - Expertium's Blog](https://expertium.github.io/Algorithm.html)
- [ts-fsrs - TypeScript Implementation](https://github.com/open-spaced-repetition/ts-fsrs)
- [py-fsrs - Python Implementation](https://github.com/open-spaced-repetition/py-fsrs)
- [FSRS Python Package - PyPI](https://pypi.org/project/fsrs/)
