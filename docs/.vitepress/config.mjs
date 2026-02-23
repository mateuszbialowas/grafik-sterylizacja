import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/grafik-sterylizacja/',
  title: 'Grafik Sterylizacja',
  description: 'Aplikacja do zarządzania grafikiem pracy techników sterylizacji',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/grafik-sterylizacja/favicon.svg' }],
  ],

  locales: {
    root: {
      label: 'Polski',
      lang: 'pl',
      themeConfig: {
        nav: [
          { text: 'Przewodnik', link: '/guide/getting-started' },
          { text: 'Pobierz', link: '/grafik-sterylizacja/grafik-sterylizacja.html' },
          { text: 'Aplikacja', link: '/app/', target: '_blank' },
        ],
        sidebar: [
          {
            text: 'Wprowadzenie',
            items: [
              { text: 'Rozpoczęcie pracy', link: '/guide/getting-started' },
            ],
          },
          {
            text: 'Użytkowanie',
            items: [
              { text: 'Funkcje', link: '/guide/features' },
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
        outline: { label: 'Na tej stronie' },
        docFooter: { prev: 'Poprzednia', next: 'Następna' },
      },
    },
    en: {
      label: 'English',
      lang: 'en',
      title: 'Sterilization Schedule',
      description: 'Shift scheduling app for sterilization technicians',
      themeConfig: {
        nav: [
          { text: 'Guide', link: '/en/guide/getting-started' },
          { text: 'Download', link: '/grafik-sterylizacja/grafik-sterylizacja.html' },
          { text: 'Live App', link: '/app/', target: '_blank' },
        ],
        sidebar: [
          {
            text: 'Introduction',
            items: [
              { text: 'Getting Started', link: '/en/guide/getting-started' },
            ],
          },
          {
            text: 'Usage',
            items: [
              { text: 'Features', link: '/en/guide/features' },
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
        outline: { label: 'On this page' },
      },
    },
  },

  themeConfig: {
    logo: '/logo.svg',
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mateuszbialowas/grafik-sterylizacja' },
    ],
  },
})
