#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Phase Command Workflow Tests                                  ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Verify /spec_kit:phase and --phase-folder command contracts.   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..', '..', '..');
const COMMAND_ROOT = path.join(REPO_ROOT, '.opencode', 'command', 'spec_kit');
const ASSETS_ROOT = path.join(COMMAND_ROOT, 'assets');

let passed = 0;
let failed = 0;

function pass(message) {
  passed += 1;
  console.log(`PASS: ${message}`);
}

function fail(message) {
  failed += 1;
  console.log(`FAIL: ${message}`);
}

function assertTrue(condition, message) {
  if (condition) {
    pass(message);
  } else {
    fail(message);
  }
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

function testPhaseCommandContracts() {
  const phaseDoc = path.join(COMMAND_ROOT, 'phase.md');
  const phaseAutoYaml = path.join(ASSETS_ROOT, 'spec_kit_phase_auto.yaml');
  const phaseConfirmYaml = path.join(ASSETS_ROOT, 'spec_kit_phase_confirm.yaml');

  assertTrue(exists(phaseDoc), '/spec_kit:phase doc exists');
  assertTrue(exists(phaseAutoYaml), '/spec_kit:phase auto workflow asset exists');
  assertTrue(exists(phaseConfirmYaml), '/spec_kit:phase confirm workflow asset exists');

  const phaseText = readFile(phaseDoc);
  assertTrue(
    phaseText.includes('spec_kit_phase_auto.yaml') && phaseText.includes('spec_kit_phase_confirm.yaml'),
    '/spec_kit:phase doc routes to auto + confirm YAML assets'
  );
  assertTrue(
    phaseText.includes('argument-hint: "[feature-description] [--phases N] [--phase-names list] [--parent specs/NNN-name/] [:auto|:confirm]"'),
    '/spec_kit:phase argument-hint includes auto/confirm and phase flags'
  );
}

function testPhaseFolderContracts() {
  const commandDocs = [
    { name: 'plan', file: 'plan.md' },
    { name: 'deep-research', file: 'deep-research.md' },
    { name: 'implement', file: 'implement.md' },
    { name: 'complete', file: 'complete.md' },
    { name: 'resume', file: 'resume.md' },
  ];

  for (const doc of commandDocs) {
    const filePath = path.join(COMMAND_ROOT, doc.file);
    assertTrue(exists(filePath), `/spec_kit:${doc.name} doc exists`);

    const text = readFile(filePath);
    const hasPhaseFolderContract = doc.name === 'deep-research'
      ? text.includes('Phase folder') || text.includes('phase child')
      : text.includes('--phase-folder=<path>') || text.includes('--phase-folder=<path> provided');

    assertTrue(
      hasPhaseFolderContract,
      `/spec_kit:${doc.name} documents --phase-folder contract`
    );

    assertTrue(
      text.includes('Option E') || text.includes('phase child') || text.includes('Phase folder'),
      `/spec_kit:${doc.name} includes Option E/phase-child behavior`
    );
  }
}

function testAssetPhaseFolderNotes() {
  const yamlAssets = [
    'spec_kit_plan_auto.yaml',
    'spec_kit_plan_confirm.yaml',
    'spec_kit_implement_auto.yaml',
    'spec_kit_implement_confirm.yaml',
    'spec_kit_complete_auto.yaml',
    'spec_kit_complete_confirm.yaml',
    'spec_kit_resume_auto.yaml',
    'spec_kit_resume_confirm.yaml',
  ];

  for (const yaml of yamlAssets) {
    const filePath = path.join(ASSETS_ROOT, yaml);
    assertTrue(exists(filePath), `${yaml} exists`);
    const text = readFile(filePath);

    const hasPhaseFolderContract =
      text.includes('--phase-folder') ||
      text.includes('phase-folder') ||
      text.includes('phase child') ||
      text.includes('Option E');

    assertTrue(
      hasPhaseFolderContract,
      `${yaml} includes phase-folder/phase-child contract`
    );
  }
}

function testTemplateCompliancePromptContracts() {
  const planImplementCompleteAssets = [
    'spec_kit_plan_auto.yaml',
    'spec_kit_plan_confirm.yaml',
    'spec_kit_implement_auto.yaml',
    'spec_kit_implement_confirm.yaml',
    'spec_kit_complete_auto.yaml',
    'spec_kit_complete_confirm.yaml',
  ];

  for (const yaml of planImplementCompleteAssets) {
    const filePath = path.join(ASSETS_ROOT, yaml);
    assertTrue(exists(filePath), `${yaml} exists for template compliance checks`);

    const text = readFile(filePath);
    assertTrue(
      text.includes('template_compliance:') && text.includes('inline_scaffolds:'),
      `${yaml} embeds inline template scaffold guidance`
    );
    assertTrue(
      text.includes('validate.sh [SPEC_FOLDER] --strict'),
      `${yaml} requires strict validation after spec-doc writes`
    );
    assertTrue(
      text.includes('template_prompt_contract:') || text.includes('summary_document:'),
      `${yaml} ties authoring steps back to the inline scaffold contract`
    );
  }

  const agentDocs = [
    path.join(REPO_ROOT, '.agents', 'agents', 'speckit.md'),
    path.join(REPO_ROOT, '.opencode', 'agent', 'speckit.md'),
    path.join(REPO_ROOT, '.claude', 'agents', 'speckit.md'),
    path.join(REPO_ROOT, '.gemini', 'agents', 'speckit.md'),
  ];

  for (const agentDoc of agentDocs) {
    assertTrue(exists(agentDoc), `${path.relative(REPO_ROOT, agentDoc)} exists`);
    const text = readFile(agentDoc);
    assertTrue(
      text.includes('Inline Scaffold Contract'),
      `${path.relative(REPO_ROOT, agentDoc)} documents inline scaffold usage`
    );
    assertTrue(
      text.includes('validate.sh [SPEC_FOLDER] --strict'),
      `${path.relative(REPO_ROOT, agentDoc)} requires strict post-write validation`
    );
  }
}

function main() {
  testPhaseCommandContracts();
  testPhaseFolderContracts();
  testAssetPhaseFolderNotes();
  testTemplateCompliancePromptContracts();

  console.log(`\nResult: passed=${passed} failed=${failed}`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
