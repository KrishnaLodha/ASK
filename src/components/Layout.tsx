import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, PieChart, CreditCard, User, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: PieChart, label: 'Expenses', path: '/expenses' },
  { icon: CreditCard, label: 'Cards', path: '/cards' },
  { icon: User, label: 'Profile', path: '/profile' },
];

export function Layout() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="sticky top-0 w-full glass z-50 flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div className="bg-primary/20 p-1.5 rounded-lg border border-primary/30">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white hidden sm:block">ASK.</span>
        </div>
        
        <div className="flex w-full sm:w-auto justify-between sm:justify-start items-center ml-0 sm:ml-8 gap-1 sm:gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-1.5 sm:py-2 rounded-lg transition-all duration-300 flex-1 sm:flex-none",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )
              }
            >
              <item.icon className="w-4 h-4 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-sm font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8 overflow-y-auto">
        <div className="w-full relative min-h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
