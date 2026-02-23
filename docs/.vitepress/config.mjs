import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/grafik-sterylizacja/',
  title: 'Grafik Sterylizacja',
  description: 'Aplikacja do zarządzania grafikiem pracy techników sterylizacji',
  lastUpdated: true,
  ignoreDeadLinks: [
    /^\/grafik-sterylizacja(\.html)?$/,
    /^\/app(\/|$)/,
  ],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/grafik-sterylizacja/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#3B82F6' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Grafik Sterylizacja' }],
    ['meta', { property: 'og:description', content: 'Aplikacja do zarządzania grafikiem pracy techników sterylizacji' }],
  ],

  locales: {
    root: {
      label: 'Polski',
      lang: 'pl',
      themeConfig: {
        nav: [
          { text: '🇬🇧 English', link: '/en/' },
          { text: 'Przewodnik', link: '/guide/getting-started' },
          { text: 'Pobierz', link: '/grafik-sterylizacja.html' },
          { text: 'Aplikacja', link: '/app/', target: '_blank' },
        ],
        sidebar: [
          {
            text: 'Wprowadzenie',
            items: [
              { text: 'Rozpoczęcie pracy', link: '/guide/getting-started' },
              { text: 'Funkcje', link: '/guide/features' },
            ],
          },
          {
            text: 'Użytkowanie',
            items: [
              { text: 'Przechowywanie danych', link: '/guide/data-storage' },
            ],
          },
          {
            text: 'Dla deweloperów',
            items: [
              { text: 'Struktura projektu', link: '/guide/project-structure' },
            ],
          },
        ],
        outline: { label: 'Na tej stronie', level: [2, 3] },
        docFooter: { prev: 'Poprzednia', next: 'Następna' },
        lastUpdated: { text: 'Ostatnia aktualizacja' },
        returnToTopLabel: 'Powrót na górę',
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'Sterilization Schedule',
      description: 'Shift scheduling app for sterilization technicians',
      themeConfig: {
        nav: [
          { text: '🇵🇱 Polski', link: '/' },
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'Download', link: '/grafik-sterylizacja.html' },
          { text: 'Live App', link: '/app/', target: '_blank' },
        ],
        sidebar: [
          {
            text: 'Introduction',
            items: [
              { text: 'Getting Started', link: '/en/guide/getting-started' },
              { text: 'Features', link: '/en/guide/features' },
            ],
          },
          {
            text: 'Usage',
            items: [
              { text: 'Data Storage', link: '/en/guide/data-storage' },
            ],
          },
          {
            text: 'For Developers',
            items: [
              { text: 'Project Structure', link: '/en/guide/project-structure' },
            ],
          },
        ],
        outline: { label: 'On this page', level: [2, 3] },
        lastUpdated: { text: 'Last updated' },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Szukaj', buttonAriaLabel: 'Szukaj' },
              modal: {
                noResultsText: 'Brak wyników dla',
                resetButtonTitle: 'Wyczyść wyszukiwanie',
                footer: { selectText: 'Wybierz', navigateText: 'Nawiguj', closeText: 'Zamknij' },
              },
            },
          },
        },
      },
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mateuszbialowas/grafik-sterylizacja' },
    ],
  },
})
