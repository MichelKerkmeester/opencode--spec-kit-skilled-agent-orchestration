# Random Operation Templates - Copy-Paste Starting Points

Ready-to-use code templates for common randomization tasks. Copy, adapt, and integrate into your workflows.

---

## 1. UUID GENERATION

### Generate Single UUID

```bash
# Generate single UUID
uuidgen
```

### Generate Multiple UUIDs

```bash
# Generate 5 UUIDs
for i in {1..5}; do uuidgen; done
```

---

## 2. RANDOM SELECTION

### Basic Selection Template

```python
import random

# Define your items
items = [
    "item1",
    "item2", 
    "item3",
]

# Single selection
selected = random.choice(items)
print(f"Selected: {selected}")

# Multiple selections (with replacement)
batch = random.choices(items, k=3)
print(f"Batch: {batch}")

# Multiple selections (without replacement)
unique = random.sample(items, k=2)
print(f"Unique: {unique}")
```

---

## 3. RANDOM NUMBER GENERATION

### Integer and Float Templates

```python
import random

# Integer range
min_val = 1
max_val = 100
random_int = random.randint(min_val, max_val)

# Float range
min_float = 0.0
max_float = 1.0
random_float = random.uniform(min_float, max_float)

# Gaussian distribution
mean = 50
std_dev = 10
gaussian = random.gauss(mean, std_dev)
```

---

## 4. SHUFFLE OPERATIONS

### In-Place and Non-Destructive Shuffle

```python
import random

# In-place shuffle
items = [1, 2, 3, 4, 5]
random.shuffle(items)
print(items)

# Non-destructive shuffle (create copy)
original = [1, 2, 3, 4, 5]
shuffled = random.sample(original, len(original))
print(f"Original: {original}")
print(f"Shuffled: {shuffled}")
```

---

## 5. TEST DATA GENERATION

### Complete Test Data Factory

```python
import random
import string

def random_string(length=8):
    """Generate random lowercase string."""
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def random_email():
    """Generate random email address."""
    name = random_string(8)
    domain = random.choice(["example.com", "test.org", "demo.net"])
    return f"{name}@{domain}"

def random_user():
    """Generate random user object."""
    return {
        "id": random.randint(1000, 9999),
        "name": random_string(10),
        "email": random_email(),
        "age": random.randint(18, 65),
        "active": random.choice([True, False])
    }

# Generate test data
users = [random_user() for _ in range(5)]
for user in users:
    print(user)
```

---

## 6. QUICK REFERENCE

| Operation | Function | Example |
|-----------|----------|---------|
| Random int | `random.randint(a, b)` | `random.randint(1, 100)` |
| Random float | `random.uniform(a, b)` | `random.uniform(0.0, 1.0)` |
| Random choice | `random.choice(seq)` | `random.choice(['a', 'b'])` |
| Multiple choices | `random.choices(seq, k=n)` | `random.choices([1,2,3], k=5)` |
| Unique sample | `random.sample(seq, k=n)` | `random.sample([1,2,3], k=2)` |
| Shuffle in-place | `random.shuffle(list)` | `random.shuffle(items)` |
| Set seed | `random.seed(n)` | `random.seed(42)` |
