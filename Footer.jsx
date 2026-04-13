import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-gray-300">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gold-500 flex items-center justify-center rounded-sm font-display font-bold text-navy-900 text-lg">KA</div>
            <div>
              <div className="font-display font-bold text-white text-base">KUBER AGENCIES</div>
              <div className="text-gold-500 text-xs font-semibold tracking-widest uppercase">Hardware Supplier</div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-gray-400 mb-4">
            Trusted government-approved hardware supplier for bulk orders, contractor deals, and public sector tenders across Tamil Nadu.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-semibold">✓ GST Registered</span>
            <span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-semibold">✓ Govt Approved</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-display font-bold text-white text-base mb-4 border-b border-gold-500/30 pb-2">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { to: '/', label: 'Home' },
              { to: '/company-profile', label: 'Company Profile' },
              { to: '/government-tenders', label: 'Government Tenders' },
              { to: '/products', label: 'Product Catalog' },
              { to: '/documents', label: 'Document Center' },
              { to: '/request-quote', label: 'Request a Quote' },
            ].map(({ to, label }) => (
              <li key={to}>
                <Link to={to} className="hover:text-gold-500 transition-colors flex items-center gap-2">
                  <span className="text-gold-500/60">›</span> {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Products */}
        <div>
          <h4 className="font-display font-bold text-white text-base mb-4 border-b border-gold-500/30 pb-2">Our Categories</h4>
          <ul className="space-y-2.5 text-sm">
            {['Pipes & Tubes', 'Pipe Fittings', 'Electrical Supplies', 'Tools & Equipment', 'Fasteners', 'Safety Gear'].map(cat => (
              <li key={cat}>
                <Link to="/products" className="hover:text-gold-500 transition-colors flex items-center gap-2">
                  <span className="text-gold-500/60">›</span> {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display font-bold text-white text-base mb-4 border-b border-gold-500/30 pb-2">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex gap-3">
              <MapPin size={16} className="text-gold-500 mt-0.5 shrink-0" />
              <span className="text-gray-400">Madambakkam, Chennai – 600126<br />Tamil Nadu, India</span>
            </li>
            <li className="flex gap-3">
              <Phone size={16} className="text-gold-500 mt-0.5 shrink-0" />
              <a href="tel:+919876543210" className="hover:text-gold-500 transition-colors">+91 98765 43210</a>
            </li>
            <li className="flex gap-3">
              <Mail size={16} className="text-gold-500 mt-0.5 shrink-0" />
              <a href="mailto:info@kuberagencies.com" className="hover:text-gold-500 transition-colors">info@kuberagencies.com</a>
            </li>
            <li className="flex gap-3">
              <Clock size={16} className="text-gold-500 mt-0.5 shrink-0" />
              <span className="text-gray-400">Mon – Sat: 9:00 AM – 6:00 PM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Kuber Agencies. All rights reserved. | GST: XXXXXXXXXXXXXXX</p>
          <p>Madambakkam, Chennai, Tamil Nadu – Bulk Hardware Supplier</p>
        </div>
      </div>
    </footer>
  );
}
