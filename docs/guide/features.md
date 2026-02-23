---
outline: [2, 3]
---

# Funkcje

## Przegląd grafiku

![Przegląd grafiku](/screenshots/schedule-overview.png)

Główny widok aplikacji — tabela z pracownikami, dniami miesiąca i przypisanymi zmianami. Weekendy i święta wyróżnione kolorem. Podsumowanie godzin po prawej stronie.

## Nagłówek i nawigacja

![Nagłówek](/screenshots/header.png)

Nawiguj między miesiącami, przeglądaj normę miesięczną i dostosowuj liczbę dni roboczych. Drukuj lub eksportuj za pomocą paska narzędzi.

## Typy zmian

| Skrót | Nazwa | Godziny | Kolor |
|:---:|---|---|---|
| **D** | Dyżur | 7:00–19:00 (12h) | 🔵 Niebieski |
| **D\*** | Dyżur alternatywny | 8:00–20:00 (12h) | 🟡 Żółty |
| **R** | Ranna | 7:00–14:35 (7:35h) | 🟢 Zielony |
| **•** | Pod telefonem | 0h | 🟣 Fioletowy |

::: tip Niestandardowe godziny
Oprócz predefiniowanych zmian, możesz ustawić dowolny zakres godzin za pomocą menu kontekstowego.
:::

## Cykliczna zmiana typów dyżurów

Kliknij dowolną komórkę, aby przełączać typy zmian:

**wolne → D → D\* → R → wolne**

![Cykliczna zmiana](/screenshots/shift-cycling.gif)

## Menu kontekstowe

Kliknij prawym przyciskiem myszy dowolną komórkę, aby uzyskać dostęp do pełnego menu opcji:

- Przypisanie konkretnej zmiany
- Ustawienie niestandardowego zakresu godzin
- Dodanie lub edycja notatki
- Wyczyszczenie komórki

![Menu kontekstowe](/screenshots/context-menu.gif)

## Edycja nazwy pracownika

Kliknij prawym przyciskiem myszy nazwę pracownika, aby zmienić imię lub usunąć pracownika:

![Edycja nazwy](/screenshots/edit-name.gif)

## Edycja normy

Kliknij prawym przyciskiem myszy komórkę normy, aby ustawić niestandardowy miesięczny cel godzinowy dla pracownika:

![Edycja normy](/screenshots/edit-norm.gif)

::: info Domyślna norma
Domyślna norma obliczana jest automatycznie: **liczba dni roboczych × 7:35h**. Nadpisanie dotyczy tylko wybranego pracownika i miesiąca.
:::

## Nawigacja po miesiącach

Nawiguj między miesiącami za pomocą przycisków strzałek. Dane każdego miesiąca zapisywane są osobno.

![Nawigacja po miesiącach](/screenshots/month-navigation.gif)

## Eksport i import

Eksportuj/importuj dane grafiku jako JSON lub przeglądaj surowy JSON do ręcznej edycji:

![Menu eksportu](/screenshots/export-menu.gif)

## Legenda i skróty klawiszowe

Legenda zmian i lista skrótów klawiszowych dostępna na dole strony:

![Legenda](/screenshots/legend.png)

### Skróty klawiszowe

| Skrót | Akcja |
|---|---|
| **Klik na komórkę** | Zmień zmianę (cykl: wolne → D → D\* → R) |
| **Prawy klik na komórkę** | Menu zmian + rotacji |
| **Shift + klik na komórkę** | Dodaj nadgodziny |
| **Prawy klik na nazwisko** | Edytuj lub usuń pracownika |
| **Prawy klik na normę** | Edytuj indywidualną normę |
