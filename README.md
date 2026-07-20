# Ma Bibliothèque

A bilingual (FR/EN) interactive dashboard visualizing my real Apple Music library export: 5,115 tracks, 49,038 plays, additions spanning 2018–2026. A portrait of one listener's taste and habits over eight years.

**Live:** https://ma-bibliotheque-marctche.vercel.app

## Stack

- Vite + React 18 + Recharts
- Hand-rolled i18n (`src/i18n/`) using `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.PluralRules`, `Intl.RelativeTimeFormat`, `Intl.Collator` — no i18n library
- No backend — a Python script (`scripts/extract.py`) parses the Apple Music XML export once at build time into a static aggregated JSON (`src/data/library.json`)

## Dashboard

- **Library activity** — a GitHub-style contribution grid of daily library adds, with year tabs and keyboard-accessible tooltips
- **Genre drift** — stacked area chart of genre share per year, with a Total/Genres toggle
- **Top artists** — horizontal bar chart of the most-added artists, filterable by year
- **Artist loyalty** — bump chart of yearly artist rank, with hover-to-isolate
- **Played vs Shelved** — stacked bar chart of tracks played at least once vs. never played, with a Count/Percent toggle

## Running locally

```bash
python3 scripts/extract.py   # regenerate src/data/library.json from Bibliothèque.xml
bun install
bun run dev
```

## Data

`Bibliothèque.xml` is a real, personal Apple Music library export (Music.app → File → Library → Export Library). `scripts/extract.py` normalizes raw genre tags into six buckets (hip-hop, R&B, alt-rock, pop, electronic, other) and aggregates daily adds, yearly genre/artist breakdowns, artist loyalty rankings, and played-vs-shelved counts — no per-track data ships to the client.
