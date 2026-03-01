// ═══════════════════════════════════════════════════════════════
// TOC SCROLL DIAGNOSTIC SCRIPT
// Paste this in browser console to debug scroll behavior
// ═══════════════════════════════════════════════════════════════

console.log('🔍 TOC Scroll Diagnostics Starting...\n');

// 1. Find all ToC sections
const sections = document.querySelectorAll('[data-toc-section]');
console.log(`📍 Found ${sections.length} elements with [data-toc-section]`);

sections.forEach((section, index) => {
  const computed = window.getComputedStyle(section);
  const scrollMargin = computed.scrollMarginTop;
  console.log(`\n  Section ${index + 1}:`);
  console.log(`    ID: ${section.id || 'NO ID!'}`);
  console.log(`    Tag: ${section.tagName}`);
  console.log(`    scroll-margin-top: ${scrollMargin}`);
  console.log(`    Element:`, section);
});

// 2. Find all ToC links
const links = document.querySelectorAll('[data-toc-link]');
console.log(`\n\n🔗 Found ${links.length} ToC links`);

links.forEach((link, index) => {
  const href = link.getAttribute('href') || link.querySelector('a[href^="#"]')?.getAttribute('href');
  const targetId = href?.substring(1);
  const target = targetId ? document.getElementById(targetId) : null;
  
  console.log(`\n  Link ${index + 1}:`);
  console.log(`    Text: ${link.textContent.trim().substring(0, 50)}`);
  console.log(`    href: ${href || 'NO HREF!'}`);
  console.log(`    Target exists: ${!!target}`);
  if (target) {
    console.log(`    Target tag: ${target.tagName}`);
    console.log(`    Target has [data-toc-section]: ${target.hasAttribute('data-toc-section')}`);
    const computed = window.getComputedStyle(target);
    console.log(`    Target scroll-margin-top: ${computed.scrollMarginTop}`);
  }
});

// 3. Check CSS file loading
const stylesheets = Array.from(document.styleSheets);
console.log(`\n\n📄 Loaded stylesheets:`);
stylesheets.forEach(sheet => {
  try {
    const href = sheet.href || 'inline';
    console.log(`  - ${href}`);
  } catch (e) {
    console.log(`  - (CORS blocked)`);
  }
});

// 4. Test scroll behavior on click
console.log(`\n\n🎯 Adding click listener to "Art. 7 Montage" link for testing...`);
links.forEach(link => {
  const text = link.textContent.trim();
  if (text.includes('Art. 7') || text.includes('Montage')) {
    link.addEventListener('click', (e) => {
      console.log('\n🖱️  CLICK DETECTED on:', text);
      const href = link.getAttribute('href') || link.querySelector('a[href^="#"]')?.getAttribute('href');
      const targetId = href?.substring(1);
      const target = document.getElementById(targetId);
      
      console.log('  Target ID:', targetId);
      console.log('  Target element:', target);
      console.log('  Target position:', target?.getBoundingClientRect());
      
      setTimeout(() => {
        console.log('  After scroll position:', target?.getBoundingClientRect());
        console.log('  Window scrollY:', window.scrollY);
      }, 500);
    }, true);
    console.log(`✅ Listener added to: ${text}`);
  }
});

console.log('\n\n✅ Diagnostics complete. Click "Art. 7 Montage" to see scroll behavior.');
