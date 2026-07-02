import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { UserPlus, Briefcase, Mail, Phone, Lock, Calendar, ClipboardList, Key, LogIn } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ManageCollectors = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleImpersonate = async (id, name, role) => {
    if (!window.confirm(`Are you sure you want to log in as ${name}? You will be logged out of your admin session.`)) return;

    try {
      const res = await api.post(`/admin/users/${id}/impersonate`);
      if (res.success && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setUser(res.data);
        toast.success(`Logged in as ${name}!`);
        if (role === 'collector') {
          navigate('/collector');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to impersonate user');
    }
  };

  const handleChangePassword = async (id, name) => {
    const newPassword = window.prompt(`Enter a new password for ${name} (minimum 6 characters):`);
    if (newPassword === null) return; // cancelled
    if (newPassword.trim().length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await api.put(`/admin/users/${id}`, {
        password: newPassword.trim(),
      });
      if (res.success) {
        toast.success(`Successfully updated password for ${name}!`);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to change password');
    }
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: { street: '', city: 'Mumbai', state: 'Maharashtra', pincode: '' },
  });
  const [createLoading, setCreateLoading] = useState(false);

  const fetchCollectors = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/collectors');
      if (res.success) {
        setCollectors(res.data);
      }
    } catch (err) {
      toast.error('Failed to load collector accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    setCreateLoading(true);
    try {
      const res = await api.post('/admin/collectors', formData);
      if (res.success) {
        toast.success('Collector account created successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          phone: '',
          address: { street: '', city: 'Mumbai', state: 'Maharashtra', pincode: '' },
        });
        setShowAddForm(false);
        fetchCollectors();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create collector account');
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Waste Collectors</h1>
          <p className="text-xs text-slate-400">Add collector accounts, track their active work load, and monitor collections metrics.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/10"
        >
          <UserPlus className="h-4 w-4" />
          {showAddForm ? 'View Collectors List' : 'Add New Collector'}
        </button>
      </div>

      {showAddForm ? (
        /* Create Collector Form */
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 sm:p-8 max-w-xl mx-auto shadow-2xl">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-emerald-400" />
            Create Collector Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Rahul Sharma"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="rahul@ewaste.com"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1.5">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="E.g. 9876543210"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="border-t border-slate-850 pt-4 space-y-3">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Address</label>
              <div>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  placeholder="Street / Office Area"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-500 mb-3"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  name="address.pincode"
                  value={formData.address.pincode}
                  onChange={handleChange}
                  placeholder="Pincode"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2.5 text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-850 flex justify-end">
              <button
                type="submit"
                disabled={createLoading}
                className="rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                {createLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Collectors Grid List */
        loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent"></div>
          </div>
        ) : collectors.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">No collector accounts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {collectors.map((c) => (
              <div
                key={c._id}
                className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 flex flex-col justify-between space-y-4 hover:border-slate-800 transition-colors shadow-lg"
              >
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">{c.name}</h3>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      Collector
                    </span>
                  </div>
                  <div className="space-y-1.5 text-slate-350">
                    <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{c.email}</p>
                    <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{c.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border-t border-slate-850 pt-3">
                  <div className="rounded-xl bg-slate-950/40 p-2.5 text-center border border-slate-900">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Assigned</p>
                    <p className="text-base font-extrabold text-white mt-0.5">{c.assignedCount || 0}</p>
                  </div>
                  <div className="rounded-xl bg-slate-950/40 p-2.5 text-center border border-slate-900">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Completed</p>
                    <p className="text-base font-extrabold text-emerald-400 mt-0.5">{c.completedCount || 0}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-slate-850/60">
                  <button
                    onClick={() => handleImpersonate(c._id, c.name, 'collector')}
                    className="w-1/2 flex items-center justify-center gap-1.5 rounded-xl border border-purple-500/20 bg-purple-500/10 py-2 text-xs font-bold text-purple-400 hover:bg-purple-500 hover:text-white transition-all"
                  >
                    <LogIn className="h-3.5 w-3.5" />
                    Login As
                  </button>
                  <button
                    onClick={() => handleChangePassword(c._id, c.name)}
                    className="w-1/2 flex items-center justify-center gap-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-white transition-all"
                  >
                    <Key className="h-3.5 w-3.5" />
                    Password
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default ManageCollectors;
