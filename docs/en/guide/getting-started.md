# Getting Started

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
git clone https://github.com/mateuszbialowas/grafik-sterylizacja.git
cd grafik-sterylizacja
npm install
```

## Development

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## Production Build

```bash
npm run build
```

Outputs a single `dist/index.html` file (~280 KB) that can be opened directly in a browser or hosted on any static server.

## Linting

```bash
npm run lint
```

## Tech Stack

| Technology | Purpose |
|---|---|
| **React** 19 | UI framework |
| **Vite** 7 | Build tool & dev server |
| **Tailwind CSS** 4 | Styling |
| **vite-plugin-singlefile** | Bundles everything into one HTML file |

No external UI libraries, backend, or database. Pure client-side React + localStorage.
