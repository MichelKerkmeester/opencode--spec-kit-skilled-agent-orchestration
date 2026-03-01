---
title: "Implementation Summary - Performance Hacks [016-performance-hacks/implementation-summary]"
description: "I cannot perform these changes via code because they are managed inside Webflow or external settings."
trigger_phrases:
  - "implementation"
  - "summary"
  - "performance"
  - "hacks"
  - "implementation summary"
  - "016"
importance_tier: "normal"
contextType: "implementation"
---
# Implementation Summary - Performance Hacks

> **Goal:** High-impact, low-effort optimizations for Core Web Vitals (LCP/FCP).

<!-- ANCHOR:applied-optimizations -->
## Applied Optimizations

### 1. Font Preloading (Previous Step)
- Added `<link rel="preload">` for Silka Regular and Semibold.
- Note: I updated the URLs to match the latest CDN paths found in your live site (`691d5754...`).

### 2. Preload Cleanup (Global)
- **Removed:** Preloads for `dropdown.js`, `mobile_menu.js`, and `modal_cookie_consent.js`.
- **Reason:** These are interaction scripts, not needed for the initial paint. Removing them frees up bandwidth for the Hero video and CSS.

### 3. FCP Safety Fallback
- **Added:** A lightweight inline script in the footer that forces the page to become visible after 500ms.
- **Reason:** Your site uses a "reveal" animation (`opacity: 0` -> `opacity: 1`). If the controlling script delays (e.g., waiting for fonts), the user sees a white screen. This fallback ensures content is visible even on slow connections.

---
<!-- /ANCHOR:applied-optimizations -->

<!-- ANCHOR:required-actions-webflow-designer -->
## Required Actions (Webflow Designer)

I cannot perform these changes via code because they are managed inside Webflow or external settings.

### 1. Remove Typekit Script
**Location:** Webflow Project Settings > Custom Code (Head) OR Integrations > Adobe Fonts.
**Action:** Delete the line `<script src="https://use.typekit.net/grw1wnt.js"...>`.
**Why:** You are using uploaded fonts. This script is blocking the main thread and slowing down the site for no reason.

### 2. Lazy Load Marquee Images
**Location:** Webflow Designer > Home Page > Marquee Section.
**Action:** Select the logo images in the marquee and set "Load" setting to **"Lazy"** (instead of Eager/Auto).
**Why:** These images are below the fold. Loading them "Eagerly" steals bandwidth from the Hero video (LCP).

### 3. Publish Site
**Action:** Publish to production to see the results.
<!-- /ANCHOR:required-actions-webflow-designer -->

