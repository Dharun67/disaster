# GeoGuard - Professional UI Design Guide

## 🎨 Visual Design System

### Color Palette

#### Primary Colors
- **Blue**: `#3b82f6` - Primary actions, information
- **Cyan**: `#06b6d4` - Highlights, accents
- **Red**: `#ef4444` - Emergency, critical alerts
- **Green**: `#10b981` - Success, low risk
- **Orange**: `#f97316` - Warning, high risk
- **Purple**: `#a855f7` - Admin, special features

#### Background Colors
- **Slate-950**: `#030712` - Darkest background
- **Slate-900**: `#0f172a` - Dark background
- **Slate-800**: `#1e293b` - Card background
- **Slate-700**: `#334155` - Borders, dividers

### Typography

#### Headings
- **H1**: 28-32px, Bold, Gradient text
- **H2**: 20-24px, Bold, Gradient text
- **H3**: 16-20px, Bold, Solid color
- **H4**: 14-16px, Semibold, Solid color

#### Body Text
- **Regular**: 14-16px, Regular weight
- **Small**: 12-14px, Regular weight
- **Tiny**: 10-12px, Regular weight

### Spacing Scale
```
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

### Border Radius
- **Small**: 6px (inputs, small elements)
- **Medium**: 8px (cards, buttons)
- **Large**: 12px (panels, containers)
- **XL**: 16px (major sections)

### Shadows
```
sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
md: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1)
xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1)
2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

## 🎯 Component Styles

### Navigation Bar
- Background: `bg-slate-900/80 backdrop-blur-md`
- Border: `border-b border-slate-700/50`
- Logo: Gradient text with icon
- Buttons: Slate or gradient backgrounds

### Cards
- Background: `bg-gradient-to-br from-slate-800 to-slate-900`
- Border: `border border-slate-700`
- Padding: `p-6`
- Hover: `hover:border-slate-600 hover:shadow-xl`

### Buttons
- Primary: `bg-gradient-to-r from-blue-600 to-cyan-600`
- Danger: `bg-gradient-to-r from-red-600 to-red-700`
- Success: `bg-gradient-to-r from-green-600 to-green-700`
- Hover: Darker gradient
- Disabled: Gray gradient

### Forms
- Input: `bg-slate-800 border border-slate-700 rounded-lg`
- Focus: `focus:border-red-500 focus:ring-1 focus:ring-red-500`
- Label: `text-sm font-semibold text-gray-300`

### Badges
- Status: `px-2 py-1 rounded bg-*-900/50 text-*-300 text-xs font-semibold`
- Colors: Green (available), Red (active), Amber (warning)

### Progress Bars
- Background: `bg-slate-600 rounded-full`
- Fill: Gradient color based on status
- Animation: Smooth width transition

## 🎬 Animation Patterns

### Page Load
```javascript
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.6 }}
```

### Hover Effects
```javascript
whileHover={{ y: -5, scale: 1.02 }}
transition={{ duration: 0.3 }}
```

### List Items
```javascript
initial={{ opacity: 0, x: -20 }}
animate={{ opacity: 1, x: 0 }}
transition={{ delay: idx * 0.05 }}
```

### Progress Animation
```javascript
initial={{ width: 0 }}
animate={{ width: `${percent}%` }}
transition={{ duration: 0.8 }}
```

## 📐 Layout Patterns

### Hero Section
- Max width: 1280px (7xl)
- Padding: 24px (6)
- Vertical spacing: 32px (8)
- Text centered

### Dashboard Grid
- 1 column on mobile
- 2 columns on tablet
- 3-4 columns on desktop
- Gap: 24px (6)

### Card Grid
- 1 column on mobile
- 2 columns on tablet
- 4 columns on desktop
- Gap: 16px (4)

### Sidebar Layout
- Main content: 75% width
- Sidebar: 25% width
- Sticky sidebar on desktop
- Full width on mobile

## 🎨 Gradient Combinations

### Risk Levels
- **Low**: `from-green-900 to-green-800`
- **Moderate**: `from-amber-900 to-amber-800`
- **High**: `from-orange-900 to-orange-800`
- **Critical**: `from-red-900 to-red-800`

### Feature Cards
- **Map**: `from-blue-600 to-blue-700`
- **SOS**: `from-red-600 to-red-700`
- **Shelter**: `from-green-600 to-green-700`
- **Admin**: `from-purple-600 to-purple-700`

## 🎯 Interaction States

### Buttons
- **Default**: Base gradient
- **Hover**: Darker gradient + shadow
- **Active**: Darker gradient + ring
- **Disabled**: Gray gradient + opacity

### Cards
- **Default**: Subtle border
- **Hover**: Brighter border + shadow
- **Active**: Colored border + glow

### Inputs
- **Default**: Slate border
- **Focus**: Colored border + ring
- **Error**: Red border + ring
- **Disabled**: Gray background

## 📱 Responsive Behavior

### Mobile (< 768px)
- Single column layouts
- Full-width cards
- Larger touch targets (44px minimum)
- Simplified navigation

### Tablet (768px - 1024px)
- 2 column layouts
- Balanced spacing
- Medium touch targets

### Desktop (> 1024px)
- 3-4 column layouts
- Optimal spacing
- Sidebar layouts
- Multi-panel views

## ✨ Accessibility Features

- **Color Contrast**: WCAG AA compliant
- **Focus States**: Visible keyboard navigation
- **Semantic HTML**: Proper heading hierarchy
- **ARIA Labels**: For screen readers
- **Touch Targets**: Minimum 44x44px
- **Text Sizing**: Readable on all devices

## 🎨 Design Tokens

```javascript
const colors = {
  primary: '#3b82f6',
  secondary: '#06b6d4',
  danger: '#ef4444',
  success: '#10b981',
  warning: '#f97316',
  dark: '#030712',
  light: '#f8fafc'
};

const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px'
};

const borderRadius = {
  sm: '6px',
  md: '8px',
  lg: '12px',
  xl: '16px'
};
```

## 🚀 Performance Tips

1. Use CSS gradients instead of images
2. Optimize animations with GPU acceleration
3. Lazy load images and components
4. Use CSS variables for theming
5. Minimize re-renders with React.memo
6. Use Framer Motion for smooth animations

---

**GeoGuard** - Professional Disaster Intelligence Platform
