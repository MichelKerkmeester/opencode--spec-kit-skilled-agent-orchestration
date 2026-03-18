---
name: bad-tools
description: Single line description
# This should fail: allowed-tools must be array format.
allowed-tools: Read, Write
version: 0.1.0
---

# Bad Tools

## 1. WHEN TO USE

- Test `allowed-tools` format validation.

## 2. ️ HOW TO USE

Run validation against this file.

## 3. RULES

- ✅ Validators must reject invalid allowed-tools format.

## 4. SUCCESS CRITERIA

- ✅ Validation fails with allowed-tools array format error.
