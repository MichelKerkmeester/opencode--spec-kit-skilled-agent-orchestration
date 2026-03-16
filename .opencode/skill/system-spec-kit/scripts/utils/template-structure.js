'use strict';

const fs = require('fs');
const path = require('path');

const OPTIONAL_TEMPLATE_PREFIX_RE = /^L(?:2|3\+?)\s*:/i;
const NUMBERED_HEADER_RE = /^\d+\.\s*/;
const PLACEHOLDER_RE = /\[[^\]]+\]/g;
const H2_RE = /^##\s+(.+)$/gm;
const ANCHOR_OPEN_RE = /<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/g;
const ANCHOR_CLOSE_LINE_RE = /<!--\s*\/ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/;
const DYNAMIC_DECISION_RECORD_RE = /^(?:ADR|DR)-\d+\s*:/i;

const TEMPLATE_PATHS = {
  '1': {
    'spec.md': 'level_1/spec.md',
    'plan.md': 'level_1/plan.md',
    'tasks.md': 'level_1/tasks.md',
    'implementation-summary.md': 'level_1/implementation-summary.md',
  },
  '2': {
    'spec.md': 'level_2/spec.md',
    'plan.md': 'level_2/plan.md',
    'tasks.md': 'level_2/tasks.md',
    'checklist.md': 'level_2/checklist.md',
    'implementation-summary.md': 'level_2/implementation-summary.md',
  },
  '3': {
    'spec.md': 'level_3/spec.md',
    'plan.md': 'level_3/plan.md',
    'tasks.md': 'level_3/tasks.md',
    'checklist.md': 'level_3/checklist.md',
    'decision-record.md': 'level_3/decision-record.md',
    'implementation-summary.md': 'level_3/implementation-summary.md',
  },
  '3+': {
    'spec.md': 'level_3+/spec.md',
    'plan.md': 'level_3+/plan.md',
    'tasks.md': 'level_3+/tasks.md',
    'checklist.md': 'level_3+/checklist.md',
    'decision-record.md': 'level_3+/decision-record.md',
    'implementation-summary.md': 'level_3+/implementation-summary.md',
  },
};

function normalizeLevel(level) {
  const raw = String(level || '').trim();
  if (raw === '3+') return '3+';

  const numeric = parseInt(raw, 10);
  if (Number.isNaN(numeric) || numeric <= 1) return '1';
  if (numeric === 2) return '2';
  return '3';
}

function normalizeHeaderText(header) {
  return String(header || '')
    .replace(PLACEHOLDER_RE, '')
    .replace(NUMBERED_HEADER_RE, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase();
}

function isOptionalTemplateHeader(rawHeader) {
  return OPTIONAL_TEMPLATE_PREFIX_RE.test(String(rawHeader || '').trim());
}

function getTemplatesRoot() {
  return path.resolve(__dirname, '..', '..', 'templates');
}

function resolveTemplatePath(level, basename, templatesRoot = getTemplatesRoot()) {
  const normalizedLevel = normalizeLevel(level);
  const levelMap = TEMPLATE_PATHS[normalizedLevel] || TEMPLATE_PATHS['1'];
  const relativeTemplatePath = levelMap[basename];

  if (!relativeTemplatePath) {
    return null;
  }

  return path.join(templatesRoot, relativeTemplatePath);
}

function extractH2Headers(content) {
  H2_RE.lastIndex = 0;
  const headers = [];
  let match;

  while ((match = H2_RE.exec(content)) !== null) {
    headers.push({
      raw: match[1].trim(),
      normalized: normalizeHeaderText(match[1]),
      index: match.index,
    });
  }

  return headers;
}

function parseAnchoredSections(content) {
  const lines = content.split(/\r?\n/);
  const sections = [];

  for (let index = 0; index < lines.length; index += 1) {
    const openMatch = lines[index].match(/<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/);
    if (!openMatch) {
      continue;
    }

    const id = openMatch[1];
    let endIndex = -1;

    for (let inner = index + 1; inner < lines.length; inner += 1) {
      const closeMatch = lines[inner].match(ANCHOR_CLOSE_LINE_RE);
      if (closeMatch && closeMatch[1] === id) {
        endIndex = inner;
        break;
      }
    }

    if (endIndex === -1) {
      continue;
    }

    sections.push({
      id,
      content: lines.slice(index, endIndex + 1).join('\n'),
      startLine: index + 1,
      endLine: endIndex + 1,
    });
    index = endIndex;
  }

  return sections;
}

function buildDecisionRecordContract(templatePath) {
  return {
    supported: true,
    templatePath,
    basename: 'decision-record.md',
    headerRules: [
      {
        raw: 'ADR/DR decision header',
        normalized: 'DECISION_RECORD_ENTRY',
        dynamic: true,
        pattern: DYNAMIC_DECISION_RECORD_RE.source,
      },
    ],
    optionalHeaderRules: [],
    requiredAnchors: [],
    optionalAnchors: [],
    allowedAnchors: ['adr-001', 'adr-001-context', 'adr-001-decision', 'adr-001-alternatives', 'adr-001-consequences', 'adr-001-five-checks', 'adr-001-impl'],
  };
}

function loadTemplateContract(level, basename, templatesRoot = getTemplatesRoot()) {
  const templatePath = resolveTemplatePath(level, basename, templatesRoot);
  if (!templatePath || !fs.existsSync(templatePath)) {
    return {
      supported: false,
      basename,
      templatePath,
      reason: 'template_not_found',
      headerRules: [],
      requiredAnchors: [],
    };
  }

  if (basename === 'decision-record.md') {
    return buildDecisionRecordContract(templatePath);
  }

  const templateContent = fs.readFileSync(templatePath, 'utf8');
  const headerRules = extractH2Headers(templateContent).map((header) => ({
    raw: header.raw,
    normalized: header.normalized,
    dynamic: false,
  }));
  const requiredHeaders = headerRules.filter((header) => !isOptionalTemplateHeader(header.raw));
  const optionalHeaders = headerRules.filter((header) => isOptionalTemplateHeader(header.raw));

  const requiredHeaderNames = new Set(requiredHeaders.map((header) => header.normalized));
  const optionalHeaderNames = new Set(optionalHeaders.map((header) => header.normalized));
  const requiredAnchors = [];
  const optionalAnchors = [];
  const seenAnchors = new Set();
  const allowedAnchors = [];
  const seenAllowedAnchors = new Set();

  let anchorMatch;
  while ((anchorMatch = ANCHOR_OPEN_RE.exec(templateContent)) !== null) {
    const anchorId = anchorMatch[1];
    if (!seenAllowedAnchors.has(anchorId)) {
      seenAllowedAnchors.add(anchorId);
      allowedAnchors.push(anchorId);
    }
  }
  ANCHOR_OPEN_RE.lastIndex = 0;

  for (const section of parseAnchoredSections(templateContent)) {
    const sectionHeaders = extractH2Headers(section.content).map((header) => header.normalized);
    const hasRequiredHeader = sectionHeaders.some((header) => requiredHeaderNames.has(header));
    const hasOptionalHeader = sectionHeaders.some((header) => optionalHeaderNames.has(header));

    if ((!hasRequiredHeader && !hasOptionalHeader) || seenAnchors.has(section.id)) {
      continue;
    }

    seenAnchors.add(section.id);
    if (hasRequiredHeader) {
      requiredAnchors.push(section.id);
    } else {
      optionalAnchors.push(section.id);
    }
  }

  return {
    supported: true,
    basename,
    templatePath,
    headerRules: requiredHeaders,
    optionalHeaderRules: optionalHeaders,
    requiredAnchors,
    optionalAnchors,
    allowedAnchors,
  };
}

function loadDocumentStructure(content) {
  ANCHOR_OPEN_RE.lastIndex = 0;
  const headers = extractH2Headers(content);
  const anchors = [];
  let match;

  while ((match = ANCHOR_OPEN_RE.exec(content)) !== null) {
    anchors.push({
      raw: match[1],
      normalized: match[1],
      index: match.index,
    });
  }

  return { headers, anchors };
}

function matchHeaderRule(actualHeader, headerRule) {
  if (headerRule.dynamic) {
    return new RegExp(headerRule.pattern, 'i').test(actualHeader.raw);
  }

  return actualHeader.normalized === headerRule.normalized;
}

function compareRequiredSequence(requiredRules, actualEntries, matcher) {
  const missing = [];
  const outOfOrder = [];
  const matchedIndexes = new Set();
  let currentIndex = 0;

  for (const requiredRule of requiredRules) {
    let foundIndex = -1;

    for (let index = currentIndex; index < actualEntries.length; index += 1) {
      if (matcher(actualEntries[index], requiredRule)) {
        foundIndex = index;
        break;
      }
    }

    if (foundIndex !== -1) {
      matchedIndexes.add(foundIndex);
      currentIndex = foundIndex + 1;
      continue;
    }

    const anyIndex = actualEntries.findIndex((entry) => matcher(entry, requiredRule));
    if (anyIndex !== -1) {
      matchedIndexes.add(anyIndex);
      outOfOrder.push(requiredRule.raw);
      continue;
    }

    missing.push(requiredRule.raw);
  }

  const extras = actualEntries
    .filter((_entry, index) => !matchedIndexes.has(index))
    .map((entry) => entry.raw);

  return { missing, outOfOrder, extras };
}

function compareDocumentToTemplate(level, basename, documentPath, templatesRoot = getTemplatesRoot()) {
  const contract = loadTemplateContract(level, basename, templatesRoot);
  if (!contract.supported) {
    return {
      supported: false,
      basename,
      contract,
      headers: { missing: [], outOfOrder: [], extras: [] },
      anchors: { missing: [], outOfOrder: [], extras: [] },
    };
  }

  if (!fs.existsSync(documentPath)) {
    return { supported: false, reason: 'Document file not found: ' + documentPath };
  }

  const documentContent = fs.readFileSync(documentPath, 'utf8');
  const actual = loadDocumentStructure(documentContent);
  const headers = compareRequiredSequence(
    contract.headerRules,
    actual.headers,
    matchHeaderRule
  );
  if (contract.optionalHeaderRules.length > 0) {
    headers.extras = headers.extras.filter(
      (extraHeader) =>
        !contract.optionalHeaderRules.some((headerRule) =>
          matchHeaderRule({ raw: extraHeader, normalized: normalizeHeaderText(extraHeader) }, headerRule)
        )
    );
  }
  const anchors = compareRequiredSequence(
    contract.requiredAnchors.map((anchorId) => ({ raw: anchorId, normalized: anchorId })),
    actual.anchors,
    (actualAnchor, requiredAnchor) => actualAnchor.normalized === requiredAnchor.normalized
  );
  if ((contract.allowedAnchors || []).length > 0) {
    const allowedAnchors = new Set(contract.allowedAnchors);
    anchors.extras = anchors.extras.filter((anchorId) => !allowedAnchors.has(anchorId));
  }

  return {
    supported: true,
    basename,
    contract,
    headers,
    anchors,
  };
}

function printCompareResult(result, scope) {
  console.log(`supported\t${result.supported ? 'true' : 'false'}`);
  if (!result.supported) {
    if (result.contract && result.contract.reason) {
      console.log(`reason\t${result.contract.reason}`);
    }
    return;
  }

  console.log(`template_path\t${result.contract.templatePath}`);

  if (scope === 'headers' || scope === 'all') {
    result.contract.headerRules.forEach((headerRule) => {
      console.log(`required_header\t${headerRule.raw}`);
    });
    (result.contract.optionalHeaderRules || []).forEach((headerRule) => {
      console.log(`optional_header\t${headerRule.raw}`);
    });
    result.headers.missing.forEach((header) => console.log(`missing_header\t${header}`));
    result.headers.outOfOrder.forEach((header) => console.log(`out_of_order_header\t${header}`));
    result.headers.extras.forEach((header) => console.log(`extra_header\t${header}`));
  }

  if (scope === 'anchors' || scope === 'all') {
    result.contract.requiredAnchors.forEach((anchorId) => console.log(`required_anchor\t${anchorId}`));
    (result.contract.optionalAnchors || []).forEach((anchorId) => console.log(`optional_anchor\t${anchorId}`));
    (result.contract.allowedAnchors || []).forEach((anchorId) => console.log(`allowed_anchor\t${anchorId}`));
    result.anchors.missing.forEach((anchorId) => console.log(`missing_anchor\t${anchorId}`));
    result.anchors.outOfOrder.forEach((anchorId) => console.log(`out_of_order_anchor\t${anchorId}`));
    result.anchors.extras.forEach((anchorId) => console.log(`extra_anchor\t${anchorId}`));
  }
}

function runCli(argv) {
  const [command, level, basename, documentPath, scope = 'all'] = argv;

  if (command === 'contract') {
    const contract = loadTemplateContract(level, basename);
    console.log(JSON.stringify(contract, null, 2));
    return 0;
  }

  if (command === 'compare') {
    if (!documentPath) {
      console.error('Usage: template-structure.js compare <level> <basename> <documentPath> [headers|anchors|all]');
      return 2;
    }

    const result = compareDocumentToTemplate(level, basename, documentPath);
    printCompareResult(result, scope);
    return 0;
  }

  console.error('Usage: template-structure.js <contract|compare> ...');
  return 2;
}

if (require.main === module) {
  process.exitCode = runCli(process.argv.slice(2));
}

module.exports = {
  compareDocumentToTemplate,
  extractH2Headers,
  loadDocumentStructure,
  loadTemplateContract,
  normalizeHeaderText,
  normalizeLevel,
  parseAnchoredSections,
  resolveTemplatePath,
};
