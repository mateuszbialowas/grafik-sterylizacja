---
outline: [2, 3]
---

# Przechowywanie danych

Wszystkie dane są przechowywane w `localStorage` przeglądarki. Nie jest wymagany serwer ani baza danych.

## Klucze localStorage

| Klucz | Zawartość |
|---|---|
| `grafik-shared` | Lista pracowników (wspólna dla wszystkich miesięcy) |
| `grafik-{RRRR}-{MM}` | Zmiany, nadgodziny, notatki, nadpisania normy dla danego miesiąca |
| `grafik-current` | Ostatnio przeglądany rok/miesiąc |

## Eksport i import

Dane można wyeksportować do pliku JSON za pomocą menu eksportu. Pozwala to na:

- **Tworzenie kopii zapasowych** — eksport przed wprowadzeniem dużych zmian
- **Przenoszenie danych** — import na innym komputerze/w innej przeglądarce
- **Ręczną edycję** — przeglądanie i modyfikacja surowego JSON

![Menu eksportu](/screenshots/export-menu.gif)

## Ważne informacje

::: warning Uwaga — dane lokalne
Dane localStorage są powiązane z konkretną przeglądarką i domeną. Wyczyszczenie danych przeglądarki spowoduje utratę grafików.
:::

::: tip Regularne kopie zapasowe
Zalecamy regularne tworzenie kopii zapasowych za pomocą funkcji eksportu JSON, szczególnie przed końcem miesiąca.
:::
