---
outline: [2, 3]
---

# Project Structure

## File Tree

```
src/
  constants.js            Shift types, layout constants, month names
  utils.js                Time parsing, formatting, hour calculations
  context/
    ScheduleContext.jsx    React Context provider + useSchedule hook
  hooks/
    useScheduleData.js     Core CRUD operations for schedule data
    useMonthNavigation.js  Month/year state + localStorage persistence
    useImportExport.js     JSON export/import logic
    useLocalStorage.js     Generic localStorage hook
    useContextMenu.js      Context menu positioning
    useToasts.js           Toast notification state
  components/
    ScheduleApp.jsx        Main app shell
    ScheduleHeader.jsx     Title, norm display, print button
    MonthNavigator.jsx     Month prev/next navigation
    ExportMenu.jsx         JSON export/import dropdown
    ShiftCell.jsx          Individual shift cell in the table
    OvertimeCell.jsx       Individual overtime cell
    OvertimeSection.jsx    Overtime rows section
    Legend.jsx             Shift legend + keyboard shortcuts
    Button.jsx             Reusable button with variants
    Modal.jsx              Reusable modal base (overlay, Esc, focus)
    Icons.jsx              All SVG icon components
  utils/
    printSchedule.js       Print layout generator
```

## Architecture

The app uses a **Context + Hooks** pattern:

### ScheduleContext

Centralized app state via `ScheduleProvider`. All components access schedule data through the `useSchedule` hook.

### Specialized Hooks

| Hook | Responsibility |
|---|---|
| `useScheduleData` | Schedule operations (CRUD) |
| `useMonthNavigation` | Month/year state |
| `useImportExport` | Import/export logic |
| `useContextMenu` | Menu positioning |
| `useModals` | Modal state |
| `useToasts` | Notifications |

## Build

The production build uses `vite-plugin-singlefile` to bundle the entire app into a single `index.html` file (~280 KB).

::: info No server needed
The output file can be opened directly in a browser — no HTTP server required.
:::
