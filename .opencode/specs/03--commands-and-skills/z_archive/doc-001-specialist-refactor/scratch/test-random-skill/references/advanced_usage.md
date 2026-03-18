# Advanced Usage

Comprehensive reference for advanced randomization patterns, seeding strategies, and performance optimization for the Random Helper skill.

---

## 1. INTRODUCTION

This reference covers advanced use cases beyond basic random operations. Use this when you need reproducible sequences, weighted selection, or high-performance batch generation.

---

## 2. SEEDED RANDOMIZATION

### Why Use Seeds?

Seeds make random sequences reproducible - essential for testing and debugging.

```python
import random

# Set seed for reproducibility
random.seed(42)

# These will always produce the same sequence
print(random.randint(1, 100))  # Always: 82
print(random.randint(1, 100))  # Always: 15
print(random.randint(1, 100))  # Always: 4
```

### Per-Instance Seeds

```python
import random

# Create isolated random generators
rng1 = random.Random(42)
rng2 = random.Random(99)

# Independent sequences
print(rng1.randint(1, 100))  # 82
print(rng2.randint(1, 100))  # 8
```

---

## 3. ️ WEIGHTED SELECTION

### Basic Weighted Choice

```python
import random

items = ["common", "uncommon", "rare", "legendary"]
weights = [70, 20, 8, 2]  # Percentage weights

selected = random.choices(items, weights=weights, k=1)[0]
print(f"Got: {selected}")
```

### Cumulative Weights

```python
import random

items = ["A", "B", "C"]
cum_weights = [50, 80, 100]  # A: 50%, B: 30%, C: 20%

selected = random.choices(items, cum_weights=cum_weights, k=5)
print(selected)  # e.g., ['A', 'A', 'B', 'A', 'C']
```

---

## 4. PERFORMANCE OPTIMIZATION

### Batch Generation

```python
import random

# SLOW: Loop with individual calls
slow_result = [random.randint(1, 100) for _ in range(10000)]

# FAST: Use choices for batch
fast_result = random.choices(range(1, 101), k=10000)
```

### Pre-computed Pools

```python
import random

# Pre-generate pool for repeated sampling
pool = list(range(1, 1001))
random.shuffle(pool)

# Fast pop from shuffled pool
def get_unique_random():
    return pool.pop() if pool else None
```

---

## 5. TROUBLESHOOTING

### Common Issues

| Problem | Cause | Solution |
|---------|-------|----------|
| Same values repeated | Seed set in loop | Set seed once outside loop |
| Not random enough | Small range | Increase range or use floats |
| Slow batch generation | Individual calls | Use `choices()` or `sample()` |
| Need reproducibility | No seed set | Add `random.seed(value)` |

### Debug Pattern

```python
import random

def debug_random(seed=None):
    if seed is not None:
        random.seed(seed)
        print(f"Seed set to: {seed}")
    
    result = random.randint(1, 100)
    print(f"Generated: {result}")
    return result

# Reproducible for debugging
debug_random(seed=42)  # Always 82
```
