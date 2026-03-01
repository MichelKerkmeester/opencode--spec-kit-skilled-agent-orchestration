---
title: "Video Play/Pause Button Hover Effect [006-video-play-pause-hover/spec]"
description: "Add a scale animation to .video--pause and .video--play icons when hovering over .video--play-pause-btn."
trigger_phrases:
  - "video"
  - "play"
  - "pause"
  - "button"
  - "hover"
  - "spec"
  - "006"
importance_tier: "important"
contextType: "decision"
---
# Video Play/Pause Button Hover Effect

<!-- ANCHOR:overview -->
## Overview
Add a scale animation to `.video--pause` and `.video--play` icons when hovering over `.video--play-pause-btn`.
<!-- /ANCHOR:overview -->

<!-- ANCHOR:requirements -->
## Requirements
- On hover of `.video--play-pause-btn`, scale up the nested play/pause icons
- Use the existing `data-trigger` / `data-hover` CSS pattern from `link_card_image.css`
- Scale factor: 15% (more noticeable for small icons)
- Smooth 300ms transition
- Respect `prefers-reduced-motion` accessibility preference
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:structure -->
## Structure
```
.video--play-pause-w (wrapper)
  └── .video--play-pause-btn [data-trigger] (hover trigger)
        ├── .video--pause [data-hover="scale-icon"]
        └── .video--play [data-hover="scale-icon"]
```
<!-- /ANCHOR:structure -->

<!-- ANCHOR:technical-approach -->
## Technical Approach
Uses CSS custom property `--_state---on` (0 or 1) with `clamp()` for smooth state transitions:
```css
transform: scale(calc(1 + (0.15 * clamp(0, var(--_state---on, 0), 1))));
```
<!-- /ANCHOR:technical-approach -->

<!-- ANCHOR:files -->
## Files
- **CSS:** `src/1_css/animations/video_play_pause_btn.css`
<!-- /ANCHOR:files -->
