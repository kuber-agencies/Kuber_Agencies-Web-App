import { useState, useEffect } from 'react';
import { Download, Mail, FileText, CheckCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { documentsAPI } from '../services/api';

const fallbackDocs = [
  { _id:'1', name:'GST Registration Certificate', type:'GST Certificate', isPublic:true, description:'Official GST registration certificate of Kuber Agencies', file:{ url:'#', format:'application/pdf' } },
  { _id:'2', name:'PAN Card', type:'PAN Card', isPublic:true, description:'Permanent Account Number card', file:{ url:'#', format:'application/pdf' } },
  { _id:'3', name:'Company Registration Certificate', type:'Company Registration', isPublic:true, description:'Certificate of Incorporation / Business Registration', file:{ url:'#', format:'application/pdf' } },
  { _id:'4', name:'Trade License', type:'Trade License', isPublic:true, description:'Current trade license issued by Chennai Corporation', file:{ url:'#', format:'application/pdf' } },
  { _id:'5', name:'Company Profile Brochure', type:'Company Profile', isPublic:true, description:'Complete company profile with capabilities, certifications, and contact details', file:{ url:'#', format:'application/pdf' } },
  { _id:'6', name:'Product Catalog 2024', type:'Product Catalog', isPublic:true, description:'Complete product catalog with specifications and bulk pricing notes', file:{ url:'#', format:'application/pdf' } },
];

const typeIcons = {
  'GST Certificate': '📋',
  'PAN Card': '🏛️',
  'Company Registration': '🏢',
  'Trade License': '📜',
  'Company Profile': '📁',
  'Product Catalog': '📦',
  'Other': '📄',
};

export default function DocumentCenter() {
  const [documents, setDocuments] = useState(fallbackDocs);
  const [loading, setLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [emailForm, setEmailForm] = useState({ name: '', email: '' });
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    documentsAPI.getAll()
      .then(({ data }) => { if (data.documents?.length) setDocuments(data.documents); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (doc) => {
    try {
      await documentsAPI.trackDownload(doc._id);
      if (doc.file?.url && doc.file.url !== '#') {
        window.open(doc.file.url, '_blank');
      } else {
        toast.error('Document not yet uploaded. Please request via email.');
      }
    } catch {
      if (doc.file?.url && doc.file.url !== '#') window.open(doc.file.url, '_blank');
    }
  };

  const toggleSelect = (id) => {
    setSelectedDocs(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const handleEmailRequest = async (e) => {
    e.preventDefault();
    if (!emailForm.name || !emailForm.email) return toast.error('Please fill in name and email');
    if (!/^\S+@\S+\.\S+$/.test(emailForm.email)) return toast.error('Enter a valid email address');
    const docIds = selectedDocs.length ? selectedDocs : documents.filter(d => d.isPublic).map(d => d._id);
    if (!docIds.length) return toast.error('No documents to send');

    setEmailSending(true);
    try {
      await documentsAPI.requestByEmail({ ...emailForm, documentIds: docIds });
      toast.success('Documents sent to your email!');
      setShowEmailModal(false);
      setEmailForm({ name: '', email: '' });
      setSelectedDocs([]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally {
      setEmailSending(false);
    }
  };

  return (
    <div className="pt-[88px]">
      {/* Header */}
      <section className="bg-navy-900 py-14 relative overflow-hidden">
        <div className="absolute inset-0 stripe-accent opacity-30" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-500" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-gold-400 text-xs font-bold uppercase tracking-widest mb-3">Compliance</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">Document Center</h1>
          <p className="text-gray-300 text-lg font-body max-w-xl">
            Official compliance documents for vendor registration, tender submissions, and procurement verification.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setShowEmailModal(true)}
              className="btn-primary text-sm">
              <Mail size={16} /> Request Documents via Email
            </button>
          </div>
        </div>
      </section>

      {/* Select info bar */}
      {selectedDocs.length > 0 && (
        <div className="bg-gold-500 py-3 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <p className="text-navy-900 font-semibold text-sm font-body">
              {selectedDocs.length} document{selectedDocs.length > 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowEmailModal(true)}
                className="flex items-center gap-2 bg-navy-900 text-white text-xs font-bold px-4 py-2 rounded-sm">
                <Mail size={14} /> Send to Email
              </button>
              <button onClick={() => setSelectedDocs([])} className="text-navy-800 hover:text-navy-900">
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Documents grid */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <p className="text-sm text-gray-500 font-body">
              Click a document to select it, then email all selected — or download individually.
              All documents are official and verified.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-8 w-8 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {documents.map(doc => {
                const isSelected = selectedDocs.includes(doc._id);
                return (
                  <div
                    key={doc._id}
                    onClick={() => toggleSelect(doc._id)}
                    className={`card p-6 cursor-pointer transition-all duration-200 relative
                      ${isSelected ? 'border-2 border-gold-500 bg-gold-50' : 'hover:border-navy-800/30'}`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                        <CheckCircle size={12} className="text-navy-900" />
                      </div>
                    )}
                    <div className="text-4xl mb-4">{typeIcons[doc.type] || '📄'}</div>
                    <h3 className="font-bold text-navy-800 text-base mb-1 font-body">{doc.name}</h3>
                    <p className="text-xs text-gray-500 mb-4 font-body leading-relaxed">{doc.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="badge-blue">{doc.type}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDownload(doc); }}
                        className="flex items-center gap-1.5 text-xs font-bold text-navy-800 hover:text-gold-600 transition-colors font-body"
                        title="Download document"
                      >
                        <Download size={14} /> Download
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom CTA */}
          <div className="mt-12 bg-navy-900 rounded-sm p-8 text-center">
            <FileText size={36} className="text-gold-500 mx-auto mb-4" />
            <h3 className="font-display text-xl font-bold text-white mb-2">Need All Documents at Once?</h3>
            <p className="text-gray-300 text-sm font-body mb-5">
              Select the documents you need and we'll email them to you instantly — or request all documents in one click.
            </p>
            <button onClick={() => { setSelectedDocs([]); setShowEmailModal(true); }}
              className="btn-primary text-sm">
              <Mail size={16} /> Request All Documents via Email
            </button>
          </div>
        </div>
      </section>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowEmailModal(false)}>
          <div className="bg-white rounded-sm shadow-2xl max-w-md w-full p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-display text-xl font-bold text-navy-800">Request Documents</h3>
                <p className="text-gray-500 text-sm font-body mt-1">
                  {selectedDocs.length > 0 ? `Sending ${selectedDocs.length} selected document(s)` : 'We\'ll send all public documents'}
                </p>
              </div>
              <button onClick={() => setShowEmailModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEmailRequest} className="space-y-4">
              <div>
                <label className="label">Your Name *</label>
                <input type="text" value={emailForm.name}
                  onChange={e => setEmailForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Full name" className="input-field" required />
              </div>
              <div>
                <label className="label">Email Address *</label>
                <input type="email" value={emailForm.email}
                  onChange={e => setEmailForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com" className="input-field" required />
              </div>
              <button type="submit" disabled={emailSending}
                className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60">
                {emailSending ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <><Mail size={16} /> Send Documents to Email</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
