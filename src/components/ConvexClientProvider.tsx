"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ReactNode } from "react";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = CONVEX_URL ? new ConvexReactClient(CONVEX_URL) : null;

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) return <>{children}</>;
  return <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>;
}
