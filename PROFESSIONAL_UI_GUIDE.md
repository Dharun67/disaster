# GeoGuard Professional UI Design System v3.0

## 🎨 Design Philosophy

The GeoGuard UI follows a **modern, professional enterprise design** with:
- Dark theme for reduced eye strain during emergency situations
- Gradient accents for visual hierarchy
- Consistent spacing and typography
- Accessibility-first approach
- Responsive mobile-first design

---

## 🎯 Color Palette

### Primary Colors
- **Primary Blue**: `#0ea5e9` - Main action color
- **Primary Dark**: `#0284c7` - Hover states
- **Primary Light**: `#38bdf8` - Highlights

### Secondary Colors
- **Cyan**: `#06b6d4` - Accent color
- **Cyan Dark**: `#0891b2` - Secondary hover

### Status Colors
- **Success Green**: `#10b981` - Positive actions, low risk
- **Warning Orange**: `#f59e0b` - Caution, moderate risk
- **Danger Red**: `#ef4444` - Critical, high risk
- **Info Blue**: `#3b82f6` - Information

### Neutral Colors
- **Dark**: `#0f172a` - Primary background
- **Darker**: `#020617` - Secondary background
- **Light**: `#f8fafc` - Light text
- **Border**: `#1e293b` - Borders
- **Text**: `#f1f5f9` - Primary text
- **Text Muted**: `#cbd5e1` - Secondary text

---

## 📐 Spacing System

```
--spacing-xs:   0.25rem (4px)
--spacing-sm:   0.5rem  (8px)
--spacing-md:   1rem    (16px)
--spacing-lg:   1.5rem  (24px)
--spacing-xl:   2rem    (32px)
--spacing-2xl:  3rem    (48px)
```

---

## 🔲 Border Radius

```
--radius-sm:  4px
--radius-md:  8px
--radius-lg:  12px
--radius-xl:  16px
```

---

## 📦 Component Library

### 1. Navigation Bar
```html
<nav class="navbar">
  <div class="navbar-container">
    <div class="navbar-logo">🌍 GeoGuard</div>
    <ul class="navbar-menu">
      <li><a href="/dashboard">📊 Dashboard</a></li>
      <li><a href="/routing">🗺️ Routing</a></li>
    </ul>
    <div class="navbar-right">
      <div class="navbar-user">👤 User</div>
      <div class="navbar-session">⏱️ 30d</div>
      <button class="navbar-logout">Logout</button>
    </div>
  </div>
</nav>
```

### 2. Stat Cards
```html
<div class="stat-card">
  <div class="stat-label">Active SOS Alerts</div>
  <div class="stat-number">12</div>
</div>

<div class="stat-card success">
  <div class="stat-label">Available Teams</div>
  <div class="stat-number">8</div>
</div>

<div class="stat-card warning">
  <div class="stat-label">Shelter Occupancy</div>
  <div class="stat-number">65%</div>
</div>

<div class="stat-card danger">
  <div class="stat-label">High Risk Zones</div>
  <div class="stat-number">3</div>
</div>
```

### 3. Cards
```html
<div class="card">
  <h3 class="card-title">Zone Name</h3>
  <p class="card-subtitle">Additional info</p>
  <div class="text-sm text-muted">Content here</div>
</div>
```

### 4. Buttons
```html
<!-- Primary Button -->
<button class="btn btn-primary">Action</button>

<!-- Danger Button -->
<button class="btn btn-danger">Delete</button>

<!-- Success Button -->
<button class="btn btn-success">Confirm</button>

<!-- Secondary Button -->
<button class="btn btn-secondary">Cancel</button>

<!-- Sizes -->
<button class="btn btn-sm">Small</button>
<button class="btn btn-lg">Large</button>

<!-- Block Button -->
<button class="btn btn-block">Full Width</button>
```

### 5. Forms
```html
<div class="form-group">
  <label class="form-label">Email Address</label>
  <input type="email" class="form-control" placeholder="your@email.com" />
</div>

<div class="form-group">
  <label class="form-label">Message</label>
  <textarea class="form-control" placeholder="Enter message..."></textarea>
</div>
```

### 6. Alerts
```html
<!-- Info Alert -->
<div class="alert alert-info">ℹ️ Information message</div>

<!-- Success Alert -->
<div class="alert alert-success">✓ Success message</div>

<!-- Warning Alert -->
<div class="alert alert-warning">⚠️ Warning message</div>

<!-- Danger Alert -->
<div class="alert alert-danger">✕ Error message</div>
```

### 7. Badges
```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
```

### 8. Tables
```html
<table class="table">
  <thead>
    <tr>
      <th>Column 1</th>
      <th>Column 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

### 9. Grids
```html
<!-- Auto-fit grid (300px min) -->
<div class="grid">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
</div>

<!-- 2-column grid (400px min) -->
<div class="grid-2">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
</div>

<!-- 3-column grid (250px min) -->
<div class="grid-3">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
</div>

<!-- 4-column grid (200px min) -->
<div class="grid-4">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
</div>
```

---

## 🎭 Typography

### Headings
```html
<h1>Main Title (2.5rem, 800 weight)</h1>
<h2>Section Title (2rem, 700 weight)</h2>
<h3>Subsection (1.5rem, 600 weight)</h3>
<h4>Minor Heading (1.25rem, 600 weight)</h4>
```

### Text Utilities
```html
<p class="text-sm">Small text (13px)</p>
<p class="text-base">Base text (14px)</p>
<p class="text-lg">Large text (16px)</p>
<p class="text-xl">Extra large (18px)</p>

<p class="font-bold">Bold text</p>
<p class="font-semibold">Semibold text</p>
<p class="font-medium">Medium text</p>

<p class="text-muted">Muted text</p>
<p class="text-primary">Primary color</p>
<p class="text-danger">Danger color</p>
<p class="text-success">Success color</p>
<p class="text-warning">Warning color</p>
```

---

## 🎬 Animations

### Available Animations
```css
/* Fade in animation */
.animate-fade { animation: fadeIn 0.3s ease-out; }

/* Slide in animation */
.animate-slide { animation: slideIn 0.3s ease-out; }

/* Pulse animation */
.animate-pulse { animation: pulse 2s infinite; }

/* Glow animation */
.animate-glow { animation: glow 2s infinite; }
```

### Transitions
```html
<!-- Default transition (0.3s) -->
<div class="transition">Hover me</div>

<!-- Fast transition (0.15s) -->
<div class="transition-fast">Quick transition</div>

<!-- Slow transition (0.5s) -->
<div class="transition-slow">Slow transition</div>
```

---

## 🎯 Utility Classes

### Flexbox
```html
<div class="flex">Flex container</div>
<div class="flex-center">Centered flex</div>
<div class="flex-between">Space between</div>
<div class="flex-col">Column direction</div>
```

### Gaps
```html
<div class="gap-1">Small gap (8px)</div>
<div class="gap-2">Medium gap (16px)</div>
<div class="gap-3">Large gap (24px)</div>
<div class="gap-4">Extra large gap (32px)</div>
```

### Margins
```html
<div class="mt-1">Margin top small</div>
<div class="mt-2">Margin top medium</div>
<div class="mt-3">Margin top large</div>
<div class="mt-4">Margin top extra large</div>

<div class="mb-1">Margin bottom small</div>
<div class="mb-2">Margin bottom medium</div>
<div class="mb-3">Margin bottom large</div>
<div class="mb-4">Margin bottom extra large</div>
```

### Padding
```html
<div class="p-1">Padding small (8px)</div>
<div class="p-2">Padding medium (16px)</div>
<div class="p-3">Padding large (24px)</div>
<div class="p-4">Padding extra large (32px)</div>
```

### Text Alignment
```html
<div class="text-left">Left aligned</div>
<div class="text-center">Center aligned</div>
<div class="text-right">Right aligned</div>
```

### Display
```html
<div class="hidden">Hidden element</div>
<div class="block">Block element</div>
<div class="inline">Inline element</div>
<div class="inline-block">Inline-block element</div>
```

### Opacity
```html
<div class="opacity-50">50% opacity</div>
<div class="opacity-75">75% opacity</div>
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
/* Default: Mobile (< 768px) */

/* Tablet (768px - 1024px) */
@media (max-width: 1024px) { }

/* Desktop (> 1024px) */
@media (min-width: 1024px) { }
```

### Grid Responsive Behavior
- **Mobile**: 1 column
- **Tablet**: 2 columns
- **Desktop**: 3-4 columns (auto-fit)

---

## ♿ Accessibility Features

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states are clearly visible with blue outline
- Tab order follows logical flow

### Color Contrast
- All text meets WCAG AA standards
- Color is not the only indicator of status
- Icons accompany color-coded information

### Reduced Motion
- Animations respect `prefers-reduced-motion` preference
- Critical animations are disabled for users who prefer reduced motion

### Screen Readers
- Semantic HTML structure
- ARIA labels where needed
- Descriptive button text

---

## 🚀 Best Practices

### 1. Use Semantic HTML
```html
<!-- Good -->
<button class="btn btn-primary">Submit</button>
<nav class="navbar">...</nav>
<section class="section">...</section>

<!-- Avoid -->
<div onclick="submit()" class="btn">Submit</div>
```

### 2. Consistent Spacing
```html
<!-- Good -->
<div class="card">
  <h3 class="card-title mb-3">Title</h3>
  <p class="text-muted mb-2">Description</p>
</div>

<!-- Avoid -->
<div class="card">
  <h3 style="margin-bottom: 20px;">Title</h3>
  <p style="margin-bottom: 5px;">Description</p>
</div>
```

### 3. Use CSS Classes Over Inline Styles
```html
<!-- Good -->
<div class="alert alert-danger">Error message</div>

<!-- Avoid -->
<div style="background: #fee; border: 1px solid #fcc; color: #c33;">Error</div>
```

### 4. Responsive Images
```html
<!-- Good -->
<img src="image.jpg" alt="Descriptive text" class="w-full" />

<!-- Avoid -->
<img src="image.jpg" width="500" height="300" />
```

### 5. Loading States
```html
<!-- Show spinner during loading -->
<div class="flex-center" style="padding: 60px 20px;">
  <div class="spinner"></div>
</div>
```

---

## 🔄 Migration Guide

### From Old Styles to Theme CSS

**Before:**
```html
<div style={{
  background: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
}}>
  Content
</div>
```

**After:**
```html
<div class="card">
  Content
</div>
```

### Import Theme CSS
```javascript
import '../theme.css';
```

### Use CSS Classes
```html
<!-- Buttons -->
<button class="btn btn-primary">Submit</button>

<!-- Cards -->
<div class="card">Content</div>

<!-- Grids -->
<div class="grid-3">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
</div>

<!-- Alerts -->
<div class="alert alert-danger">Error message</div>
```

---

## 📊 Component Examples

### Dashboard Header
```html
<div class="page-header">
  <h1 class="page-title">Flood Risk Dashboard</h1>
  <p class="page-subtitle">Real-time monitoring and predictions</p>
</div>
```

### Stat Cards Row
```html
<div class="grid-4">
  <div class="stat-card">
    <div class="stat-label">Active Alerts</div>
    <div class="stat-number">12</div>
  </div>
  <div class="stat-card success">
    <div class="stat-label">Available Teams</div>
    <div class="stat-number">8</div>
  </div>
  <div class="stat-card warning">
    <div class="stat-label">Occupancy</div>
    <div class="stat-number">65%</div>
  </div>
  <div class="stat-card danger">
    <div class="stat-label">High Risk</div>
    <div class="stat-number">3</div>
  </div>
</div>
```

### Card Grid
```html
<div class="grid-3">
  <div class="card cursor-pointer">
    <h3 class="card-title">Zone Name</h3>
    <div class="mb-2">
      <span class="badge badge-primary">Low Risk</span>
    </div>
    <p class="text-sm text-muted">📍 Location info</p>
  </div>
</div>
```

### Modal Dialog
```html
<div class="modal-overlay" onclick="closeModal()">
  <div class="modal-content" onclick="event.stopPropagation()">
    <button class="btn btn-secondary" style="position: absolute; top: 15px; right: 15px;">✕</button>
    <h2 class="card-title mb-4">Modal Title</h2>
    <div class="grid-2">
      <div>
        <div class="text-sm text-muted mb-1">Label</div>
        <div class="text-xl font-bold text-primary">Value</div>
      </div>
    </div>
  </div>
</div>
```

---

## 🎨 Customization

### Change Primary Color
Edit `theme.css`:
```css
:root {
  --primary: #0ea5e9;        /* Change this */
  --primary-dark: #0284c7;   /* And this */
  --primary-light: #38bdf8;  /* And this */
}
```

### Add Custom Component
```css
.custom-component {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.8) 100%);
  border: 1px solid rgba(14, 165, 233, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
}

.custom-component:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-lg);
}
```

---

## 📞 Support

For UI/UX questions or improvements:
1. Check this guide first
2. Review existing components in `theme.css`
3. Follow the established patterns
4. Test on mobile and desktop
5. Ensure accessibility compliance

---

**Last Updated**: 2024
**Version**: 3.0
**Status**: Production Ready
