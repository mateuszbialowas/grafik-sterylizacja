const defaults = { fill: "none", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };

function Svg({ size = 16, children, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...defaults} {...props}>
      {children}
    </svg>
  );
}

export function IconEdit({ size = 16, stroke = "#4a5565", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </Svg>
  );
}

export function IconEditSmall({ size = 12, stroke = "#432dd7", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
    </Svg>
  );
}

export function IconTrash({ size = 16, stroke = "#e7000b", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </Svg>
  );
}

export function IconClock({ size = 16, stroke = "#4a5565", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </Svg>
  );
}

export function IconAlert({ size = 20, stroke = "#e7000b", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </Svg>
  );
}

export function IconPrinter({ size = 16, stroke = "#0a0a0a", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <path d="M6 9V2h12v7" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x="6" y="14" width="12" height="8" />
    </Svg>
  );
}

export function IconMoreVertical({ size = 16, stroke = "#0a0a0a", ...props }) {
  return (
    <Svg size={size} stroke={stroke} strokeLinejoin={undefined} {...props}>
      <circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" />
    </Svg>
  );
}

export function IconDownload({ size = 16, stroke = "#4a5565", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </Svg>
  );
}

export function IconUpload({ size = 16, stroke = "#4a5565", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </Svg>
  );
}

export function IconCode({ size = 16, stroke = "#4a5565", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </Svg>
  );
}

export function IconChevronLeft({ size = 15, stroke = "#0a0a0a", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <polyline points="15 18 9 12 15 6" />
    </Svg>
  );
}

export function IconChevronRight({ size = 15, stroke = "#0a0a0a", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <polyline points="9 18 15 12 9 6" />
    </Svg>
  );
}

export function IconChevronDown({ size = 16, stroke = "#6a7282", className, ...props }) {
  return (
    <Svg size={size} stroke={stroke} className={className} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </Svg>
  );
}

export function IconCalendar({ size = 15, stroke = "#0a0a0a", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  );
}

export function IconInfo({ size = 16, stroke = "#6a7282", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
    </Svg>
  );
}

export function IconPlus({ size = 14, stroke = "white", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </Svg>
  );
}

export function IconError({ size = 16, stroke = "#b91c1c", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
    </Svg>
  );
}

export function IconSuccess({ size = 16, stroke = "#016630", ...props }) {
  return (
    <Svg size={size} stroke={stroke} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </Svg>
  );
}

export function IconNote({ className }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 14 14" fill="none">
      <path d="M2 1h7l4 4v7H2V1z" fill="#f59e0b" stroke="#b45309" strokeWidth="0.5" />
      <path d="M9 1v4h4" fill="#d97706" />
      <line x1="4.5" y1="6.5" x2="10" y2="6.5" stroke="#92400e" strokeWidth="0.8" />
      <line x1="4.5" y1="8.5" x2="10" y2="8.5" stroke="#92400e" strokeWidth="0.8" />
      <line x1="4.5" y1="10.5" x2="8" y2="10.5" stroke="#92400e" strokeWidth="0.8" />
    </svg>
  );
}
