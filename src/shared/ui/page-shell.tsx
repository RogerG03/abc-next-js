import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  return <main className="mx-auto w-[min(100%-2rem,72rem)] py-20">{children}</main>;
}
