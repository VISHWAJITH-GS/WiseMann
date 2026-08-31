import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  TrendingUp,
  Users,
  GitBranch,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { MagicWandIcon } from '@radix-ui/react-icons';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: ShoppingCart, label: 'Purchase Advisor', href: '/purchase-advisor' },
  { icon: Package, label: 'Inventory', href: '/inventory' },
  { icon: TrendingUp, label: 'Forecast', href: '/forecast' },
  { icon: Users, label: 'Suppliers', href: '/suppliers' },
  { icon: GitBranch, label: 'What-if', href: '/what-if' },
  { icon: MessageSquare, label: 'AI Store Manager', href: '/ai-manager' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentStore } = useAppStore();

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-surface rounded-lg transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </motion.button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -24, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className={`fixed left-0 top-0 h-screen w-64 bg-white border-r border-border transition-transform duration-300 z-40 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white shadow-sm">
              <MagicWandIcon className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold text-ink">WiseMann</h1>
          </div>
          {currentStore && (
            <p className="text-xs text-text-muted">{currentStore.name}</p>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.99 }}
              >
                <Link
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-text hover:bg-surface'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border space-y-2">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-text hover:bg-surface transition-colors"
          >
            <Settings size={20} />
            <span className="text-sm font-medium">Settings</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-danger hover:bg-danger-soft transition-colors">
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
