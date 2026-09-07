export function Crown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 48" aria-hidden="true">
      <path
        d="M6 40 L2 12 L20 24 L32 4 L44 24 L62 12 L58 40 Z"
        fill="#FFD046"
        stroke="#222126"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <rect x="6" y="38" width="52" height="8" rx="3" fill="#FFFFFF" stroke="#222126" strokeWidth="5" />
    </svg>
  );
}
