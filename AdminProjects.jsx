import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { projectsAPI } from '../../services/api';

const emptyForm = {
  title: '', client: '', department: '', value: '', location: '',
  startDate: '', endDate: '', status: 'Completed', category: 'Government',
  description: '', highlights: ''
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    projectsAPI.getAll()
      .then(({ data }) => setProjects(data.projects || []))
      .catch(() => toast.error('Failed to load projects'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...emptyForm, ...p,
      startDate: p.startDate ? p.startDate.split('T')[0] : '',
      endDate: p.endDate ? p.endDate.split('T')[0] : '',
      highlights: Array.isArray(p.highlights) ? p.highlights.join(', ') : ''
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.client) return toast.error('Title and client are required');
    setSaving(true);
    try {
      const payload = { ...form, highlights: form.highlights ? form.highlights.split(',').map(h => h.trim()).filter(Boolean) : [] };
      if (editing) { await projectsAPI.update(editing, payload); toast.success('Project updated'); }
      else { await projectsAPI.create(payload); toast.success('Project created'); }
      setShowModal(false);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      setProjects(p => p.filter(x => x._id !== id));
      toast.success('Project deleted');
    } catch { toast.error('Delete failed'); }
  };

  const f = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <AdminLayout title="Projects">
      <div className="flex justify-end mb-5">
        <button onClick={openCreate} className="btn-primary text-sm"><Plus size={16} /> Add Project</button>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_, i) => <div key={i} className="card p-5 h-24 animate-pulse" />)
        ) : projects.length === 0 ? (
          <div className="card p-12 text-center text-gray-400 font-body">No projects yet.</div>
        ) : projects.map(p => (
          <div key={p._id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full font-body
                    ${p.status === 'Ongoing' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {p.status}
                  </span>
                  <span className="badge-blue">{p.category}</span>
                  {p.value && <span className="text-xs font-bold text-navy-700 font-body">{p.value}</span>}
                </div>
                <h3 className="font-display font-bold text-navy-800 text-lg">{p.title}</h3>
                <p className="text-sm text-gray-500 font-body mt-0.5">{p.client}{p.location ? ` · ${p.location}` : ''}</p>
                {p.highlights?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {p.highlights.map(h => (
                      <span key={h} className="bg-navy-50 text-navy-700 text-xs px-2.5 py-1 rounded-full font-body">{h}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 rounded-sm hover:bg-blue-50 text-blue-600 transition-colors"><Edit2 size={15} /></button>
                <button onClick={() => handleDelete(p._id)} className="p-2 rounded-sm hover:bg-red-50 text-red-500 transition-colors"><Trash2 size={15} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full my-8 p-7" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-navy-800">{editing ? 'Edit Project' : 'Add Project'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Project Title *</label>
                <input value={form.title} onChange={f('title')} className="input-field" placeholder="e.g. TNHB Housing Phase II" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Client *</label>
                  <input value={form.client} onChange={f('client')} className="input-field" placeholder="e.g. TNHB" />
                </div>
                <div>
                  <label className="label">Department</label>
                  <input value={form.department} onChange={f('department')} className="input-field" placeholder="e.g. PWD" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Project Value</label>
                  <input value={form.value} onChange={f('value')} className="input-field" placeholder="e.g. ₹42 Lakhs" />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input value={form.location} onChange={f('location')} className="input-field" placeholder="e.g. Chennai" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Status</label>
                  <select value={form.status} onChange={f('status')} className="input-field">
                    <option>Completed</option>
                    <option>Ongoing</option>
                  </select>
                </div>
                <div>
                  <label className="label">Category</label>
                  <select value={form.category} onChange={f('category')} className="input-field">
                    <option>Government</option>
                    <option>Private</option>
                    <option>PSU</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} onChange={f('description')} rows={3} className="input-field resize-none" placeholder="Project scope and supply details..." />
              </div>
              <div>
                <label className="label">Highlights (comma separated)</label>
                <input value={form.highlights} onChange={f('highlights')} className="input-field" placeholder="e.g. 500 units, ₹42L, On-time delivery" />
              </div>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center text-sm disabled:opacity-60">
                {saving ? 'Saving...' : <><Save size={15} /> {editing ? 'Update' : 'Create'}</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
