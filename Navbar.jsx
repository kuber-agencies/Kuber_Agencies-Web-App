import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/company-profile', label: 'Company Profile' },
  { to: '/government-tenders', label: 'Gov. Tenders' },
  { to: '/products', label: 'Products' },
  { to: '/documents', label: 'Documents' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-navy-900 shadow-xl' : 'bg-navy-900/95 backdrop-blur-sm'
    }`}>
      {/* Top bar */}
      <div className="bg-gold-500 py-1.5 px-4 text-center text-xs font-semibold text-navy-900 hidden md:block">
        📞 +91 98765 43210 &nbsp;|&nbsp; ✉️ info@kuberagencies.com &nbsp;|&nbsp; 📍 Madambakkam, Chennai
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gold-500 flex items-center justify-center rounded-sm font-display font-bold text-navy-900 text-lg shadow-md group-hover:scale-105 transition-transform">
              KA
            </div>
            <div className="hidden sm:block">
              <div className="font-display font-bold text-white text-lg leading-tight">KUBER AGENCIES</div>
              <div className="text-gold-500 text-xs font-semibold tracking-widest uppercase">Hardware Supplier</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-semibold rounded-sm transition-all duration-150 font-body
                  ${isActive
                    ? 'bg-gold-500 text-navy-900'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/request-quote" className="btn-primary text-sm py-2.5">
              Request Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-2 rounded-sm hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-navy-900 border-t border-white/10 px-4 pb-4 animate-fade-in">
          <div className="flex flex-col gap-1 pt-3">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-semibold rounded-sm transition-colors font-body
                  ${isActive ? 'bg-gold-500 text-navy-900' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-white/10 mt-2">
              <Link to="/request-quote" className="btn-primary w-full justify-center text-sm">
                Request Quote
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
