<div align="center">

<img src="public/logo.svg" alt="Grafik Sterylizacja" width="80" />

# Grafik Sterylizacja

**Shift scheduling app for sterilization technicians**

A lightweight, offline-first single-page application for managing monthly work schedules of Centralna Sterylizacja staff. One HTML file — no server, no database, no install.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-Private-gray)]()

[Live App](https://mateuszbialowas.github.io/grafik-sterylizacja/app/) · [Documentation](https://mateuszbialowas.github.io/grafik-sterylizacja/) · [Dokumentacja (PL)](https://mateuszbialowas.github.io/grafik-sterylizacja/)

</div>

---

![Schedule Overview](screenshots/schedule-overview.png)

## Features

| Feature | Description |
|---|---|
| **4 shift types** | Dyżur (D), Dyżur alt. (D\*), Ranna (R), Pod telefonem (•) + custom time ranges |
| **Click-to-cycle** | Left-click cells to rotate shifts (wolne → D → D\* → R) |
| **Context menu** | Right-click for full options — assign shifts, notes, custom hours |
| **Overtime tracking** | Dedicated section for recording extra hours per employee per day |
| **Monthly norm** | Auto-calculates hours vs. norm (days × 7:35h), per-employee overrides |
| **Notes & requests** | Attach notes to any cell (vacation, training, etc.) |
| **Print-ready** | Landscape-optimized layout with legend |
| **JSON export/import** | Backup, restore, and transfer schedule data |
| **Offline-first** | All data in localStorage — no server, no login |
| **Single-file build** | Production output is one `index.html` (~280 KB) |

<details>
<summary><strong>Screenshots</strong></summary>

### Header & Navigation

![Header](screenshots/header.png)

### Shift Cycling

![Shift Cycling](screenshots/shift-cycling.gif)

### Context Menu

![Context Menu](screenshots/context-menu.gif)

### Edit Employee Name

![Edit Name](screenshots/edit-name.gif)

### Edit Norm

![Edit Norm](screenshots/edit-norm.gif)

### Month Navigation

![Month Navigation](screenshots/month-navigation.gif)

### Export Menu

![Export Menu](screenshots/export-menu.gif)

### Legend & Keyboard Shortcuts

![Legend](screenshots/legend.png)

</details>

## Quick Start

> **Just want the app?** [Download the HTML file](https://mateuszbialowas.github.io/grafik-sterylizacja/grafik-sterylizacja.html) — open it in any browser, no install needed.

### Development

```bash
git clone https://github.com/mateuszbialowas/grafik-sterylizacja.git
cd grafik-sterylizacja
npm install
npm run dev        # http://localhost:5173
```

### Production Build

```bash
npm run build      # → dist/index.html (~280 KB)
```

### Other Commands

```bash
npm run lint           # ESLint
npm run docs:dev       # VitePress docs dev server
npm run docs:build     # Build documentation
```

## Tech Stack

| | Technology | Purpose |
|---|---|---|
| <img src="https://cdn.simpleicons.org/react/61DAFB" width="16" /> | **React** 19 | UI framework |
| <img src="https://cdn.simpleicons.org/vite/646CFF" width="16" /> | **Vite** 7 | Build tool & dev server |
| <img src="https://cdn.simpleicons.org/tailwindcss/06B6D4" width="16" /> | **Tailwind CSS** 4 | Styling |
| | **vite-plugin-singlefile** | Bundles into one HTML file |
| <img src="https://cdn.simpleicons.org/vitepress/646CFF" width="16" /> | **VitePress** | Documentation site |

No external UI libraries, backend, or database. Pure client-side React + localStorage.

## Data Storage

All data is persisted in the browser's `localStorage`:

| Key | Contents |
|---|---|
| `grafik-shared` | Employee list (shared across months) |
| `grafik-{YYYY}-{MM}` | Shifts, overtime, notes, norm overrides for a given month |
| `grafik-current` | Last viewed year/month |

> **Tip:** Use the JSON export feature to back up your data regularly.

## Project Structure

```
src/
├── constants.js              Shift types, layout constants, month names
├── utils.js                  Time parsing, formatting, hour calculations
├── context/
│   └── ScheduleContext.jsx   React Context provider + useSchedule hook
├── hooks/
│   ├── useScheduleData.js    Core CRUD operations for schedule data
│   ├── useMonthNavigation.js Month/year state + localStorage persistence
│   ├── useImportExport.js    JSON export/import logic
│   ├── useLocalStorage.js    Generic localStorage hook
│   ├── useContextMenu.js     Context menu positioning
│   └── useToasts.js          Toast notification state
├── components/
│   ├── ScheduleApp.jsx       Main app shell
│   ├── ScheduleTable.jsx     Main shift grid table
│   ├── ScheduleHeader.jsx    Title, norm display, print button
│   ├── MonthNavigator.jsx    Month prev/next navigation
│   ├── ExportMenu.jsx        JSON export/import dropdown
│   ├── ShiftCell.jsx         Individual shift cell
│   ├── Legend.jsx            Shift legend + keyboard shortcuts
│   ├── Modal.jsx             Reusable modal (overlay, Esc, focus trap)
│   └── ...                   Button, Icons, Tooltips, Context menus
└── utils/
    └── printSchedule.js      Print layout generator
```

## Links

| | |
|---|---|
| **Live App** | https://mateuszbialowas.github.io/grafik-sterylizacja/app/ |
| **Documentation** | https://mateuszbialowas.github.io/grafik-sterylizacja/ |
| **Download** | [grafik-sterylizacja.html](https://mateuszbialowas.github.io/grafik-sterylizacja/grafik-sterylizacja.html) |
