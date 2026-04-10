'use strict';

// ---------------------------------------------------------------
// MODULE: Wave Segment Planner (T001, T-WE-NEW-2, T-WE-NEW-3)
// ---------------------------------------------------------------
// Deterministic segmentation for review files and research domains.
// v1: heuristic-based (file counts, directory grouping, hotspot ranking)
// v2: graph/cluster-enhanced (Phase 002 coverage graph overlay)
//
// Segment identity and ordering are reproducible from the same inputs.
// Activation gates ensure wave mode only activates for large targets.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Minimum file count to activate wave mode for review.
 * @type {number}
 */
const REVIEW_FILE_THRESHOLD = 1000;

/**
 * Minimum domain count to activate wave mode for research.
 * @type {number}
 */
const RESEARCH_DOMAIN_THRESHOLD = 50;

/**
 * Default maximum files per review segment.
 * @type {number}
 */
const DEFAULT_SEGMENT_SIZE_REVIEW = 200;

/**
 * Default maximum domains per research segment.
 * @type {number}
 */
const DEFAULT_SEGMENT_SIZE_RESEARCH = 10;

/**
 * Minimum hotspot spread ratio to justify wave segmentation.
 * At least this fraction of directories must contain hotspots.
 * @type {number}
 */
const HOTSPOT_SPREAD_THRESHOLD = 0.15;

/**
 * Minimum cluster diversity ratio to justify wave segmentation for research.
 * At least this fraction of domains must span distinct clusters.
 * @type {number}
 */
const CLUSTER_DIVERSITY_THRESHOLD = 0.20;

/* ---------------------------------------------------------------
   2. ACTIVATION GATES
----------------------------------------------------------------*/

/**
 * Check whether wave mode should activate for a review scope.
 * Requires >= REVIEW_FILE_THRESHOLD files with sufficient hotspot spread.
 *
 * @param {Array<object>} files - File inventory list
 * @param {object} [metrics] - Optional precomputed metrics
 * @param {number} [metrics.hotspotSpread] - Fraction of directories with hotspots
 * @returns {{ activate: boolean, reason: string, fileCount: number, hotspotSpread: number }}
 */
function shouldActivateReviewWave(files, metrics) {
  const fileCount = Array.isArray(files) ? files.length : 0;
  const hotspotSpread = (metrics && typeof metrics.hotspotSpread === 'number')
    ? metrics.hotspotSpread
    : computeHotspotSpread(files);

  if (fileCount < REVIEW_FILE_THRESHOLD) {
    return {
      activate: false,
      reason: `File count ${fileCount} below threshold ${REVIEW_FILE_THRESHOLD}`,
      fileCount,
      hotspotSpread,
    };
  }

  if (hotspotSpread < HOTSPOT_SPREAD_THRESHOLD) {
    return {
      activate: false,
      reason: `Hotspot spread ${hotspotSpread.toFixed(3)} below threshold ${HOTSPOT_SPREAD_THRESHOLD}`,
      fileCount,
      hotspotSpread,
    };
  }

  return {
    activate: true,
    reason: `Wave activated: ${fileCount} files, hotspot spread ${hotspotSpread.toFixed(3)}`,
    fileCount,
    hotspotSpread,
  };
}

/**
 * Check whether wave mode should activate for a research scope.
 * Requires >= RESEARCH_DOMAIN_THRESHOLD domains with sufficient cluster diversity.
 *
 * @param {Array<object>} domains - Domain inventory list
 * @param {object} [metrics] - Optional precomputed metrics
 * @param {number} [metrics.clusterDiversity] - Fraction of domains in distinct clusters
 * @returns {{ activate: boolean, reason: string, domainCount: number, clusterDiversity: number }}
 */
function shouldActivateResearchWave(domains, metrics) {
  const domainCount = Array.isArray(domains) ? domains.length : 0;
  const clusterDiversity = (metrics && typeof metrics.clusterDiversity === 'number')
    ? metrics.clusterDiversity
    : computeClusterDiversity(domains);

  if (domainCount < RESEARCH_DOMAIN_THRESHOLD) {
    return {
      activate: false,
      reason: `Domain count ${domainCount} below threshold ${RESEARCH_DOMAIN_THRESHOLD}`,
      domainCount,
      clusterDiversity,
    };
  }

  if (clusterDiversity < CLUSTER_DIVERSITY_THRESHOLD) {
    return {
      activate: false,
      reason: `Cluster diversity ${clusterDiversity.toFixed(3)} below threshold ${CLUSTER_DIVERSITY_THRESHOLD}`,
      domainCount,
      clusterDiversity,
    };
  }

  return {
    activate: true,
    reason: `Wave activated: ${domainCount} domains, cluster diversity ${clusterDiversity.toFixed(3)}`,
    domainCount,
    clusterDiversity,
  };
}

/* ---------------------------------------------------------------
   3. HOTSPOT INVENTORY (T-WE-NEW-2)
----------------------------------------------------------------*/

/**
 * Generate hotspot-inventory.json for review.
 * Produces file ranking, directory clusters, and coverage priorities.
 *
 * Deterministic: same inputs always produce same output order.
 *
 * @param {Array<object>} files - File list with metadata
 * @param {string} files[].path - File path
 * @param {number} [files[].complexity] - Complexity score (higher = more complex)
 * @param {number} [files[].churnRate] - Change frequency (higher = more active)
 * @param {number} [files[].issueCount] - Known issues in this file
 * @param {object} [metrics] - Additional scoring metrics
 * @returns {object} Hotspot inventory artifact
 */
function generateHotspotInventory(files, metrics) {
  if (!Array.isArray(files)) {
    return { files: [], directories: [], segments: [], version: 'v1', generatedAt: new Date().toISOString() };
  }

  // Score each file for hotspot ranking
  const scored = files.map(f => {
    const complexity = typeof f.complexity === 'number' ? f.complexity : 1;
    const churnRate = typeof f.churnRate === 'number' ? f.churnRate : 0;
    const issueCount = typeof f.issueCount === 'number' ? f.issueCount : 0;

    const hotspotScore = (complexity * 0.4) + (churnRate * 0.35) + (issueCount * 0.25);

    return {
      path: f.path || '',
      directory: extractDirectory(f.path || ''),
      complexity,
      churnRate,
      issueCount,
      hotspotScore,
    };
  });

  // Sort deterministically: by hotspotScore descending, then path ascending
  scored.sort((a, b) => {
    if (b.hotspotScore !== a.hotspotScore) return b.hotspotScore - a.hotspotScore;
    return a.path.localeCompare(b.path);
  });

  // Group by directory
  const dirMap = new Map();
  for (const file of scored) {
    if (!dirMap.has(file.directory)) {
      dirMap.set(file.directory, { directory: file.directory, files: [], totalScore: 0 });
    }
    const entry = dirMap.get(file.directory);
    entry.files.push(file);
    entry.totalScore += file.hotspotScore;
  }

  // Sort directories by total score descending, then name ascending
  const directories = Array.from(dirMap.values())
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return a.directory.localeCompare(b.directory);
    })
    .map((d, idx) => ({
      directory: d.directory,
      fileCount: d.files.length,
      totalScore: d.totalScore,
      rank: idx + 1,
    }));

  return {
    files: scored,
    directories,
    totalFiles: scored.length,
    totalDirectories: directories.length,
    version: 'v1',
    generatedAt: new Date().toISOString(),
  };
}

/* ---------------------------------------------------------------
   4. DOMAIN LEDGER (T-WE-NEW-3)
----------------------------------------------------------------*/

/**
 * Generate domain-ledger.json for research.
 * Produces source domains, authority levels, and cluster assignments.
 *
 * Deterministic: same inputs always produce same output order.
 *
 * @param {Array<object>} sources - Source list with metadata
 * @param {string} sources[].domain - Domain identifier
 * @param {string} [sources[].url] - Source URL
 * @param {number} [sources[].authority] - Authority score (0.0-1.0)
 * @param {string} [sources[].cluster] - Pre-assigned cluster name
 * @param {string[]} [sources[].topics] - Topics this source covers
 * @param {object} [metrics] - Additional clustering metrics
 * @returns {object} Domain ledger artifact
 */
function generateDomainLedger(sources, metrics) {
  if (!Array.isArray(sources)) {
    return { domains: [], clusters: [], version: 'v1', generatedAt: new Date().toISOString() };
  }

  // Score and normalize each domain
  const scored = sources.map(s => ({
    domain: s.domain || '',
    url: s.url || '',
    authority: typeof s.authority === 'number' ? Math.max(0, Math.min(1, s.authority)) : 0.5,
    cluster: s.cluster || assignCluster(s),
    topics: Array.isArray(s.topics) ? [...s.topics].sort() : [],
  }));

  // Sort deterministically: by authority descending, then domain ascending
  scored.sort((a, b) => {
    if (b.authority !== a.authority) return b.authority - a.authority;
    return a.domain.localeCompare(b.domain);
  });

  // Group by cluster
  const clusterMap = new Map();
  for (const domain of scored) {
    if (!clusterMap.has(domain.cluster)) {
      clusterMap.set(domain.cluster, { cluster: domain.cluster, domains: [], totalAuthority: 0 });
    }
    const entry = clusterMap.get(domain.cluster);
    entry.domains.push(domain);
    entry.totalAuthority += domain.authority;
  }

  // Sort clusters by total authority descending, then name ascending
  const clusters = Array.from(clusterMap.values())
    .sort((a, b) => {
      if (b.totalAuthority !== a.totalAuthority) return b.totalAuthority - a.totalAuthority;
      return a.cluster.localeCompare(b.cluster);
    })
    .map((c, idx) => ({
      cluster: c.cluster,
      domainCount: c.domains.length,
      totalAuthority: c.totalAuthority,
      rank: idx + 1,
    }));

  return {
    domains: scored,
    clusters,
    totalDomains: scored.length,
    totalClusters: clusters.length,
    version: 'v1',
    generatedAt: new Date().toISOString(),
  };
}

/* ---------------------------------------------------------------
   5. REVIEW SEGMENTATION (T001)
----------------------------------------------------------------*/

/**
 * Segment files for review using deterministic heuristics.
 * Groups by directory, ranks by hotspot score, and produces stable
 * segment identities reproducible from the same inventory.
 *
 * @param {object} inventory - Hotspot inventory from generateHotspotInventory
 * @param {object} [config] - Segmentation configuration
 * @param {number} [config.segmentSize] - Max files per segment
 * @param {number} [config.maxSegments] - Maximum number of segments
 * @returns {Array<object>} Ordered array of segment descriptors
 */
function segmentForReview(inventory, config) {
  if (!inventory || !Array.isArray(inventory.files)) {
    return [];
  }

  const cfg = config || {};
  const segmentSize = cfg.segmentSize || DEFAULT_SEGMENT_SIZE_REVIEW;
  const maxSegments = cfg.maxSegments || MAX_SEGMENTS_DEFAULT;

  const files = inventory.files;
  if (files.length === 0) return [];

  // Group files by directory (preserving hotspot-score order within each group)
  const dirGroups = new Map();
  for (const file of files) {
    const dir = file.directory || extractDirectory(file.path || '');
    if (!dirGroups.has(dir)) {
      dirGroups.set(dir, []);
    }
    dirGroups.get(dir).push(file);
  }

  // Sort directory groups by aggregate score descending
  const sortedDirs = Array.from(dirGroups.entries())
    .map(([dir, groupFiles]) => ({
      dir,
      files: groupFiles,
      totalScore: groupFiles.reduce((s, f) => s + (f.hotspotScore || 0), 0),
    }))
    .sort((a, b) => {
      if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
      return a.dir.localeCompare(b.dir);
    });

  // Split any oversized directory groups into chunks of segmentSize
  const expandedGroups = [];
  for (const group of sortedDirs) {
    if (group.files.length <= segmentSize) {
      expandedGroups.push(group);
    } else {
      // Split oversized directory into segmentSize chunks
      for (let i = 0; i < group.files.length; i += segmentSize) {
        expandedGroups.push({
          dir: group.dir,
          files: group.files.slice(i, i + segmentSize),
          totalScore: group.files.slice(i, i + segmentSize).reduce((s, f) => s + (f.hotspotScore || 0), 0),
        });
      }
    }
  }

  // Pack directories into segments up to segmentSize
  const segments = [];
  let currentSegment = { files: [], directories: [] };

  for (const group of expandedGroups) {
    // If adding this directory would exceed segment size, finalize current
    if (currentSegment.files.length > 0 &&
        currentSegment.files.length + group.files.length > segmentSize) {
      segments.push(currentSegment);
      currentSegment = { files: [], directories: [] };

      if (segments.length >= maxSegments) break;
    }

    currentSegment.files.push(...group.files);
    if (!currentSegment.directories.includes(group.dir)) {
      currentSegment.directories.push(group.dir);
    }

    // If current segment is full, finalize
    if (currentSegment.files.length >= segmentSize) {
      segments.push(currentSegment);
      currentSegment = { files: [], directories: [] };

      if (segments.length >= maxSegments) break;
    }
  }

  // Push remaining files
  if (currentSegment.files.length > 0 && segments.length < maxSegments) {
    segments.push(currentSegment);
  }

  // Assign stable segment IDs
  return segments.map((seg, idx) => ({
    segmentId: `review-seg-${String(idx + 1).padStart(3, '0')}`,
    segmentIndex: idx,
    files: seg.files.map(f => f.path || f),
    directories: seg.directories,
    fileCount: seg.files.length,
    directoryCount: seg.directories.length,
    totalHotspotScore: seg.files.reduce((s, f) => s + (f.hotspotScore || 0), 0),
  }));
}

/**
 * Maximum segments default (safety cap).
 * @type {number}
 */
const MAX_SEGMENTS_DEFAULT = 20;

/* ---------------------------------------------------------------
   6. RESEARCH SEGMENTATION (T001)
----------------------------------------------------------------*/

/**
 * Segment domains for research using deterministic heuristics.
 * Groups by cluster, ranks by authority, and produces stable
 * segment identities reproducible from the same ledger.
 *
 * @param {object} domainLedger - Domain ledger from generateDomainLedger
 * @param {object} [config] - Segmentation configuration
 * @param {number} [config.segmentSize] - Max domains per segment
 * @param {number} [config.maxSegments] - Maximum number of segments
 * @returns {Array<object>} Ordered array of segment descriptors
 */
function segmentForResearch(domainLedger, config) {
  if (!domainLedger || !Array.isArray(domainLedger.domains)) {
    return [];
  }

  const cfg = config || {};
  const segmentSize = cfg.segmentSize || DEFAULT_SEGMENT_SIZE_RESEARCH;
  const maxSegments = cfg.maxSegments || MAX_SEGMENTS_DEFAULT;

  const domains = domainLedger.domains;
  if (domains.length === 0) return [];

  // Group domains by cluster (preserving authority order within each group)
  const clusterGroups = new Map();
  for (const domain of domains) {
    const cluster = domain.cluster || 'unclustered';
    if (!clusterGroups.has(cluster)) {
      clusterGroups.set(cluster, []);
    }
    clusterGroups.get(cluster).push(domain);
  }

  // Sort cluster groups by aggregate authority descending
  const sortedClusters = Array.from(clusterGroups.entries())
    .map(([cluster, clusterDomains]) => ({
      cluster,
      domains: clusterDomains,
      totalAuthority: clusterDomains.reduce((s, d) => s + (d.authority || 0), 0),
    }))
    .sort((a, b) => {
      if (b.totalAuthority !== a.totalAuthority) return b.totalAuthority - a.totalAuthority;
      return a.cluster.localeCompare(b.cluster);
    });

  // Split any oversized cluster groups into chunks of segmentSize
  const expandedClusters = [];
  for (const group of sortedClusters) {
    if (group.domains.length <= segmentSize) {
      expandedClusters.push(group);
    } else {
      for (let i = 0; i < group.domains.length; i += segmentSize) {
        expandedClusters.push({
          cluster: group.cluster,
          domains: group.domains.slice(i, i + segmentSize),
          totalAuthority: group.domains.slice(i, i + segmentSize).reduce((s, d) => s + (d.authority || 0), 0),
        });
      }
    }
  }

  // Pack clusters into segments up to segmentSize
  const segments = [];
  let currentSegment = { domains: [], clusters: [] };

  for (const group of expandedClusters) {
    if (currentSegment.domains.length > 0 &&
        currentSegment.domains.length + group.domains.length > segmentSize) {
      segments.push(currentSegment);
      currentSegment = { domains: [], clusters: [] };

      if (segments.length >= maxSegments) break;
    }

    currentSegment.domains.push(...group.domains);
    if (!currentSegment.clusters.includes(group.cluster)) {
      currentSegment.clusters.push(group.cluster);
    }

    if (currentSegment.domains.length >= segmentSize) {
      segments.push(currentSegment);
      currentSegment = { domains: [], clusters: [] };

      if (segments.length >= maxSegments) break;
    }
  }

  if (currentSegment.domains.length > 0 && segments.length < maxSegments) {
    segments.push(currentSegment);
  }

  // Assign stable segment IDs
  return segments.map((seg, idx) => ({
    segmentId: `research-seg-${String(idx + 1).padStart(3, '0')}`,
    segmentIndex: idx,
    domains: seg.domains.map(d => d.domain || d),
    clusters: seg.clusters,
    domainCount: seg.domains.length,
    clusterCount: seg.clusters.length,
    totalAuthority: seg.domains.reduce((s, d) => s + (d.authority || 0), 0),
  }));
}

/* ---------------------------------------------------------------
   7. HELPERS
----------------------------------------------------------------*/

/**
 * Extract the directory portion of a file path.
 * @param {string} filePath
 * @returns {string}
 */
function extractDirectory(filePath) {
  if (!filePath) return '';
  const lastSlash = filePath.lastIndexOf('/');
  return lastSlash > 0 ? filePath.slice(0, lastSlash) : '.';
}

/**
 * Compute hotspot spread: fraction of directories that contain files
 * with above-median complexity or churn.
 * @param {Array<object>} files
 * @returns {number}
 */
function computeHotspotSpread(files) {
  if (!Array.isArray(files) || files.length === 0) return 0;

  const allDirs = new Set();
  const hotDirs = new Set();

  // Compute median complexity
  const complexities = files
    .map(f => typeof f.complexity === 'number' ? f.complexity : 1)
    .sort((a, b) => a - b);
  const median = complexities[Math.floor(complexities.length / 2)] || 1;

  for (const f of files) {
    const dir = extractDirectory(f.path || '');
    allDirs.add(dir);
    const complexity = typeof f.complexity === 'number' ? f.complexity : 1;
    if (complexity >= median) {
      hotDirs.add(dir);
    }
  }

  return allDirs.size > 0 ? hotDirs.size / allDirs.size : 0;
}

/**
 * Compute cluster diversity: fraction of unique clusters across domains.
 * @param {Array<object>} domains
 * @returns {number}
 */
function computeClusterDiversity(domains) {
  if (!Array.isArray(domains) || domains.length === 0) return 0;

  const clusters = new Set();
  for (const d of domains) {
    clusters.add(d.cluster || assignCluster(d));
  }

  return clusters.size / domains.length;
}

/**
 * Assign a default cluster to a domain based on its name.
 * Simple heuristic: uses the top-level domain category.
 * @param {object} source
 * @returns {string}
 */
function assignCluster(source) {
  if (!source || !source.domain) return 'unclustered';
  // Simple heuristic: split by dot and use first meaningful segment
  const parts = source.domain.split('.');
  if (parts.length >= 2) return parts[parts.length - 1];
  return parts[0] || 'unclustered';
}

/* ---------------------------------------------------------------
   8. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  // Constants
  REVIEW_FILE_THRESHOLD,
  RESEARCH_DOMAIN_THRESHOLD,
  DEFAULT_SEGMENT_SIZE_REVIEW,
  DEFAULT_SEGMENT_SIZE_RESEARCH,
  HOTSPOT_SPREAD_THRESHOLD,
  CLUSTER_DIVERSITY_THRESHOLD,
  MAX_SEGMENTS_DEFAULT,
  // Activation gates
  shouldActivateReviewWave,
  shouldActivateResearchWave,
  // Prepass artifacts
  generateHotspotInventory,
  generateDomainLedger,
  // Segmentation
  segmentForReview,
  segmentForResearch,
  // Helpers
  extractDirectory,
  computeHotspotSpread,
  computeClusterDiversity,
};
