# Design System: RNS — Riadenie nelineárnych systémov
**Project ID:** n/a. No Stitch project exists; this file was written from the brief and is the source of truth for `src/shared/tokens.css`.

## 1. Visual Theme & Atmosphere

A **quiet reading room**. The site is for studying in long sessions, mostly on a phone,
often late at night. It should feel like a well-set textbook page: calm, unhurried, and
built around one question at a time.

- **Density:** airy. One idea per screen region, generous vertical rhythm, nothing competing with the question.
- **Mood:** warm-neutral paper in light mode and soft graphite (never pure black) in dark mode, with one restrained ink-teal accent.
- **Philosophy:** content first, chrome last. Navigation and progress are present but recede. Colour is semantic: correct, wrong and the active choice. It is never decoration.
- **Motion:** short, soft fades and height reveals (150–220 ms, ease-out). When `prefers-reduced-motion` is set, everything is instant.

## 2. Color Palette & Roles

Every text/background pair meets WCAG AA (body text ≥ 7:1 where possible, UI text ≥ 4.5:1).

### Light theme ("Paper")
- **Cool Paper** (#F3F4F1): page background. A neutral, faintly green off-white, easier on the eyes over long reading than #FFF (and deliberately not the cream "generated page" ground).
- **Clean Sheet** (#FFFFFF): cards and question surfaces, sitting just above the paper.
- **Sunken Paper** (#EEEBE4): sunken areas such as option rows at rest, search field and progress tracks.
- **Bookbinding Ink** (#1D1C1A): primary text and headings (~15:1 on Cool Paper).
- **Pencil Grey** (#55514A): secondary text, metadata, topic labels (~7.5:1).
- **Hairline Rule** (#DCD7CC): borders and dividers.
- **Ink Teal** (#0E5A5E): primary accent for links, focus ring, active nav, primary buttons and progress fill (~7.6:1).
- **Teal Wash** (#DCEBE9): accent background for selected/active states.
- **Margin Green** (#22663A) on **Mint Wash** (#E2F0E4): correct answer / "vedel som" / known.
- **Correction Red** (#A1301F) on **Blush Wash** (#F7E3DF): wrong answer / "nevedel som".
- **Amber Note** (#7A5200) on **Amber Wash** (#F6ECD6): "learning" state and warnings.

### Dark theme ("Graphite")
- **Graphite** (#141615): page background. Very dark green-grey, not black, which reduces halation.
- **Slate Sheet** (#1C1F1E): cards and question surfaces.
- **Deep Slate** (#252928): sunken areas and tracks.
- **Chalk** (#ECE9E2): primary text (~14:1).
- **Ash** (#A8A398): secondary text (~7:1).
- **Night Rule** (#323735): borders.
- **Sea-glass Teal** (#74C7C1): accent (~9:1).
- **Teal Shadow** (#17393A): accent background.
- **Spring Green** (#86CB95) on **Moss** (#18321F): correct / known.
- **Coral** (#F2907F) on **Ember** (#3B1E19): wrong.
- **Honey** (#E2B866) on **Umber** (#352A12): learning.

## 3. Typography Rules

- **Body and UI:** *Atkinson Hyperlegible Next* (self-hosted, latin-ext for Slovak diacritics), falling back to `system-ui`. It was designed for legibility and has distinct letterforms, so similar glyphs like I/l/1 and diacritics stay easy to tell apart at small sizes and in poor light.
- **Display / headings:** chosen per visual direction (see prototypes). It is always used sparingly: page titles and topic names only.
- **Math:** KaTeX's own fonts, scaled to 1.05em so formulas match the body x-height.
- **Scale (fluid):** body 18–19 px (`clamp(1.125rem, 1rem + .4vw, 1.1875rem)`), question text 20–24 px, small/meta 15 px. Nothing interactive is below 15 px.
- **Line length:** 60–68 characters (`max-width: 66ch`) for answers and questions.
- **Line height:** 1.6 for body and 1.3 for headings. Letter-spacing is normal for body and slightly tight (−0.01em) for large headings. Uppercase labels get +0.06em tracking.
- **Weights:** 400 body, 600 emphasis and option letters, 700 headings. No light weights: they disappear in dark mode.

## 4. Component Stylings

- **Buttons:**
  - Gently rounded rectangles (10 px radius), at least 48 px tall (thumb targets).
  - Primary: solid Ink Teal with paper-white text.
  - Secondary: Sunken Paper fill with ink text.
  - Self-grade buttons are tinted: Correction Red wash for "Nevedel som" and Margin Green wash for "Vedel som". They are equal width, side by side, and placed within thumb reach at the bottom of the screen.
  - Press state darkens slightly. Focus is a 3 px Ink Teal ring with 2 px offset, always visible on keyboard focus.
- **Cards/Containers:** gently rounded (14 px), Clean Sheet background, 1 px Hairline Rule border, no shadow in dark mode and at most a whisper-soft shadow (`0 1px 2px` at 6 %) in light mode. Elevation comes from tone, not shadow.
- **Answer options (A–D):** full-width rows with a circular letter badge and 12 px radius. At rest they are Sunken Paper. After reveal, the correct row turns Mint Wash with a green badge and check icon; the others fade to 70 % opacity. State is never shown by colour alone: there is always an icon and text too.
- **Inputs/Forms:** the search field is a Sunken Paper fill, 1 px Hairline Rule, 12 px radius and 48 px tall, with the focus ring in Ink Teal.
- **Progress bars:** 8 px pill-shaped track in Sunken Paper. The fill is segmented into known (green) and learning (amber), with "new" left as the empty track.
- **Header:** slim (56 px), the background colour, and a bottom hairline. It holds the "RNS" wordmark on the left and the Zápočet and Prednášky links. The active link has an accent underline and `aria-current="page"`. On the far right a 44 px light/dark switch (sun/moon icon). The theme follows the OS until it is used, then the choice is remembered in localStorage.

## 5. Layout Principles

- **Mobile first:** a single column with a 16 px gutter at 375 px and 24 px from 768 px. Content column max 720 px, centred.
- **Spacing scale:** 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 px. Vertical rhythm between question blocks is 24–32 px.
- **Thumb zone:** primary study actions (reveal, knew/didn't know, next) sit in a sticky bottom bar on phones and inline below the card on desktop.
- **Desktop (1440 px):** keep the reading column. Extra width goes to a quiet side rail for topic navigation and progress, never to wider text.
- **Hierarchy:** topic label (small caps, Pencil Grey), then the question (largest text), then the options, then actions. One accent element per view.
