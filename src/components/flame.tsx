/** A streak flame in the house style: orange with the ink outline. */
export function Flame({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 28" aria-hidden="true">
      <path
        d="M12 2c1 4 5 6 5 12a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-4-1-7 1-11z"
        fill="#ff7a1a"
        stroke="#222126"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path d="M12 14c1 1 2 2 2 4a2 2 0 0 1-4 0c0-2 1-3 2-4z" fill="#ffd046" />
    </svg>
  );
}
