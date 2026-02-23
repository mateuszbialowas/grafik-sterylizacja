# Data Storage

All data is persisted in the browser's `localStorage`. No server or database is required.

## localStorage Keys

| Key | Contents |
|---|---|
| `grafik-shared` | Employee list (persists across months) |
| `grafik-{YYYY}-{MM}` | Shifts, overtime, notes, norm overrides for a given month |
| `grafik-current` | Last viewed year/month |

## Export & Import

Data can be exported to a JSON file via the export menu. This allows you to:

- **Create backups** — export before making large changes
- **Transfer data** — import on a different computer/browser
- **Manual editing** — view and modify raw JSON

![Export Menu](/screenshots/export-menu.gif)

## Important

::: warning Note
localStorage data is tied to a specific browser and domain. Clearing browser data will delete all schedules. Back up regularly using the export feature.
:::
