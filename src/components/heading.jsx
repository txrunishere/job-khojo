import { cn } from "@/lib/utils";

export const Heading = ({ children, className = "" }) => {
  return (
    <h1
      className={cn(
        "mx-auto max-w-md bg-linear-to-r from-neutral-400 to-neutral-300 bg-clip-text text-center text-4xl font-bold text-transparent sm:max-w-xl sm:text-6xl",
        className,
      )}
    >
      {children}
    </h1>
  );
};
