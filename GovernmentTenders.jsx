import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, CheckCircle, Clock, Building2, ArrowRight, FileText } from 'lucide-react';
import { projectsAPI } from '../services/api';

const capabilityItems = [
  'Supply of MS/GI/PVC/HDPE pipes for water supply & sewerage projects',
  'Electrical materials for government building electrification',
  'Plumbing fittings & accessories for housing projects',
  'Industrial tools & safety equipment for PSUs',
  'Bulk fasteners, anchors & construction hardware',
  'Turnkey hardware procurement for civil works',
];

const downloadDocs = [
  { name: 'GST Certificate', type: 'GST Certificate', icon: '📋' },
  { name: 'PAN Card Copy', type: 'PAN Card', icon: '🏛️' },
  { name: 'Company Registration', type: 'Company Registration', icon: '🏢' },
  { name: 'Product Catalog', type: 'Product Catalog', icon: '📦' },
];

const fallbackProjects = [
  {
    _id: '1', title: 'TNHB Housing Project – Phase II', client: 'Tamil Nadu Housing Board',
    department: 'TNHB', location: 'Sholinganallur, Chennai', value: '₹42 Lakhs',
    status: 'Completed', category: 'Government',
    description: 'Supply of GI pipes, MS fittings, and plumbing hardware for 500-unit residential project.',
    highlights: ['500 housing units', '42L project value', 'On-time delivery'],
  },
  {
    _id: '2', title: 'CMDA Road Infrastructure Supply', client: 'Chennai Metropolitan Development Authority',
    department: 'CMDA', location: 'Multiple zones, Chennai', value: '₹18 Lakhs',
    status: 'Completed', category: 'Government',
    description: 'Bulk supply of tools, safety gear, and civil hardware for road widening project.',
    highlights: ['3 zones covered', 'Emergency supply managed', 'Full documentation'],
  },
  {
    _id: '3', title: 'TANGEDCO Substation Electrification', client: 'Tamil Nadu Generation & Distribution Corp.',
    department: 'TANGEDCO', location: 'Tambaram, Chennai', value: '₹27 Lakhs',
    status: 'Completed', category: 'Government',
    description: 'Supply of electrical conduits, wires, MCBs, panels and allied materials.',
    highlights: ['3 substations', 'All ISI-marked materials', 'Delivered in 15 days'],
  },
  {
    _id: '4', title: 'CMWSSB Water Pipeline Renewal', client: 'Chennai Metro Water Supply & Sewerage Board',
    department: 'CMWSSB', location: 'South Chennai zones', value: '₹55 Lakhs',
    status: 'Ongoing', category: 'Government',
    description: 'Ongoing supply of HDPE pipes, jointing materials & fittings for pipeline renewal.',
    highlights: ['12 km pipeline', 'Phase-wise delivery', 'Real-time coordination'],
  },
];

export default function GovernmentTenders() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [activeTab, setActiveTab] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.getAll()
      .then(({ data }) => { if (data.projects?.length) setProjects(data.projects); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeTab === 'All' ? projects : projects.filter(p => p.status === activeTab);

  return (
    <div className="pt-[88px]">
      {/* Header */}
      <section className="bg-navy-900 py-14 relative overflow-hidden">
        <div className="absolute inset-0 stripe-accent opacity-30" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-3">Public Sector</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Government Tenders</h1>
          <p className="text-gray-300 text-lg max-w-2xl font-body">
            Our track record of successful government supply projects and ongoing procurement partnerships.
          </p>
        </div>
      </section>

      {/* Capability Statement */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14">
          <div>
            <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-3">Capability Statement</p>
            <h2 className="section-title mb-5">What We Can Supply</h2>
            <p className="text-gray-600 font-body mb-7 leading-relaxed">
              Kuber Agencies is equipped to fulfil large-scale procurement requirements for government departments, PSUs, and contractors. Our supply capability covers:
            </p>
            <ul className="space-y-3">
              {capabilityItems.map(item => (
                <li key={item} className="flex items-start gap-3 text-sm text-navy-700 font-body">
                  <CheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-navy-900 rounded-sm p-8 text-white">
            <h3 className="font-display font-bold text-xl mb-6 text-gold-400">Tender Documents Available</h3>
            <p className="text-gray-300 text-sm mb-7 font-body leading-relaxed">
              All compliance documents required for vendor evaluation and tender submission are available for download or can be sent to your email.
            </p>
            <div className="space-y-3 mb-7">
              {downloadDocs.map(doc => (
                <a key={doc.name} href="#"
                  className="flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 rounded-sm px-4 py-3 transition-colors group">
                  <span className="flex items-center gap-3 text-sm font-body">
                    <span className="text-xl">{doc.icon}</span>
                    {doc.name}
                  </span>
                  <Download size={14} className="text-gold-400 group-hover:text-gold-300" />
                </a>
              ))}
            </div>
            <Link to="/documents" className="btn-primary w-full justify-center text-sm">
              View All Documents <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
            <div>
              <p className="text-gold-600 font-bold text-xs uppercase tracking-widest mb-2">Track Record</p>
              <h2 className="section-title">Project Portfolio</h2>
            </div>
            <div className="flex gap-2">
              {['All', 'Completed', 'Ongoing'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-semibold rounded-sm transition-all font-body
                    ${activeTab === tab ? 'bg-navy-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-navy-800'}`}>
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map(project => (
              <div key={project._id} className="card p-6 hover:border-gold-400/40 transition-all duration-200">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full font-body
                    ${project.status === 'Ongoing' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {project.status === 'Ongoing' ? '⏳ Ongoing' : '✅ Completed'}
                  </span>
                  <span className="text-xs text-gray-400 font-body">{project.category}</span>
                </div>

                <h3 className="font-display font-bold text-navy-800 text-lg mb-2">{project.title}</h3>

                <div className="flex flex-wrap gap-3 text-xs text-gray-500 font-body mb-3">
                  <span className="flex items-center gap-1"><Building2 size={12} /> {project.client}</span>
                  {project.location && <span>📍 {project.location}</span>}
                  {project.value && <span className="font-bold text-navy-700">💰 {project.value}</span>}
                </div>

                <p className="text-gray-600 text-sm font-body leading-relaxed mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.highlights?.map(h => (
                    <span key={h} className="bg-navy-50 text-navy-700 text-xs font-semibold px-2.5 py-1 rounded-full font-body">{h}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-navy-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <FileText size={40} className="text-gold-500 mx-auto mb-5" />
          <h2 className="font-display text-3xl font-bold text-white mb-4">Need Hardware for Your Tender?</h2>
          <p className="text-gray-300 font-body mb-7 text-lg">
            Submit your RFQ with product specifications and quantities. We'll respond with a competitive quote within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/request-quote" className="btn-primary px-10 py-4">
              Submit RFQ <ArrowRight size={18} />
            </Link>
            <Link to="/documents" className="btn-outline px-8 py-4">
              Download Documents
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
