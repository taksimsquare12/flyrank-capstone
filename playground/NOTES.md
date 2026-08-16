# NOTES.md — Accessibility Audit & shadcn/ui Comparison

## Overview
This document compares custom hand-written ARIA components (`playground/src/components`) against Radix UI-backed `shadcn/ui` primitives.

---

## Key Gaps Identified in Custom Implementations

### 1. Portal Rendering & Stacking Context
- **Custom Version:** The custom Modal component renders directly inside the parent React DOM hierarchy (`<div className="fixed ...">`). If a parent element has `overflow: hidden`, `z-index` stacking constraints, or CSS transform properties, the modal background overlay clips or breaks positioning.
- **shadcn/ui (`Radix Dialog`):** Uses `@radix-ui/react-portal` to detach the modal container and append it directly to `document.body`. This guarantees top-layer rendering regardless of parent DOM constraints.

### 2. Scroll Locking & Background Interaction
- **Custom Version:** When our custom modal opens, the background page (`body`) remains scrollable via mouse wheel or touchpad.
- **shadcn/ui:** Automatically applies `pointer-events: none` and `overflow: hidden` with padding compensation to `document.body`, preventing background scroll jumping and outside interaction completely.

### 3. Screen Reader Live Regions & Focus Restoration Edge Cases
- **Custom Version:** Relies on manual `useRef` to store `previousFocusRef`. If the trigger button is unmounted from the DOM while the modal is open, restoring focus throws a console warning or fails silently.
- **shadcn/ui:** Implements `FocusScope` primitives with explicit focus trap guards and fallback focus targets if trigger elements disappear during lifecycle changes.

---

## Keyboard Verification Checklist

| Component | Key Command | Expected ARIA Behavior | Status |
|---|---|---|---|
| **Modal** | `Tab` / `Shift+Tab` | Focus traps inside dialog container | **PASS** |
| **Modal** | `Escape` | Dismisses modal & restores focus to trigger | **PASS** |
| **Tabs** | `ArrowRight` / `ArrowLeft` | Navigates between tab controls | **PASS** |
| **Tabs** | `Home` / `End` | Moves focus to first/last tab | **PASS** |
| **Disclosure** | `Enter` / `Space` | Toggles disclosure region state | **PASS** |