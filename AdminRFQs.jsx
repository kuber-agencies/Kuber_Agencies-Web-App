import { useState, useEffect } from 'react';
import { Trash2, ChevronDown, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { rfqAPI } from '../../services/api';

const STATUS_OPTIONS = ['New', 'In Progress', 'Closed'];
const PRIORITY_OPTIONS = ['All', 'High', 'Medium', 'Low'];

const priorityBadge = (p) => ({ High: 'badge-red', Medium: 'badge-yellow', Low: 'badge-green' })[p] || 'badge-blue';
const statusBadge = (s) => ({ New: 'badge-blue', 'In Progress': 'badge-yellow', Closed: 'badge-green' })[s] || 'badge-blue';

export default function AdminRFQs() {
  const [rfqs, setRfqs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', priority: '' });
  const [expanded, setExpanded] = useState(null);

  const fetchRFQs = () => {
    setLoading(true);
    const params = {};
    if (filter.status) params.status = filter.status;
    if (filter.priority && filter.priority !== 'All') params.priority = filter.priority;
    rfqAPI.getAll(params)
      .then(({ data }) => { setRfqs(data.rfqs || []); setStats(data.stats || {}); })
      .catch(() => toast.error('Failed to load RFQs'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchRFQs(); }, [filter]);

  const handleStatusChange = async (id, status) => {
    try {
      await rfqAPI.updateStatus(id, status);
      setRfqs(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      toast.success(`Status updated to ${status}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this RFQ? This cannot be undone.')) return;
    try {
      await rfqAPI.delete(id);
      setRfqs(prev => prev.filter(r => r._id !== id));
      toast.success('RFQ deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <AdminLayout title="RFQ Enquiries">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-blue-600 bg-blue-50' },
          { label: 'New', value: stats.new, color: 'text-amber-600 bg-amber-50' },
          { label: 'In Progress', value: stats.inProgress, color: 'text-purple-600 bg-purple-50' },
          { label: 'High Priority', value: stats.highPriority, color: 'text-red-600 bg-red-50' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card p-4 text-center">
            <div className={`text-2xl font-bold font-display ${color.split(' ')[0]}`}>{value ?? '—'}</div>
            <div className="text-xs text-gray-500 font-semibold font-body mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card p-4 mb-5 flex flex-wrap gap-3 items-center">
        <span className="text-sm font-semibold text-gray-600 font-body">Filter by:</span>
        <select value={filter.status} onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
          className="input-field w-auto text-sm py-2">
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={filter.priority} onChange={e => setFilter(f => ({ ...f, priority: e.target.value }))}
          className="input-field w-auto text-sm py-2">
          {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p} Priority</option>)}
        </select>
        {(filter.status || (filter.priority && filter.priority !== 'All')) && (
          <button onClick={() => setFilter({ status: '', priority: '' })}
            className="text-xs text-red-500 font-semibold font-body hover:underline">Clear filters</button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="card p-5 h-20 animate-pulse" />)}
        </div>
      ) : rfqs.length === 0 ? (
        <div className="card p-12 text-center text-gray-400 font-body">No RFQs match the current filters.</div>
      ) : (
        <div className="space-y-3">
          {rfqs.map(rfq => (
            <div key={rfq._id} className="card overflow-hidden">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                {/* Priority indicator */}
                <div className={`w-1 self-stretch rounded-full shrink-0 hidden sm:block
                  ${rfq.priority === 'High' ? 'bg-red-500' : rfq.priority === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'}`} />

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-bold text-navy-800 font-body">{rfq.name}</span>
                    {rfq.company && <span className="text-xs text-gray-500 font-body">· {rfq.company}</span>}
                    <span className={priorityBadge(rfq.priority)}>{rfq.priority}</span>
                    <span className="text-xs text-gray-400 font-body ml-auto">Score: {rfq.leadScore}</span>
                  </div>
                  <div className="text-sm text-navy-700 font-semibold font-body">
                    {rfq.productName} — <span className="font-bold">{rfq.quantity} {rfq.unit}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-gray-500 font-body">
                    <span className="flex items-center gap-1"><MapPin size={11} /> {rfq.deliveryLocation}</span>
                    <span className="flex items-center gap-1"><Calendar size={11} /> By {new Date(rfq.deadline).toLocaleDateString('en-IN')}</span>
                    <span className="flex items-center gap-1"><Phone size={11} /> {rfq.phone}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 shrink-0">
                  <select value={rfq.status}
                    onChange={e => handleStatusChange(rfq._id, e.target.value)}
                    className={`text-xs font-bold px-3 py-2 rounded-full border cursor-pointer transition-all font-body
                      ${rfq.status === 'New' ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : rfq.status === 'In Progress' ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => setExpanded(expanded === rfq._id ? null : rfq._id)}
                    className="p-2 rounded-sm hover:bg-gray-100 transition-colors text-gray-500">
                    <ChevronDown size={16} className={`transition-transform ${expanded === rfq._id ? 'rotate-180' : ''}`} />
                  </button>
                  <button onClick={() => handleDelete(rfq._id)}
                    className="p-2 rounded-sm hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === rfq._id && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50 grid sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 font-body">
                    <Mail size={13} className="text-gray-400" />
                    <a href={`mailto:${rfq.email}`} className="hover:text-navy-800">{rfq.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 font-body">
                    <Phone size={13} className="text-gray-400" />
                    <a href={`tel:${rfq.phone}`} className="hover:text-navy-800">{rfq.phone}</a>
                  </div>
                  {rfq.additionalNotes && (
                    <div className="sm:col-span-2">
                      <span className="font-semibold text-gray-600">Notes: </span>
                      <span className="text-gray-600 font-body">{rfq.additionalNotes}</span>
                    </div>
                  )}
                  <div className="font-body text-gray-500 text-xs sm:col-span-2">
                    Submitted: {new Date(rfq.createdAt).toLocaleString('en-IN')}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
