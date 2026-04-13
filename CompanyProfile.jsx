import { Link } from 'react-router-dom';
import { Download, CheckCircle, Building2, Award, Users, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';

const certifications = [
  { name: 'GST Registration', number: 'XXXXXXXXXXXXXXXXX', icon: '📋', color: 'bg-blue-50 border-blue-200' },
  { name: 'PAN Card', number: 'XXXXXXXXXX', icon: '🏛️', color: 'bg-purple-50 border-purple-200' },
  { name: 'MSME / Udyam', number: 'UDYAM-TN-XX-XXXXXXX', icon: '🏅', color: 'bg-gold-50 border-gold-200' },
  { name: 'Trade License', number: 'TL-XXXXXXXX', icon: '📜', color: 'bg-emerald-50 border-emerald-200' },
  { name: 'GeM Seller ID', number: 'XXXXXXXXXXXX', icon: '🛒', color: 'bg-orange-50 border-orange-200' },
  { name: 'Company Registration', number: 'CIN: XXXXXXXXX', icon: '🏢', color: 'bg-rose-50 border-rose-200' },
];

const govClients = [
  'TNHB', 'CMDA', 'PWD', 'TANGEDCO', 'CMWSSB', 'TNSCB', 'MTC Chennai', 'TIDCO'
];

const milestones = [
  { year: '2009', event: 'Founded in Madambakkam, Chennai' },
  { year: '2012', event: 'First government supply order — TNHB' },
  { year: '2015', event: 'MSME certification & expanded product range' },
  { year: '2018', event: 'GeM Portal registration — Pan-India supply capability' },
  { year: '2021', event: 'Crossed 200+ government projects milestone' },
  { year: '2024', event: 'Digital transformation with online RFQ system' },
];

export default function CompanyProfile() {
  return (
    <div className="pt-[88px]">

      {/* Header */}
      <section className="bg-navy-900 py-14 relative overflow-hidden">
        <div className="absolute inset-0 stripe-accent opacity-30" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-3">About Us</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Company Profile</h1>
          <p className="text-gray-300 text-lg max-w-2xl font-body">
            15+ years of trusted hardware supply for government bodies, contractors, and industrial clients across Tamil Nadu.
          </p>
          <div className="mt-7 flex flex-wrap gap-4">
            <a href="/company-profile.pdf" download
              className="btn-primary text-sm">
              <Download size={16} /> Download Company Profile (PDF)
            </a>
            <Link to="/request-quote" className="btn-outline text-sm">
              Request Quotation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Business Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-3">Business Overview</p>
            <h2 className="section-title mb-5">Who We Are</h2>
            <div className="space-y-4 text-gray-700 font-body leading-relaxed">
              <p>
                <strong>Kuber Agencies</strong> is a Madambakkam, Chennai-based hardware supplier with over 15 years of experience serving government departments, public sector units, and private contractors across Tamil Nadu.
              </p>
              <p>
                We specialize in bulk supply of pipes, fittings, electrical materials, tools, and construction hardware. Our vendor registration on the Government e-Marketplace (GeM) and strong compliance framework make us a preferred choice for public procurement.
              </p>
              <p>
                Every order is backed by proper documentation — GST invoices, delivery challans, quality certificates, and material test reports — ensuring smooth audit compliance for government buyers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            {[
              { label: 'Founded', value: '2009', icon: '📅' },
              { label: 'Location', value: 'Madambakkam, Chennai', icon: '📍' },
              { label: 'GST No.', value: 'XXXXXXXXXXXXXXXXX', icon: '📋' },
              { label: 'PAN No.', value: 'XXXXXXXXXX', icon: '🏛️' },
              { label: 'MSME No.', value: 'UDYAM-TN-XX-XXXXX', icon: '🏅' },
              { label: 'GeM ID', value: 'XXXXXXXXXXXX', icon: '🛒' },
            ].map(({ label, value, icon }) => (
              <div key={label} className="card p-4">
                <div className="text-2xl mb-2">{icon}</div>
                <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1 font-body">{label}</div>
                <div className="text-navy-800 font-bold text-sm font-body">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-3">Compliance</p>
            <h2 className="section-title">Registrations & Certifications</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {certifications.map(({ name, number, icon, color }) => (
              <div key={name} className={`card p-5 border ${color} flex items-start gap-4`}>
                <div className="text-3xl">{icon}</div>
                <div>
                  <div className="font-bold text-navy-800 text-sm mb-1">{name}</div>
                  <div className="text-gray-500 text-xs font-mono">{number}</div>
                  <div className="flex items-center gap-1 mt-2 text-emerald-600 text-xs font-semibold">
                    <CheckCircle size={12} /> Verified
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Government Clients */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-3">Client Base</p>
            <h2 className="section-title">Government & Institutional Clients</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {govClients.map(client => (
              <div key={client} className="bg-navy-50 border border-navy-100 text-navy-800 font-bold px-8 py-4 rounded-sm text-sm font-body hover:bg-navy-800 hover:text-white transition-all duration-200 cursor-default">
                {client}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-3">Our Journey</p>
            <h2 className="section-title">Milestones</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gold-500/30" />
            <div className="space-y-8">
              {milestones.map(({ year, event }) => (
                <div key={year} className="flex gap-8 items-start">
                  <div className="w-12 h-12 bg-gold-500 rounded-sm flex items-center justify-center shrink-0 font-bold text-navy-900 text-xs font-body z-10">
                    {year}
                  </div>
                  <div className="card p-4 flex-1">
                    <p className="text-navy-800 font-semibold text-sm font-body">{event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact block */}
      <section className="py-16 bg-navy-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: Phone, label: 'Call Us', value: '+91 98765 43210', href: 'tel:+919876543210' },
            { icon: Mail, label: 'Email Us', value: 'info@kuberagencies.com', href: 'mailto:info@kuberagencies.com' },
            { icon: MapPin, label: 'Visit Us', value: 'Madambakkam, Chennai – 600126', href: '#' },
          ].map(({ icon: Icon, label, value, href }) => (
            <a key={label} href={href} className="group bg-white/5 border border-white/10 hover:border-gold-500/50 rounded-sm p-8 transition-all duration-200">
              <div className="w-12 h-12 bg-gold-500/10 rounded-sm flex items-center justify-center mx-auto mb-4 group-hover:bg-gold-500/20 transition-colors">
                <Icon size={22} className="text-gold-500" />
              </div>
              <div className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-1">{label}</div>
              <div className="text-white font-semibold text-sm">{value}</div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
