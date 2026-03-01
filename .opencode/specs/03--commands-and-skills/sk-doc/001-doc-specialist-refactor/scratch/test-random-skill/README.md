# Random Helper Skill

> A versatile utility skill for AI assistants that provides common randomization operations including UUID generation, random selection, shuffling, and configurable random number generation.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1.  OVERVIEW]](#1--overview)
- [2.  QUICK START]](#2--quick-start)
- [3.  FEATURES]](#3--features)
- [4.  USAGE EXAMPLES]](#4--usage-examples)
- [5. ️ CONFIGURATION]](#5-️-configuration)
- [6.  REQUIREMENTS]](#6--requirements)
- [7. ️ LIMITATIONS]](#7-️-limitations)
- [8.  LICENSE]](#8--license)

---
<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### What is Random Helper?

**Random Helper** is a utility skill that provides common randomization operations for AI assistants and automation workflows.

### Key Capabilities

| Feature | Description |
|---------|-------------|
| **UUID Generation** | Create unique identifiers (v4 UUIDs) |
| **Random Selection** | Pick random items from lists/arrays |
| **Shuffling** | Randomize order of collections |
| **Number Generation** | Integers and floats with configurable ranges |

---
<!-- /ANCHOR:overview -->

<!-- ANCHOR:quick-start -->
## 2. QUICK START

### Installation

```bash
# Copy to your skills directory
cp -r random-helper ~/.opencode/skills/

# Or use the skill installer
opencode skill install random-helper
```

### Basic Usage

```python
import random

# Generate random number 1-100
num = random.randint(1, 100)

# Pick random item
items = ["red", "green", "blue"]
color = random.choice(items)
```

---
<!-- /ANCHOR:quick-start -->

<!-- ANCHOR:features -->
## 3. FEATURES

### UUID Generation

Generate unique identifiers using system tools:

```bash
uuidgen
# Output: 550e8400-e29b-41d4-a716-446655440000
```

### Random Selection

Pick random items from collections with or without replacement.

### Shuffling

Randomize order of lists and arrays in-place or non-destructively.

### Number Generation

Generate integers, floats, and Gaussian-distributed numbers.

---
<!-- /ANCHOR:features -->

<!-- ANCHOR:usage-examples -->
## 4. USAGE EXAMPLES

### Generate Multiple UUIDs

```bash
for i in {1..5}; do uuidgen; done
```

### Weighted Random Selection

```python
import random

items = ["common", "uncommon", "rare"]
weights = [70, 25, 5]
selected = random.choices(items, weights=weights, k=1)[0]
```

---
<!-- /ANCHOR:usage-examples -->

<!-- ANCHOR:configuration -->
## 5. ️ CONFIGURATION

No configuration required. The skill uses:

- Python's built-in `random` module
- System `uuidgen` command

---
<!-- /ANCHOR:configuration -->

<!-- ANCHOR:requirements -->
## 6. REQUIREMENTS

| Requirement | Version |
|-------------|---------|
| Python | 3.8+ |
| OpenCode CLI | Latest |
| `uuidgen` | Standard on macOS/Linux |

---
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:limitations -->
## 7. ️ LIMITATIONS

- **Not cryptographic**: Not suitable for security-sensitive purposes
- **Non-reproducible**: Random sequences require explicit seeding for reproducibility
- **Security alternative**: Use `secrets` module for cryptographic randomness

---
<!-- /ANCHOR:limitations -->

<!-- ANCHOR:license -->
## 8. LICENSE

MIT License
<!-- /ANCHOR:license -->

