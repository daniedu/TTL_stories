---
name: Correspondence Post
colors:
  surface: '#fbfbe2'
  surface-dim: '#dbdcc3'
  surface-bright: '#fbfbe2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f5dc'
  surface-container: '#efefd7'
  surface-container-high: '#eaead1'
  surface-container-highest: '#e4e4cc'
  on-surface: '#1b1d0e'
  on-surface-variant: '#42474e'
  inverse-surface: '#303221'
  inverse-on-surface: '#f2f2d9'
  outline: '#72777f'
  outline-variant: '#c2c7cf'
  surface-tint: '#31628d'
  primary: '#002a48'
  on-primary: '#ffffff'
  primary-container: '#00416a'
  on-primary-container: '#7faddc'
  inverse-primary: '#9ccbfb'
  secondary: '#ba002a'
  on-secondary: '#ffffff'
  secondary-container: '#e0273f'
  on-secondary-container: '#fffbff'
  tertiary: '#282829'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e3e3f'
  on-tertiary-container: '#aba9aa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#cfe5ff'
  primary-fixed-dim: '#9ccbfb'
  on-primary-fixed: '#001d33'
  on-primary-fixed-variant: '#114a73'
  secondary-fixed: '#ffdad9'
  secondary-fixed-dim: '#ffb3b2'
  on-secondary-fixed: '#410008'
  on-secondary-fixed-variant: '#92001f'
  tertiary-fixed: '#e5e2e3'
  tertiary-fixed-dim: '#c8c6c7'
  on-tertiary-fixed: '#1b1b1c'
  on-tertiary-fixed-variant: '#474647'
  background: '#fbfbe2'
  on-background: '#1b1d0e'
  surface-variant: '#e4e4cc'
  paper-cream: '#F5F5DC'
  ink-black: '#1A1A1B'
  airmail-blue: '#00416A'
  stamp-red: '#C60C30'
  postmark-gray: '#A6A697'
typography:
  headline-lg:
    fontFamily: Space Mono
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Space Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  body-lg:
    fontFamily: Courier Prime
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Courier Prime
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.1em
  metadata:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
  headline-lg-mobile:
    fontFamily: Space Mono
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 640px
---

## Brand & Style

The design system evokes the tactile, nostalgic experience of physical correspondence—telegrams, airmail letters, and ledger books. It is designed for an ephemeral story-sharing app where "messages" feel like artifacts delivered through time and space.

The style is **Tactile / High-Contrast**, leaning into the aesthetic of 20th-century stationery. It avoids all gradients, relying instead on flat surfaces, purposeful line-work, and rubber-stamp textures to create depth. The interface should feel like a well-organized desk: functional, grounded, and authoritative. Key visual motifs include perforated edges (mimicking postage stamps), ink-bleed effects on borders, and monospaced "typewriter" typography that suggests urgency and transience.

## Colors

The palette is strictly limited to four tonal groups to maintain the "postal" aesthetic. 

- **Primary (Airmail Blue):** Used for navigation, active states, and public visibility markers. It represents the "international" and "moving" nature of stories.
- **Secondary (Postage Red):** Reserved for urgent actions, private visibility, and critical alerts.
- **Neutral (Paper Cream):** The base color for all surfaces, simulating aged stationery.
- **Ink Black:** Used for all primary typography and structural borders.

Avoid using pure white or pure black. All "white" space should be filled with the cream paper tone to reduce eye strain and enhance the tactile feel. Visibility states (Public, Unlisted, Private) should map to Blue, Ink, and Red respectively to maintain the theme's color hierarchy.

## Typography

The system uses a strictly monospaced typographic stack to simulate typewritten documents and telegrams. 

- **Headings (Space Mono):** Used for app titles and section headers. Its geometric structure provides a modern "tech-meets-postal" look.
- **Story Body (Courier Prime):** Optimized for readability while maintaining the classic typewriter aesthetic. This is the primary voice of the users.
- **Labels & Metadata (JetBrains Mono/Courier):** Used for timestamps, coordinates, and button labels. High-density information should feel like it was stamped or printed by a mechanical device.

Vertical rhythm is critical; maintain generous line heights to mimic double-spaced typewritten drafts.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** approach, resembling a ledger or a formal letter. Content is centered on desktop to focus the eye, while mobile layouts utilize a full-width "edge-to-edge paper" feel.

- **Rhythm:** A 4px baseline grid ensures all elements align with the precision of a printed form.
- **Dividers:** Use simple 1px or 2px solid lines in `ink-black` to separate sections. Avoid soft shadows for separation; use borders and tonal shifts instead.
- **Map:** The map should occupy a defined "window" within the ledger, appearing as if it were a photograph or technical drawing pinned to the desk.

## Elevation & Depth

This system rejects traditional shadows in favor of **Tonal Layers** and **Flat Stacking**. 

- **Surface Levels:** The base level is the desk (a slightly darker or more textured cream). The primary UI elements (cards, sheets) sit on top as "sheets of paper."
- **Perception of Depth:** Depth is created through overlapping elements and thick, offset borders (2px to 4px) rather than blurs. For example, a button may have a solid 2px black bottom-right border to "push" it off the page.
- **Tactile Details:** Use "perforated" CSS masks or SVG backgrounds on the edges of cards to mimic postage stamps. Postmarks and rubber-stamp icons should appear slightly rotated (2–5 degrees) to break the digital perfection.

## Shapes

The shape language is primarily **Sharp**. Physical paper and telegrams have square corners. 

- **Standard Elements:** Buttons, input fields, and story cards use 0px border-radius.
- **Exceptions:** Floating Action Buttons (FABs) and certain visibility badges may use a "Stamp" shape—essentially a rectangle with a jagged/perforated edge—rather than a circle or pill. 
- **Borders:** All interactive elements must have a defined `1px` or `2px` border in `ink-black`.

## Components

- **Buttons:** Rectangular with a solid 2px border. Active states shift the background to `airmail-blue` or `stamp-red` with white text. Use "Telegram style" ALL CAPS for primary actions.
- **Story Cards:** Designed to look like postcards. The top-right corner should contain the "visibility badge" designed as a postage stamp. Use a faint rubber-stamp "POSTED" texture as a background watermark for expired stories.
- **Input Fields:** Styled like a fill-in-the-blank form. Use underlined text areas or boxes with clear, monospaced labels positioned above the line.
- **Chips/Badges:** Use a "serrated edge" (perforated) border. Public stories use the blue colorway; private stories use the red colorway.
- **PostForm (Bottom Sheet):** This should look like a "Telegram Form." Include fields for "To: [Location]" and "From: [User]" to reinforce the metaphor.
- **Map Markers:** Simple geometric "pins" or circular "postmarks" that look hand-stamped onto the map surface.