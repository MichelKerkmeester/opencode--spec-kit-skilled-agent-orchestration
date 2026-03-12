# Feature flag governance

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

This document captures the implemented behavior, source references, and validation scope for Feature flag governance.

## 2. CURRENT REALITY

The program introduces many new scoring signals and pipeline stages. Without governance, flags accumulate until nobody knows what is enabled.

A governance framework defines operational targets (small active flag surface, explicit sunset windows and periodic audits). These are process controls, not hard runtime-enforced caps in code.

The B8 signal ceiling ("12 active scoring signals") is a governance target, not a runtime-enforced guardrail.

## 3. SOURCE FILES

No dedicated source files — this describes governance process controls.

## 4. SOURCE METADATA

- Group: Governance
- Source feature title: Feature flag governance
- Current reality source: feature_catalog.md
