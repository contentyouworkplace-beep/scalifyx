export function LogoIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>
        <linearGradient id="logoSGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#D1FAE5" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="logoBoltGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" rx="22" fill="url(#logoBgGrad)" />
      <path
        d="M60 28C60 28 52 22 42 24C32 26 28 34 30 40C32 46 40 48 46 50C52 52 58 54 60 60C62 66 58 74 48 76C38 78 30 72 30 72"
        fill="none"
        stroke="url(#logoSGrad)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M68 18L62 32H70L64 46"
        fill="none"
        stroke="url(#logoBoltGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="74" cy="14" r="2" fill="#FCD34D" fillOpacity="0.8" />
      <circle cx="78" cy="24" r="1.2" fill="#FCD34D" fillOpacity="0.5" />
    </svg>
  );
}

export function Logo({ size = 36, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <LogoIcon size={size} />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-xl font-extrabold tracking-tight text-white">
            Scalify<span className="gradient-text">X</span>
          </span>
        </div>
      )}
    </div>
  );
}
