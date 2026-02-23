---
outline: [2, 3]
---

# Rozpoczęcie pracy

::: tip Szybki start
Nie musisz nic instalować, aby korzystać z aplikacji. Po prostu [pobierz plik HTML](/grafik-sterylizacja.html) lub [otwórz aplikację online](/app/).

Poniższe instrukcje dotyczą uruchomienia środowiska deweloperskiego.
:::

## Wymagania

- Node.js 18+
- npm

## Instalacja

```bash
git clone https://github.com/mateuszbialowas/grafik-sterylizacja.git
cd grafik-sterylizacja
npm install
```

## Uruchomienie (tryb deweloperski)

```bash
npm run dev
```

Aplikacja otworzy się pod adresem `http://localhost:5173`.

## Build produkcyjny

```bash
npm run build
```

Generuje pojedynczy plik `dist/index.html` (~280 KB), który można otworzyć bezpośrednio w przeglądarce lub hostować na dowolnym serwerze statycznym.

## Linting

```bash
npm run lint
```

## Stos technologiczny

| Technologia | Zastosowanie |
|---|---|
| **React** 19 | Interfejs użytkownika |
| **Vite** 7 | Narzędzie do budowania i serwer deweloperski |
| **Tailwind CSS** 4 | Stylowanie |
| **vite-plugin-singlefile** | Pakowanie do jednego pliku HTML |

::: info Brak zależności zewnętrznych
Aplikacja nie korzysta z żadnych zewnętrznych bibliotek UI, backendu ani bazy danych. Czysta aplikacja kliencka React + localStorage.
:::
