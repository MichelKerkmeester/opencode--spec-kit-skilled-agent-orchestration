---
name: random-helper
description: A versatile utility skill that assists with common random operations including UUID generation, random selection from lists, shuffling, and random number generation with configurable ranges and distributions.
allowed-tools: [Read, Write, Bash]
version: 1.0.0
---

# Random Helper - Versatile Randomization Utilities

A utility skill providing common randomization operations for AI assistants. Handles UUIDs, random selection, shuffling, and number generation with configurable parameters.

---

## 1. WHEN TO USE

Use this skill when you need to:

- Generate unique identifiers (UUIDs, random strings)
- Select random items from a list or collection
- Shuffle arrays or reorder elements randomly
- Generate random numbers within specific ranges
- Create randomized test data

**Do NOT use when:**
- Cryptographic security is required (use dedicated crypto tools)
- Reproducible "random" sequences are needed (use seeded generators)

---

## 2. ️ HOW IT WORKS

The skill provides four main operations through simple function calls:

### Generate UUID

```bash
# Generate a v4 UUID
uuidgen
# Output: 550e8400-e29b-41d4-a716-446655440000
```

### Random Selection

```python
import random

items = ["apple", "banana", "cherry", "date"]
selected = random.choice(items)
print(f"Selected: {selected}")
# Output: Selected: cherry
```

### Shuffle List

```python
import random

items = [1, 2, 3, 4, 5]
random.shuffle(items)
print(items)
# Output: [3, 1, 5, 2, 4]
```

### Random Number

```python
import random

# Integer in range
num = random.randint(1, 100)
print(f"Random int: {num}")

# Float in range
flt = random.uniform(0.0, 1.0)
print(f"Random float: {flt}")
```

---

## 3. RULES

### ✅ ALWAYS

- Validate input ranges before generating random numbers
- Use appropriate random functions for the data type
- Document the randomization method used

### ❌ NEVER

- Use for cryptographic purposes (passwords, tokens, keys)
- Assume random output is reproducible without seeding
- Generate random data in security-sensitive contexts

### ⚠️ ESCALATE IF

- User requests cryptographically secure randomness
- Random generation needs to be reproducible across sessions
- Performance is critical (millions of operations)

---

## 4. EXAMPLES

### Example 1: Generate Test Users

```python
import random
import string

def generate_test_user():
    name = ''.join(random.choices(string.ascii_lowercase, k=8))
    age = random.randint(18, 65)
    return {"name": name, "age": age}

users = [generate_test_user() for _ in range(5)]
print(users)
```

### Example 2: Random Password (Non-Cryptographic)

```python
import random
import string

chars = string.ascii_letters + string.digits
password = ''.join(random.choices(chars, k=12))
print(f"Generated: {password}")
# Note: NOT for production security use
```

---

## 5. SUCCESS CRITERIA

- Random output is within specified bounds
- No errors during generation
- Output format matches expected type
- Performance is acceptable for batch operations
