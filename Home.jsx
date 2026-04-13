import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Building2, Package, Truck, Star, Award, Users, Phone } from 'lucide-react';

const WHATSAPP_URL = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919876543210'}?text=${import.meta.env.VITE_WHATSAPP_MESSAGE || 'Hello,%20I%20need%20a%20quotation%20for%20bulk%20hardware%20supply'}`;

const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '500+', label: 'Projects Completed' },
  { value: '200+', label: 'Govt. Clients' },
  { value: '50+', label: 'Product Categories' },
];

const features = [
  {
    icon: Building2,
    title: 'Government Supply Expertise',
    desc: 'Registered and approved vendor for government bodies, municipal corporations, and public sector units across Tamil Nadu. All documentation ready for tender submission.',
    points: ['GeM Portal Registered', 'MSME Certified', 'EMD & SD Ready'],
  },
  {
    icon: Package,
    title: 'Bulk Order Capability',
    desc: 'Equipped to handle large-scale procurement requirements. Direct manufacturer tie-ups ensure competitive pricing with no compromise on quality.',
    points: ['MOQ from 100 units', 'Tiered bulk pricing', 'Custom packaging available'],
  },
  {
    icon: Truck,
    title: 'Fast & Reliable Delivery',
    desc: 'Strategically located in Madambakkam, Chennai with strong logistics partnerships ensuring on-time delivery across Tamil Nadu and South India.',
    points: ['Same-day dispatch available', 'Pan-India delivery', 'Delivery tracking'],
  },
];

const testimonials = [
  {
    name: 'Er. Suresh Ramasamy',
    role: 'Site Engineer, TNHB',
    text: 'Kuber Agencies has been our go-to supplier for three consecutive government housing projects. Delivery is always on time and documentation is impeccable.',
    rating: 5,
  },
  {
    name: 'Prakash Contractors Pvt. Ltd.',
    role: 'Private Contractor, Chennai',
    text: 'Exceptional bulk pricing and product quality. The RFQ system is very convenient — we get quotes within hours, not days.',
    rating: 5,
  },
  {
    name: 'Anand Murugesh',
    role: 'Procurement Officer, CMDA',
    text: 'All compliance documents were provided upfront. Made our vendor evaluation process smooth and efficient. Highly recommended for government procurement.',
    rating: 5,
  },
];

const categories = [
  { name: 'Pipes & Tubes', icon: '🔩', desc: 'GI, MS, PVC, CPVC, HDPE pipes' },
  { name: 'Fittings', icon: '⚙️', desc: 'Elbows, tees, reducers, couplings' },
  { name: 'Electrical', icon: '⚡', desc: 'Wires, conduits, MCBs, panels' },
  { name: 'Tools', icon: '🔧', desc: 'Power tools, hand tools, safety gear' },
];

export default function Home() {
  return (
    <div className="pt-[88px]">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-navy-900 min-h-[88vh] flex items-center overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 stripe-accent opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-900 via-navy-800/90 to-navy-900" />

        {/* Decorative accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold-500 via-gold-400 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-widest animate-fade-in">
              <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse-slow" />
              Government Approved Vendor · Chennai
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 animate-fade-up">
              Trusted Hardware Supplier for
              <span className="text-gold-500 block mt-1">Government &</span>
              <span className="text-gold-400">Bulk Projects</span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl animate-fade-up animate-delay-100 font-body">
              Kuber Agencies — Madambakkam, Chennai. We supply pipes, fittings, electrical materials, and tools for government tenders, contractor deals, and bulk industrial orders across Tamil Nadu.
            </p>

            <div className="flex flex-wrap gap-3 mb-10 animate-fade-up animate-delay-200">
              {['GST Registered', 'MSME Certified', 'GeM Portal Listed', 'ISO Compliant'].map(tag => (
                <span key={tag} className="flex items-center gap-1.5 text-sm text-emerald-300 font-semibold">
                  <CheckCircle size={14} className="text-emerald-400" /> {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 animate-fade-up animate-delay-300">
              <Link to="/request-quote" className="btn-primary text-base px-8 py-4 shadow-gold-500/20 shadow-lg">
                Request Quotation <ArrowRight size={18} />
              </Link>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20c05c] text-white font-semibold px-7 py-4 rounded-sm transition-all duration-200 shadow-lg text-base">
                <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white shrink-0"><path d="M16 2C8.28 2 2 8.28 2 16c0 2.48.67 4.8 1.84 6.8L2 30l7.38-1.82A13.9 13.9 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.2a11.1 11.1 0 0 1-5.66-1.54l-.4-.24-4.38 1.08 1.1-4.28-.27-.44A11.14 11.14 0 0 1 4.8 16C4.8 9.8 9.8 4.8 16 4.8S27.2 9.8 27.2 16 22.2 27.2 16 27.2zm6.1-8.33c-.33-.17-1.97-.97-2.28-1.08-.3-.1-.52-.17-.74.17-.22.33-.85 1.08-1.04 1.3-.19.22-.38.24-.71.08-.33-.17-1.4-.52-2.66-1.65-.98-.88-1.64-1.96-1.84-2.3-.19-.33-.02-.5.15-.67.15-.15.33-.4.5-.6.17-.2.22-.33.33-.55.1-.22.05-.42-.03-.58-.08-.17-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.22 0-.57.08-.87.4-.3.33-1.14 1.12-1.14 2.72s1.17 3.16 1.33 3.38c.17.22 2.3 3.5 5.57 4.9.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.97-.81 2.24-1.59.28-.78.28-1.44.2-1.59-.1-.13-.3-.2-.63-.36z"/></svg>
                WhatsApp Enquiry
              </a>
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-2 gap-4 animate-fade-up animate-delay-200">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-white/5 border border-white/10 rounded-sm p-6 text-center hover:bg-white/10 transition-colors">
                <div className="font-display text-4xl font-bold text-gold-500 mb-2">{value}</div>
                <div className="text-gray-300 text-sm font-semibold font-body">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-3 font-body">Why Choose Us</p>
            <h2 className="section-title">Built for Government & Bulk Supply</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              From tender documentation to last-mile delivery — we handle it all so your procurement process stays smooth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map(({ icon: Icon, title, desc, points }) => (
              <div key={title} className="group card p-8 hover:border-gold-500/40 transition-all duration-300">
                <div className="w-14 h-14 bg-navy-800 rounded-sm flex items-center justify-center mb-6 group-hover:bg-gold-500 transition-colors duration-300">
                  <Icon size={26} className="text-gold-500 group-hover:text-navy-900 transition-colors duration-300" />
                </div>
                <h3 className="font-display font-bold text-xl text-navy-800 mb-3">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 font-body">{desc}</p>
                <ul className="space-y-2">
                  {points.map(p => (
                    <li key={p} className="flex items-center gap-2 text-sm text-navy-700 font-semibold">
                      <CheckCircle size={14} className="text-emerald-500 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUCT CATEGORIES ────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
            <div>
              <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2 font-body">Product Range</p>
              <h2 className="section-title">What We Supply</h2>
            </div>
            <Link to="/products" className="btn-secondary text-sm">
              View Full Catalog <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map(({ name, icon, desc }) => (
              <Link key={name} to="/products" className="group card p-7 text-center hover:border-gold-500/40 hover:-translate-y-1 transition-all duration-300">
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="font-display font-bold text-navy-800 text-base mb-2">{name}</h3>
                <p className="text-gray-500 text-xs font-body leading-relaxed">{desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ─────────────────────────────────────────────── */}
      <section className="bg-navy-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {[
              { icon: Award, label: 'GST Registered', sub: 'Tamil Nadu' },
              { icon: Building2, label: 'GeM Portal', sub: 'Listed Vendor' },
              { icon: Users, label: '200+ Clients', sub: 'Govt & Private' },
              { icon: Star, label: '4.9 / 5', sub: 'Client Rating' },
              { icon: CheckCircle, label: 'MSME Certified', sub: 'Udyam Registered' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-gold-500/15 rounded-sm flex items-center justify-center">
                  <Icon size={20} className="text-gold-500" />
                </div>
                <div>
                  <div className="text-sm font-bold font-body">{label}</div>
                  <div className="text-xs text-gray-400 font-body">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-3 font-body">Testimonials</p>
            <h2 className="section-title">What Our Clients Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {testimonials.map(({ name, role, text, rating }) => (
              <div key={name} className="card p-7 relative">
                <div className="text-5xl text-gold-500/20 font-display font-bold absolute top-4 right-6">"</div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(rating)].map((_, i) => (
                    <Star key={i} size={14} className="fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5 font-body italic">"{text}"</p>
                <div>
                  <div className="font-bold text-navy-800 text-sm">{name}</div>
                  <div className="text-gray-500 text-xs font-body mt-0.5">{role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-navy-800 to-navy-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 stripe-accent opacity-30" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Submit a Quotation Request?
          </h2>
          <p className="text-gray-300 mb-8 text-lg font-body max-w-xl mx-auto">
            Fill our RFQ form and receive a competitive bulk quote within 24 hours. No hidden charges.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/request-quote" className="btn-primary px-10 py-4 text-base">
              Request Quote Now <ArrowRight size={18} />
            </Link>
            <a href="tel:+919876543210"
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold px-8 py-4 rounded-sm transition-all duration-200 text-base">
              <Phone size={18} /> Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
