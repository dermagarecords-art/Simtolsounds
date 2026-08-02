import type { ReactNode } from "react";

type Props = { className: string; children: ReactNode };

export function TrackPosition({ className, children }: Props) {
  return <article className={className}>{children}</article>;
}
