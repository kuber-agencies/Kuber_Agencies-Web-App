import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Send, Phone, Clock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { rfqAPI } from '../services/api';

const initialForm = {
  productName: '', quantity: '', unit: 'pieces',
  deliveryLocation: '', deadline: '',
  name: '', email: '', phone: '', company: '', additionalNotes: ''
};

const units = ['pieces', 'kg', 'tonnes', 'meters', 'feet', 'boxes', 'rolls', 'sets', 'pairs'];

export default function RFQPage() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ ...initialForm, productName: searchParams.get('product') || '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.productName.trim()) e.productName = 'Product name is required';
    if (!form.quantity || form.quantity <= 0) e.quantity = 'Valid quantity is required';
    if (!form.deliveryLocation.trim()) e.deliveryLocation = 'Delivery location is required';
    if (!form.deadline) e.deadline = 'Deadline is required';
    if (new Date(form.deadline) < new Date()) e.deadline = 'Deadline must be a future date';
    if (!form.name.trim()) e.name = 'Your name is required';
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email is required';
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone)) e.phone = 'Valid 10-digit Indian mobile number required';
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(err => ({ ...err, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);
    try {
      await rfqAPI.submit({ ...form, quantity: Number(form.quantity) });
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="pt-[88px] min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="card p-10">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <h2 className="font-display text-2xl font-bold text-navy-800 mb-3">Request Submitted!</h2>
            <p className="text-gray-600 font-body mb-6 leading-relaxed">
              Thank you! We've received your quotation request and will respond within <strong>24 business hours</strong>. A confirmation has been sent to your email.
            </p>
            <div className="bg-gold-50 border border-gold-200 rounded-sm p-4 mb-6 text-left">
              <p className="text-xs font-bold text-gold-700 uppercase tracking-wider mb-2">Your Submission</p>
              <p className="text-sm font-body"><strong>Product:</strong> {form.productName}</p>
              <p className="text-sm font-body"><strong>Quantity:</strong> {form.quantity} {form.unit}</p>
              <p className="text-sm font-body"><strong>Contact:</strong> {form.phone}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={() => { setSubmitted(false); setForm(initialForm); }}
                className="btn-secondary flex-1 justify-center text-sm">
                Submit Another RFQ
              </button>
              <Link to="/" className="btn-primary flex-1 justify-center text-sm">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-[88px]">
      {/* Header */}
      <section className="bg-navy-900 py-14 relative overflow-hidden">
        <div className="absolute inset-0 stripe-accent opacity-30" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-3">Bulk Orders</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Request a Quotation</h1>
          <p className="text-gray-300 text-lg font-body max-w-xl">
            Fill in your requirements and receive a competitive bulk quote within 24 business hours.
          </p>
        </div>
      </section>

      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-10">

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="font-display text-2xl font-bold text-navy-800 mb-7">RFQ Details</h2>
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  {/* Product name */}
                  <div className="sm:col-span-2">
                    <label className="label">Product / Material Name *</label>
                    <input type="text" name="productName" value={form.productName} onChange={handleChange}
                      placeholder="e.g. GI Pipes 25mm NB, Electrical conduit 20mm..."
                      className={`input-field ${errors.productName ? 'border-red-400' : ''}`} />
                    {errors.productName && <p className="text-red-500 text-xs mt-1 font-body">{errors.productName}</p>}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="label">Quantity *</label>
                    <input type="number" name="quantity" value={form.quantity} onChange={handleChange}
                      placeholder="e.g. 500"
                      min="1"
                      className={`input-field ${errors.quantity ? 'border-red-400' : ''}`} />
                    {errors.quantity && <p className="text-red-500 text-xs mt-1 font-body">{errors.quantity}</p>}
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="label">Unit</label>
                    <select name="unit" value={form.unit} onChange={handleChange} className="input-field">
                      {units.map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>

                  {/* Delivery location */}
                  <div>
                    <label className="label">Delivery Location *</label>
                    <input type="text" name="deliveryLocation" value={form.deliveryLocation} onChange={handleChange}
                      placeholder="e.g. Tambaram, Chennai"
                      className={`input-field ${errors.deliveryLocation ? 'border-red-400' : ''}`} />
                    {errors.deliveryLocation && <p className="text-red-500 text-xs mt-1 font-body">{errors.deliveryLocation}</p>}
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="label">Required By (Deadline) *</label>
                    <input type="date" name="deadline" value={form.deadline} onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      className={`input-field ${errors.deadline ? 'border-red-400' : ''}`} />
                    {errors.deadline && <p className="text-red-500 text-xs mt-1 font-body">{errors.deadline}</p>}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6 mb-5">
                  <h3 className="font-bold text-navy-800 mb-5 font-body">Contact Information</h3>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Your Name *</label>
                      <input type="text" name="name" value={form.name} onChange={handleChange}
                        placeholder="Full name"
                        className={`input-field ${errors.name ? 'border-red-400' : ''}`} />
                      {errors.name && <p className="text-red-500 text-xs mt-1 font-body">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="label">Company / Organisation</label>
                      <input type="text" name="company" value={form.company} onChange={handleChange}
                        placeholder="Company name (optional)"
                        className="input-field" />
                    </div>

                    <div>
                      <label className="label">Email Address *</label>
                      <input type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="you@example.com"
                        className={`input-field ${errors.email ? 'border-red-400' : ''}`} />
                      {errors.email && <p className="text-red-500 text-xs mt-1 font-body">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="label">Mobile Number *</label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className={`input-field ${errors.phone ? 'border-red-400' : ''}`} />
                      {errors.phone && <p className="text-red-500 text-xs mt-1 font-body">{errors.phone}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="label">Additional Notes</label>
                      <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange}
                        rows={3}
                        placeholder="Specifications, brand preference, site conditions..."
                        className="input-field resize-none" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="btn-primary w-full justify-center py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <><Send size={18} /> Submit Quotation Request</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-navy-900 rounded-sm p-7 text-white">
              <h3 className="font-display font-bold text-lg mb-5 text-gold-400">Quick Contact</h3>
              <a href="tel:+919876543210"
                className="flex items-center gap-3 bg-white/10 hover:bg-white/15 rounded-sm p-4 mb-3 transition-colors">
                <Phone size={18} className="text-gold-500" />
                <div>
                  <div className="text-xs text-gray-400 font-body">Call us directly</div>
                  <div className="font-bold text-sm">+91 98765 43210</div>
                </div>
              </a>
              <div className="flex items-center gap-3 bg-white/5 rounded-sm p-4 mb-6">
                <Clock size={18} className="text-gold-500" />
                <div>
                  <div className="text-xs text-gray-400 font-body">Response time</div>
                  <div className="font-bold text-sm">Within 24 hours</div>
                </div>
              </div>
              <div className="space-y-2.5 text-sm">
                {['Competitive bulk pricing', 'All compliance documents', 'Pan-India delivery', 'Genuine ISI-marked products'].map(pt => (
                  <div key={pt} className="flex items-center gap-2 text-gray-300 font-body">
                    <CheckCircle size={14} className="text-emerald-400 shrink-0" /> {pt}
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-6">
              <h3 className="font-bold text-navy-800 mb-3 font-body">Looking for Documents?</h3>
              <p className="text-gray-600 text-sm font-body mb-4 leading-relaxed">
                Download our GST certificate, company registration, PAN card and product catalog for tender submissions.
              </p>
              <Link to="/documents" className="btn-secondary w-full justify-center text-sm">
                Document Center <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
