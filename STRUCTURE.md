# Luis Rosa Portfolio — Repository Structure

## File Tree

```
Luis-Portfolio/
├── public/
│   ├── fonts/                    # (empty — reserved for local fonts)
│   ├── images/
│   │   └── hero.jpeg             # Hero/enter-gate background image
│   ├── file.svg                  # Default Next.js icons
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── about/
│   │   │   └── page.tsx          # About page (stub)
│   │   ├── clients/
│   │   │   └── page.tsx          # Clients page (stub)
│   │   ├── films/
│   │   │   └── page.tsx          # Short Films page (stub)
│   │   ├── photography/
│   │   │   └── page.tsx          # Photography page (stub)
│   │   ├── work/
│   │   │   └── page.tsx          # Work grid — main portfolio page
│   │   ├── favicon.ico
│   │   ├── globals.css           # Global styles, film-grain animation, scrollbar
│   │   ├── layout.tsx            # Root layout (fonts, Navbar, Footer, FilmGrain, ContactModal)
│   │   └── page.tsx              # Homepage "Enter Gate" splash screen
│   │
│   ├── components/
│   │   ├── ContactModal.tsx      # Full-screen contact form modal w/ Framer Motion
│   │   ├── FilmEntry.tsx         # Film entry component (stub)
│   │   ├── FilmGrain.tsx         # CSS film-grain overlay effect
│   │   ├── Footer.tsx            # Site footer with copyright & credit
│   │   ├── Navbar.tsx            # Fixed top navigation bar
│   │   ├── PageTransition.tsx    # Page transition wrapper (stub)
│   │   ├── PhotoItem.tsx         # Photo gallery item (stub)
│   │   ├── ProjectCard.tsx       # Hover-reveal project card with play button
│   │   └── ScrollReveal.tsx      # Scroll-triggered fade-up animation wrapper
│   │
│   ├── data/
│   │   └── projects.ts           # Project data (9 projects) + clients list
│   │
│   └── lib/
│       └── firebase.ts           # Firebase config placeholder
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts            # Custom theme (colors, fonts, easing)
├── tsconfig.json
└── README.md
```

---

## Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| Framework    | Next.js 16 (App Router)                       |
| Language     | TypeScript                                    |
| Styling      | Tailwind CSS 4                                |
| Animations   | Framer Motion                                 |
| Fonts        | Chivo (sans) + Cormorant Garamond (serif)     |
| Backend      | Firebase (placeholder — not yet configured)   |
| Deployment   | Vercel-ready (`next build` / `next start`)    |

---

## What Has Been Implemented

### Design System (`tailwind.config.ts` + `globals.css`)

- **Color palette**: dark cinematic theme — near-black background (`#0a0a0a`), warm off-white text (`#ede8e0`), gold accent (`#c4a265`), plus dim/ghost/mute text opacity variants.
- **Typography**: dual font stack — Chivo for body/UI, Cormorant Garamond for serif headlines.
- **Custom easing**: `ease-smooth` cubic-bezier curve used across all animations.
- **Film grain overlay**: SVG noise texture animated with CSS keyframes, rendered as a fixed full-screen layer.
- **Scrollbar styling**: ultra-thin 3px gold scrollbar thumb on dark track.

### Root Layout (`layout.tsx`)

- Loads Google Fonts (Chivo + Cormorant Garamond) via `next/font`.
- Renders global persistent components: `FilmGrain`, `Navbar`, `ContactModal`, and `Footer`.
- Sets metadata for SEO: "Luis Rosa — Filmmaker".

### Enter Gate / Homepage (`page.tsx`)

- Full-screen cinematic splash page with hero background image.
- Displays "Luis Rosa" branding with serif/italic styling.
- **Enter** button navigates to `/work` with a fade-out + scale exit animation.
- **Contact** button triggers enter animation, then opens the contact modal via a custom `open-contact` window event.
- Instagram social link in the top bar.
- "Scroll to enter" hint text (desktop only) with pulse animation.

### Navigation (`Navbar.tsx`)

- Fixed top nav bar with gradient fade background.
- Links: Work, Short Films, Photography, Clients, About, Contact.
- Active route highlighting via `usePathname()`.
- Hidden on homepage (enter gate).
- Instagram icon link.
- Contact button present but modal wiring via event dispatch is a TODO.

### Work Page (`work/page.tsx`)

- Renders a responsive grid (1-col mobile, 2-col desktop) of all projects from the data file.
- Featured projects span full width (`col-span-2`) at 70vh; standard cards are 50vh.

### Project Cards (`ProjectCard.tsx`)

- Gradient placeholder backgrounds (to be replaced with real images).
- Hover effects: scale-up on image, overlay slides in with category label (gold), title, and optional subtitle.
- Conditional play button overlay for video projects (centered circle with triangle icon).
- Scroll-triggered entrance animation (fade-up via Framer Motion `whileInView`).

### Contact Modal (`ContactModal.tsx`)

- Full-screen blurred overlay (92% opacity dark background + backdrop-blur).
- Opens via custom `open-contact` window event, closes on Escape key or close button.
- Animated entrance: fade + slide-up with staggered timing.
- Form fields: Name, Email, Project Type, and a free-text vision textarea.
- Submit button with gold hover effect and tracking animation.
- Social links footer (Instagram, Vimeo, YouTube — hrefs not yet wired).
- Form submission is not yet connected to any backend.

### Footer (`Footer.tsx`)

- Minimal footer with copyright notice and "Designed by HNO Consulting" credit.
- Hidden on homepage (enter gate).

### Scroll Reveal (`ScrollReveal.tsx`)

- Reusable Framer Motion wrapper: fades up elements when they scroll into view.
- Configurable delay and className passthrough.
- Uses `viewport: { once: true }` so animations only play once.

### Film Grain Overlay (`FilmGrain.tsx`)

- Renders a `<div>` with the `.film-grain` CSS class — a fixed, full-screen SVG noise texture animated at 8fps for a cinematic analog feel.

### Project Data (`data/projects.ts`)

- **9 projects** defined with typed `Project` interface: id, title, category, categoryLabel, subtitle, description, role, gradient, isVideo, isFeatured, videoUrl.
- Projects span music videos, concert photography, short films, and documentaries.
- **6 clients** listed: Jacquees, Residente, LMU, Luquis, YouTube Theater, Atlantic.

---

## Stubs / Not Yet Implemented

| Item                     | Status                                                  |
| ------------------------ | ------------------------------------------------------- |
| About page               | Stub — renders `<div>About</div>`                       |
| Clients page             | Stub — renders `<div>Clients</div>`                     |
| Short Films page         | Stub — renders `<div>Films</div>`                       |
| Photography page         | Stub — renders `<div>Photography</div>`                 |
| `FilmEntry` component    | Stub — renders `<div>FilmEntry</div>`                   |
| `PhotoItem` component    | Stub — renders `<div>PhotoItem</div>`                   |
| `PageTransition`         | Stub — passthrough wrapper, no animation yet            |
| Firebase integration     | Placeholder file with a comment only                    |
| Contact form submission  | Form renders but has no `onSubmit` / backend handler    |
| Navbar contact button    | Button exists but event dispatch is not wired (TODO)    |
| Real project images      | Using gradient placeholders; no actual thumbnails yet   |
| Social link URLs         | Instagram linked; Vimeo/YouTube are `#` placeholders    |
| Mobile hamburger menu    | Nav links are `hidden md:flex`; no mobile menu yet      |
