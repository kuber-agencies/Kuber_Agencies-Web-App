import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Package, Building2, ArrowRight, TrendingUp, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { rfqAPI, productsAPI, projectsAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ rfq: null, products: 0, projects: 0 });
  const [recentRFQs, setRecentRFQs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      rfqAPI.getAll({ limit: 5 }),
      productsAPI.getAll({ limit: 1 }),
      projectsAPI.getAll()
    ]).then(([rfqRes, prodRes, projRes]) => {
      if (rfqRes.status === 'fulfilled') {
        setStats(s => ({ ...s, rfq: rfqRes.value.data.stats }));
        setRecentRFQs(rfqRes.value.data.rfqs || []);
      }
      if (prodRes.status === 'fulfilled') {
        setStats(s => ({ ...s, products: prodRes.value.data.total || 0 }));
      }
      if (projRes.status === 'fulfilled') {
        setStats(s => ({ ...s, projects: projRes.value.data.projects?.length || 0 }));
      }
    }).finally(() => setLoading(false));
  }, []);

  const priorityColor = (p) => ({
    High: 'badge-red',
    Medium: 'badge-yellow',
    Low: 'badge-green'
  })[p] || 'badge-blue';

  const statusColor = (s) => ({
    New: 'badge-blue',
    'In Progress': 'badge-yellow',
    Closed: 'badge-green'
  })[s] || 'badge-blue';

  return (
    <AdminLayout title="Dashboard">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total RFQs', value: stats.rfq?.total ?? '—', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'New Enquiries', value: stats.rfq?.new ?? '—', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'High Priority', value: stats.rfq?.highPriority ?? '—', icon: TrendingUp, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Products Listed', value: stats.products, icon: Package, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card p-5 flex items-center gap-4">
            <div className={`w-12 h-12 ${bg} rounded-sm flex items-center justify-center shrink-0`}>
              <Icon size={22} className={color} />
            </div>
            <div>
              <div className="text-2xl font-bold text-navy-800 font-display">{value}</div>
              <div className="text-xs text-gray-500 font-body font-semibold mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {[
          { to: '/admin/rfqs', label: 'Manage RFQ Enquiries', icon: FileText, desc: 'View and respond to quotation requests' },
          { to: '/admin/products', label: 'Manage Products', icon: Package, desc: 'Add, edit, or remove catalog items' },
          { to: '/admin/projects', label: 'Manage Projects', icon: Building2, desc: 'Update government project portfolio' },
        ].map(({ to, label, icon: Icon, desc }) => (
          <Link key={to} to={to}
            className="card p-5 hover:border-navy-800/30 group transition-all duration-200">
            <Icon size={22} className="text-navy-800 mb-3" />
            <h3 className="font-bold text-navy-800 text-sm mb-1 font-body">{label}</h3>
            <p className="text-xs text-gray-500 font-body mb-3">{desc}</p>
            <span className="text-xs font-bold text-gold-600 group-hover:gap-2 flex items-center gap-1 transition-all">
              Go <ArrowRight size={12} />
            </span>
          </Link>
        ))}
      </div>

      {/* Recent RFQs */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-display font-bold text-navy-800">Recent RFQ Enquiries</h2>
          <Link to="/admin/rfqs" className="text-xs font-bold text-gold-600 hover:text-gold-700 flex items-center gap-1">
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : recentRFQs.length === 0 ? (
          <div className="p-10 text-center text-gray-400 font-body text-sm">No RFQs yet. They'll appear here once customers submit enquiries.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Customer', 'Product', 'Qty', 'Priority', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider font-body">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRFQs.map(rfq => (
                  <tr key={rfq._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-navy-800 font-body">{rfq.name}</div>
                      <div className="text-xs text-gray-400 font-body">{rfq.phone}</div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="font-body text-gray-800">{rfq.productName}</div>
                    </td>
                    <td className="px-5 py-3.5 font-body text-gray-600">{rfq.quantity} {rfq.unit}</td>
                    <td className="px-5 py-3.5">
                      <span className={priorityColor(rfq.priority)}>{rfq.priority}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={statusColor(rfq.status)}>{rfq.status}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 font-body">
                      {new Date(rfq.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
