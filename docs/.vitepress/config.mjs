import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/grafik-sterylizacja/',
  title: 'Grafik Sterylizacja',
  description: 'Aplikacja do zarządzania grafikiem pracy techników sterylizacji',

  locales: {
    root: {
      label: 'Polski',
      lang: 'pl',
      themeConfig: {
        nav: [
          { text: 'Przewodnik', link: '/guide/getting-started' },
          { text: 'Aplikacja', link: '/app/', target: '_blank' },
        ],
        sidebar: [
          {
            text: 'Przewodnik',
            items: [
              { text: 'Rozpoczęcie pracy', link: '/guide/getting-started' },
              { text: 'Funkcje', link: '/guide/features' },
              { text: 'Przechowywanie danych', link: '/guide/data-storage' },
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
          { text: 'Live App', link: '/app/', target: '_blank' },
        ],
        sidebar: [
          {
            text: 'Guide',
            items: [
              { text: 'Getting Started', link: '/en/guide/getting-started' },
              { text: 'Features', link: '/en/guide/features' },
              { text: 'Data Storage', link: '/en/guide/data-storage' },
              { text: 'Project Structure', link: '/en/guide/project-structure' },
            ],
          },
        ],
        outline: { label: 'On this page' },
      },
    },
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/mateuszbialowas/grafik-sterylizacja' },
    ],
  },
})
