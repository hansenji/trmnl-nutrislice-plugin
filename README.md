# TRMNL Nutrislice Lunch Menu Plugin

A clean, high-readability TRMNL e-ink display plugin that fetches and formats school lunch menus from Nutrislice. This version is designed specifically for **maximum legibility**, featuring:

- **No pictures/images** to keep the screen uncluttered.
- **Dotted outline card layout** (`outline`) separating the weekdays clearly.
- **Enhanced typography hierarchy** with bold, easy-to-read headers and descriptions.
- **Dynamic fallbacks and variables** to avoid hardcoding your specific school details directly in the git repository (keeping your location private when publishing).

---

## Features

- **Full Screen Layout**: 5 columns wrapped in dotted borders. Includes main dish in bold and sides beneath.
- **Half Horizontal Layout**: 5 columns for the days of the week focusing strictly on the main meal.
- **Half Vertical Layout**: A 2-column list layout showing the date/day alongside the main meal and sides.
- **Quadrant Layout**: A highly compact vertical overview for mashups.
- **Dynamic Mode (Vercel)**: Automatically handles current dates, weekend roll-forwards, and fetches on-the-fly.
- **Static Mode (GitHub Actions)**: Automatically fetches the menu every day at 7 AM UTC and commits it to `menu.json`.

---

## Setup Instructions

### 1. Configure Secrets and Variables (Recommended)
To keep your school information secure and anonymous in public source code, configure the following variables locally in a `.env` file, or as environment variables on Vercel/GitHub:

- `NUTRISLICE_DISTRICT`: The subdomain of your school's Nutrislice URL (e.g., `jordandistrict` for `jordandistrict.nutrislice.com`).
- `NUTRISLICE_SCHOOL_ID`: The last part of your school's menu URL (e.g., `oak-leaf` for `/menu/oak-leaf`).
- `MEAL_TYPE` (Optional): Defaults to `lunch`. Can be set to `breakfast` or `lunch`.

### 2. Local Testing
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your school's values:
   ```bash
   cp .env.example .env
   ```
4. Run locally (using Vercel CLI or similar local node scripts).

### 3. Deployment Options

#### Option A: Dynamic API (Vercel)
1. Deploy this repository to Vercel (using the Vercel GitHub Integration or Vercel CLI).
2. Set your environment variables (`NUTRISLICE_DISTRICT` and `NUTRISLICE_SCHOOL_ID`) in your Vercel Project Settings.
3. In your TRMNL Custom Plugin settings, use your Vercel deployment URL:
   `https://your-project.vercel.app/api/menu`
   *Note: If you want to check a different school dynamically, you can pass query parameters: `https://your-project.vercel.app/api/menu?district=other-district&school=other-school-id`*

#### Option B: Static JSON (GitHub Pages / Raw Content)
1. Create a new GitHub repository and push this codebase.
2. Go to repository **Settings** -> **Secrets and variables** -> **Actions** -> **Variables** tab.
3. Add Repository Variables:
   - `NUTRISLICE_DISTRICT`
   - `NUTRISLICE_SCHOOL_ID`
   - `MEAL_TYPE` (Optional, defaults to `lunch`)
4. Enable Actions in your repository to let the daily update workflow run.
5. In your TRMNL Custom Plugin settings, configure the URL to the raw file:
   `https://raw.githubusercontent.com/your-username/your-repo-name/main/menu.json`

### 4. HTML Markup Configuration
Copy the markup from the files in this repository into your TRMNL plugin's dashboard:
- For Full screen view: [trmnl_markup.html](file:///home/hansenji/src/trmnl/nutrislice-plugin/trmnl_markup.html)
- For Half horizontal view: [trmnl_markup_half_horizontal.html](file:///home/hansenji/src/trmnl/nutrislice-plugin/trmnl_markup_half_horizontal.html)
- For Half vertical view: [trmnl_markup_half_vertical.html](file:///home/hansenji/src/trmnl/nutrislice-plugin/trmnl_markup_half_vertical.html)
- For Quadrant view: [trmnl_markup_quadrant.html](file:///home/hansenji/src/trmnl/nutrislice-plugin/trmnl_markup_quadrant.html)

---

## License

MIT
