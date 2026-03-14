# Feature flag governance

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
Feature flag governance defines operational targets for keeping the active flag surface small with explicit sunset windows and periodic audits.

## 2. CURRENT REALITY
The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework defines operational targets (small active flag surface, explicit sunset windows and periodic audits). These are process controls, not hard runtime-enforced caps in code.

The B8 signal ceiling ("12 active scoring signals") is a governance target, not a runtime-enforced guardrail.

## 3. IN SIMPLE TERMS
Feature flags let you turn new features on or off without changing the code itself, like light switches for functionality. This governance process tracks which switches exist, who controls them and when old ones should be retired so the collection does not grow out of control.
## 4. SOURCE FILES
No dedicated source files. This describes governance process controls.

## 5. SOURCE METADATA
- Group: Governance
- Source feature title: Feature flag governance
- Current reality source: feature_catalog.md

