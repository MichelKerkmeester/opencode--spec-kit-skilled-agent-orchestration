---
title: "243 -- Setup, Native Module Health, and MCP Installation"
description: "This scenario validates setup, native module health, and MCP installation for `243`. It focuses on confirming prerequisite checks, native-module diagnostics, marker recording, and installer execution."
---

# 243 -- Setup, Native Module Health, and MCP Installation

## 1. OVERVIEW

This scenario validates setup, native module health, and MCP installation for `243`. It focuses on confirming prerequisite checks, native-module diagnostics, marker recording, and installer execution.

---

## 2. SCENARIO CONTRACT

Operators verify the setup surface from least to most invasive: prerequisite validation, native-module probing, ABI marker recording, and the bundled installer flow that builds the workspace and updates MCP configuration.

- Objective: Confirm prerequisite validation, native-module diagnostics, marker recording, and installer execution
- Prompt: `As a tooling validation operator, validate Setup, Native Module Health, and MCP Installation against bash .opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate. Verify prerequisite validation, native-module diagnostics, marker recording, and installer execution. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: prerequisite JSON emitted; native-module probe prints PASS/FAIL lines; record-node-version writes `.node-version-marker`; installer completes or reports existing configuration
- Pass/fail: PASS if readiness, native-module health, marker recording, and installer behavior match the documented setup contract

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, confirm prerequisite validation, native-module diagnostics, marker recording, and installer execution against bash .opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate. Verify prerequisite JSON is emitted; native probe prints diagnostic lines and recovery hint when needed; .node-version-marker is written; installer either completes or reports existing MCP configuration without silent failure. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `bash .opencode/skill/system-spec-kit/scripts/setup/check-prerequisites.sh --json --validate`
2. `cd .opencode/skill/system-spec-kit && bash scripts/setup/check-native-modules.sh`
3. `cd .opencode/skill/system-spec-kit && node scripts/setup/record-node-version.js`
4. `cd .opencode/skill/system-spec-kit && bash scripts/setup/install.sh --skip-verify`

### Expected

Prerequisite JSON is emitted; native probe prints diagnostic lines and recovery hint when needed; `.node-version-marker` is written; installer either completes or reports existing MCP configuration without silent failure

### Evidence

JSON prerequisite output, native-module probe transcript, record-node-version stdout, and installer transcript

### Pass / Fail

- **Pass**: the first three steps succeed and the installer run is explicit about success, rebuild needs, or existing configuration
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `scripts/setup/check-prerequisites.sh`, `check-native-modules.sh`, `rebuild-native-modules.sh`, `record-node-version.js`, and `install.sh` if setup state or native-module health is misreported

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md](../../feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 243
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/243-setup-native-module-health-and-mcp-installation.md`
