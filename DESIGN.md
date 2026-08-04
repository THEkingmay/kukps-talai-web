---
name: KUKPS Talai Transit
description: Real-time tracked campus transit control room.
colors:
  primary: "#0ea5e9"
  neutral-bg: "#f9fafb"
  neutral-surface: "#ffffff"
  text-primary: "#1f2937"
  border-subtle: "#e5e7eb"
typography:
  display:
    fontFamily: "Public Sans, sans-serif"
  body:
    fontFamily: "Public Sans, sans-serif"
  label:
    fontFamily: "ui-monospace, monospace"
rounded:
  md: "0.375rem"
  lg: "0.5rem"
  full: "9999px"
spacing:
  sm: "0.5rem"
  md: "1.5rem"
  lg: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-surface}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  button-secondary:
    backgroundColor: "{colors.neutral-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
---

# Design System: KUKPS Talai Transit

## Overview

**Creative North Star: "Command Center Light"**

A daytime control room that balances data density with a clean, light, accessible minimal UI. It leverages sharp grid layouts, flat surfaces, and monospaced statistical blocks to evoke precision and operational efficiency. The environment is distinctly administrative, relying on subtle 1px dividers rather than heavy shadows to structure information.

**Key Characteristics:**
- Crisp grid structures and thin dividers
- Monospaced typography for data and status indicators
- Minimalist shadow usage (flat-by-default)
- Restrained color palette anchoring on stark white and cool grays, punctuated by an operational sky blue

## Colors

A precise, high-contrast operational palette.

### Primary
- **Operational Blue** (#0ea5e9): Used for primary actions, active indicators, and critical status markers.

### Neutral
- **Canvas Gray** (#f9fafb): The default background tone separating structured surfaces.
- **Surface White** (#ffffff): Active operational planes and cards.
- **Subtle Line** (#e5e7eb): 1px dividers that build the grid.
- **Data Ink** (#1f2937): High-contrast text for critical readability.

### Named Rules
**The Divider Grid Rule.** Structure is built via 1px border lines, not overlapping shadows.

## Typography

**Display Font:** Public Sans (with sans-serif)
**Body Font:** Public Sans (with sans-serif)
**Label/Mono Font:** ui-monospace (with standard monospace fallback)

**Character:** Highly legible, functional, and precise.

### Hierarchy
- **Display** (bold, up to 5xl): Hero statements.
- **Title** (semibold, lg/xl): Structural markers.
- **Body** (normal, base): Readable explanations.
- **Label** (medium, xs, uppercase, wide tracking): System statuses and metadata.

### Named Rules
**The Mono-Data Rule.** Any live statistic, coordinate, or system metric must be set in a monospaced font.

## Layout

A rigid, 12-column structural grid for desktop, stacking linearly on mobile. Sections are distinctly separated by structural borders. The layout is expansive and uses negative space to group data logically.

## Elevation & Depth

Tonal layering and flat architecture.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows (`shadow-sm`) appear only to lift discrete interactive controls (buttons) or distinct modal alerts above the operational plane.

## Shapes

Precise, mildly rounded geometry.
- Cards and containers: 8px radius (`rounded-lg`)
- Small controls (buttons, badges): 6px radius (`rounded-md`)
- Status dots: fully rounded (`rounded-full`)

## Components

### Buttons
- **Shape:** Softly squared (6px radius)
- **Primary:** Solid sky blue background, white text, 12px 24px padding.
- **Secondary:** White background, gray border, dark gray text.

### Cards / Containers
- **Corner Style:** 8px radius
- **Background:** White
- **Border:** 1px subtle gray
- **Shadow Strategy:** Flat at rest, occasional shadow-sm for emphasis.

### Badges
- **Style:** Small, pill-shaped (`rounded-full`), monospace uppercase text. Often uses a tinted background of the semantic color.

## Do's and Don'ts

### Do:
- **Do** use `font-mono` for all live tracking metrics and statuses.
- **Do** separate dense operational data blocks with 1px borders.

### Don't:
- **Don't** use heavy drop shadows on structural layout elements.
- **Don't** use the primary blue for large backgrounds; keep its role as an accent and action color.
