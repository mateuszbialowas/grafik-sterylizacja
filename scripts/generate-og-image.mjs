// Generates an OG image as an HTML file, then uses the schedule-overview screenshot as the base
// Since we can't generate PNG from Node without dependencies, we'll create an SVG-based OG image

import { writeFileSync } from 'fs';

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="white"/>

  <!-- Blue gradient top bar -->
  <rect width="1200" height="6" fill="#3B82F6"/>

  <!-- Logo -->
  <rect x="80" y="80" width="64" height="64" rx="12" fill="#3B82F6"/>
  <rect x="96" y="92" width="5" height="28" rx="1" fill="white"/>
  <rect x="86" y="104" width="20" height="5" rx="1" fill="white"/>
  <rect x="112" y="94" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
  <rect x="112" y="102" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
  <rect x="112" y="110" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
  <rect x="120" y="94" width="4" height="4" rx="1" fill="white" opacity="0.6"/>
  <rect x="120" y="102" width="4" height="4" rx="1" fill="white" opacity="0.6"/>

  <!-- Title -->
  <text x="160" y="105" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" fill="#111827">Grafik Sterylizacja</text>
  <text x="160" y="138" font-family="system-ui, -apple-system, sans-serif" font-size="20" fill="#6B7280">Zarządzanie grafikiem pracy techników sterylizacji</text>

  <!-- Shift type pills -->
  <rect x="80" y="180" width="80" height="36" rx="8" fill="#DBEAFE"/>
  <text x="100" y="204" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#193CB8">Dyżur</text>

  <rect x="172" y="180" width="56" height="36" rx="8" fill="#FEF3C6"/>
  <text x="185" y="204" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#973C00">D*</text>

  <rect x="240" y="180" width="80" height="36" rx="8" fill="#DCFCE7"/>
  <text x="256" y="204" font-family="system-ui, sans-serif" font-size="16" font-weight="600" fill="#016630">Ranna</text>

  <rect x="332" y="180" width="36" height="36" rx="8" fill="#F3E8FF"/>
  <text x="344" y="205" font-family="system-ui, sans-serif" font-size="18" font-weight="600" fill="#6B21A8">•</text>

  <!-- Features -->
  <text x="80" y="270" font-family="system-ui, sans-serif" font-size="18" fill="#374151">✓  Offline-first — dane w przeglądarce, bez serwera</text>
  <text x="80" y="305" font-family="system-ui, sans-serif" font-size="18" fill="#374151">✓  Jeden plik HTML (~280 KB) — wyślij e-mailem</text>
  <text x="80" y="340" font-family="system-ui, sans-serif" font-size="18" fill="#374151">✓  Druk, eksport JSON, śledzenie nadgodzin</text>

  <!-- Decorative grid (representing schedule) -->
  <g transform="translate(700, 80)" opacity="0.9">
    <!-- Table header -->
    <rect width="420" height="40" rx="8" fill="#F9FAFB" stroke="#E5E7EB"/>
    <text x="16" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#6B7280">Pracownik</text>
    <text x="120" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#6B7280">1</text>
    <text x="155" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#6B7280">2</text>
    <text x="190" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#6B7280">3</text>
    <text x="225" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#6B7280">4</text>
    <text x="260" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#E7000B">5</text>
    <text x="295" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#E7000B">6</text>
    <text x="330" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#6B7280">7</text>
    <text x="365" y="26" font-family="system-ui, sans-serif" font-size="13" font-weight="600" fill="#6B7280">8</text>

    <!-- Row 1 -->
    <rect y="44" width="420" height="36" fill="white" stroke="#E5E7EB"/>
    <text x="16" y="68" font-family="system-ui, sans-serif" font-size="13" fill="#111827">Anna Kowalska</text>
    <rect x="110" y="50" width="32" height="24" rx="4" fill="#DBEAFE"/>
    <text x="119" y="67" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#193CB8">D</text>
    <rect x="180" y="50" width="32" height="24" rx="4" fill="#DBEAFE"/>
    <text x="189" y="67" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#193CB8">D</text>
    <rect x="215" y="50" width="32" height="24" rx="4" fill="#DCFCE7"/>
    <text x="225" y="67" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#016630">R</text>
    <rect x="320" y="50" width="32" height="24" rx="4" fill="#DBEAFE"/>
    <text x="329" y="67" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#193CB8">D</text>

    <!-- Row 2 -->
    <rect y="84" width="420" height="36" fill="#FAFAFA" stroke="#E5E7EB"/>
    <text x="16" y="108" font-family="system-ui, sans-serif" font-size="13" fill="#111827">Jan Nowak</text>
    <rect x="145" y="90" width="32" height="24" rx="4" fill="#DCFCE7"/>
    <text x="155" y="107" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#016630">R</text>
    <rect x="180" y="90" width="32" height="24" rx="4" fill="#DCFCE7"/>
    <text x="190" y="107" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#016630">R</text>
    <rect x="320" y="90" width="32" height="24" rx="4" fill="#FEF3C6"/>
    <text x="327" y="107" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#973C00">D*</text>
    <rect x="355" y="90" width="32" height="24" rx="4" fill="#DBEAFE"/>
    <text x="364" y="107" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#193CB8">D</text>

    <!-- Row 3 -->
    <rect y="124" width="420" height="36" fill="white" stroke="#E5E7EB"/>
    <text x="16" y="148" font-family="system-ui, sans-serif" font-size="13" fill="#111827">Maria Wiśniewska</text>
    <rect x="110" y="130" width="32" height="24" rx="4" fill="#DBEAFE"/>
    <text x="119" y="147" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#193CB8">D</text>
    <rect x="145" y="130" width="32" height="24" rx="4" fill="#DBEAFE"/>
    <text x="154" y="147" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#193CB8">D</text>
    <rect x="215" y="130" width="32" height="24" rx="4" fill="#F3E8FF"/>
    <text x="226" y="148" font-family="system-ui, sans-serif" font-size="14" font-weight="600" fill="#6B21A8">•</text>
    <rect x="355" y="130" width="32" height="24" rx="4" fill="#DCFCE7"/>
    <text x="365" y="147" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#016630">R</text>

    <!-- Fade out rows -->
    <rect y="164" width="420" height="60" fill="url(#fadeOut)"/>
  </g>

  <defs>
    <linearGradient id="fadeOut" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="white" stop-opacity="0"/>
      <stop offset="1" stop-color="white" stop-opacity="1"/>
    </linearGradient>
  </defs>

  <!-- Bottom bar -->
  <rect y="560" width="1200" height="70" fill="#F9FAFB"/>
  <text x="80" y="602" font-family="system-ui, sans-serif" font-size="16" fill="#9CA3AF">mateuszbialowas.github.io/grafik-sterylizacja</text>
  <text x="1120" y="602" font-family="system-ui, sans-serif" font-size="16" fill="#9CA3AF" text-anchor="end">~280 KB</text>
</svg>`;

writeFileSync('public/og-image.svg', svg);
console.log('Generated public/og-image.svg');
