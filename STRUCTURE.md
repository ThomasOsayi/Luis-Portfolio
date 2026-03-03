# Luis Rosa Portfolio — Repository Structure

## File Tree

```
Luis-Portfolio/
├── public/
│   ├── fonts/
│   ├── images/
│   │   └── hero.jpeg
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
│
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── clients/
│   │   │   │   └── page.tsx      # Clients CRUD + live preview
│   │   │   ├── photography/
│   │   │   │   └── page.tsx      # Photos CRUD, albums, drag reorder, preview
│   │   │   ├── projects/
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx  # Add/Edit project, split view, YouTube thumb
│   │   │   │   └── page.tsx      # Projects table, filters, category pills
│   │   │   ├── settings/
│   │   │   │   └── page.tsx      # Site settings, section nav, live /about preview
│   │   │   ├── layout.tsx        # Auth guard, admin nav (Dashboard, Projects, Photography, Clients, Settings)
│   │   │   └── page.tsx          # Dashboard: stats, recent projects, quick actions
│   │   ├── login/
│   │   │   └── page.tsx          # Email/password login → /admin
│   │   ├── about/
│   │   │   └── page.tsx          # About (static content for now)
│   │   ├── clients/
│   │   │   └── page.tsx          # Public clients grid (static data)
│   │   ├── films/
│   │   │   └── page.tsx          # Short films (static projects filter)
│   │   ├── photography/
│   │   │   └── page.tsx          # Photography grid — Firestore photos + Lightbox
│   │   ├── work/
│   │   │   └── page.tsx          # Work grid — Firestore, WorkSkeleton, video modal
│   │   ├── favicon.ico
│   │   ├── globals.css           # Theme, film grain, admin animations
│   │   ├── layout.tsx            # Fonts, FilmGrain, ContactModal, VideoModal, LayoutShell
│   │   └── page.tsx              # Enter gate — hero/social from Firestore, scroll/touch to enter
│   │
│   ├── components/
│   │   ├── ContactModal.tsx      # Contact form modal
│   │   ├── FilmEntry.tsx         # Film row (thumbnail, title, role, description)
│   │   ├── FilmGrain.tsx         # Film-grain overlay
│   │   ├── Footer.tsx            # Site footer
│   │   ├── LayoutShell.tsx       # Navbar + main + Footer (hidden on /admin)
│   │   ├── Lightbox.tsx          # Full-screen image viewer (keyboard, touch, prev/next)
│   │   ├── Navbar.tsx            # Fixed top nav
│   │   ├── PageTransition.tsx    # (stub)
│   │   ├── PhotoItem.tsx         # Photo grid item (imageUrl or gradient, tall/wide, label)
│   │   ├── ProjectCard.tsx       # Work card — imageUrl/videoUrl, opens VideoModal on click
│   │   ├── ScrollReveal.tsx     # Scroll fade-up
│   │   ├── Skeleton.tsx          # Loading skeletons (Work, Films, Photo, Clients, About)
│   │   └── VideoModal.tsx       # Video modal (open-video event, YouTube/Vimeo/direct embed)
│   │
│   ├── data/
│   │   └── projects.ts          # Static projects + clients (films, clients pages)
│   │
│   └── lib/
│       └── firebase.ts          # Firebase app, Auth, Firestore, Storage, Analytics
│
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── README.md
└── STRUCTURE.md
```

---

## Tech Stack

| Layer        | Technology                                    |
| ------------ | --------------------------------------------- |
| Framework    | Next.js 16 (App Router)                       |
| Language     | TypeScript                                    |
| Styling      | Tailwind CSS 4 (`@theme` in globals.css)     |
| Animations   | Framer Motion                                 |
| Fonts        | Chivo (sans) + Cormorant Garamond (serif)    |
| Backend      | Firebase (Auth, Firestore, Storage, Analytics)|
| Deployment   | Vercel-ready                                  |

---

## What Has Been Implemented

### Design System (`globals.css` + `tailwind.config.ts`)

- **Tailwind v4 theme**: `@theme` with `--color-bg`, `--color-tx`, `--color-gold`, `--font-sans`, `--font-serif`, `--ease-smooth`.
- **Base**: dark background, smooth scroll, gold scrollbar, film-grain keyframes.
- **Admin animations**: `@keyframes admin-fade-in`, `admin-fade-in-up`; utility `.animate-fade-in-up`.
- **tailwind.config.ts**: content paths, extended colors/fonts/easing.

### Root Layout (`layout.tsx`)

- Google Fonts (Chivo, Cormorant Garamond). Renders: `FilmGrain`, `ContactModal`, `VideoModal`, `LayoutShell`. VideoModal opens via `open-video` custom event (used by ProjectCard).

### LayoutShell (`LayoutShell.tsx`)

- Renders `Navbar` → `main` → `Footer` when path is **not** `/admin`; on `/admin` only `main`.

### Enter Gate / Homepage (`page.tsx`)

- **Hero image and Instagram** loaded from Firestore `siteSettings/main` (heroImage, instagram); fallback to local `/images/hero.jpeg` and default Instagram URL.
- Enter / Contact buttons; scroll-to-enter (wheel) and touch-swipe to enter; Contact opens modal via `open-contact`.

### Public Pages

- **Work** (`work/page.tsx`): Fetches from Firestore `projects` (`orderBy("order")`), excludes `category === "photography"`. Loading → `WorkSkeleton`. Grid of `ProjectCard` with `imageUrl`, `videoUrl`, `gradient`, etc. Click opens **VideoModal** when `videoUrl` is set.
- **About** (`about/page.tsx`): Two-column layout; static content (not yet from siteSettings).
- **Clients** (`clients/page.tsx`): Static `clients` from `data/projects.ts`; serif/sans styling, staggered motion.
- **Short Films** (`films/page.tsx`): Static `projects` filtered by film/documentary; `FilmEntry` per item.
- **Photography** (`photography/page.tsx`): Fetches from Firestore `photos` collection (`orderBy("order")`). Loading → `PhotoSkeleton`. Grid with `layout` (tall/wide) for row/col span. Click opens **Lightbox** (current index, navigate, close).

### Components

- **Navbar**: Fixed nav, links, Contact, active route, Instagram; hidden on `/` and `/login`. Inside LayoutShell.
- **Footer**: Copyright, credit; hidden on `/`. Inside LayoutShell.
- **ContactModal**: Full-screen overlay, form; `open-contact` event; close on Escape; submit not wired.
- **VideoModal** (`VideoModal.tsx`): Listens for `open-video` custom event (detail = video URL). Full-screen overlay; YouTube/Vimeo embed or direct video; close on Escape or backdrop click; body scroll lock.
- **ProjectCard**: `imageUrl` or `gradient`; `videoUrl`; onClick dispatches `open-video` when `videoUrl` present; play icon when `isVideo`.
- **Lightbox** (`Lightbox.tsx`): Full-screen image viewer. Props: `images` (imageUrl + label), `currentIndex`, `onClose`, `onNavigate`. Keyboard (Escape, ArrowLeft/Right), touch swipe, prev/next buttons; caption and index (e.g. 1 / N). Body scroll lock.
- **PhotoItem**: `imageUrl` or `gradient`; optional `tall`/`wide` for grid span; label on hover.
- **Skeleton** (`Skeleton.tsx`): Base `Skeleton` (shimmer block). **WorkSkeleton**, **FilmsSkeleton**, **PhotoSkeleton**, **ClientsSkeleton**, **AboutSkeleton** — page-specific loading placeholders.
- **FilmEntry**, **ScrollReveal**, **FilmGrain**: As before.

### Firebase (`lib/firebase.ts`)

- Single app init via `NEXT_PUBLIC_FIREBASE_*`. Exports: `db`, `storage`, `auth`, `app`, `analytics`.

### Authentication & Admin

- **Login** (`login/page.tsx`): Email/password, redirect to `/admin`, loading state.
- **Admin layout** (`admin/layout.tsx`): Auth guard. Nav: **Dashboard**, **Projects**, **Photography**, **Clients**, **Settings** (with icons). “View Site”, Sign Out.

- **Admin dashboard** (`admin/page.tsx`): Firestore stats; recent projects; quick actions by category; portfolio sections with links.

- **Projects list** (`admin/projects/page.tsx`): Firestore `projects`; filter tabs; table with thumbnail, category pills, featured, order; Edit / Delete.

- **Add/Edit project** (`admin/projects/new/page.tsx`): Split view; YouTube thumbnail auto-fetch; form fields; Storage upload; create/update.

- **Admin Photography** (`admin/photography/page.tsx`): Firestore `photos` collection. **Album filter** tabs (All + dynamic albums with counts). **Add photo** modal: label, album, layout (normal/tall/wide), file upload to Storage `photos/`. Table: drag handle, thumb, label/album, layout (cycle button), order, delete. **Drag-and-drop reorder** (when filter = All); batch update `order` via `writeBatch`. **Cycle layout** per photo (normal → tall → wide). Show/Hide **live preview** of public photography grid. Icons: Grip, Trash, Plus, Eye, Upload, Image, X; layout icons and colors.

- **Clients admin** (`admin/clients/page.tsx`): Firestore `clients`; add form; list; Show/Hide Preview.

- **Site settings** (`admin/settings/page.tsx`): `siteSettings/main`; section nav; hero image, about copy, details, social; live /about preview; save feedback.

### Data

- **Work**: Firestore `projects` (photography excluded).
- **Photography**: Firestore `photos` (label, album, layout, imageUrl, order).
- **Enter gate**: `siteSettings/main` (heroImage, instagram).
- **Films**, **Clients**: static `data/projects.ts`.

---

## Stubs / Not Yet Implemented

| Item                     | Status                                                                 |
| ------------------------ | ---------------------------------------------------------------------- |
| `PageTransition`         | Stub — passthrough wrapper, no animation                               |
| Contact form submit      | Form UI only; no backend or `onSubmit` handler                        |
| Navbar Contact button    | Present; verify dispatches `open-contact`                              |
| Public Films from Firestore | Films page uses static `projects.ts` filter                           |
| Public Clients from Firestore | Clients page uses static `clients` from `projects.ts`                |
| About from site settings | About page is static; not driven by `siteSettings/main`                 |
| Mobile hamburger menu    | Nav links `hidden md:flex`; no mobile menu                              |
