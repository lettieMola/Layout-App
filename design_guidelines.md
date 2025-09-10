# Mobile Collage Creator App Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from **Instagram** and **Canva** for their mobile-first design patterns, intuitive gesture controls, and creative tool interfaces. This approach prioritizes visual appeal and seamless mobile interaction for a creative application.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Light Mode: 280 15% 25% (Deep purple-gray for toolbars)
- Dark Mode: 280 20% 12% (Rich dark background)

**Accent Colors:**
- Creative Blue: 210 85% 55% (For primary actions)
- Success Green: 145 70% 45% (For downloads/saves)

**Background Colors:**
- Light: 0 0% 98% (Clean canvas background)
- Dark: 220 15% 8% (True dark for canvas work)

### B. Typography
**Font Family:** Inter (Google Fonts)
- Headers: 600 weight, 18-24px
- Body text: 400 weight, 14-16px
- Tool labels: 500 weight, 12-14px

### C. Layout System
**Tailwind Spacing Units:** Consistent use of 2, 4, 6, and 8 units
- Touch targets: min-h-12 (48px minimum)
- Tool spacing: p-4, gap-4
- Section spacing: p-6, mb-8
- Icon sizes: w-6 h-6 for tools, w-8 h-8 for primary actions

### D. Component Library

**Navigation:**
- Bottom toolbar with 5 primary tools (layouts, filters, AI, mirror, download)
- Top toolbar for undo/redo and settings
- Floating action button for image picker

**Canvas Area:**
- Full-screen canvas with gesture support
- Grid overlay for precise positioning
- Smooth zoom and pan interactions

**Tool Panels:**
- Slide-up drawers from bottom
- Horizontal scrolling tool carousels
- Quick preview thumbnails for filters/layouts

**Forms & Controls:**
- Large touch-friendly sliders
- Toggle switches for on/off features
- Gesture-based controls (pinch, swipe, tap)

### E. Mobile-Specific Features

**Touch Interactions:**
- Pinch-to-zoom on canvas
- Drag-and-drop for image positioning
- Swipe gestures for tool switching
- Long-press for context menus

**Progressive Web App:**
- Splash screen with app branding
- Offline capability indicators
- Native-feeling navigation
- Install prompts for home screen

**Camera Integration:**
- Direct camera capture button
- Gallery picker with preview
- Permission handling UI

## Key Design Principles

1. **Touch-First Design**: All interactive elements sized for finger navigation
2. **Gesture-Driven**: Leverage natural mobile gestures for creative tools
3. **Visual Feedback**: Clear states for loading, processing, and completion
4. **Performance Focus**: Smooth 60fps interactions during editing
5. **Creative Flow**: Minimal UI chrome to maximize canvas space

## Critical Constraints
- Maximum 3 levels of navigation depth
- All tools accessible within 2 taps
- No hover states - design for touch only
- Maintain consistent visual hierarchy across all screens
- Ensure accessibility for various screen sizes (320px to 768px width)