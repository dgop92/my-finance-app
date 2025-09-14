import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navigationItems } from "@/lib/navigation";

const Sidebar = () => {
  const location = useLocation();
  
  return (
    <aside className="hidden lg:block w-64 border-r border-border h-full overflow-y-auto fixed top-16">
      <div className="p-4">
        <nav className="flex flex-col gap-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "hover:bg-accent text-foreground hover:text-primary"
                )}
                aria-label={`Navigate to ${item.name}`}
                tabIndex={0}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
