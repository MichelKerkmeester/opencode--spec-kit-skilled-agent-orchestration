import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  auditHistoricalMemoryFile,
  buildHistoricalMemoryAuditManifest,
  repairHistoricalMemoryContent,
  runHistoricalMemoryRemediation,
} from '../memory/historical-memory-remediation';
import { validateMemoryTemplateContract } from '../../shared/parsing/memory-template-contract';

const ROOT = '/repo/.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion';

function buildPath(specFolder: string, filename: string): string {
  return path.join(ROOT, specFolder, 'memory', filename);
}

const tempDirs: string[] = [];

afterEach(() => {
  while (tempDirs.length > 0) {
    const dir = tempDirs.pop();
    if (dir) {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  }
});

describe('historical memory remediation audit', () => {
  it('classifies legacy generic frontmatter as repair_in_place and repairs it mechanically', () => {
    const filePath = buildPath('013-outsourced-agent-memory', 'memory.md');
    const content = [
      '---',
      'title: "Analyzed loadCollectedData in data-loader.ts"',
      'description: "Session context memory template for Spec Kit indexing."',
      'trigger_phrases:',
      '  - "memory dashboard"',
      '  - "session summary"',
      '  - "context template"',
      'importance_tier: "normal"',
      'contextType: "implementation"',
      '---',
      '',
      '# Analyzed loadCollectedData in data-loader.ts',
      '',
      '**Summary:** Verified the data loader keeps explicit JSON authoritative while native capture remains fallback-only.',
      '',
      '## SESSION SUMMARY',
      '',
      '| **Meta Data** | **Value** |',
      '|:--------------|:----------|',
      '| Total Messages | 5 |',
      '| Tool Executions | 3 |',
      '| Decisions Made | 1 |',
      '',
      'Body content stays intact.',
      '',
      '# Trigger Phrases (auto-extracted for fast <50ms matching)',
      'trigger_phrases:',
      '  - "memory dashboard"',
      '  - "session summary"',
      '  - "context template"',
    ].join('\n');

    const audit = auditHistoricalMemoryFile(filePath, ROOT, content);
    const repaired = repairHistoricalMemoryContent(filePath, ROOT, content);

    expect(audit.classification).toBe('repair_in_place');
    expect(audit.issues).toContain('legacy_generic_trigger_phrases');
    expect(audit.issues).toContain('generic_description');
    expect(repaired).not.toContain('memory dashboard');
    expect(repaired).not.toContain('session summary');
    expect(repaired).not.toContain('context template');
    expect(repaired).not.toContain('Session context memory template for Spec Kit indexing.');
    expect(repaired).toContain('Body content stays intact.');
    expect(repaired).toMatch(/trigger_phrases:\n  - "/);
    expect(repaired.match(/# Trigger Phrases \(auto-extracted for fast <50ms matching\)/g)?.length ?? 0).toBe(1);
  });

  it('repairs memories that still contain a single legacy placeholder trigger phrase', () => {
    const filePath = buildPath('001-hybrid-rag-fusion-epic', 'partial-generic-trigger.md');
    const content = [
      '---',
      'title: "Indexed direct-save closure"',
      'description: "Specific preserved session context."',
      'trigger_phrases:',
      '  - "indexed direct save"',
      '  - "session summary"',
      'importance_tier: "important"',
      'contextType: "implementation"',
      '---',
      '',
      '# Indexed direct-save closure',
      '',
      '**Summary:** Confirmed the direct-save path indexed cleanly after the remediation pass.',
      '',
      '## SESSION SUMMARY',
      '',
      '| **Meta Data** | **Value** |',
      '|:--------------|:----------|',
      '| Total Messages | 4 |',
      '| Tool Executions | 2 |',
      '| Decisions Made | 1 |',
    ].join('\n');

    const audit = auditHistoricalMemoryFile(filePath, ROOT, content);
    const repaired = repairHistoricalMemoryContent(filePath, ROOT, content);

    expect(audit.classification).toBe('repair_in_place');
    expect(audit.issues).toContain('legacy_generic_trigger_phrases');
    expect(repaired).not.toContain('"session summary"');
  });

  it('repairs trigger sections even when legacy memories use variant heading levels or spacing', () => {
    const filePath = buildPath('001-hybrid-rag-fusion-epic', 'variant-trigger-section.md');
    const content = [
      '---',
      'title: "Variant trigger section"',
      'description: "Session context memory template for Spec Kit indexing."',
      'trigger_phrases:',
      '  - "memory dashboard"',
      '  - "session summary"',
      '  - "context template"',
      'importance_tier: "important"',
      'contextType: "implementation"',
      '---',
      '',
      '# Variant trigger section',
      '',
      '**Summary:** Preserved a useful historical memory with a non-canonical trigger heading.',
      '',
      '### Trigger Phrases (legacy export)',
      '',
      'trigger_phrases:',
      '  - "memory dashboard"',
      '  - "session summary"',
      '  - "context template"',
      '',
      'Body content stays intact.',
    ].join('\n');

    const audit = auditHistoricalMemoryFile(filePath, ROOT, content);
    const repaired = repairHistoricalMemoryContent(filePath, ROOT, content);

    expect(audit.classification).toBe('repair_in_place');
    expect(audit.issues).toContain('legacy_generic_trigger_phrases');
    expect(repaired).toContain('### Trigger Phrases (auto-extracted for fast <50ms matching)');
    expect(repaired).not.toContain('memory dashboard');
    expect(repaired).not.toContain('session summary');
    expect(repaired).not.toContain('context template');
  });

  it('repairs legacy template banners and duplicate top-of-body separators in place', () => {
    const filePath = buildPath('010-perfect-session-capturing', 'legacy-banner.md');
    const content = [
      '---',
      'title: "Phase 13 indexed direct save"',
      'description: "Specific preserved session context."',
      'trigger_phrases:',
      '  - "indexed direct save"',
      'importance_tier: "critical"',
      'contextType: "implementation"',
      '---',
      '<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->',
      '<!-- Constitutional Tier Promotion:',
      '  To promote a memory to constitutional tier, use memory_update.',
      '-->',
      '',
      '---',
      '',
      '# Phase 13 indexed direct save',
      '',
      '**Summary:** Confirmed the direct save path indexed cleanly after gating fixes.',
    ].join('\n');

    const audit = auditHistoricalMemoryFile(filePath, ROOT, content);
    const repaired = repairHistoricalMemoryContent(filePath, ROOT, content);

    expect(audit.classification).toBe('repair_in_place');
    expect(audit.issues).toContain('legacy_template_banner');
    expect(repaired).not.toContain('<!-- TEMPLATE:');
    expect(repaired).not.toContain('Constitutional Tier Promotion');
    expect(repaired).toContain('# Phase 13 indexed direct save');
  });

  it('repairs missing standard anchor comments and html ids for canonical memory sections', () => {
    const filePath = buildPath('014-hydra-db-based-features/002-versioned-memory-state', 'phase-2-verification.md');
    const content = [
      '---',
      'title: "2026-03-13 verification"',
      'description: "2026-03-13 verification pass confirmed Phase 2 versioned memory state is implemented with lineage writes, active projection, asOf semantics, backfill, and rollback evidence."',
      'trigger_phrases:',
      '  - "as of"',
      'importance_tier: "normal"',
      'contextType: "general"',
      '---',
      '',
      '# 2026-03-13 verification pass confirmed Phase 2 versioned memory state is implemented with lineage...',
      '',
      '## SESSION SUMMARY',
      '',
      '| **Meta Data** | **Value** |',
      '|:--------------|:----------|',
      '| Session Date | 2026-03-13 |',
      '',
      '---',
      '',
      '---',
      '',
      '## CONTINUE SESSION',
      '',
      '**Quick resume context for session continuation and handover.**',
      '',
      '---',
      '',
      '## PROJECT STATE SNAPSHOT',
      '',
      '| Field | Value |',
      '|-------|-------|',
      '| Phase | RESEARCH |',
      '',
      '---',
      '',
      '## MEMORY METADATA',
      '',
      '```yaml',
      'session_id: "abc"',
      '```',
    ].join('\n');

    const audit = auditHistoricalMemoryFile(filePath, ROOT, content);
    const repaired = repairHistoricalMemoryContent(filePath, ROOT, content);

    expect(audit.classification).toBe('repair_in_place');
    expect(audit.issues).toContain('duplicate_body_separator');
    expect(audit.issues).toContain('missing_standard_anchor_scaffolding');
    expect(repaired).toContain('<!-- ANCHOR:continue-session -->');
    expect(repaired).toContain('<a id="continue-session"></a>');
    expect(repaired).toContain('<!-- ANCHOR:project-state-snapshot -->');
    expect(repaired).toContain('<a id="project-state-snapshot"></a>');
    expect(repaired).toContain('<!-- ANCHOR:metadata -->');
    expect(repaired).toContain('<a id="memory-metadata"></a>');
    expect(repaired.match(/<!-- ANCHOR:metadata -->/g)?.length ?? 0).toBe(1);
    expect(repaired).toContain('<!-- /ANCHOR:metadata -->');
    expect(repaired.match(/<!-- \/ANCHOR:metadata -->/g)?.length ?? 0).toBe(1);
    expect(repaired).not.toContain('\n---\n\n---\n');
  });

  it('classifies raw mustache leakage as regenerate_from_authoritative_evidence when the memory is otherwise substantive', () => {
    const filePath = buildPath('010-perfect-session-capturing', 'mustache.md');
    const content = [
      '---',
      'title: "Detailed direct-mode regression investigation"',
      'description: "Captured a substantive debugging session for trigger rendering."',
      'trigger_phrases:',
      '  - "trigger rendering"',
      'importance_tier: "important"',
      'contextType: "implementation"',
      '---',
      '',
      '# Detailed direct-mode regression investigation',
      '',
      '**Summary:** Verified the rendered output leaked {{#TRIGGER_PHRASES}} tags into frontmatter during a real save attempt.',
      '',
      '## SESSION SUMMARY',
      '',
      '| **Meta Data** | **Value** |',
      '|:--------------|:----------|',
      '| Total Messages | 8 |',
      '| Tool Executions | 6 |',
      '| Decisions Made | 2 |',
      '',
      'This memory has enough durable context to preserve, but not enough structural trust to repair mechanically.',
    ].join('\n');

    const audit = auditHistoricalMemoryFile(filePath, ROOT, content);

    expect(audit.classification).toBe('regenerate_from_authoritative_evidence');
    expect(audit.repairStrategy).toBe('pipeline_regeneration');
    expect(audit.indexAction).toBe('regenerate_then_reindex');
    expect(audit.issues).toContain('raw_mustache_literal');
  });

  it('quarantines regenerate_from_authoritative_evidence files during apply so they leave active memory paths', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'historical-remediation-'));
    tempDirs.push(tempRoot);

    const specFolder = path.join(tempRoot, '010-perfect-session-capturing');
    const memoryDir = path.join(specFolder, 'memory');
    const reportDir = path.join(tempRoot, 'reports');
    const filename = 'regenerate-me.md';
    const filePath = path.join(memoryDir, filename);

    fs.mkdirSync(memoryDir, { recursive: true });
    fs.writeFileSync(filePath, [
      '---',
      'title: "Regenerate me"',
      'description: "Specific context for a render regression."',
      'trigger_phrases:',
      '  - "render regression"',
      'importance_tier: "important"',
      'contextType: "implementation"',
      '---',
      '',
      '# Regenerate me',
      '',
      '**Summary:** The body leaked {{TRIGGER_PHRASES}} into a substantive memory.',
      '',
      '## SESSION SUMMARY',
      '',
      '| **Meta Data** | **Value** |',
      '|:--------------|:----------|',
      '| Total Messages | 4 |',
      '| Tool Executions | 2 |',
      '| Decisions Made | 1 |',
    ].join('\n'));

    const manifest = runHistoricalMemoryRemediation({
      root: tempRoot,
      reportDir,
      apply: true,
    });

    expect(manifest.summary.regenerate_from_authoritative_evidence).toBe(1);
    expect(fs.existsSync(filePath)).toBe(false);
    expect(fs.existsSync(path.join(specFolder, 'scratch', 'legacy-memory-quarantine', filename))).toBe(true);

    const postApplyManifest = runHistoricalMemoryRemediation({
      root: tempRoot,
      reportDir,
      apply: false,
    });
    expect(postApplyManifest.summary.total).toBe(0);
  });

  it('leaves repaired files validator-clean after apply', () => {
    const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'historical-remediation-'));
    tempDirs.push(tempRoot);

    const specFolder = path.join(tempRoot, '013-outsourced-agent-memory');
    const memoryDir = path.join(specFolder, 'memory');
    const reportDir = path.join(tempRoot, 'reports');
    const filename = 'repair-me.md';
    const filePath = path.join(memoryDir, filename);

    fs.mkdirSync(memoryDir, { recursive: true });
    fs.writeFileSync(filePath, [
      '---',
      'title: "Repair me"',
      'description: "Session context memory template for Spec Kit indexing."',
      'trigger_phrases:',
      '  - "memory dashboard"',
      '  - "session summary"',
      '  - "context template"',
      'importance_tier: "normal"',
      'contextType: "implementation"',
      '---',
      '',
      '# Repair me',
      '',
      '**Summary:** Preserved a specific loader analysis with durable content.',
      '',
      '## SESSION SUMMARY',
      '',
      '| **Meta Data** | **Value** |',
      '|:--------------|:----------|',
      '| Total Messages | 3 |',
      '| Tool Executions | 2 |',
      '| Decisions Made | 1 |',
      '',
      '## CONTINUE SESSION',
      '',
      'Continue the historical repair test.',
      '',
      '## PROJECT STATE SNAPSHOT',
      '',
      'Historical repair state.',
      '',
      '## 2. DECISIONS',
      '',
      'Repair in place should keep durable memories active.',
      '',
      '## 3. CONVERSATION',
      '',
      'Repairable historical memory content.',
      '',
      '## RECOVERY HINTS',
      '',
      'No recovery work required.',
      '',
      '## MEMORY METADATA',
      '',
      '```yaml',
      'session_id: "repair-me"',
      '```',
    ].join('\n'));

    runHistoricalMemoryRemediation({
      root: tempRoot,
      reportDir,
      apply: true,
    });

    const repaired = fs.readFileSync(filePath, 'utf-8');
    expect(validateMemoryTemplateContract(repaired).valid).toBe(true);

    const postApplyManifest = runHistoricalMemoryRemediation({
      root: tempRoot,
      reportDir,
      apply: false,
    });
    expect(postApplyManifest.summary.clean).toBe(1);
    expect(postApplyManifest.summary.repair_in_place).toBe(0);
  });

  it('quarantines low-signal memories instead of repairing them in place', () => {
    const filePath = buildPath('015-skill-alignment', 'manual-context-save.md');
    const content = [
      '---',
      'title: "manual context save"',
      'description: "Session context memory template for Spec Kit indexing."',
      'trigger_phrases:',
      '  - "memory dashboard"',
      '  - "session summary"',
      '  - "context template"',
      'importance_tier: "normal"',
      'contextType: "general"',
      '---',
      '',
      '# manual context save',
      '',
      '**Summary:** Session focused on implementing and testing features.',
      '',
      '## SESSION SUMMARY',
      '',
      '| **Meta Data** | **Value** |',
      '|:--------------|:----------|',
      '| Total Messages | 1 |',
      '| Tool Executions | 0 |',
      '| Decisions Made | 0 |',
    ].join('\n');

    const audit = auditHistoricalMemoryFile(filePath, ROOT, content);

    expect(audit.classification).toBe('quarantine');
    expect(audit.repairStrategy).toBe('quarantine_move');
    expect(audit.indexAction).toBe('deindex');
    expect(audit.quarantinePath).toContain('/scratch/legacy-memory-quarantine/');
  });

  it('builds a manifest that tracks regenerate candidates separately from repair and quarantine', () => {
    const cleanFile = auditHistoricalMemoryFile(
      buildPath('001-hybrid-rag-fusion-epic', 'clean.md'),
      ROOT,
      [
        '---',
        'title: "Clean historical memory"',
        'description: "Specific preserved session context."',
        'trigger_phrases:',
        '  - "clean historical memory"',
        'importance_tier: "normal"',
        'contextType: "implementation"',
        '---',
        '',
        '# Clean historical memory',
        '',
        '**Summary:** Preserved a specific and already compliant memory.',
        '',
        '## SESSION SUMMARY',
        '',
        '| **Meta Data** | **Value** |',
        '|:--------------|:----------|',
        '| Total Messages | 3 |',
        '| Tool Executions | 1 |',
        '| Decisions Made | 1 |',
        '',
        '<!-- ANCHOR:continue-session -->',
        '<a id="continue-session"></a>',
        '',
        '## CONTINUE SESSION',
        '',
        'Continue from the last clean checkpoint.',
        '',
        '<!-- ANCHOR:project-state-snapshot -->',
        '<a id="project-state-snapshot"></a>',
        '',
        '## PROJECT STATE SNAPSHOT',
        '',
        'Historical clean memory fixture.',
        '',
        '<!-- ANCHOR:decisions -->',
        '<a id="decisions"></a>',
        '',
        '## 2. DECISIONS',
        '',
        'This fixture should remain classified as clean.',
        '',
        '<!-- ANCHOR:session-history -->',
        '<a id="conversation"></a>',
        '',
        '## 3. CONVERSATION',
        '',
        'Captured a compliant historical memory body.',
        '',
        '<!-- ANCHOR:recovery-hints -->',
        '<a id="recovery-hints"></a>',
        '',
        '## RECOVERY HINTS',
        '',
        'No repair required.',
        '',
        '<!-- ANCHOR:metadata -->',
        '<a id="memory-metadata"></a>',
        '',
        '## MEMORY METADATA',
        '',
        '```yaml',
        'session_id: "clean-memory"',
        '```',
        '',
        '<!-- /ANCHOR:metadata -->',
      ].join('\n')
    );
    const repairFile = auditHistoricalMemoryFile(
      buildPath('013-outsourced-agent-memory', 'repair.md'),
      ROOT,
      [
        '---',
        'title: "Repair me"',
        'description: "Session context memory template for Spec Kit indexing."',
        'trigger_phrases:',
        '  - "memory dashboard"',
        '  - "session summary"',
        '  - "context template"',
        'importance_tier: "normal"',
        'contextType: "implementation"',
        '---',
        '',
        '# Repair me',
        '',
        '**Summary:** Preserved a specific loader analysis with durable content.',
        '',
        '## SESSION SUMMARY',
        '',
        '| **Meta Data** | **Value** |',
        '|:--------------|:----------|',
        '| Total Messages | 3 |',
        '| Tool Executions | 2 |',
        '| Decisions Made | 1 |',
      ].join('\n')
    );
    const regenerateFile = auditHistoricalMemoryFile(
      buildPath('010-perfect-session-capturing', 'regenerate.md'),
      ROOT,
      [
        '---',
        'title: "Regenerate me"',
        'description: "Specific context for a render regression."',
        'trigger_phrases:',
        '  - "render regression"',
        'importance_tier: "important"',
        'contextType: "implementation"',
        '---',
        '',
        '# Regenerate me',
        '',
        '**Summary:** The body leaked {{TRIGGER_PHRASES}} into a substantive memory.',
        '',
        '## SESSION SUMMARY',
        '',
        '| **Meta Data** | **Value** |',
        '|:--------------|:----------|',
        '| Total Messages | 4 |',
        '| Tool Executions | 2 |',
        '| Decisions Made | 1 |',
      ].join('\n')
    );
    const quarantineFile = auditHistoricalMemoryFile(
      buildPath('015-skill-alignment', 'quarantine.md'),
      ROOT,
      [
        '---',
        'title: "quarantine me"',
        'description: "Session context memory template for Spec Kit indexing."',
        'trigger_phrases:',
        '  - "memory dashboard"',
        '  - "session summary"',
        '  - "context template"',
        'importance_tier: "normal"',
        'contextType: "general"',
        '---',
        '',
        '# quarantine me',
        '',
        '**Summary:** Session focused on implementing and testing features.',
        '',
        '## SESSION SUMMARY',
        '',
        '| **Meta Data** | **Value** |',
        '|:--------------|:----------|',
        '| Total Messages | 1 |',
        '| Tool Executions | 0 |',
        '| Decisions Made | 0 |',
      ].join('\n')
    );

    const manifest = buildHistoricalMemoryAuditManifest(ROOT, [
      cleanFile,
      repairFile,
      regenerateFile,
      quarantineFile,
    ]);

    expect(manifest.summary).toEqual({
      total: 4,
      clean: 1,
      repair_in_place: 1,
      regenerate_from_authoritative_evidence: 1,
      quarantine: 1,
    });
    expect(manifest.bySpecFolder['010-perfect-session-capturing']?.regenerate_from_authoritative_evidence).toBe(1);
    expect(manifest.bySpecFolder['015-skill-alignment']?.quarantine).toBe(1);
  });
});
