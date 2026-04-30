#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// BUILD: VERIFY MINIFICATION
// ───────────────────────────────────────────────────────────────
//
// Usage:
//   node scripts/verify-minification.mjs
//
// Verifies that critical patterns are preserved after minification:
// - Data attribute selectors (e.g., [data-target='hero-item'])
// - DOM event names (e.g., 'DOMContentLoaded', 'click')
// - Global assignments (window.X patterns)
// - Webflow/Motion/gsap references
// - Init flags (e.g., __heroVideoInit)

import { readdirSync, existsSync, readFileSync } from 'fs';
import { join, relative } from 'path';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const SOURCE_DIR = 'src/2_javascript';
const OUTPUT_DIR = 'src/2_javascript/z_minified';

// Folders to skip
const SKIP_FOLDERS = ['z_minified', 'node_modules', '.git'];

// Critical patterns to verify
const PATTERNS = {
  // Data attribute selectors - must be preserved exactly
  data_selectors: /\[data-[a-z-]+=['"][^'"]+['"]\]/g,

  // DOM event names in addEventListener
  dom_events: /addEventListener\s*\(\s*['"]([^'"]+)['"]/g,

  // Global init flags (window['__flag'] or window.__flag patterns)
  init_flags: /(?:window\s*\[\s*['"](__[a-zA-Z_]+)['"]|window\.(__[a-zA-Z_]+))/g,

  // Webflow.push pattern (no /g - used with .test() only)
  webflow_push: /(?:window\.)?Webflow(?:\?)?\.push/,

  // Motion.animate references (no /g - used with .test() only)
  motion_animate: /(?:window\.)?Motion(?:\?)?\.animate/,

  // gsap references (no /g - used with .test() only)
  gsap_ref: /(?:window\.)?gsap\./,

  // ScrollTrigger references (no /g - used with .test() only)
  scroll_trigger: /ScrollTrigger/,

  // Swiper references (no /g - used with .test() only)
  swiper_ref: /(?:new\s+)?Swiper\s*\(/,

  // HLS references (no /g - used with .test() only)
  hls_ref: /(?:new\s+)?Hls\s*\(/,
};

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
──────────────────────────────────────────────────────────────── */

// Recursively find all .js files in directory
function find_js_files(dir, base_dir = dir) {
  const files = [];

  if (!existsSync(dir)) {
    return files;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full_path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_FOLDERS.includes(entry.name)) {
        files.push(...find_js_files(full_path, base_dir));
      }
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(relative(base_dir, full_path));
    }
  }

  return files;
}

/* ─────────────────────────────────────────────────────────────
   3. PATTERN EXTRACTION
──────────────────────────────────────────────────────────────── */

// Extract patterns from file content
function extract_patterns(content) {
  const results = {
    data_selectors: [],
    dom_events: [],
    init_flags: [],
    has_webflow_push: false,
    has_motion_animate: false,
    has_gsap: false,
    has_scroll_trigger: false,
    has_swiper: false,
    has_hls: false,
  };

  // Extract data selectors
  const selector_matches = content.match(PATTERNS.data_selectors) || [];
  results.data_selectors = [...new Set(selector_matches)];

  // Extract DOM events
  let event_match;
  const event_regex = new RegExp(PATTERNS.dom_events.source, 'g');
  while ((event_match = event_regex.exec(content)) !== null) {
    results.dom_events.push(event_match[1]);
  }
  results.dom_events = [...new Set(results.dom_events)];

  // Extract init flags
  let flag_match;
  const flag_regex = new RegExp(PATTERNS.init_flags.source, 'g');
  while ((flag_match = flag_regex.exec(content)) !== null) {
    const flag = flag_match[1] || flag_match[2];
    if (flag) results.init_flags.push(flag);
  }
  results.init_flags = [...new Set(results.init_flags)];

  // Check for library patterns
  results.has_webflow_push = PATTERNS.webflow_push.test(content);
  results.has_motion_animate = PATTERNS.motion_animate.test(content);
  results.has_gsap = PATTERNS.gsap_ref.test(content);
  results.has_scroll_trigger = PATTERNS.scroll_trigger.test(content);
  results.has_swiper = PATTERNS.swiper_ref.test(content);
  results.has_hls = PATTERNS.hls_ref.test(content);

  return results;
}

/* ─────────────────────────────────────────────────────────────
   4. COMPARISON
──────────────────────────────────────────────────────────────── */

// Compare patterns between original and minified
function compare_patterns(original, minified, file_name) {
  const issues = [];

  // Check data selectors
  for (const selector of original.data_selectors) {
    if (!minified.data_selectors.includes(selector)) {
      issues.push({
        type: 'FAIL',
        category: 'data-selector',
        message: `Missing selector: ${selector}`,
      });
    }
  }

  // Check DOM events
  for (const event of original.dom_events) {
    if (!minified.dom_events.includes(event)) {
      issues.push({
        type: 'FAIL',
        category: 'dom-event',
        message: `Missing event: ${event}`,
      });
    }
  }

  // Check init flags
  for (const flag of original.init_flags) {
    if (!minified.init_flags.includes(flag)) {
      issues.push({
        type: 'FAIL',
        category: 'init-flag',
        message: `Missing init flag: ${flag}`,
      });
    }
  }

  // Check library patterns
  if (original.has_webflow_push && !minified.has_webflow_push) {
    issues.push({
      type: 'FAIL',
      category: 'webflow',
      message: 'Missing Webflow.push pattern',
    });
  }

  if (original.has_motion_animate && !minified.has_motion_animate) {
    issues.push({
      type: 'FAIL',
      category: 'motion',
      message: 'Missing Motion.animate pattern',
    });
  }

  if (original.has_gsap && !minified.has_gsap) {
    issues.push({
      type: 'FAIL',
      category: 'gsap',
      message: 'Missing gsap reference',
    });
  }

  if (original.has_scroll_trigger && !minified.has_scroll_trigger) {
    issues.push({
      type: 'FAIL',
      category: 'scrolltrigger',
      message: 'Missing ScrollTrigger reference',
    });
  }

  if (original.has_swiper && !minified.has_swiper) {
    issues.push({
      type: 'FAIL',
      category: 'swiper',
      message: 'Missing Swiper reference',
    });
  }

  if (original.has_hls && !minified.has_hls) {
    issues.push({
      type: 'FAIL',
      category: 'hls',
      message: 'Missing Hls reference',
    });
  }

  return issues;
}

/* ─────────────────────────────────────────────────────────────
   5. VERIFICATION
──────────────────────────────────────────────────────────────── */

// Verify a single file
function verify_file(relative_path) {
  const source_path = join(SOURCE_DIR, relative_path);
  const output_path = join(OUTPUT_DIR, relative_path);

  // Check files exist
  if (!existsSync(source_path)) {
    return { status: 'SKIP', message: 'Source file not found' };
  }

  if (!existsSync(output_path)) {
    return { status: 'SKIP', message: 'Minified file not found' };
  }

  // Read files
  const source_content = readFileSync(source_path, 'utf-8');
  const output_content = readFileSync(output_path, 'utf-8');

  // Extract patterns
  const source_patterns = extract_patterns(source_content);
  const output_patterns = extract_patterns(output_content);

  // Compare
  const issues = compare_patterns(source_patterns, output_patterns, relative_path);

  return {
    status: issues.length === 0 ? 'PASS' : 'FAIL',
    source_patterns,
    output_patterns,
    issues,
  };
}

/* ─────────────────────────────────────────────────────────────
   6. MAIN EXECUTION
──────────────────────────────────────────────────────────────── */

function main() {
  console.log('=== VERIFICATION REPORT ===\n');

  // Find all source files
  const files = find_js_files(SOURCE_DIR);

  let passed = 0;
  let failed = 0;
  let skipped = 0;

  for (const file of files) {
    const result = verify_file(file);

    console.log(file);

    if (result.status === 'SKIP') {
      console.log(`  ⊘ SKIP: ${result.message}`);
      skipped++;
      continue;
    }

    // Show what was found
    const sp = result.source_patterns;
    if (sp.data_selectors.length > 0) {
      console.log(`  ✓ ${sp.data_selectors.length} data-selectors preserved`);
    }
    if (sp.dom_events.length > 0) {
      console.log(`  ✓ ${sp.dom_events.length} DOM events preserved`);
    }
    if (sp.init_flags.length > 0) {
      for (const flag of sp.init_flags) {
        console.log(`  ✓ Init flag: ${flag}`);
      }
    }
    if (sp.has_webflow_push) {
      console.log('  ✓ Webflow.push preserved');
    }
    if (sp.has_motion_animate) {
      console.log('  ✓ Motion.animate preserved');
    }
    if (sp.has_gsap) {
      console.log('  ✓ gsap preserved');
    }
    if (sp.has_scroll_trigger) {
      console.log('  ✓ ScrollTrigger preserved');
    }
    if (sp.has_swiper) {
      console.log('  ✓ Swiper preserved');
    }
    if (sp.has_hls) {
      console.log('  ✓ Hls preserved');
    }

    // Show issues
    for (const issue of result.issues) {
      console.log(`  ✗ ${issue.type}: ${issue.message}`);
    }

    console.log(`  RESULT: ${result.status}\n`);

    if (result.status === 'PASS') {
      passed++;
    } else {
      failed++;
    }
  }

  // Summary
  console.log('=== SUMMARY ===');
  console.log(`Passed:  ${passed}/${files.length}`);
  console.log(`Failed:  ${failed}/${files.length}`);
  console.log(`Skipped: ${skipped}/${files.length}`);

  if (failed > 0) {
    console.log('\n⚠️  VERIFICATION FAILED - Do not deploy!');
    console.log('Fix the issues above before proceeding.');
    process.exit(1);
  }

  console.log('\n✓ All verifications passed');
  console.log('Next: Run test-minified-runtime.mjs for runtime testing');
}

main();
