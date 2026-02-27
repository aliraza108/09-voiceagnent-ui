interface LoadingDotsProps {
  className?: string;
}

export function LoadingDots({ className = "" }: LoadingDotsProps) {
  return (
    <span className={`loading-dots ${className}`.trim()} aria-hidden>
      <span />
      <span />
      <span />
    </span>
  );
}
