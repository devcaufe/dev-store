export function BrazilFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 28 20"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Bandeira do Brasil"
    >
      <rect width="28" height="20" rx="2" fill="#009C3B" />
      <polygon points="14,2.5 25.5,10 14,17.5 2.5,10" fill="#FFDF00" />
      <circle cx="14" cy="10" r="3.6" fill="#002776" />
      <path
        d="M10.6 10.6 a 4 4 0 0 1 6.8 -0.4"
        stroke="#FFFFFF"
        strokeWidth="0.6"
        fill="none"
      />
    </svg>
  );
}
