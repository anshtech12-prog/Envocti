import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Plus, Award, RefreshCw, Calendar, Eye, ShieldCheck, Leaf } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPickups: 0,
    pendingPickups: 0,
    completedPickups: 0,
    inProgressPickups: 0,
    totalPoints: 0,
    totalWeight: 0,
    co2Saved: '0.0',
  });
  const [recentPickups, setRecentPickups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/users/dashboard');
      if (res.success) {
        setStats(res.data.stats);
        setRecentPickups(res.data.recentPickups);
      }
    } catch (err) {
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Green Score', value: user.greenScore || 0, icon: Award, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Total Pickups', value: stats.totalPickups, icon: RefreshCw, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Weight Recycled', value: `${stats.totalWeight} kg`, icon: ShieldCheck, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { label: 'CO₂ Saved', value: `${stats.co2Saved} kg`, icon: Leaf, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Welcome back, {user.name}!</h1>
          <p className="text-xs text-slate-400">Here's your environmental impact summary for today.</p>
        </div>
        <Link
          to="/dashboard/pickup/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/10"
        >
          <Plus className="h-4 w-4" />
          Schedule E-Waste Pickup
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`rounded-2xl border p-5 flex items-center justify-between bg-slate-900/40 backdrop-blur-sm ${c.color}`}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{c.label}</p>
                <p className="mt-1 text-xl font-extrabold text-white font-display">{c.value}</p>
              </div>
              <div className="rounded-xl p-2.5 bg-slate-950/40">
                <Icon className="h-5 w-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Pickups Section */}
      <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Recent Pickups</h2>
          </div>
          <Link to="/dashboard/pickups" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
            View History
          </Link>
        </div>

        {recentPickups.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 space-y-3">
            <p>No pickup requests found.</p>
            <Link to="/dashboard/pickup/new" className="inline-block text-emerald-400 hover:underline">
              Create one now to start earning rewards.
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Category</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Pickup Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Green Points</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {recentPickups.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/10">
                    <td className="px-4 py-3 font-semibold text-white capitalize">{p.category}</td>
                    <td className="px-4 py-3">{p.quantity}</td>
                    <td className="px-4 py-3">{new Date(p.pickupDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border capitalize ${
                        p.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : p.status === 'pending'
                          ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {p.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-emerald-400">
                      {p.status === 'completed' ? `+${p.rewardPoints}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/dashboard/pickups/${p._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
