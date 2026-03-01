## User Profile

**Role**: Designer - emphasize visual hierarchy, typography, spacing, and brand consistency

# Design Context

## Aesthetic & Philosophy
**Dark Brutalist Technical Documentation** - High contrast, monospace-accented typography, industrial grid-based layout with glassmorphic card elements. Minimalist interface with maximum information density. Terminal/CLI aesthetic with live system status indicators. Intentional use of negative space balanced with dense content blocks.

## Color Palette
- **Background**: `#131314` (--bg) - Deep charcoal, almost black
- **Surface**: `#1c1c1e` (--surface) - Slightly elevated cards/containers
- **Text/Foreground**: `#fafafa` (--text) - Off-white for readability
- **Primary Accent**: `#3b82f6` (--accent) - Blue, used for active states, links, highlights
- **Muted/Secondary**: `#71717a` (--muted) - Gray for labels, disabled states
- **Border**: `#27272a` (--border) - Subtle dividers and card edges
- **Green**: `#22c55e` - System active indicator (pulsing)

## Typography
- **Sans Serif (Display/UI)**: `Inter` (weights: 300, 400, 500, 600, 700, 800, 900)
  - H1: 7rem-9rem, font-black, tracking-tighter, leading-none
  - H2: Text-[10px], uppercase, tracking-[0.3em], font-black
  - Body: text-lg, leading-relaxed
  - Small text: text-[10px], text-[11px], text-[9px], mono for technical content
- **Monospace (Code)**: `JetBrains Mono` (weights: 400, 700)
  - Code blocks: text-accent with bg-black/40
  - Terminal-style: p-3 rounded containers
  - Status bar: mono font-bold uppercase tracking-widest

## Spacing & Layout
- **Grid**: 260px sidebar + 1fr main content gap-4rem on desktop
- **Section spacing**: space-y-48 between major sections, space-y-12 within sections
- **Card padding**: p-4 to p-8 depending on content density
- **Border radius**: 4px to 8px (sharp, not rounded)
- **Mobile**: Single column, sidebar hidden

## Interactive Elements & Animations
- **Reveal animation**: opacity 0→1, translateY(20px)→(0), 0.6s cubic-bezier(0.22, 1, 0.36, 1)
- **Visualization bars**: width transition 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)
- **Hover states**: border-color transition 0.3s, hover:border-accent on cards
- **Active navigation**: .active class with blue dot indicator and text-accent color
- **Scroll**: smooth scroll behavior, sticky navigation top-24
- **Scanline effect**: Fixed animated line moving top to bottom 10s loop at low opacity

## Reusable Components

### Terminal Header (Status Bar)
```html
<div class="terminal-header sticky top-0 px-6 py-3 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted mono">
    <div class="flex items-center gap-6">
        <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span class="text-text">System Active</span>
        </div>
        <div class="hidden md:block">Region: MASTER-INTEL-99</div>
        <div class="hidden md:block">Latency: 14ms</div>
    </div>
    <div class="flex items-center gap-6">
        <div id="clock">00:00:00 UTC</div>
        <div class="text-accent">Auth: Verified // Project Root</div>
    </div>
</div>
```

### Glass Card
```html
<div class="glass-card p-6 space-y-4">
    <p class="text-xs font-bold text-muted uppercase tracking-widest">Card Title</p>
    <!-- Content -->
</div>

<style>
.glass-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    transition: border-color 0.3s ease;
}
.glass-card:hover { 
    border-color: var(--accent); 
}
</style>
```

### Navigation Link (TOC)
```html
<a href="#section-id" class="toc-link active">01 Section Name</a>

<style>
.toc-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--muted);
    padding: 0.4rem 0;
    transition: all 0.2s ease;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.toc-link:hover { color: var(--text); }
.toc-link.active { color: var(--accent); }
.toc-link.active::before {
    content: '';
    width: 4px;
    height: 4px;
    background: var(--accent);
    border-radius: 50%;
}
</style>
```

### Flow Step / Feature Box
```html
<div class="flow-step group hover:border-accent">
    <span class="text-[9px] font-black text-muted uppercase mb-4 block">Stage Label</span>
    <h4 class="font-bold text-sm mb-2">Title</h4>
    <p class="text-[10px] text-muted">Description text.</p>
</div>

<style>
.flow-step {
    position: relative;
    padding: 1.5rem;
    border: 1px solid var(--border);
    background: rgba(255,255,255,0.01);
    border-radius: 4px;
}
</style>
```

### Visualization Bar
```html
<div class="space-y-2">
    <div class="flex justify-between text-[10px] mono uppercase">
        <span>Label</span>
        <span>85%</span>
    </div>
    <div class="viz-bar"><div class="viz-fill" data-width="85%"></div></div>
</div>

<style>
.viz-bar {
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
    margin-top: 0.5rem;
}
.viz-fill {
    height: 100%;
    background: var(--accent);
    width: 0;
    transition: width 1.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}
</style>
```

### Code Block
```html
<code class="block text-accent bg-black/40 p-3 rounded">
git clone https://github.com/repo.git
</code>
```

### Ledger Divider Line
```html
<div class="ledger-line"></div>

<style>
.ledger-line {
    height: 1px;
    background: linear-gradient(90deg, var(--border) 0%, transparent 100%);
    margin: 2rem 0;
}
</style>
```

### Highlight Grid
```html
<div class="highlight-grid">
    <div class="p-5 border border-border rounded-lg bg-surface/30">
        <p class="text-xs font-bold text-accent mb-3 uppercase tracking-tighter">Highlight Title</p>
        <p class="text-[11px] text-muted leading-relaxed">Description content.</p>
    </div>
</div>

<style>
.highlight-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}
</style>
```

## CSS Custom Properties
```css
:root {
    --bg: #131314;
    --surface: #1c1c1e;
    --text: #fafafa;
    --accent: #3b82f6;
    --muted: #71717a;
    --border: #27272a;
}
```

## Key Features
- Sidebar TOC with active section tracking via IntersectionObserver
- Reveal animations on scroll with threshold 0.1
- Live clock showing UTC time (updates every 1 second)
- Visualization bars animate on scroll with spring easing
- Mobile-responsive (sidebar hidden on <1024px)
- Custom scrollbar styled to match theme
- Sticky navigation and header
- Terminal-style status bar with system indicators
- Scanline animation effect for aesthetic depth
- Max-width container (90rem) for readability

## JavaScript Functionality
- Auto-updating UTC clock in header
- IntersectionObserver for section reveal animations
- Navigation link highlighting based on current scroll position
- Visualization bar width animation on scroll
- Toast notification for clipboard copy (if needed)

## Project Integration
This design serves as the **technical documentation ledger** for the OpenCode system. It showcases:
- Complete system architecture overview
- Memory engine cognitive features
- Agent network coordination
- Command-driven workflows
- Gate system and validation
- Skills library auto-detection
- FAQ and institutional knowledge
- Resource links and changelogs

All sections are designed for high scannability while maintaining visual hierarchy and brutalist aesthetic consistency.