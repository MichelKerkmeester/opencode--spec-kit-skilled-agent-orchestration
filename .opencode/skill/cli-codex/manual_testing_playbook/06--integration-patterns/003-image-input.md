---
title: "CX-020 -- Image input via --image"
description: "This scenario validates --image visual input for `CX-020`. It focuses on confirming Codex incorporates an attached PNG into its response."
---

# CX-020 -- Image input via --image

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-020`.

---

## 1. OVERVIEW

This scenario validates image input via `--image` (or `-i`) for `CX-020`. It focuses on confirming Codex accepts a PNG/JPEG and incorporates the image into its response (color and dimension description as the verifiable signal).

### Why This Matters

`--image` is the documented design-to-code surface (`references/codex_tools.md` §2 Image Input). The skill's prompt templates (`assets/prompt_templates.md` §2 Design-to-Code) and routing recommendations all assume the flag actually wires images into the model context. Validating the round trip with a known-color PNG keeps the design-to-code workflow trustworthy.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-020` and confirm the expected signals without contradictory evidence.

- Objective: Verify `--image` (or `-i`) accepts a PNG/JPEG and that Codex incorporates the image into its response.
- Real user request: `Make sure Codex actually sees images when I attach a PNG with --image.`
- Prompt: `As a cross-AI orchestrator implementing from a design, FIRST create a tiny placeholder PNG at /tmp/cli-codex-playbook-cx020/wireframe.png (e.g., a 200x200 red square via ImageMagick or Python Pillow), THEN dispatch codex exec -i /tmp/cli-codex-playbook-cx020/wireframe.png --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="medium" -c service_tier="fast" "Describe the attached image in one sentence: name the dominant color and approximate dimensions." Verify Codex exits 0, the response names a red color and ~200x200 dimensions, and the dispatched command line includes -i. Return a verdict naming the image path, the described color, and the described dimensions.`
- Expected execution process: Operator pre-creates a 200x200 red PNG using ImageMagick or Python Pillow -> dispatches `codex exec -i <png>` with the description prompt -> captures stdout -> verifies the response names the dominant color and dimensions.
- Expected signals: `codex exec -i <image>` exits 0. Stdout response names the dominant color (red) and approximate dimensions (~200x200 or "200 by 200" or similar). Dispatched command line includes `-i <path>`.
- Desired user-visible outcome: Confirmation that the image-input surface works end-to-end so design-to-code workflows are unblocked.
- Pass/fail: PASS if exit 0, the response names "red" (or a clear red synonym) AND mentions ~200x200 dimensions, AND `-i <path>` is in the dispatched command. FAIL if exit non-zero, color description is wrong, dimensions are wildly off or `-i` is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Pre-create a 200x200 red PNG using whichever tool is available (ImageMagick `convert` or Python Pillow).
2. Dispatch `codex exec -i <png>` with the description prompt.
3. Capture stdout to a temp file.
4. Verify the response names "red" and "200" (or "200x200").
5. Return a verdict naming the image path, color and dimensions.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CX-020 | Image input via --image | Verify --image attaches a PNG and Codex describes it correctly | `As a cross-AI orchestrator implementing from a design, FIRST create a tiny placeholder PNG at /tmp/cli-codex-playbook-cx020/wireframe.png (e.g., a 200x200 red square via ImageMagick or Python Pillow), THEN dispatch codex exec -i /tmp/cli-codex-playbook-cx020/wireframe.png --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="medium" -c service_tier="fast" "Describe the attached image in one sentence: name the dominant color and approximate dimensions." Verify Codex exits 0, the response names a red color and ~200x200 dimensions, and the dispatched command line includes -i. Return a verdict naming the image path, the described color, and the described dimensions.` | 1. `bash: rm -rf /tmp/cli-codex-playbook-cx020 && mkdir -p /tmp/cli-codex-playbook-cx020 && (command -v magick && magick -size 200x200 xc:red /tmp/cli-codex-playbook-cx020/wireframe.png) || (command -v convert && convert -size 200x200 xc:red /tmp/cli-codex-playbook-cx020/wireframe.png) || python3 -c "from PIL import Image; Image.new('RGB', (200, 200), 'red').save('/tmp/cli-codex-playbook-cx020/wireframe.png')"` -> 2. `bash: ls -la /tmp/cli-codex-playbook-cx020/wireframe.png && file /tmp/cli-codex-playbook-cx020/wireframe.png` -> 3. `codex exec -i /tmp/cli-codex-playbook-cx020/wireframe.png --model gpt-5.5 --sandbox read-only -c model_reasoning_effort="medium" -c service_tier="fast" "Describe the attached image in one sentence: name the dominant color (one word) and approximate pixel dimensions in WxH format." > /tmp/cli-codex-cx020.txt 2>&1` -> 4. `bash: grep -iE "red|crimson|scarlet" /tmp/cli-codex-cx020.txt && grep -E "200" /tmp/cli-codex-cx020.txt` | Step 1: PNG created (200x200 red square); Step 2: file is a valid PNG; Step 3: exit 0; Step 4: stdout contains "red" (or a red synonym) AND "200" (or "200x200") | Generated PNG, file metadata, captured stdout, dispatched command line, exit code | PASS if exit 0, response names red, response mentions 200, AND `-i <path>` is in the dispatched command; FAIL if exit non-zero, color description is wrong, or dimensions are wildly off | (1) Confirm one of magick/convert/Python+Pillow is available; (2) re-run with `2>&1 | tee` for stderr inline; (3) inspect stdout for "image not supported" errors; (4) verify Codex CLI version supports image input |

### Optional Supplemental Checks

- Test with a JPEG instead of PNG (`convert -size 200x200 xc:blue /tmp/cli-codex-playbook-cx020/wireframe.jpg`) and confirm Codex handles both formats.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `MANUAL_TESTING_PLAYBOOK.md` | Root directory page and scenario summary |
| `../../references/codex_tools.md` (§2 Image Input) | Documents --image / -i capability |
| `../../assets/prompt_templates.md` (§2 Design-to-Code) | Documents the design-to-code prompt template |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/codex_tools.md` | §2 Image Input (--image / -i) |
| `../../references/cli_reference.md` | §4 Essential Flags (--image / -i) |
| `../../assets/prompt_templates.md` | §2 Design-to-Code template |

---

## 5. SOURCE METADATA

- Group: Integration Patterns
- Playbook ID: CX-020
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `06--integration-patterns/003-image-input.md`
