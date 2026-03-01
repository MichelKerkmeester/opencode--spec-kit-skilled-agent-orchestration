#!/usr/bin/env node
/**
 * measure-token-savings.js
 *
 * Measures actual token savings from anchor-based selective retrieval
 * on production memory files.
 *
 * Usage: node measure-token-savings.js
 */

'use strict';

const fs = require('fs');
const path = require('path');

// Import memory-parser from the actual location
const memoryParser = require('../../../../.opencode/skill/system-spec-kit/mcp_server/lib/memory-parser.js');

// Simple token estimation: chars / 4 (industry standard approximation)
function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

// Find all memory files with anchors
function findMemoryFilesWithAnchors(specsDir) {
  const results = [];

  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (err) {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        if (entry.name.startsWith('.') || entry.name === 'node_modules') continue;
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        if (fullPath.includes('/memory/')) {
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            if (content.includes('<!-- ANCHOR:')) {
              results.push(fullPath);
            }
          } catch (err) {
            // Skip unreadable files
          }
        }
      }
    }
  }

  walk(specsDir);
  return results;
}

// Analyze a single memory file
function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const totalTokens = estimateTokens(content);

  // Extract anchors using the actual parser
  const anchors = memoryParser.extractAnchors(content);

  // Map anchor IDs to canonical types
  // Anchor IDs follow pattern: {type}-{session_id}-{spec_folder}
  // e.g., summary-session-1768474374788-oxru94sa7-003-memory-and-spec-kit/064-bug-analysis-and-fix
  const anchorTypes = {
    summary: null,
    decisions: null,
    'session-history': null,
    metadata: null
  };

  for (const [id, content] of Object.entries(anchors)) {
    for (const type of Object.keys(anchorTypes)) {
      if (id.startsWith(type + '-')) {
        anchorTypes[type] = {
          id,
          content,
          tokens: estimateTokens(content)
        };
        break;
      }
    }
  }

  return {
    filePath,
    totalTokens,
    fileSize: content.length,
    anchors: anchorTypes,
    anchorCount: Object.values(anchorTypes).filter(a => a !== null).length
  };
}

// Calculate savings for a retrieval pattern
function calculateSavings(analysis, retrieveAnchors) {
  let retrievedTokens = 0;

  for (const anchorType of retrieveAnchors) {
    const anchor = analysis.anchors[anchorType];
    if (anchor) {
      retrievedTokens += anchor.tokens;
    }
  }

  const savings = analysis.totalTokens - retrievedTokens;
  const savingsPercent = analysis.totalTokens > 0
    ? ((savings / analysis.totalTokens) * 100).toFixed(1)
    : 0;

  return {
    retrievedTokens,
    savedTokens: savings,
    savingsPercent: parseFloat(savingsPercent)
  };
}

// Main analysis
function main() {
  const specsDir = path.resolve(__dirname, '../../../../specs');

  console.log('='.repeat(70));
  console.log('ANCHOR SYSTEM TOKEN SAVINGS ANALYSIS');
  console.log('='.repeat(70));
  console.log(`\nAnalyzing memory files in: ${specsDir}\n`);

  // Find all memory files with anchors
  const memoryFiles = findMemoryFilesWithAnchors(specsDir);
  console.log(`Found ${memoryFiles.length} memory files with anchors\n`);

  if (memoryFiles.length === 0) {
    console.log('No memory files found with anchors. Exiting.');
    return;
  }

  // Analyze each file
  const analyses = [];
  for (const filePath of memoryFiles) {
    try {
      const analysis = analyzeFile(filePath);
      if (analysis.anchorCount > 0) {
        analyses.push(analysis);
      }
    } catch (err) {
      console.error(`Error analyzing ${filePath}: ${err.message}`);
    }
  }

  console.log(`Successfully analyzed ${analyses.length} files\n`);

  // Define retrieval scenarios
  const scenarios = [
    { name: 'Summary Only', anchors: ['summary'] },
    { name: 'Decisions Only', anchors: ['decisions'] },
    { name: 'Summary + Decisions', anchors: ['summary', 'decisions'] },
    { name: 'Metadata Only', anchors: ['metadata'] },
    { name: 'All Except History', anchors: ['summary', 'decisions', 'metadata'] },
  ];

  // Calculate statistics per scenario
  console.log('-'.repeat(70));
  console.log('SCENARIO ANALYSIS');
  console.log('-'.repeat(70));

  const scenarioResults = [];

  for (const scenario of scenarios) {
    const savingsData = analyses.map(a => calculateSavings(a, scenario.anchors));
    const percentages = savingsData.map(s => s.savingsPercent);

    const min = Math.min(...percentages);
    const max = Math.max(...percentages);
    const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
    const median = percentages.sort((a, b) => a - b)[Math.floor(percentages.length / 2)];

    const totalOriginalTokens = analyses.reduce((sum, a) => sum + a.totalTokens, 0);
    const totalRetrievedTokens = savingsData.reduce((sum, s) => sum + s.retrievedTokens, 0);
    const totalSavedTokens = savingsData.reduce((sum, s) => sum + s.savedTokens, 0);

    const result = {
      scenario: scenario.name,
      anchors: scenario.anchors,
      min: min.toFixed(1),
      max: max.toFixed(1),
      avg: avg.toFixed(1),
      median: median.toFixed(1),
      totalOriginalTokens,
      totalRetrievedTokens,
      totalSavedTokens,
      overallSavings: ((totalSavedTokens / totalOriginalTokens) * 100).toFixed(1)
    };

    scenarioResults.push(result);

    console.log(`\n### ${scenario.name}`);
    console.log(`    Anchors retrieved: ${scenario.anchors.join(', ')}`);
    console.log(`    Savings: min=${result.min}% | max=${result.max}% | avg=${result.avg}% | median=${result.median}%`);
    console.log(`    Aggregate: ${totalRetrievedTokens.toLocaleString()} tokens retrieved vs ${totalOriginalTokens.toLocaleString()} total`);
    console.log(`    Overall savings: ${result.overallSavings}%`);
  }

  // File size distribution
  console.log('\n' + '-'.repeat(70));
  console.log('FILE SIZE DISTRIBUTION');
  console.log('-'.repeat(70));

  const tokenCounts = analyses.map(a => a.totalTokens).sort((a, b) => a - b);
  const totalTokens = tokenCounts.reduce((a, b) => a + b, 0);

  console.log(`\nTotal files: ${analyses.length}`);
  console.log(`Total tokens across all files: ${totalTokens.toLocaleString()}`);
  console.log(`Min file tokens: ${Math.min(...tokenCounts).toLocaleString()}`);
  console.log(`Max file tokens: ${Math.max(...tokenCounts).toLocaleString()}`);
  console.log(`Average file tokens: ${Math.round(totalTokens / analyses.length).toLocaleString()}`);
  console.log(`Median file tokens: ${tokenCounts[Math.floor(tokenCounts.length / 2)].toLocaleString()}`);

  // Anchor presence statistics
  console.log('\n' + '-'.repeat(70));
  console.log('ANCHOR COVERAGE');
  console.log('-'.repeat(70));

  const anchorTypes = ['summary', 'decisions', 'session-history', 'metadata'];
  for (const type of anchorTypes) {
    const count = analyses.filter(a => a.anchors[type] !== null).length;
    const avgTokens = analyses
      .filter(a => a.anchors[type] !== null)
      .reduce((sum, a) => sum + a.anchors[type].tokens, 0) / count || 0;
    console.log(`\n${type}:`);
    console.log(`    Present in ${count}/${analyses.length} files (${((count/analyses.length)*100).toFixed(1)}%)`);
    console.log(`    Average tokens: ${Math.round(avgTokens).toLocaleString()}`);
  }

  // Sample files (top 5 largest)
  console.log('\n' + '-'.repeat(70));
  console.log('SAMPLE: 5 LARGEST FILES');
  console.log('-'.repeat(70));

  const largestFiles = [...analyses].sort((a, b) => b.totalTokens - a.totalTokens).slice(0, 5);
  for (const file of largestFiles) {
    const relativePath = path.relative(specsDir, file.filePath);
    console.log(`\n${relativePath}`);
    console.log(`    Total: ${file.totalTokens.toLocaleString()} tokens`);
    for (const [type, anchor] of Object.entries(file.anchors)) {
      if (anchor) {
        const pct = ((anchor.tokens / file.totalTokens) * 100).toFixed(1);
        console.log(`    ${type}: ${anchor.tokens.toLocaleString()} tokens (${pct}%)`);
      }
    }
  }

  // JSON output for documentation
  console.log('\n' + '='.repeat(70));
  console.log('JSON OUTPUT (for documentation)');
  console.log('='.repeat(70));

  const jsonOutput = {
    analysis_date: new Date().toISOString(),
    files_analyzed: analyses.length,
    total_tokens_all_files: totalTokens,
    scenarios: scenarioResults.map(r => ({
      name: r.scenario,
      anchors: r.anchors,
      savings_min_pct: parseFloat(r.min),
      savings_max_pct: parseFloat(r.max),
      savings_avg_pct: parseFloat(r.avg),
      savings_median_pct: parseFloat(r.median),
      overall_savings_pct: parseFloat(r.overallSavings)
    })),
    file_stats: {
      min_tokens: Math.min(...tokenCounts),
      max_tokens: Math.max(...tokenCounts),
      avg_tokens: Math.round(totalTokens / analyses.length),
      median_tokens: tokenCounts[Math.floor(tokenCounts.length / 2)]
    }
  };

  console.log(JSON.stringify(jsonOutput, null, 2));

  // Write results to file
  const outputPath = path.join(__dirname, 'token-savings-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(jsonOutput, null, 2));
  console.log(`\nResults written to: ${outputPath}`);
}

main();
