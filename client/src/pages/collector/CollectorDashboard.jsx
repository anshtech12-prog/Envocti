import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Truck, ShieldAlert, Award, Package, CheckSquare, Eye, Inbox } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CollectorDashboard = () => {
  const [stats, setStats] = useState({
    totalAssigned: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    todayCompleted: 0,
    totalWeight: 0,
  });
  const [assignedPickups, setAssignedPickups] = useState([]);
  const [availableCount, setAvailableCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCollectorData = async () => {
    try {
      const [statsRes, listRes, availRes] = await Promise.all([
        api.get('/collector/stats'),
        api.get('/collector/assigned', { params: { limit: 5 } }),
        api.get('/collector/available', { params: { limit: 1 } }),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (listRes.success) setAssignedPickups(listRes.data);
      if (availRes.success) setAvailableCount(availRes.pagination?.total || 0);
    } catch (err) {
      toast.error('Failed to load collector dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectorData();
  }, []);

  const handleAccept = async (id) => {
    try {
      const res = await api.put(`/collector/${id}/accept`);
      if (res.success) {
        toast.success('Pickup request accepted! Drive safe.');
        fetchCollectorData(); // Refresh metrics and lists
      }
    } catch (err) {
      toast.error(err.message || 'Failed to accept pickup assignment');
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'New Requests', value: availableCount, icon: Inbox, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { label: 'Assigned Pickups', value: stats.totalAssigned, icon: Truck, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Completed Today', value: stats.todayCompleted, icon: CheckSquare, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Pending Action', value: stats.pending, icon: ShieldAlert, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Weight Collected', value: `${stats.totalWeight} kg`, icon: Package, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  ];

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Collector Console</h1>
        <p className="text-xs text-slate-400">View and update e-waste pick up requests assigned to you.</p>
      </div>

      {/* Stats row */}
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

      {/* Available Pickups Banner */}
      {availableCount > 0 && (
        <Link
          to="/collector/available"
          className="block rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 hover:bg-purple-500/10 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-purple-500/15 p-2.5">
                <Inbox className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {availableCount} new pickup request{availableCount > 1 ? 's' : ''} waiting!
                </p>
                <p className="text-[10px] text-slate-400">
                  Citizens have submitted requests. Browse and claim them now.
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
              Browse Requests →
            </span>
          </div>
        </Link>
      )}

      {/* Assigned Pickups Table */}
      <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 shadow-xl backdrop-blur-sm">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-850">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Assigned Pickup Requests</h2>
          </div>
          <Link to="/collector/pickups" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
            View All
          </Link>
        </div>

        {assignedPickups.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No assigned pickups found. Good job!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">Citizen Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Address</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {assignedPickups.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/10">
                    <td className="px-4 py-3 font-semibold text-white">{p.user?.name || 'N/A'}</td>
                    <td className="px-4 py-3 capitalize">{p.category}</td>
                    <td className="px-4 py-3">{p.quantity}</td>
                    <td className="px-4 py-3 max-w-[180px] truncate">
                      {p.address.street}, {p.address.city}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border capitalize ${
                        p.status === 'assigned'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : p.status === 'in-progress'
                          ? 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                          : p.status === 'collected'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                        {p.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-1.5 whitespace-nowrap">
                      {p.status === 'assigned' && (
                        <button
                          onClick={() => handleAccept(p._id)}
                          className="rounded-lg bg-emerald-500 px-2.5 py-1 text-[11px] font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                        >
                          Accept
                        </button>
                      )}
                      <Link
                        to={`/collector/pickups#action-${p._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Manage
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

export default CollectorDashboard;
