# Webflow Custom Fonts User Guide

<!-- ANCHOR:verify-font-display-swap -->
## 1. Verify `font-display: swap`

Great news! My analysis of your live site shows that `font-display: swap` is **already active** for your uploaded "Silka" fonts.

You can verify this in the Webflow Designer:
1.  Go to **Project Settings** > **Fonts**.
2.  Scroll to **Custom Fonts**.
3.  Check the "Silka" font family.
4.  Ensure the **"Display"** setting is set to **"Swap"** for each variant.

*If it is already set to Swap, no action is needed here.*
<!-- /ANCHOR:verify-font-display-swap -->

<!-- ANCHOR:font-preloading-implemented -->
## 2. Font Preloading (Implemented)

I have updated your `global.html` to preload the two most critical font weights:
- **Silka Regular** (Body text)
- **Silka Semibold** (Headings)

This tells the browser to start downloading these files immediately, which will significantly improve your LCP score.

### URLs Used:
- Regular: `.../6726274a716cce6e0304c5a7_silka-regular-webfont.woff2`
- Semibold: `.../6726274abd17ff787446fd05_silka-semibold-webfont.woff2`

*Note: If you re-upload these fonts in Webflow, the filenames (hash) will change, and you will need to update the `global.html` file with the new URLs.*
<!-- /ANCHOR:font-preloading-implemented -->
