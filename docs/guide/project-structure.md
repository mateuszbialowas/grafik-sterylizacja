# Struktura projektu

```
src/
  constants.js           Typy zmian, stałe layoutu, nazwy miesięcy
  utils.js               Parsowanie czasu, formatowanie, obliczanie godzin
  context/
    ScheduleContext.jsx   Provider React Context + hook useSchedule
  hooks/
    useScheduleData.js    Operacje CRUD na danych grafiku
    useMonthNavigation.js Stan miesiąca/roku + persystencja localStorage
    useImportExport.js    Logika eksportu/importu JSON
    useLocalStorage.js    Generyczny hook localStorage
    useContextMenu.js     Pozycjonowanie menu kontekstowego
    useToasts.js          Stan powiadomień toast
  components/
    ScheduleApp.jsx       Główna powłoka aplikacji
    ScheduleHeader.jsx    Tytuł, wyświetlanie normy, przycisk druku
    MonthNavigator.jsx    Nawigacja miesiąc wprzód/wstecz
    ExportMenu.jsx        Dropdown eksportu/importu JSON
    ShiftCell.jsx         Pojedyncza komórka zmiany w tabeli
    OvertimeCell.jsx      Pojedyncza komórka nadgodzin
    OvertimeSection.jsx   Sekcja wierszy nadgodzin
    Legend.jsx            Legenda zmian + skróty klawiszowe
    Button.jsx            Komponent przycisku z wariantami
    Modal.jsx             Bazowy komponent modalu (overlay, Esc, fokus)
    Icons.jsx             Wszystkie komponenty ikon SVG
  utils/
    printSchedule.js      Generator layoutu do druku
```

## Architektura

Aplikacja korzysta z wzorca **Context + Hooks**:

- **ScheduleContext** — scentralizowany stan aplikacji przez `ScheduleProvider`
- Zarządzanie stanem podzielone na wyspecjalizowane hooki:
  - `useScheduleData` — operacje na grafiku (CRUD)
  - `useMonthNavigation` — stan miesiąca/roku
  - `useImportExport` — logika importu/eksportu
  - `useContextMenu` — pozycjonowanie menu
  - `useModals` — stan modali
  - `useToasts` — powiadomienia

## Build

Produkcyjny build wykorzystuje `vite-plugin-singlefile`, aby spakować całą aplikację do jednego pliku `index.html` (~280 KB). Plik ten można otworzyć bezpośrednio w przeglądarce bez serwera.
