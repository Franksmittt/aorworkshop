'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, MessageSquare, Settings, X, LogOut, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/app/AuthContext';
import { clearWorkshopLocalStorage } from '@/lib/data-service';

const BUILD_HREF = '/dashboard/projects/lc79-epr042gp';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const allNavItems = [
    { name: 'Home', href: '/dashboard', icon: Home, roles: ['Boss', 'Staff'] as const },
    { name: 'LC79 build', href: BUILD_HREF, icon: Car, roles: ['Boss', 'Staff'] as const },
    { name: 'Media & Photos', href: '/dashboard/media', icon: MessageSquare, roles: ['Boss', 'Staff'] as const },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['Boss', 'Staff'] as const },
  ];

  const navItems = allNavItems.filter((item) => user?.role && item.roles.includes(user.role));

  const handleResetData = () => {
    if (confirm('Clear saved data in this browser and reload the default LC79 job?')) {
      clearWorkshopLocalStorage();
      window.location.reload();
    }
  };

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const SidebarContent = () => (
    <div className="w-[260px] flex flex-col h-full bg-white border-r border-[var(--border-light)] shadow-[var(--shadow-sm)]">
      <div className="h-16 flex items-center justify-between px-5 border-b border-[var(--border-light)]">
        <Link
          href="/dashboard"
          className="text-[var(--shark)] font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
        >
          Absolute Offroad
        </Link>
        <button
          onClick={onClose}
          className="md:hidden p-2 -mr-2 text-[var(--system-gray)] hover:text-[var(--shark)] rounded-[var(--radius-sm)] transition-colors"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-grow px-3 py-4">
        <ul className="space-y-0.5">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[15px] font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--shark)] hover:bg-[var(--athens-gray)]'
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0 opacity-90" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-3 border-t border-[var(--border-light)] space-y-0.5">
        <button
          onClick={handleResetData}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[15px] font-medium text-[var(--system-gray)] hover:bg-[var(--athens-gray)] hover:text-[var(--shark)] transition-colors"
        >
          <RefreshCw className="h-5 w-5 shrink-0" />
          Reset browser data
        </button>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] text-[15px] font-medium text-[var(--system-gray)] hover:bg-[var(--athens-gray)] hover:text-[var(--shark)] transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:flex md:flex-shrink-0">
        <SidebarContent />
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="fixed inset-0 z-30 bg-black/40 md:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: [0.22, 0.25, 0, 1] }}
              className="fixed top-0 left-0 h-full z-40 md:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
