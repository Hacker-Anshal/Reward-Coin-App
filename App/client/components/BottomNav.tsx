import { Home, Gift, History } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  {
    id: "home",
    label: "Home",
    icon: Home,
    path: "/",
  },
  {
    id: "redeem",
    label: "Redeem",
    icon: Gift,
    path: "/redeem",
  },
  {
    id: "history",
    label: "History",
    icon: History,
    path: "/history",
  },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border bottom-nav-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-all duration-200",
                  isActive && "scale-110",
                )}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-all duration-200",
                  isActive && "font-semibold",
                )}
              >
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
