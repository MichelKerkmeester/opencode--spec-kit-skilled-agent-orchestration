const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const attribute_cleanup_path = path.resolve(
    __dirname,
    '../../../..',
    'src/2_javascript/global/attribute_cleanup.js'
  );

  const attribute_cleanup_source = fs.readFileSync(attribute_cleanup_path, 'utf8');

  const dom = new JSDOM(
    '<!doctype html><html><body>' +
      '<div id="" data-state="" data-social-share-success="" data-target=""></div>' +
      '</body></html>',
    {
      runScripts: 'dangerously',
      url: 'https://example.test',
    }
  );

  dom.window.eval(attribute_cleanup_source);

  dom.window.document.dispatchEvent(
    new dom.window.Event('DOMContentLoaded', { bubbles: true })
  );

  await new Promise((resolve) => setTimeout(resolve, 10));

  const el = dom.window.document.querySelector('div');
  assert(el, 'Expected test element to exist');

  assert(el.hasAttribute('data-state'), 'Expected empty data-state to be preserved');
  assert(
    el.getAttribute('data-state') === '',
    'Expected data-state value to remain empty string'
  );

  assert(
    el.hasAttribute('data-social-share-success'),
    'Expected empty data-social-share-success to be preserved'
  );
  assert(
    el.getAttribute('data-social-share-success') === '',
    'Expected data-social-share-success value to remain empty string'
  );

  assert(
    !el.hasAttribute('data-target'),
    'Expected empty data-target to be removed'
  );

  assert(!el.hasAttribute('id'), 'Expected empty id to be removed');

  console.log('PASS');
}

main().catch((err) => {
  console.error('FAIL');
  console.error(err && err.stack ? err.stack : err);
  process.exitCode = 1;
});
