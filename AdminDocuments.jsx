import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Save, Download, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { documentsAPI } from '../../services/api';

const DOC_TYPES = ['GST Certificate', 'PAN Card', 'Company Registration', 'Trade License', 'Company Profile', 'Product Catalog', 'Other'];
const emptyForm = { name: '', type: 'GST Certificate', description: '', isPublic: true };

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [fileInput, setFileInput] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    documentsAPI.getAll()
      .then(({ data }) => setDocuments(data.documents || []))
      .catch(() => toast.error('Failed to load documents'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.type) return toast.error('Name and type are required');
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('type', form.type);
      fd.append('description', form.description);
      fd.append('isPublic', form.isPublic);
      if (fileInput) fd.append('file', fileInput);
      await documentsAPI.create(fd);
      toast.success('Document uploaded');
      setShowModal(false);
      setForm(emptyForm);
      setFileInput(null);
      fetch();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setSaving(false);
    }
  };

  const togglePublic = async (doc) => {
    try {
      await documentsAPI.update(doc._id, { isPublic: !doc.isPublic });
      setDocuments(prev => prev.map(d => d._id === doc._id ? { ...d, isPublic: !d.isPublic } : d));
      toast.success(`Document ${!doc.isPublic ? 'made public' : 'set to private'}`);
    } catch { toast.error('Update failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    try {
      await documentsAPI.delete(id);
      setDocuments(prev => prev.filter(d => d._id !== id));
      toast.success('Document deleted');
    } catch { toast.error('Delete failed'); }
  };

  return (
    <AdminLayout title="Documents">
      <div className="flex justify-end mb-5">
        <button onClick={() => setShowModal(true)} className="btn-primary text-sm"><Plus size={16} /> Upload Document</button>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-body">No documents uploaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Document', 'Type', 'Visibility', 'Downloads', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider font-body">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {documents.map(doc => (
                  <tr key={doc._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-navy-800 font-body">{doc.name}</div>
                      {doc.description && <div className="text-xs text-gray-400 font-body mt-0.5">{doc.description}</div>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge-blue">{doc.type}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button onClick={() => togglePublic(doc)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full transition-colors font-body
                          ${doc.isPublic ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                        {doc.isPublic ? <><Eye size={11} /> Public</> : <><EyeOff size={11} /> Private</>}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 font-body">{doc.downloadCount || 0}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        {doc.file?.url && doc.file.url !== '#' && (
                          <a href={doc.file.url} target="_blank" rel="noopener noreferrer"
                            className="p-1.5 rounded-sm hover:bg-blue-50 text-blue-600 transition-colors">
                            <Download size={15} />
                          </a>
                        )}
                        <button onClick={() => handleDelete(doc._id)}
                          className="p-1.5 rounded-sm hover:bg-red-50 text-red-500 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-sm shadow-2xl max-w-md w-full p-7" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-navy-800">Upload Document</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="label">Document Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. GST Registration Certificate" className="input-field" />
              </div>
              <div>
                <label className="label">Document Type *</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-field">
                  {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Description</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Brief description (optional)" className="input-field" />
              </div>
              <div>
                <label className="label">Upload File (PDF / Image)</label>
                <input type="file" accept=".pdf,image/*" onChange={e => setFileInput(e.target.files[0])}
                  className="input-field text-sm" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-navy-800 font-body">
                <input type="checkbox" checked={form.isPublic} onChange={e => setForm(f => ({ ...f, isPublic: e.target.checked }))}
                  className="w-4 h-4 accent-navy-800" />
                Make this document publicly visible
              </label>
            </div>
            <div className="flex gap-3 mt-7">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1 justify-center text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center text-sm disabled:opacity-60">
                {saving ? 'Uploading...' : <><Save size={15} /> Upload</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
