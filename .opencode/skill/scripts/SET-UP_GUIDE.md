# Skill Advisor Setup Guide

Complete setup and validation guide for the Skill Advisor workflow in `.opencode/skill/scripts/`.

This guide reflects the current runtime:
- default dual-threshold routing (`confidence >= 0.8` and `uncertainty <= 0.35`)
- explicit confidence-only override (`--confidence-only`)
- command-bridge separation (`kind: command`)
- cached skill discovery with mtime invalidation
- permanent regression + benchmark harnesses

---

## 1. Overview

### What You Are Setting Up

The Skill Advisor stack now includes:

```text
.opencode/skill/scripts/
├── skill_advisor.py
├── skill_advisor_runtime.py
├── skill_advisor_regression.py
├── skill_advisor_bench.py
├── fixtures/
│   └── skill_advisor_regression_cases.jsonl
└── out/
    ├── regression-report.json
    └── benchmark-report.json
```

### Core Routing Model

- `default mode`: dual-threshold filter (`--threshold` + `--uncertainty`)
- `override mode`: confidence-only filter (`--confidence-only`)
- `skill kinds`: `kind: "skill"` and `kind: "command"`
- `command bridge behavior`: command bridges are deprioritized unless explicit slash intent is present (for example `/spec_kit:` or `/memory:save`)

### Gate 2 Integration

Typical invocation used by workflows:

```bash
python3 .opencode/skill/scripts/skill_advisor.py "$USER_REQUEST" --threshold 0.8
```

Interpretation:
- skill returned in default mode -> passed both confidence and uncertainty gates
- empty list in default mode but non-empty list with `--confidence-only` -> high confidence with elevated uncertainty

---

## 2. Prerequisites

### Required Software

- Python `3.6+`
- Workspace with `.opencode/skill/*/SKILL.md` entries

### Quick Checks

```bash
python3 --version
ls -la .opencode/skill/scripts/skill_advisor.py
```

Optional executable bit:

```bash
chmod +x .opencode/skill/scripts/skill_advisor.py
```

---

## 3. Installation Validation

### Step 1: Health Check

```bash
python3 .opencode/skill/scripts/skill_advisor.py --health
```

Expected characteristics:
- valid JSON
- `skills_found` > 0
- `command_bridges_found` present
- `cache` field present

### Step 2: Smoke Routing

```bash
python3 .opencode/skill/scripts/skill_advisor.py "create a pull request on github"
python3 .opencode/skill/scripts/skill_advisor.py "save this conversation context to memory"
python3 .opencode/skill/scripts/skill_advisor.py "/memory:save this context"
```

Expected behavior:
- natural language prompts prefer `kind: "skill"`
- explicit slash prompts may return `kind: "command"`

---

## 4. CLI Modes and Flags

### One-Shot (Default)

```bash
python3 .opencode/skill/scripts/skill_advisor.py "your prompt"
```

Uses dual-threshold filtering:
- `--threshold` default: `0.8`
- `--uncertainty` default: `0.35`

### Confidence-Only Override

```bash
python3 .opencode/skill/scripts/skill_advisor.py "api chain mcp" --threshold 0.8 --confidence-only
```

Use this only when you intentionally want high-confidence suggestions even when uncertainty is above default limits.

### Batch Structural Mode

File mode:

```bash
python3 .opencode/skill/scripts/skill_advisor.py --batch-file prompts.txt
```

Stdin mode:

```bash
cat prompts.txt | python3 .opencode/skill/scripts/skill_advisor.py --batch-stdin
```

Batch mode reduces repeated process overhead for multi-prompt evaluations.

### Optional Debug/Control Flags

```bash
python3 .opencode/skill/scripts/skill_advisor.py "prompt" --show-rejections
python3 .opencode/skill/scripts/skill_advisor.py --force-refresh --health
```

---

## 5. Quality Verification

### Regression Harness

```bash
python3 .opencode/skill/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --out .opencode/skill/scripts/out/regression-report.json
```

Validates:
- top-1 routing quality gates
- P0 gate pass rate
- command-bridge false-positive rate on non-slash prompts

### Benchmark Harness

```bash
python3 .opencode/skill/scripts/skill_advisor_bench.py \
  --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --runs 7 \
  --out .opencode/skill/scripts/out/benchmark-report.json
```

Reports:
- one-shot subprocess latency
- in-process warm latency
- batch throughput multiplier

### Script-Level Alignment

```bash
python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/scripts
```

Expected: zero `ERROR` findings before claiming completion.

---

## 6. Troubleshooting

### No Results Returned

Possible causes:
- prompt does not cross confidence threshold
- prompt crosses confidence but fails uncertainty gate

Check:

```bash
python3 .opencode/skill/scripts/skill_advisor.py "your prompt" --show-rejections
python3 .opencode/skill/scripts/skill_advisor.py "your prompt" --threshold 0.8 --confidence-only
```

### Batch Mode Input Errors

Invalid batch combinations are rejected with JSON error payloads and exit code `2`:

```bash
python3 .opencode/skill/scripts/skill_advisor.py --batch-file /tmp/missing.txt
python3 .opencode/skill/scripts/skill_advisor.py --batch-file prompts.txt --batch-stdin
```

### Skills Not Refreshing

Force refresh cached discovery:

```bash
python3 .opencode/skill/scripts/skill_advisor.py --force-refresh --health
```

---

## 7. Operational Checklist

- [ ] `--health` returns valid JSON and non-zero `skills_found`
- [ ] default one-shot mode returns expected `kind: "skill"` for natural-language prompts
- [ ] explicit slash prompts can route to `kind: "command"`
- [ ] regression harness passes
- [ ] benchmark harness passes
- [ ] alignment verifier reports no errors for `.opencode/skill/scripts`

---

## 8. Reference Commands

```bash
# Health
python3 .opencode/skill/scripts/skill_advisor.py --health

# One-shot default mode
python3 .opencode/skill/scripts/skill_advisor.py "create a pull request on github"

# Confidence-only override
python3 .opencode/skill/scripts/skill_advisor.py "api chain mcp" --threshold 0.8 --confidence-only

# Batch file mode
python3 .opencode/skill/scripts/skill_advisor.py --batch-file prompts.txt

# Regression report
python3 .opencode/skill/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --out .opencode/skill/scripts/out/regression-report.json

# Benchmark report
python3 .opencode/skill/scripts/skill_advisor_bench.py \
  --dataset .opencode/skill/scripts/fixtures/skill_advisor_regression_cases.jsonl \
  --runs 7 \
  --out .opencode/skill/scripts/out/benchmark-report.json

# Alignment verification
python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/scripts
```
