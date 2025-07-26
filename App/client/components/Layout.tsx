import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main content with bottom padding for nav */}
      <main className="pb-20 min-h-screen">{children}</main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
