import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, UserPlus, Mail, Lock, User, Phone, MapPin, Shield, Key } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'user',
    adminSecretKey: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.phone.length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    if (formData.role === 'admin' && !formData.adminSecretKey) {
      toast.error('Admin secret key is required for admin registration');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful!');
      const role = formData.role;
      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'collector') {
        navigate('/collector');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      <div className="w-full max-w-lg space-y-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-md">
        <div className="flex flex-col items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Leaf className="h-7 w-7" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-white font-display">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Join the eco-friendly movement today!
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left side: Profile Info */}
            <div className="space-y-4">
              <div className="px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Profile Details
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-505 outline-none focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                  placeholder="Full Name"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-505 outline-none focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                  placeholder="Email Address"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-505 outline-none focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                  placeholder="Password (min 6 chars)"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-505 outline-none focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                  placeholder="10-Digit Mobile"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold cursor-pointer transition-all ${
                    formData.role === 'user'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={formData.role === 'user'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <User className="h-3 w-3" />
                    Citizen
                  </label>
                  <label className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold cursor-pointer transition-all ${
                    formData.role === 'collector'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="collector"
                      checked={formData.role === 'collector'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    Collector
                  </label>
                  <label className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold cursor-pointer transition-all ${
                    formData.role === 'admin'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={formData.role === 'admin'}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <Shield className="h-3 w-3" />
                    Admin
                  </label>
                </div>
              </div>

              {/* Admin Secret Key Field */}
              {formData.role === 'admin' && (
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-amber-500">
                    <Key className="h-4 w-4" />
                  </div>
                  <input
                    name="adminSecretKey"
                    type="password"
                    required
                    value={formData.adminSecretKey}
                    onChange={handleChange}
                    className="block w-full rounded-xl border border-amber-500/30 bg-amber-500/5 py-2.5 pl-9 pr-3 text-xs text-white placeholder-amber-500/40 outline-none focus:border-amber-500 focus:ring-amber-500 transition-all"
                    placeholder="Admin Secret Key"
                  />
                  <p className="mt-1 text-[10px] text-amber-500/60">Required for admin registration</p>
                </div>
              )}
            </div>

            {/* Right side: Address Info */}
            <div className="space-y-4">
              <div className="px-1 text-xs font-bold text-slate-500 uppercase tracking-wider">
                Address Details (Optional)
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  name="address.street"
                  type="text"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-505 outline-none focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                  placeholder="Street / Area"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  name="address.city"
                  type="text"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-505 outline-none focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                  placeholder="City"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  name="address.state"
                  type="text"
                  value={formData.address.state}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-505 outline-none focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                  placeholder="State"
                />
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <MapPin className="h-4 w-4" />
                </div>
                <input
                  name="address.pincode"
                  type="text"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-white placeholder-slate-505 outline-none focus:border-emerald-500 focus:ring-emerald-500 transition-all"
                  placeholder="Pincode"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative flex w-full justify-center rounded-xl py-3 px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all ${
                formData.role === 'admin'
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 focus:ring-amber-500'
                  : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-500'
              }`}
            >
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></span>
              ) : (
                <span className="flex items-center gap-2">
                  {formData.role === 'admin' ? <Shield className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                  {formData.role === 'admin' ? 'Register as Admin' : 'Sign Up'}
                </span>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-emerald-400 hover:text-emerald-300">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

