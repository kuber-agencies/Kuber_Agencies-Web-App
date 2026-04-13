import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, FileText, FolderOpen, Building2, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/rfqs', icon: FileText, label: 'RFQ Enquiries' },
  { to: '/admin/products', icon: Package, label: 'Products' },
  { to: '/admin/projects', icon: Building2, label: 'Projects' },
  { to: '/admin/documents', icon: FolderOpen, label: 'Documents' },
];

export default function AdminLayout({ children, title }) {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 flex flex-col transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:flex`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gold-500 rounded-sm flex items-center justify-center font-display font-bold text-navy-900">KA</div>
            <div>
              <div className="text-white font-display font-bold text-sm">KUBER AGENCIES</div>
              <div className="text-gold-500 text-xs font-semibold">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/admin'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-semibold transition-all font-body
                ${isActive ? 'bg-gold-500 text-navy-900' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`
              }>
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 bg-gold-500/20 rounded-full flex items-center justify-center text-gold-400 font-bold text-sm">
              {admin?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div className="text-white text-xs font-semibold font-body">{admin?.name}</div>
              <div className="text-gray-500 text-xs font-body">{admin?.role}</div>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2.5 text-red-400 hover:bg-red-500/10 rounded-sm text-sm font-semibold transition-colors font-body">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-500 hover:text-navy-800 p-1" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1 className="font-display font-bold text-navy-800 text-lg">{title}</h1>
          </div>
          <a href="/" target="_blank" className="text-xs text-gray-500 hover:text-navy-800 font-body transition-colors">
            View Site ↗
          </a>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
