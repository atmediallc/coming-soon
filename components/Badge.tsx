import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm animate-fade-in",
        className
      )}
    >
      <span
        className="mr-1.5 flex h-1.5 w-1.5 rounded-full bg-accent animate-pulse"
        aria-hidden="true"
      />
      {children}
    </div>
  );
}
