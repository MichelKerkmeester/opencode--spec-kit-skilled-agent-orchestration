const fs = require('fs');
const path = require('path');

const [folder, selectedRule] = process.argv.slice(2);

const CANONICAL_SAVE_CUTOFF =
  process.env.SPECKIT_CANONICAL_SAVE_CUTOFF || '2026-05-01T00:00:00Z';
const CANONICAL_SAVE_ALLOWLIST_UNTIL =
  process.env.SPECKIT_CANONICAL_SAVE_ALLOWLIST_UNTIL || CANONICAL_SAVE_CUTOFF;
const CANONICAL_SAVE_FRESHNESS_SLACK_MS = Number(
  process.env.SPECKIT_CANONICAL_SAVE_FRESHNESS_SLACK_MS || `${10 * 60 * 1000}`,
);
const DEFAULT_ALLOWLIST = [
  'system-spec-kit/026-graph-and-context-optimization/007-release-alignment-revisits',
  'system-spec-kit/026-graph-and-context-optimization/008-cleanup-and-audit',
  'system-spec-kit/026-graph-and-context-optimization/009-playbook-and-remediation',
  'system-spec-kit/026-graph-and-context-optimization/010-search-and-routing-tuning',
];
const allowlist = new Set(
  (process.env.SPECKIT_CANONICAL_SAVE_ALLOWLIST || DEFAULT_ALLOWLIST.join(','))
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean),
);

function emit(status, message, details = [], remediation = '') {
  console.log(`rule\t${selectedRule}`);
  console.log(`status\t${status}`);
  console.log(`message\t${message}`);
  for (const detail of details) {
    console.log(`detail\t${detail}`);
  }
  if (remediation) {
    console.log(`detail\tRemediation: ${remediation}`);
  }
}

function normalizePacketId(rawValue) {
  if (typeof rawValue !== 'string') return null;
  let normalized = rawValue.trim();
  if (!normalized) return null;
  normalized = normalized
    .replace(/\\/g, '/')
    .replace(/^\.\//, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');
  const specsMarker = '/.opencode/specs/';
  const plainSpecsMarker = '/specs/';
  if (normalized.includes(specsMarker)) {
    normalized = normalized.split(specsMarker)[1] || normalized;
  } else if (normalized.includes(plainSpecsMarker)) {
    normalized = normalized.split(plainSpecsMarker)[1] || normalized;
  }
  normalized = normalized.replace(/^\.opencode\/specs\//, '').replace(/^specs\//, '');
  return normalized;
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function derivePacketIdFromPath(folderPath) {
  const normalizedPath = folderPath.replace(/\\/g, '/');
  const markers = ['/.opencode/specs/', '/specs/'];
  for (const marker of markers) {
    const index = normalizedPath.indexOf(marker);
    if (index >= 0) {
      return normalizePacketId(normalizedPath.slice(index + marker.length));
    }
  }
  return normalizePacketId(path.basename(folderPath));
}

function readContinuityPacketPointer(folderPath) {
  const candidates = [
    'implementation-summary.md',
    'handover.md',
    'spec.md',
    'plan.md',
    'tasks.md',
    'checklist.md',
    'decision-record.md',
  ];
  for (const candidate of candidates) {
    const filePath = path.join(folderPath, candidate);
    if (!fs.existsSync(filePath)) continue;
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) continue;
    const pointerMatch = frontmatterMatch[1].match(
      /^[ \t]*packet_pointer:\s*(?:"([^"\n]+)"|'([^'\n]+)'|([^\n#]+))/m,
    );
    const pointer = pointerMatch?.[1] || pointerMatch?.[2] || pointerMatch?.[3];
    if (pointer) {
      return normalizePacketId(pointer);
    }
  }
  return null;
}

const descriptionPath = path.join(folder, 'description.json');
const graphPath = path.join(folder, 'graph-metadata.json');
const specPath = path.join(folder, 'spec.md');
const description = readJson(descriptionPath);
const graph = readJson(graphPath);
const packetId =
  normalizePacketId(description?.specFolder)
  || normalizePacketId(graph?.spec_folder)
  || derivePacketIdFromPath(folder);
const hasMetadataSurface = fs.existsSync(descriptionPath) || fs.existsSync(graphPath);
const childPacketDirs = fs.existsSync(folder)
  ? fs.readdirSync(folder, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && /^\d{3}-/.test(entry.name))
      .map((entry) => entry.name)
  : [];
const isLivePacketRoot = childPacketDirs.length > 0 && hasMetadataSurface;
const allowlisted = packetId !== null && allowlist.has(packetId);
const allowlistActive = CANONICAL_SAVE_ALLOWLIST_UNTIL > new Date().toISOString();

switch (selectedRule) {
  case 'CANONICAL_SAVE_ROOT_SPEC_REQUIRED': {
    if (!isLivePacketRoot) {
      emit('pass', 'Canonical-save root-spec check not applicable to this folder');
      break;
    }
    if (fs.existsSync(specPath)) {
      emit('pass', 'Live packet root exposes a canonical spec.md surface');
      break;
    }
    if (allowlisted && allowlistActive) {
      emit(
        'pass',
        `Live packet root is grandfathered until ${CANONICAL_SAVE_ALLOWLIST_UNTIL}`,
        [`Packet: ${packetId}`, `Child packets: ${childPacketDirs.join(', ')}`],
      );
      break;
    }
    emit(
      'fail',
      'Live packet root has metadata but no canonical root spec.md',
      [`Packet: ${packetId}`, `Child packets: ${childPacketDirs.join(', ')}`],
      'Create a root coordination spec.md so canonical save, resume, and graph provenance all target a real packet root.',
    );
    break;
  }
  case 'CANONICAL_SAVE_SOURCE_DOCS_REQUIRED': {
    if (!isLivePacketRoot || !graph) {
      emit('pass', 'Canonical-save source-doc check not applicable to this folder');
      break;
    }
    const sourceDocs = Array.isArray(graph?.derived?.source_docs) ? graph.derived.source_docs : [];
    if (sourceDocs.length > 0) {
      emit('pass', 'Live packet root graph metadata has non-empty derived.source_docs');
      break;
    }
    if (allowlisted && allowlistActive) {
      emit(
        'pass',
        `Empty derived.source_docs is grandfathered until ${CANONICAL_SAVE_ALLOWLIST_UNTIL}`,
        [`Packet: ${packetId}`],
      );
      break;
    }
    emit(
      'fail',
      'Live packet root graph metadata has empty derived.source_docs',
      [`Packet: ${packetId}`],
      'Refresh graph-metadata.json after restoring a canonical root spec.md so derived.source_docs can include the root packet docs.',
    );
    break;
  }
  case 'CANONICAL_SAVE_LINEAGE_REQUIRED': {
    if (!graph?.derived?.last_save_at) {
      emit('pass', 'Canonical-save lineage check not applicable to this folder');
      break;
    }
    const saveLineage = graph?.derived?.save_lineage;
    if (['description_only', 'graph_only', 'same_pass'].includes(saveLineage)) {
      emit('pass', 'save_lineage is present for the refreshed graph metadata');
      break;
    }
    if (graph.derived.last_save_at < CANONICAL_SAVE_CUTOFF) {
      emit(
        'pass',
        `save_lineage is grandfathered for graph writes before ${CANONICAL_SAVE_CUTOFF}`,
        [`last_save_at=${graph.derived.last_save_at}`],
      );
      break;
    }
    emit(
      'fail',
      `save_lineage is required for graph writes on or after ${CANONICAL_SAVE_CUTOFF}`,
      [`last_save_at=${graph.derived.last_save_at}`],
      'Re-run the canonical save path or graph refresh with a valid saveLineage value so graph-metadata.json records the write lineage.',
    );
    break;
  }
  case 'CANONICAL_SAVE_PACKET_IDENTITY_NORMALIZED': {
    const continuityPointer = readContinuityPacketPointer(folder);
    const descriptionSpecFolder = normalizePacketId(description?.specFolder);
    const graphSpecFolder = normalizePacketId(graph?.spec_folder);
    const identities = [continuityPointer, descriptionSpecFolder, graphSpecFolder].filter(Boolean);
    if (identities.length < 2) {
      emit('pass', 'Canonical-save packet-identity check not applicable to this folder');
      break;
    }
    const uniqueIdentities = [...new Set(identities)];
    if (uniqueIdentities.length === 1) {
      emit('pass', 'Packet identity is normalized across continuity, description, and graph surfaces');
      break;
    }
    emit(
      'pass',
      'Packet identity normalization drift detected (soft detector)',
      uniqueIdentities.map((value) => `identity=${value}`),
    );
    break;
  }
  case 'CANONICAL_SAVE_DESCRIPTION_GRAPH_FRESHNESS': {
    const descriptionTimestamp = description?.lastUpdated;
    const graphTimestamp = graph?.derived?.last_save_at;
    if (typeof descriptionTimestamp !== 'string' || typeof graphTimestamp !== 'string') {
      emit('pass', 'Canonical-save freshness-skew check not applicable to this folder');
      break;
    }
    const deltaMs = Date.parse(descriptionTimestamp) - Date.parse(graphTimestamp);
    if (Number.isNaN(deltaMs) || deltaMs <= CANONICAL_SAVE_FRESHNESS_SLACK_MS) {
      emit('pass', 'Description and graph freshness stay within the canonical-save slack window');
      break;
    }
    emit(
      'pass',
      'Description and graph freshness skew detected (soft detector)',
      [
        `description.lastUpdated=${descriptionTimestamp}`,
        `graph.derived.last_save_at=${graphTimestamp}`,
        `deltaMs=${deltaMs}`,
      ],
    );
    break;
  }
  default:
    emit('fail', `Unsupported canonical-save rule: ${selectedRule}`);
}
