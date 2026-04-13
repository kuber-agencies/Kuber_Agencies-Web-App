import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/AdminLayout';
import { productsAPI } from '../../services/api';

const CATEGORIES = ['Pipes', 'Fittings', 'Electrical', 'Tools', 'Other'];
const emptyForm = { name: '', category: 'Pipes', description: '', bulkPricingNote: '', brand: '', unit: 'piece', featured: false, isActive: true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('All');

  const fetchProducts = () => {
    setLoading(true);
    const params = filterCat !== 'All' ? { category: filterCat, limit: 50 } : { limit: 50 };
    productsAPI.getAll(params)
      .then(({ data }) => setProducts(data.products || []))
      .catch(() => toast.error('Failed to load products'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, [filterCat]);

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setShowModal(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ name: p.name, category: p.category, description: p.description,
      bulkPricingNote: p.bulkPricingNote || '', brand: p.brand || '',
      unit: p.unit || 'piece', featured: p.featured, isActive: p.isActive });
    setImageFile(null);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.description) return toast.error('Name and description are required');
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (imageFile) fd.append('image', imageFile);

      if (editing) {
        await productsAPI.update(editing, fd);
        toast.success('Product updated');
      } else {
        await productsAPI.create(fd);
        toast.success('Product created');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productsAPI.delete(id);
      setProducts(p => p.filter(x => x._id !== id));
      toast.success('Product deleted');
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <AdminLayout title="Products">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {['All', ...CATEGORIES].map(c => (
            <button key={c} onClick={() => setFilterCat(c)}
              className={`px-4 py-2 text-sm font-semibold rounded-sm transition-all font-body
                ${filterCat === c ? 'bg-navy-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-navy-800'}`}>
              {c}
            </button>
          ))}
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded animate-pulse" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-body">
            No products yet. <button onClick={openCreate} className="text-navy-800 font-semibold underline">Add the first one</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product', 'Category', 'Bulk Pricing Note', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider font-body">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p._id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {p.image?.url
                          ? <img src={p.image.url} alt={p.name} className="w-10 h-10 object-cover rounded-sm" />
                          : <div className="w-10 h-10 bg-gray-100 rounded-sm flex items-center justify-center text-gray-400 text-xs">IMG</div>
                        }
                        <div>
                          <div className="font-semibold text-navy-800 font-body">{p.name}</div>
                          {p.brand && <div className="text-xs text-gray-400">{p.brand}</div>}
                          {p.featured && <span className="text-xs text-gold-600 font-bold">★ Featured</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge-blue">{p.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-500 font-body max-w-xs truncate">{p.bulkPricingNote || '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={p.isActive ? 'badge-green' : 'badge-red'}>{p.isActive ? 'Active' : 'Inactive'}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(p)}
                          className="p-1.5 rounded-sm hover:bg-blue-50 text-blue-600 transition-colors">
                          <Edit2 size={15} />
                        </button>
                        <button onClick={() => handleDelete(p._id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-sm shadow-2xl max-w-lg w-full my-8 p-7" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-display text-xl font-bold text-navy-800">{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label">Product Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. GI Pipe 25mm NB" className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Category *</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input-field">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Unit</label>
                  <input value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}
                    placeholder="piece / meter / kg" className="input-field" />
                </div>
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3} className="input-field resize-none"
                  placeholder="Product specifications, material grade, standards..." />
              </div>
              <div>
                <label className="label">Bulk Pricing Note</label>
                <input value={form.bulkPricingNote} onChange={e => setForm(f => ({ ...f, bulkPricingNote: e.target.value }))}
                  placeholder="e.g. Special rate for 500+ units" className="input-field" />
              </div>
              <div>
                <label className="label">Brand</label>
                <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                  placeholder="Brand name (optional)" className="input-field" />
              </div>
              <div>
                <label className="label">Product Image</label>
                <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])}
                  className="input-field text-sm" />
              </div>
              <div className="flex gap-5">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-navy-800 font-body">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                    className="w-4 h-4 accent-navy-800" />
                  Featured Product
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-navy-800 font-body">
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                    className="w-4 h-4 accent-navy-800" />
                  Active
                </label>
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
