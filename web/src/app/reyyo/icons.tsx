// Colorful playful SVG icon set — Reyyo brand style

type IconProps = { size?: number; className?: string };

function Svg({ size = 24, children }: { size?: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {children}
    </svg>
  );
}

export function IcoGift({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="4" y="16" width="24" height="13" rx="3" fill="#FF2D78" />
      <rect x="2" y="11" width="28" height="7" rx="3" fill="#FF5C94" />
      <rect x="14" y="11" width="4" height="18" fill="white" opacity="0.9" />
      <rect x="2" y="13.5" width="28" height="2.5" fill="white" opacity="0.5" />
      <path d="M16 11 C16 11 12 9.5 12 6.5C12 4.5 13.5 3.5 16 6C18.5 3.5 20 4.5 20 6.5C20 9.5 16 11 16 11Z" fill="#FF2D78" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </Svg>
  );
}

export function IcoStar({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M16 2L19.5 11.5H30L22 17.5L25 27L16 21L7 27L10 17.5L2 11.5H12.5L16 2Z" fill="#FF8C00" />
      <path d="M16 5.5L19 13H28L21.5 17.5L24 25L16 20L8 25L10.5 17.5L4 13H13L16 5.5Z" fill="#FFD600" />
    </Svg>
  );
}

export function IcoPhone({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="7" y="1" width="18" height="30" rx="4" fill="#00C853" />
      <rect x="10" y="5" width="12" height="18" rx="2" fill="white" opacity="0.85" />
      <circle cx="16" cy="27" r="2" fill="white" />
      <rect x="13" y="2.5" width="6" height="2" rx="1" fill="white" opacity="0.5" />
    </Svg>
  );
}

export function IcoUsers({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="9" r="5" fill="#00AEEF" />
      <circle cx="22" cy="10" r="4" fill="#7B2FBE" />
      <path d="M2 26C2 21.6 6.7 18 12 18C17.3 18 22 21.6 22 26" fill="#00AEEF" />
      <path d="M20 19.5C24 20.5 29 23 29 26H22" fill="#7B2FBE" opacity="0.7" />
    </Svg>
  );
}

export function IcoCamera({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="2" y="9" width="28" height="20" rx="4" fill="#7B2FBE" />
      <circle cx="16" cy="19" r="6" fill="white" opacity="0.25" />
      <circle cx="16" cy="19" r="4" fill="white" />
      <circle cx="16" cy="19" r="2" fill="#7B2FBE" />
      <path d="M11 4L13.5 9H18.5L21 4H11Z" fill="#7B2FBE" />
      <circle cx="25" cy="12" r="2" fill="white" opacity="0.8" />
    </Svg>
  );
}

export function IcoGlobe({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="16" cy="16" r="14" fill="#00AEEF" />
      <path d="M16 2 Q20 16 16 30" stroke="white" strokeWidth="2" fill="none" />
      <path d="M16 2 Q12 16 16 30" stroke="white" strokeWidth="2" fill="none" />
      <line x1="2" y1="16" x2="30" y2="16" stroke="white" strokeWidth="2" />
      <path d="M3 10 Q16 13.5 29 10" stroke="white" strokeWidth="1.5" fill="none" />
      <path d="M3 22 Q16 18.5 29 22" stroke="white" strokeWidth="1.5" fill="none" />
    </Svg>
  );
}

export function IcoTruck({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="1" y="10" width="18" height="15" rx="2.5" fill="#FF8C00" />
      <path d="M19 13H25.5L30 19V25H19V13Z" fill="#FF6B00" />
      <circle cx="7" cy="27" r="3.5" fill="#1A1A2E" />
      <circle cx="7" cy="27" r="1.5" fill="white" />
      <circle cx="24" cy="27" r="3.5" fill="#1A1A2E" />
      <circle cx="24" cy="27" r="1.5" fill="white" />
      <rect x="4" y="14" width="9" height="6" rx="1.5" fill="white" opacity="0.85" />
      <path d="M21 14.5H27L29 18.5H21V14.5Z" fill="white" opacity="0.35" />
    </Svg>
  );
}

export function IcoBox({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M2 11L16 5L30 11L16 17L2 11Z" fill="#FFD600" />
      <path d="M2 11V22L16 28V17L2 11Z" fill="#FF8C00" />
      <path d="M30 11V22L16 28V17L30 11Z" fill="#FF6B00" />
      <path d="M16 5V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 8L23 14" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

export function IcoQR({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="2" y="2" width="12" height="12" rx="2" fill="#7B2FBE" />
      <rect x="4.5" y="4.5" width="7" height="7" rx="1" fill="white" />
      <rect x="6" y="6" width="4" height="4" rx="0.5" fill="#7B2FBE" />
      <rect x="18" y="2" width="12" height="12" rx="2" fill="#FF2D78" />
      <rect x="20.5" y="4.5" width="7" height="7" rx="1" fill="white" />
      <rect x="22" y="6" width="4" height="4" rx="0.5" fill="#FF2D78" />
      <rect x="2" y="18" width="12" height="12" rx="2" fill="#00AEEF" />
      <rect x="4.5" y="20.5" width="7" height="7" rx="1" fill="white" />
      <rect x="6" y="22" width="4" height="4" rx="0.5" fill="#00AEEF" />
      <rect x="18" y="18" width="5" height="5" rx="1" fill="#00C853" />
      <rect x="25" y="18" width="5" height="5" rx="1" fill="#FF8C00" />
      <rect x="18" y="25" width="5" height="5" rx="1" fill="#FFD600" />
      <rect x="25" y="24" width="5" height="6" rx="1" fill="#00C853" />
    </Svg>
  );
}

export function IcoChart({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="3" y="18" width="6" height="12" rx="1.5" fill="#FF2D78" />
      <rect x="12" y="12" width="6" height="18" rx="1.5" fill="#7B2FBE" />
      <rect x="21" y="5" width="6" height="25" rx="1.5" fill="#00AEEF" />
      <path d="M2 30L30 30" stroke="#E5E7EB" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

export function IcoRocket({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M16 2 C16 2 24 8 24 18H8C8 8 16 2 16 2Z" fill="#7B2FBE" />
      <rect x="11" y="18" width="10" height="8" rx="1.5" fill="#9B4FDE" />
      <path d="M8 18 L4 22 L8 24Z" fill="#FF2D78" />
      <path d="M24 18 L28 22 L24 24Z" fill="#FF2D78" />
      <circle cx="16" cy="13" r="3.5" fill="white" opacity="0.9" />
      <path d="M12 26 L13.5 31 L16 29.5 L18.5 31 L20 26H12Z" fill="#FF8C00" />
    </Svg>
  );
}

export function IcoZap({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M18 2L6 18H14L12 30L26 14H18L18 2Z" fill="#FFD600" />
      <path d="M18 2L8 18H15L13 28L24 14H17L18 2Z" fill="#FF8C00" opacity="0.45" />
    </Svg>
  );
}

export function IcoCoin({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="16" cy="16" r="14" fill="#FFD600" />
      <circle cx="16" cy="16" r="10" fill="#FF8C00" opacity="0.3" />
      <text x="16" y="21" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#B45309" fontFamily="sans-serif">₹</text>
    </Svg>
  );
}

export function IcoCheck({ size = 24, color = '#00C853' }: IconProps & { color?: string }) {
  return (
    <Svg size={size}>
      <circle cx="16" cy="16" r="14" fill={color} />
      <path d="M9 16L13.5 20.5L23 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IcoLock({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="5" y="14" width="22" height="16" rx="4" fill="#7B2FBE" />
      <path d="M10 14V10C10 6.7 12.7 4 16 4C19.3 4 22 6.7 22 10V14" stroke="#7B2FBE" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="16" cy="21" r="3" fill="white" />
      <rect x="14.5" y="21" width="3" height="5" rx="1.5" fill="white" />
    </Svg>
  );
}

export function IcoMessage({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M3 6C3 4 4 3 6 3H26C28 3 29 4 29 6V19C29 21 28 22 26 22H18L10 29V22H6C4 22 3 21 3 19V6Z" fill="#00C853" />
      <circle cx="10" cy="12.5" r="2" fill="white" />
      <circle cx="16" cy="12.5" r="2" fill="white" />
      <circle cx="22" cy="12.5" r="2" fill="white" />
    </Svg>
  );
}

export function IcoHeart({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M16 28L4 16C1 13 1 8 4.5 5.5C8 3 12 4.5 14 7L16 9L18 7C20 4.5 24 3 27.5 5.5C31 8 31 13 28 16L16 28Z" fill="#FF2D78" />
      <path d="M16 24L7 15C5.5 13.5 5.5 11 7 9.5C8.5 8 11 8 12.5 9.5L16 13L19.5 9.5C21 8 23.5 8 25 9.5C26.5 11 26.5 13.5 25 15L16 24Z" fill="#FF5C94" opacity="0.5" />
    </Svg>
  );
}

export function IcoCoffee({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="4" y="11" width="20" height="17" rx="3" fill="#795548" />
      <path d="M24 14H27C28.7 14 30 15.3 30 17C30 18.7 28.7 20 27 20H24" stroke="#795548" strokeWidth="3" fill="none" strokeLinecap="round" />
      <rect x="7" y="14" width="14" height="11" rx="2" fill="#D2691E" />
      <path d="M11 6C11 6 11 3 14 4.5C14 4.5 14 7 11 6Z" fill="#00C853" />
      <path d="M16 4C16 4 16 7 19 5.5C19 5.5 19 2.5 16 4Z" fill="#00C853" />
    </Svg>
  );
}

export function IcoScissors({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="8" cy="8" r="5" fill="#FF2D78" />
      <circle cx="8" cy="24" r="5" fill="#7B2FBE" />
      <circle cx="8" cy="8" r="2.5" fill="white" />
      <circle cx="8" cy="24" r="2.5" fill="white" />
      <path d="M12 10 L26 22" stroke="#FF2D78" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M12 22 L26 10" stroke="#7B2FBE" strokeWidth="3.5" strokeLinecap="round" />
    </Svg>
  );
}

export function IcoPlate({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="16" cy="19" r="11" fill="#FF8C00" />
      <circle cx="16" cy="19" r="7" fill="#FFD600" />
      <path d="M11 4 L11 11C11 13.8 13.2 16 16 16C18.8 16 21 13.8 21 11L21 4" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <line x1="16" y1="4" x2="16" y2="16" stroke="#FF8C00" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

export function IcoDumbbell({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="1" y="12" width="6" height="8" rx="2" fill="#7B2FBE" />
      <rect x="25" y="12" width="6" height="8" rx="2" fill="#7B2FBE" />
      <rect x="0" y="11" width="5" height="10" rx="2.5" fill="#9B4FDE" />
      <rect x="27" y="11" width="5" height="10" rx="2.5" fill="#9B4FDE" />
      <rect x="6" y="14.5" width="20" height="3" rx="1.5" fill="#7B2FBE" />
    </Svg>
  );
}

export function IcoTooth({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M11 3C7.5 3 4 6 4 10C4 13.5 6 16 7.5 20.5C9 25 9 29 11.5 29C13.5 29 14 27 16 27C18 27 18.5 29 20.5 29C23 29 23 25 24.5 20.5C26 16 28 13.5 28 10C28 6 24.5 3 21 3C19 3 18 4.5 16 4.5C14 4.5 13 3 11 3Z" fill="#00AEEF" />
      <path d="M11 6C9.5 6 7 8 7 10.5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
    </Svg>
  );
}

export function IcoBag({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="4" y="12" width="24" height="18" rx="3.5" fill="#FF2D78" />
      <path d="M11 12C11 8.7 13.2 6 16 6C18.8 6 21 8.7 21 12" stroke="#FF2D78" strokeWidth="3" strokeLinecap="round" fill="none" />
      <rect x="7" y="17" width="18" height="10" rx="1.5" fill="white" opacity="0.15" />
      <path d="M12 12 L12 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 12 L20 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

export function IcoPill({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="3" y="11.5" width="26" height="9" rx="4.5" fill="#00AEEF" transform="rotate(-45 16 16)" />
      <rect x="3" y="11.5" width="13" height="9" rx="4.5" fill="#FF2D78" transform="rotate(-45 16 16)" />
      <line x1="8" y1="23" x2="24" y2="9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </Svg>
  );
}

export function IcoPaw({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <ellipse cx="16" cy="20" rx="7" ry="8" fill="#FF8C00" />
      <circle cx="7" cy="12" r="4" fill="#FF8C00" />
      <circle cx="25" cy="12" r="4" fill="#FF8C00" />
      <circle cx="11" cy="8" r="3" fill="#FF8C00" />
      <circle cx="21" cy="8" r="3" fill="#FF8C00" />
      <ellipse cx="16" cy="21" rx="4" ry="4.5" fill="white" opacity="0.25" />
    </Svg>
  );
}

export function IcoCroissant({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M5 27C2 24 3 16 10 10C15 6 23 4 27 4C30 10 28 18 23 22C18 27 10 30 5 27Z" fill="#FF8C00" />
      <path d="M7 24C5.5 22 7 17 12 12.5C16 9 22 8 25 8" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.55" />
    </Svg>
  );
}

export function IcoBook({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="5" y="3" width="19" height="26" rx="3" fill="#7B2FBE" />
      <rect x="5" y="3" width="19" height="26" rx="3" fill="#9B4FDE" opacity="0.4" />
      <rect x="4" y="3" width="4" height="26" rx="2" fill="#00AEEF" />
      <rect x="11" y="9" width="9" height="2" rx="1" fill="white" opacity="0.8" />
      <rect x="11" y="14" width="9" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x="11" y="19" width="6" height="2" rx="1" fill="white" opacity="0.4" />
    </Svg>
  );
}

export function IcoSpa({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="16" cy="16" r="13" fill="#00C853" opacity="0.15" />
      <path d="M16 3 C16 3 22 9 22 16 C22 22 19 27 16 29 C13 27 10 22 10 16 C10 9 16 3 16 3Z" fill="#00C853" />
      <path d="M6 10C6 10 13 13 16 20" stroke="#00AEEF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M26 10C26 10 19 13 16 20" stroke="#7B2FBE" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    </Svg>
  );
}

export function IcoRepeat({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M5 16A11 11 0 0 1 27 16" stroke="#00AEEF" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M27 16A11 11 0 0 1 5 16" stroke="#7B2FBE" strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M23 9 L27 16 L31 9" fill="none" stroke="#00AEEF" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M9 23 L5 16 L1 23" fill="none" stroke="#7B2FBE" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
    </Svg>
  );
}

export function IcoScan({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M4 11V5H10" stroke="#FF2D78" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M21 5H28V11" stroke="#7B2FBE" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M28 21V28H21" stroke="#00C853" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M10 28H4V21" stroke="#00AEEF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <rect x="12" y="12" width="3.5" height="3.5" rx="1" fill="#FF8C00" />
      <rect x="16.5" y="12" width="3.5" height="3.5" rx="1" fill="#FF2D78" />
      <rect x="12" y="16.5" width="3.5" height="3.5" rx="1" fill="#7B2FBE" />
      <rect x="16.5" y="16.5" width="3.5" height="3.5" rx="1" fill="#00AEEF" />
    </Svg>
  );
}

export function IcoSparkle({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M16 2L18 12L28 10L20 16L25 26L16 20L7 26L12 16L4 10L14 12L16 2Z" fill="#FFD600" />
      <path d="M6 3L6.7 7.5L11.5 6.8L7.5 10L10 15L6 11.5L2 15L4.5 10L0.5 6.8L5.3 7.5L6 3Z" fill="#FF8C00" />
      <path d="M27 17L27.5 20.5L31 20L28 22.5L29.5 26L27 23.5L24.5 26L26 22.5L23 20L26.5 20.5L27 17Z" fill="#FF2D78" />
    </Svg>
  );
}

export function IcoStore({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <rect x="3" y="14" width="26" height="16" rx="3" fill="#FF8C00" />
      <rect x="7" y="18" width="7" height="12" rx="1.5" fill="white" opacity="0.9" />
      <rect x="17" y="18" width="9" height="8" rx="1.5" fill="white" opacity="0.7" />
      <path d="M3 6H29L27 14H5L3 6Z" fill="#FFD600" />
      <path d="M5 6H9.5L8.5 14H4L5 6Z" fill="#FF8C00" opacity="0.5" />
      <path d="M14.5 6H17.5L17.5 14H14.5L14.5 6Z" fill="#FF8C00" opacity="0.5" />
      <path d="M22.5 6H27L26 14H21.5L22.5 6Z" fill="#FF8C00" opacity="0.5" />
    </Svg>
  );
}

export function IcoMapPin({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M16 2C10.5 2 6 6.5 6 12C6 19 16 30 16 30C16 30 26 19 26 12C26 6.5 21.5 2 16 2Z" fill="#FF2D78" />
      <circle cx="16" cy="12" r="5" fill="white" />
      <circle cx="16" cy="12" r="3" fill="#FF2D78" />
    </Svg>
  );
}

export function IcoShield({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <path d="M16 2L4 7V15C4 21.5 9.5 27.5 16 30C22.5 27.5 28 21.5 28 15V7L16 2Z" fill="#00C853" />
      <path d="M10 15.5L14 19.5L22 11" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

export function IcoKey({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="8.5" fill="#FFD600" />
      <circle cx="12" cy="12" r="5" fill="#FF8C00" opacity="0.5" />
      <rect x="18.5" y="11" width="12" height="3.5" rx="1.75" fill="#FFD600" />
      <rect x="26" y="14.5" width="3.5" height="4" rx="1" fill="#FFD600" />
      <rect x="22" y="14.5" width="3.5" height="3" rx="1" fill="#FFD600" />
    </Svg>
  );
}

export function IcoWhatsApp({ size = 24 }: IconProps) {
  return (
    <Svg size={size}>
      <circle cx="16" cy="16" r="14" fill="#00C853" />
      <path d="M10 22L12 19.5C13.5 20.5 15 21 16 21C20 21 23 18 23 14.5C23 11 20 8 16 8C12 8 9 11 9 14.5C9 16 9.5 17.5 10.5 18.5L10 22Z" fill="white" />
      <path d="M13 13C13 13 13.5 12 14.5 12C15.5 12 16 13 16 13L17.5 16L18.5 16.5C18.5 16.5 19 17 18.5 17.5L17.5 18.5C17.5 18.5 17 19 16.5 18.5C16 18 14.5 16.5 13.5 15C12.5 13.5 12.5 13 13 13Z" fill="#00C853" />
    </Svg>
  );
}
