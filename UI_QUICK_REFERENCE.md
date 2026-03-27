# GeoGuard UI - Quick Reference Guide

## 🚀 Quick Start

### 1. Import Theme CSS
```javascript
import '../theme.css';
```

### 2. Use Professional Components
```html
<!-- Page Header -->
<div class="page-header">
  <h1 class="page-title">Page Title</h1>
  <p class="page-subtitle">Subtitle text</p>
</div>

<!-- Main Container -->
<div class="main-container">
  <!-- Your content here -->
</div>
```

---

## 📦 Common Components

### Stat Cards (4 columns)
```html
<div class="grid-4">
  <div class="stat-card">
    <div class="stat-label">Label</div>
    <div class="stat-number">42</div>
  </div>
  <div class="stat-card success">
    <div class="stat-label">Success</div>
    <div class="stat-number">8</div>
  </div>
  <div class="stat-card warning">
    <div class="stat-label">Warning</div>
    <div class="stat-number">65%</div>
  </div>
  <div class="stat-card danger">
    <div class="stat-label">Danger</div>
    <div class="stat-number">3</div>
  </div>
</div>
```

### Card Grid (3 columns)
```html
<div class="grid-3">
  <div class="card cursor-pointer">
    <h3 class="card-title">Title</h3>
    <p class="card-subtitle">Subtitle</p>
    <p class="text-sm text-muted">Content</p>
  </div>
</div>
```

### Buttons
```html
<button class="btn btn-primary">Primary</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-block">Full Width</button>
```

### Alerts
```html
<div class="alert alert-info">ℹ️ Info message</div>
<div class="alert alert-success">✓ Success message</div>
<div class="alert alert-warning">⚠️ Warning message</div>
<div class="alert alert-danger">✕ Error message</div>
```

### Badges
```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
```

### Forms
```html
<div class="form-group">
  <label class="form-label">Label</label>
  <input type="text" class="form-control" placeholder="Placeholder" />
</div>

<div class="form-group">
  <label class="form-label">Message</label>
  <textarea class="form-control" placeholder="Enter message..."></textarea>
</div>
```

### Tables
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

---

## 🎨 Utility Classes

### Flexbox
```html
<div class="flex">Flex container</div>
<div class="flex-center">Centered</div>
<div class="flex-between">Space between</div>
<div class="flex-col">Column</div>
```

### Spacing
```html
<!-- Gaps -->
<div class="gap-1">8px gap</div>
<div class="gap-2">16px gap</div>
<div class="gap-3">24px gap</div>
<div class="gap-4">32px gap</div>

<!-- Margins -->
<div class="mt-1">Margin top</div>
<div class="mb-2">Margin bottom</div>

<!-- Padding -->
<div class="p-1">Padding</div>
```

### Text
```html
<p class="text-sm">Small (13px)</p>
<p class="text-base">Base (14px)</p>
<p class="text-lg">Large (16px)</p>
<p class="text-xl">Extra large (18px)</p>

<p class="font-bold">Bold</p>
<p class="font-semibold">Semibold</p>
<p class="font-medium">Medium</p>

<p class="text-muted">Muted</p>
<p class="text-primary">Primary</p>
<p class="text-danger">Danger</p>
<p class="text-success">Success</p>
<p class="text-warning">Warning</p>
```

### Alignment
```html
<div class="text-left">Left</div>
<div class="text-center">Center</div>
<div class="text-right">Right</div>
```

### Display
```html
<div class="hidden">Hidden</div>
<div class="block">Block</div>
<div class="inline">Inline</div>
<div class="inline-block">Inline-block</div>
```

### Opacity
```html
<div class="opacity-50">50% opacity</div>
<div class="opacity-75">75% opacity</div>
```

### Cursor
```html
<div class="cursor-pointer">Clickable</div>
<div class="cursor-default">Default</div>
```

---

## 🎬 Animations

### Apply Animations
```html
<div class="animate-fade">Fade in</div>
<div class="animate-slide">Slide in</div>
<div class="animate-pulse">Pulsing</div>
<div class="animate-glow">Glowing</div>
```

### Transitions
```html
<div class="transition">Default (0.3s)</div>
<div class="transition-fast">Fast (0.15s)</div>
<div class="transition-slow">Slow (0.5s)</div>
```

---

## 📐 Grid Layouts

### Auto-fit Grid (300px min)
```html
<div class="grid">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

### 2-Column Grid (400px min)
```html
<div class="grid-2">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
</div>
```

### 3-Column Grid (250px min)
```html
<div class="grid-3">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

### 4-Column Grid (200px min)
```html
<div class="grid-4">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
  <div class="card">Item 4</div>
</div>
```

---

## 🎯 Common Patterns

### Page with Header and Content
```javascript
import '../theme.css';

export default function MyPage() {
  return (
    <div className="main-container">
      <div className="page-header">
        <h1 className="page-title">Page Title</h1>
        <p className="page-subtitle">Subtitle</p>
      </div>

      {/* Content here */}
    </div>
  );
}
```

### Card with Details
```html
<div class="card">
  <h3 class="card-title">Title</h3>
  <div class="mb-3">
    <span class="badge badge-primary">Status</span>
  </div>
  <p class="text-sm text-muted">Description</p>
  <button class="btn btn-primary">Action</button>
</div>
```

### Modal Dialog
```html
<div class="modal-overlay" onclick="closeModal()">
  <div class="modal-content" onclick="event.stopPropagation()">
    <button class="btn btn-secondary" style="position: absolute; top: 15px; right: 15px;">✕</button>
    <h2 class="card-title mb-4">Modal Title</h2>
    <!-- Content -->
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%);
    border: 1px solid rgba(14, 165, 233, 0.2);
    border-radius: 12px;
    padding: 30px;
    max-width: 600px;
    width: 90%;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    position: relative;
  }
</style>
```

### Loading State
```html
<div class="flex-center" style="padding: 60px 20px;">
  <div class="spinner"></div>
</div>
```

### Error Alert
```html
<div class="alert alert-danger">
  ✕ Error message here
</div>
```

### Success Alert
```html
<div class="alert alert-success">
  ✓ Success message here
</div>
```

---

## 🎨 Color Reference

### Using Color Classes
```html
<!-- Text Colors -->
<p class="text-primary">Primary blue</p>
<p class="text-danger">Danger red</p>
<p class="text-success">Success green</p>
<p class="text-warning">Warning orange</p>
<p class="text-muted">Muted gray</p>

<!-- Badge Colors -->
<span class="badge badge-primary">Primary</span>
<span class="badge badge-danger">Danger</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>

<!-- Button Colors -->
<button class="btn btn-primary">Primary</button>
<button class="btn btn-danger">Danger</button>
<button class="btn btn-success">Success</button>
<button class="btn btn-warning">Warning</button>

<!-- Stat Card Colors -->
<div class="stat-card">Default</div>
<div class="stat-card success">Success</div>
<div class="stat-card warning">Warning</div>
<div class="stat-card danger">Danger</div>
```

---

## 📱 Responsive Tips

### Mobile-First Approach
```html
<!-- Default: Mobile (1 column) -->
<div class="grid-3">
  <!-- Automatically becomes 2 columns on tablet, 3 on desktop -->
</div>
```

### Hide on Mobile
```html
<div class="hidden">Hidden on mobile</div>
```

### Full Width on Mobile
```html
<button class="btn btn-block">Full width button</button>
```

---

## ⚡ Performance Tips

### Use CSS Classes (Not Inline Styles)
```html
<!-- Good -->
<div class="card">Content</div>

<!-- Avoid -->
<div style="background: linear-gradient(...); border: 1px solid ...;">Content</div>
```

### Lazy Load Images
```html
<img src="image.jpg" alt="Description" loading="lazy" />
```

### Use Semantic HTML
```html
<!-- Good -->
<button class="btn btn-primary">Submit</button>
<nav class="navbar">...</nav>

<!-- Avoid -->
<div onclick="submit()" class="btn">Submit</div>
```

---

## 🔍 Debugging

### Check CSS Variables
```javascript
// In browser console
getComputedStyle(document.documentElement).getPropertyValue('--primary')
```

### Inspect Element
- Right-click → Inspect
- Check applied classes
- Verify CSS variables

### Common Issues
- Missing `import '../theme.css'`
- Typo in class names
- Conflicting inline styles
- Missing parent container

---

## 📚 Full Documentation

For complete documentation, see:
- **`theme.css`** - All CSS variables and components
- **`PROFESSIONAL_UI_GUIDE.md`** - Comprehensive guide
- **`Dashboard.js`** - Example implementation
- **`ShelterLocator.js`** - Example implementation

---

## 🎓 Examples

### Complete Page Example
```javascript
import React, { useState, useEffect } from 'react';
import '../theme.css';

export default function ExamplePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load data
    setLoading(false);
  }, []);

  return (
    <div className="main-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Example Page</h1>
        <p className="page-subtitle">This is an example</p>
      </div>

      {/* Stats */}
      <div className="grid-4">
        <div className="stat-card">
          <div className="stat-label">Total</div>
          <div className="stat-number">100</div>
        </div>
      </div>

      {/* Content */}
      <div className="section">
        <h2 className="section-title">Content Section</h2>
        <div className="grid-3">
          {data.map(item => (
            <div key={item.id} className="card">
              <h3 className="card-title">{item.name}</h3>
              <p className="text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

---

## ✅ Checklist for New Pages

- [ ] Import `../theme.css`
- [ ] Use `main-container` wrapper
- [ ] Add `page-header` with title
- [ ] Use appropriate grid layout
- [ ] Apply professional components
- [ ] Test on mobile
- [ ] Check accessibility
- [ ] Verify animations work
- [ ] Test dark theme
- [ ] Check color contrast

---

**Version**: 3.0
**Last Updated**: 2024
**Status**: Production Ready
