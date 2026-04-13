import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Email and password are required');
    const result = await login(form.email, form.password);
    if (result.success) {
      toast.success('Welcome back!');
      navigate('/admin');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-navy-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 stripe-accent opacity-20" />
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gold-500 rounded-sm flex items-center justify-center mx-auto mb-4 font-display font-bold text-navy-900 text-2xl shadow-xl">
            KA
          </div>
          <h1 className="font-display text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 text-sm font-body mt-1">Kuber Agencies Management</p>
        </div>

        <div className="bg-white rounded-sm shadow-2xl p-8">
          <h2 className="font-display text-xl font-bold text-navy-800 mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <input type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="admin@kuberagencies.com"
                className="input-field" autoComplete="email" required />
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input type={showPwd ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field pr-11" autoComplete="current-password" required />
                <button type="button" onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-60">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <><LogIn size={18} /> Sign In</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6 font-body">
          Restricted access — authorised personnel only
        </p>
      </div>
    </div>
  );
}
