# BookNook — Design System

A complete reference for the visual language, component conventions, layout rules, and interaction patterns used throughout BookNook.

---

## Table of Contents

- [Brand Identity](#brand-identity)
- [Color System](#color-system)
  - [Light Mode Tokens](#light-mode-tokens)
  - [Dark Mode Tokens](#dark-mode-tokens)
  - [Category Colors](#category-colors)
  - [Semantic Colors](#semantic-colors)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Border Radius](#border-radius)
- [Shadows & Elevation](#shadows--elevation)
- [Component Library](#component-library)
  - [Button](#button)
  - [Badge](#badge)
  - [Alert](#alert)
  - [BookCard](#bookcard)
  - [CategoryCard](#categorycard)
  - [Modal & ConfirmDialog](#modal--confirmdialog)
  - [Toast](#toast)
  - [Form Primitives](#form-primitives)
  - [Skeleton](#skeleton)
  - [EmptyState](#emptystate)
  - [SectionHeading](#sectionheading)
  - [Pagination](#pagination)
- [Icons](#icons)
- [Animation & Motion](#animation--motion)
- [Dark / Light Theme](#dark--light-theme)
- [Page Layout Patterns](#page-layout-patterns)
- [Home Page Sections](#home-page-sections)
- [Accessibility](#accessibility)
- [Image Handling](#image-handling)

---

## Brand Identity

| Property | Value |
|---|---|
| **Brand name** | BookNook |
| **Tagline** | A quiet, thoughtful corner for book lovers |
| **Personality** | Calm, premium, editorial, minimalist |
| **Logo mark** | `BookOpen` Lucide icon in a teal-to-dark-teal gradient rounded square |
| **Wordmark** | "Book" in `--color-ink`, "Nook" in `--color-brand` |
| **Font display** | Playfair Display — Serif, editorial |
| **Font body** | Inter — Clean, legible sans-serif |

---

## Color System

All colors are defined as CSS custom properties in `src/app/globals.css` and mapped to Tailwind CSS v4 theme tokens. The `.dark` class on `<html>` switches every token to its dark-mode equivalent. No hard-coded hex values appear in component code.

### Light Mode Tokens

| CSS Variable | Tailwind Token | Hex Value | Usage |
|---|---|---|---|
| `--canvas` | `bg-canvas` | `#F8FAFC` | Page background |
| `--paper` | `bg-paper` | `#FFFFFF` | Card and surface backgrounds |
| `--surface-muted` | `bg-surface-muted` | `#F1F5F9` | Subtle inset surfaces, image placeholders |
| `--ink` | `text-ink` | `#17212B` | Primary body text |
| `--ink-panel` | `bg-ink-panel` | `#17212B` | Dark panels (hero strip, hero slider bg) |
| `--ink-muted` | `text-muted` | `#5B6B7C` | Secondary text, captions, labels |
| `--line` | `border-line` | `#E2E8F0` | Borders, dividers, input outlines |
| `--brand-surface` | `bg-brand-surface` | `#0F766E` | Primary action buttons, CTA backgrounds |
| `--brand-ink` | `text-brand` | `#0F766E` | Brand-colored text, active links |
| `--brand-dark` | `bg-brand-dark` | `#0B5F59` | Hover state for brand buttons; quote section background |
| `--brand-soft` | `bg-brand-soft` | `#ECFDF9` | "View Details" button background, soft teal surfaces |
| `--brand-soft-hover` | `bg-brand-soft-hover` | `#CCFBF1` | Hover on soft teal buttons |
| `--brand-soft-foreground` | `text-brand-soft-foreground` | `#0B5F59` | Text on soft teal surfaces |
| `--brand-accent` | `text-accent` | `#B45309` | Warm amber accent (eyebrow text, some badges) |
| `--brand-accent-soft` | `bg-accent-soft` | `#FFFBEB` | Soft amber surface |

### Dark Mode Tokens

| CSS Variable | Hex Value | Change vs Light |
|---|---|---|
| `--canvas` | `#0B1220` | Deep navy background |
| `--paper` | `#111827` | Dark card surfaces |
| `--surface-muted` | `#1E293B` | Slightly lighter than paper |
| `--ink` | `#E5E7EB` | Light gray primary text |
| `--ink-muted` | `#94A3B8` | Muted text becomes lighter gray |
| `--line` | `#263244` | Dark borders |
| `--brand-ink` | `#5EEAD4` | Bright teal for brand text in dark |
| `--brand-soft` | `#0F2C2A` | Dark teal soft surface |
| `--brand-soft-foreground` | `#99F6E4` | Mint text on dark teal |
| `--brand-accent` | `#FBBF24` | Warm yellow replaces amber |

### Category Colors

Each category has a soft background token for card backgrounds and a colored spine strip:

| Category | Tailwind Token | Spine Color |
|---|---|---|
| Fiction | `bg-cat-fiction-soft` → `#ECFDF9` | `bg-teal-700` |
| Science | `bg-cat-science-soft` → `#FFFBEB` | `bg-amber-700` |
| History | `bg-cat-history-soft` → `#FFF1F2` | `bg-rose-800` |
| Kids | `bg-cat-kids-soft` → `#EEF2FF` | `bg-indigo-700` |
| Others | `bg-cat-others-soft` → `#F5F5F4` | `bg-stone-700` |

### Semantic Colors

| Token | Usage |
|---|---|
| `--success` / `--success-surface` / `--success-border` | Available copies indicators, success toasts |
| `--warning` / `--warning-surface` / `--warning-border` | Low-availability warnings, warning toasts |
| `--danger` / `--danger-surface` / `--danger-border` | Error states, delete actions, danger toasts |
| `--danger-solid` / `--danger-solid-hover` | Destructive confirmation buttons |
| `--info` / `--info-surface` / `--info-border` | Informational toasts |
| `--overlay` | Modal backdrop (`rgba(15 23 42 / 0.45)` light, deeper in dark) |

---

## Typography

| Role | Font | Weight | CSS Class Pattern |
|---|---|---|---|
| Display headings (h1, h2, section titles) | Playfair Display | 500–700 | `font-display text-4xl font-semibold` |
| Hero heading | Playfair Display | 500 | `font-display text-[2.5rem] sm:text-5xl lg:text-[3.75rem]` |
| Body text | Inter | 400 | `font-sans text-base` |
| Navigation, labels, UI text | Inter | 500–600 | `text-sm font-semibold` |
| Eyebrows / labels | Inter Mono (font-mono) | 700 | `font-mono text-xs uppercase tracking-[0.2em]` |
| Captions, metadata | Inter | 400 | `text-xs text-muted` |
| Book titles on cards | Playfair Display | 600 | `font-display text-xl font-semibold` |

**Scale used in components:**

- `text-xs` — 12px: metadata, eyebrows, badges
- `text-sm` — 14px: secondary body, navigation links, card metadata
- `text-base` — 16px: primary body
- `text-lg` — 18px: sub-headings
- `text-xl` — 20px: card headings
- `text-2xl` — 24px: section sub-headings
- `text-3xl`–`text-5xl` — Page headings, CTA headline
- `text-[3.75rem]` / `text-[2.5rem]` — Hero display

---

## Spacing & Layout

- **Maximum content width:** `max-w-7xl` (1280px) centered via the `Container` component
- **Horizontal padding:** `px-4` (mobile) → `px-6` (sm) → `px-8` (lg)
- **Section vertical padding:** `py-20 sm:py-24` standard; `py-16 sm:py-20` for denser sections
- **Card grid gap:** `gap-6`
- **Column counts:**
  - 1 column: mobile default
  - 2 columns: `sm:grid-cols-2`
  - 3 columns: `lg:grid-cols-3`
- **Navbar height:** `h-18` (72px), sticky with backdrop blur
- **Card internal padding:** `p-5` standard, `p-6`–`p-8` for category cards
- **Section heading margin below:** `mt-10`–`mt-16`

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-xl` | `10px` | Buttons, badges, form inputs, nav items |
| `rounded-2xl` | `14px` | Book cards, category cards, toast container |
| `rounded-3xl` | `22px` | Empty state containers |
| `rounded-[2rem]` | `32px` | CTA section card |
| `rounded-full` | 50% | Avatar circles, dot indicators |
| `rounded-sm` | Small | Reader's wall sticky notes |

The base radius token is `--radius: 0.625rem` (10px), from which the scale is derived.

---

## Shadows & Elevation

BookNook uses directional shadows that communicate real depth, not generic box-shadows:

| Component | Shadow |
|---|---|
| Book card (hover) | `hover:shadow-[0_18px_45px_-24px_rgba(15,23,42,0.28)]` |
| Category card (hover) | `hover:shadow-[0_20px_50px_-30px_rgba(28,25,23,0.4)]` |
| CTA section | `shadow-[0_30px_80px_-45px_rgba(15,118,110,0.65)]` — teal glow |
| Navbar | `border-b border-line/80 bg-paper/95 backdrop-blur` — glass effect |
| Buttons | `shadow-sm shadow-brand-surface/25` on primary |
| Theme toggle | `shadow-sm border border-line` |
| Sticky notes (ReadersWall) | `shadow-sm` with `hover:shadow-md` |

---

## Component Library

### Button

Located at `src/components/ui/Button.tsx`. Built with `class-variance-authority`.

| Variant | Description |
|---|---|
| `default` | Teal fill, white text — primary action |
| `outline` | Transparent with border |
| `ghost` | No border or background, text-only |
| `danger` | Red fill — destructive action |

| Size | Height |
|---|---|
| `sm` | `h-8 px-4 text-xs` |
| `default` | `h-10 px-5 text-sm` |
| `lg` | `h-12 px-6 text-base` |

Buttons also accept `loading` and `disabled` states with appropriate cursor and opacity treatment.

### Badge

Located at `src/components/ui/Badge.tsx`. Variants:

| Variant | Usage |
|---|---|
| `teal` | Category labels on book cards |
| `success` | Available status |
| `warning` | Low availability, due-soon loans |
| `danger` | Unavailable, overdue loans |
| `muted` | Neutral / returned status |
| `info` | Informational labels |
| `default` | Outline style |

### Alert

Located at `src/components/ui/Alert.tsx`. Variants: `info`, `success`, `warning`, `error`. Used for inline error states and retry prompts.

### BookCard

Located at `src/components/books/BookCard.tsx`.

- `article` element with `h-full flex flex-col` for equal grid heights
- Cover area: `h-65` fixed height with `object-cover` and 3D scale on hover (`group-hover:scale-[1.035]`)
- Category badge overlaid at top-left of cover
- Availability dot (`bg-success`, `bg-warning`, `bg-danger`) with text
- "View Details" button uses `bg-brand-soft` / `text-brand-soft-foreground`
- Accepts an optional `actions` prop to replace the default button (used in My Books)

### CategoryCard

Located at `src/components/home/CategoryCard.tsx`.

- Left-side colored spine strip (2px wide, full height)
- Category icon in a soft-background rounded square
- Lucide `ArrowUpRight` top-right, animates on hover
- Playfair Display category name
- Supports a `featured` prop for the first (larger) card in the grid
- Hover: `-translate-y-0.5` lift + deep shadow

### Modal & ConfirmDialog

Located at `src/components/ui/Modal.tsx` and `ConfirmDialog.tsx`.

- Focus-trapped, Escape-to-close, body scroll locked while open
- Backdrop uses `--overlay` color token
- `ConfirmDialog` has a neutral Cancel and a `danger` Confirm button

### Toast

Located at `src/components/ui/Toast.tsx`.

- Global `ToastProvider` context
- Three variants: `success` (teal icon), `error` (red icon), `info` (blue icon)
- Floats fixed bottom-right, stacks with `gap-2`
- 4-second auto-dismiss with slide-in animation

### Form Primitives

Located at `src/components/ui/Form.tsx`.

- `Input`, `Label`, `Select`, `Textarea` — all share border-line styling, focus-visible outline using `--brand-ink`, consistent `rounded-xl` radius
- Read-only fields use `bg-surface-muted cursor-not-allowed opacity-70`
- Character count on Textarea when near limit

### Skeleton

Located at `src/components/ui/Skeleton.tsx`. Single component, animated `animate-pulse` with `bg-surface-muted`. Used in `BookGridSkeleton` (book card grid) and inline in My Books / My Borrows tables.

### EmptyState

Located at `src/components/ui/EmptyState.tsx`. Centered icon, heading, description, and optional action button. Used for empty shelves, empty borrows.

### SectionHeading

Located at `src/components/ui/SectionHeading.tsx`.

- `eyebrow`: mono uppercase tracking-wide text in `--brand-ink`
- `title`: Playfair Display display heading
- `description`: secondary text below
- `action`: optional right-aligned link/button
- `align`: `left` (default) or `center`

### Pagination

Located at `src/components/books/Pagination.tsx`. Previous / Next with page number buttons. Active page uses `bg-brand-surface text-white`.

---

## Icons

All icons use **Lucide React** (`lucide-react ^1.65.0`).

Key icons used by feature area:

| Area | Icons |
|---|---|
| Navigation | `Menu`, `X`, `BookOpen` |
| Book management | `Plus`, `Pencil`, `Trash2`, `BookOpen` |
| Borrowing | `Calendar`, `Clock`, `RotateCcw` |
| Availability | Colored `●` dots (CSS, not icons) |
| User / Auth | `User`, `LogOut`, `LogIn` |
| Categories | `BookOpen` (Fiction), `Atom` (Science), `Landmark` (History), `Baby` (Kids), `Library` (Others) |
| Feedback | `CheckCircle`, `XCircle`, `AlertCircle`, `Info` |
| Navigation actions | `ArrowRight`, `ArrowUpRight`, `ChevronLeft`, `ChevronRight` |
| Footer / Contact | `Mail`, `Phone`, `MapPin` |
| Social | Custom inline SVG for GitHub and LinkedIn |
| Theme | `Sun`, `Moon` |
| Quotes | `Quote`, `Star` |

Custom SVG icons (GitHub, LinkedIn) are defined as inline components in `Footer.tsx` to avoid additional icon dependencies.

---

## Animation & Motion

### CSS Keyframes (globals.css)

| Name | Behavior | Usage |
|---|---|---|
| `fade-up` | Opacity 0→1, translateY 14px→0 in 0.6s | Section entrances |
| `fade-in` | Opacity 0→1 in 0.5s | Toast appearance, quote transitions |
| `scale-in` | Opacity+scale(0.97)+translateY(6px)→normal in 0.2s | Modal open |

Applied via Tailwind utilities: `animate-fade-up`, `animate-fade-in`, `animate-scale-in`.

### Component-Level Transitions

| Element | Transition |
|---|---|
| Book card | `hover:-translate-y-1` + shadow, cover `scale-[1.035]` on group hover |
| Category card | `hover:-translate-y-0.5` + shadow |
| NavLinks | `transition hover:text-brand` |
| Theme toggle | `transition hover:bg-canvas` |
| Social icons in footer | `hover:-translate-y-0.5 hover:shadow-md` |
| Reader's wall cards | `hover:scale-105 hover:shadow-md` |
| CTA buttons | `transition hover:bg-brand-soft` / `hover:bg-brand-dark` |

### Hero Slider

Powered by **Swiper 14** with:
- `effect="fade"` with `crossFade: true`
- `autoplay={{ delay: 4000, disableOnInteraction: false }}`
- `speed: 900ms` transition
- `loop: true` with clickable pagination dots

### Reading Quote Section

4 literary quotes rotate every **10 seconds** using `setInterval` + React state. Each transition uses `key={currentIndex}` to trigger `animate-in fade-in duration-700`.

### Discovery Section

- **Blind Date card**: Click reveals the hidden book title with a CSS reveal animation
- **Mood Studio cards**: 3D flip on click using CSS `transform-style: preserve-3d` / `rotateY` on the card container

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

---

## Dark / Light Theme

Theme is implemented using **next-themes** (`next-themes ^0.4.6`).

### Implementation

| File | Role |
|---|---|
| `src/components/shared/ThemeProvider.tsx` | Wraps `NextThemesProvider` with `attribute="class"`, `defaultTheme="system"`, `storageKey="booknook-theme"`, `enableSystem`, `disableTransitionOnChange` |
| `src/app/layout.tsx` | Mounts `ThemeProvider` as outermost wrapper; `suppressHydrationWarning` on `<html>` |
| `src/components/shared/ThemeToggle.tsx` | Sun/Moon icon button; uses `useSyncExternalStore` on `document.documentElement.classList` for hydration-safe theme detection |
| `src/app/globals.css` | `@custom-variant dark (&:is(.dark *))` enables Tailwind `dark:` utilities; `.dark { }` block redefines all tokens |

### How It Works

1. `next-themes` applies `class="dark"` to `<html>` based on user preference or OS setting.
2. The CSS `@custom-variant dark (&:is(.dark *))` selector makes all `dark:` Tailwind utilities respond to that class.
3. All design tokens (colors) are defined on `:root` (light) and `.dark` — no component needs `dark:` overrides because every color is a token.
4. The `ThemeToggle` button in the Navbar toggles between `"light"` and `"dark"`. The Sun icon shows in dark mode; Moon in light mode.
5. The selection is persisted to `localStorage` under the key `"booknook-theme"`.

---

## Page Layout Patterns

### Root Layout (`layout.tsx`)

```
<html class="font-sans ...">
  <body class="flex min-h-screen flex-col bg-canvas">
    <ThemeProvider>
      <PageTitleProvider>
        <ToastProvider>
          <Navbar />           ← sticky top-0 z-50
          <main class="flex-1">
            {page content}
          </main>
          <Footer />
        </ToastProvider>
      </PageTitleProvider>
    </ThemeProvider>
  </body>
</html>
```

### Standard Page

```
<Container>              ← max-w-7xl, px responsive
  <section>
    <SectionHeading />
    {grid or list content}
  </section>
</Container>
```

### Two-Column Book Detail (Desktop)

```
Grid lg:grid-cols-[2fr_1fr]
├── Left: image (sticky) + availability panel
└── Right: title, author, meta, description, borrow/owner actions
```

### Auth Pages (Login / Register)

Split-screen layout via `AuthShell.tsx`:
- Left half: brand panel with logo, tagline, decorative book illustration
- Right half: form card, centered vertically

### Dashboard Pages (My Books / My Borrows)

- **Desktop**: `<table>` with responsive widths
- **Mobile**: Card-per-row list with the same data in stacked label/value format
- Summary stat cards above the table (totals, counts)

---

## Home Page Sections

In order of appearance in `src/app/page.tsx`:

| Order | Component | Background | Purpose |
|---|---|---|---|
| 1 | `HeroSlider` | `bg-ink-panel` (dark) | Full-width Swiper fade slider, 3 editorial slides |
| — | `HeroStrip` | `bg-ink-panel/95` | Dark sub-bar with 3 feature highlights |
| 2 | `Categories` | `bg-paper` | 5-category grid with `CategoryCard` |
| 3 | `DiscoverySection` | `bg-canvas` | Blind Date card + Mood Studio |
| 4 | `NewArrivals` | `bg-canvas` | 3-column grid of latest 6 books |
| 5 | `ReadingNook` | `bg-brand-dark` (teal) | Rotating literary quote |
| 6 | `ReadersWall` | `bg-canvas` | 3 community sticky-note reviews |
| 7 | `CtaSection` | `bg-paper` | CTA card with "Explore Books" and "Add a Book" |

---

## Accessibility

- All interactive elements have visible `:focus-visible` outlines using `--brand-ink`
- `aria-label` on icon-only buttons (hamburger, theme toggle, social links)
- `aria-current="page"` on active nav links
- `aria-live` regions for toast announcements
- `aria-hidden="true"` on decorative icons
- Modal implements focus trap, Escape to close, body scroll lock
- `suppressHydrationWarning` on `<html>` to suppress theme flash
- Book cover `alt` text: `"${title} by ${author}"`
- Semantic HTML: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section>`, `<article>` used throughout
- `@media (prefers-reduced-motion)` disables all animations

---

## Image Handling

| Scenario | Treatment |
|---|---|
| Local cover art | Stored in `public/books/` as `.jpg` files, 24 curated titles |
| Remote covers | Any `https://` URL accepted via `next.config.ts` wildcard `remotePatterns` |
| Hero slider images | Unsplash CDN URLs (3 editorial library photos) |
| Avatar images | ImgBB upload or manual URL |
| Missing / broken image | `BookCover.tsx` falls back to a branded placeholder with the book's initials |
| `next/image` | Used for all `<Image>` renders; `fill` + `object-cover` for responsive covers |
| Cover aspect ratio | `h-65` fixed card cover height → consistent 2:3 proportion across grid |
