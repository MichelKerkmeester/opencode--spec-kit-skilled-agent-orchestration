---
title: "Stress testing manual playbook"
description: "Section index for manual stress testing playbooks in system-spec-kit."
audited_post_018: true
---

# Stress testing manual playbook

## 1. OVERVIEW

This section contains operational playbooks for running structured stress test cycles. These playbooks convert the feature catalog pattern into repeatable operator steps and evidence requirements.

## 2. ENTRIES

| Entry | Summary |
|-------|---------|
| [01 - Run stress cycle](01-run-stress-cycle.md) | End-to-end guide for freezing a corpus, scoring packet x dimension cells, authoring findings, emitting `findings-rubric.json`, comparing against a prior cycle, capturing telemetry samples, validating the packet, and updating the parent phase map. |

## 3. SOURCE METADATA

- Group: Stress testing
- Playbook root: `.opencode/skill/system-spec-kit/manual_testing_playbook/14--stress-testing/`
- Feature catalog: `.opencode/skill/system-spec-kit/feature_catalog/14--stress-testing/01-stress-test-cycle.md`
- Template bundle: `.opencode/skill/system-spec-kit/templates/stress_test/`

