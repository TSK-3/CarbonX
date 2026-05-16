---
name: Terra Firma
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#424844'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ed'
  outline: '#727973'
  outline-variant: '#c2c8c2'
  surface-tint: '#496455'
  primary: '#173124'
  on-primary: '#ffffff'
  primary-container: '#2d4739'
  on-primary-container: '#98b5a3'
  inverse-primary: '#b0cdbb'
  secondary: '#4a654a'
  on-secondary: '#ffffff'
  secondary-container: '#ccebc8'
  on-secondary-container: '#506b50'
  tertiary: '#462200'
  on-tertiary: '#ffffff'
  tertiary-container: '#663500'
  on-tertiary-container: '#fe942c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ccead6'
  primary-fixed-dim: '#b0cdbb'
  on-primary-fixed: '#062014'
  on-primary-fixed-variant: '#324c3e'
  secondary-fixed: '#ccebc8'
  secondary-fixed-dim: '#b0ceae'
  on-secondary-fixed: '#07200b'
  on-secondary-fixed-variant: '#334d34'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
typography:
  headline-lg:
    fontFamily: Public Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Public Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Public Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  gutter: 16px
  margin: 20px
---

## Brand & Style

The core philosophy of the design system is "Grounded Reliability." It is built to serve smallholder farmers by bridging the gap between high-tech carbon sequestration data and the physical reality of the land. The aesthetic is **Corporate / Modern** with a **Tactile** influence—evoking a sense of stability, growth, and transparency.

The UI should feel like a dependable tool. It avoids unnecessary flourishes in favor of extreme clarity and high legibility. The emotional response sought is one of calm confidence; the user should feel that their land is being respected and their data is being handled with institutional-grade security. Heavy whitespace and a structured layout ensure that complex agricultural metrics do not become overwhelming.

## Colors

The palette is derived from the lifecycle of a forest. The primary color is a deep **Forest Green**, used for key actions and headers to establish authority and trust. The secondary **Soft Sage** acts as a calming accent for background surfaces and secondary buttons, bridging the gap between text and white space.

For data visualizations and critical alerts, a tertiary **Earthy Amber** is used to provide high-contrast visibility without feeling clinical. Neutrals are intentionally warm, moving away from "tech-blue" grays toward **Warm Sand** and **Stone** tones to keep the interface feeling organic and approachable for users working in outdoor environments.

NDVI visualizations must use a specific high-contrast spectrum:
- **Low Vegetation:** #E5E7EB (Light Gray) to #FDE68A (Soft Yellow)
- **High Vegetation:** #166534 (Deep Emerald)
- **Carbon Sequestration Metrics:** Use the Primary Forest Green to denote positive accumulation.

## Typography

This design system utilizes **Public Sans** across all levels. Chosen for its institutional clarity and neutral "government-grade" reliability, it ensures that technical data remains accessible even in suboptimal lighting conditions (e.g., direct sunlight in a field).

Hierarchy is established through weight rather than dramatic size shifts. Headlines are bold and authoritative, while body text uses a generous 1.6 line-height to maximize readability for agricultural workers who may be viewing the interface on mobile devices while active. Labels are slightly tracked out and semi-bold to ensure they remain legible when used as captions for complex data charts.

## Layout & Spacing

The layout utilizes a **Fluid Grid** system designed for mobile-first utility. For smallholder farmers, the primary touchpoint is a handheld device; therefore, the grid is built on a 4-column mobile structure expanding to a 12-column desktop view.

A consistent 8px rhythm governs all spatial relationships. Generous margins (20px) prevent content from feeling cramped, while large gutters (16px) ensure that interactive elements are clearly separated to prevent accidental taps. Vertical rhythm is prioritized to allow users to scan long lists of crop data or carbon metrics without visual fatigue.

## Elevation & Depth

Visual hierarchy is conveyed through **Tonal Layers** and **Ambient Shadows**. This design system avoids harsh elevations, preferring a "stacked paper" look that feels grounded. 

Surface tiers are defined by subtle shifts in background color (e.g., a Warm Sand card on a Stone background). Where shadows are necessary for interactivity, they are extra-diffused and tinted with a hint of the primary green (#2D4739 at 8% opacity) to keep the depth feeling natural rather than synthetic. This creates a tactile quality that suggests the UI elements have a physical, reliable weight.

## Shapes

The shape language is **Rounded**, utilizing a 0.5rem (8px) base radius. This level of roundedness softens the professional tone, making the application feel welcoming and modern. 

- **Primary Cards:** Use `rounded-lg` (16px) to containerize distinct data sets like soil health or carbon yield.
- **Buttons and Inputs:** Use the base `rounded` (8px) to provide a clear, tactile hit-area.
- **Image Containers:** High-resolution satellite imagery should utilize `rounded-xl` (24px) to create a clear distinction between the "organic" land data and the structured UI frame.

## Components

### Buttons
Buttons are solid and high-contrast. The primary action button uses the Forest Green background with white text. Hover states should darken the green slightly, mimicking the depth of shade. Secondary buttons use a thick 2px border in Sage with no fill to maintain a "light" footprint.

### Data Cards
Cards are the workhorse of the design system. They must include a subtle 1px border (#E5E7EB) to define boundaries on warm neutral backgrounds. Metrics within cards should use the Bold Green for the "Value" and Sage for the "Label" to guide the eye to the most important data first.

### Input Fields
Inputs are large (minimum 48px height) with a warm-gray fill. Focus states are indicated by a 2px Forest Green border. Error states must use a high-contrast Terracotta red to ensure visibility for users with color-vision deficiencies.

### NDVI & Metric Visualizations
Data visualizations must be high-contrast. Use thick line weights for graphs and large, clear legends. For NDVI maps, provide a "High Contrast" toggle that increases the saturation of the green-to-red spectrum to ensure utility in bright outdoor environments.

### Progress Trackers
Use "growing" metaphors for carbon sequestration progress—thicker bars with rounded end-caps that feel like stalks or branches, moving from left to right as carbon goals are met.