import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, Filter, Eye, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const MyPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pickups/my-pickups', {
        params: {
          status: statusFilter || undefined,
          category: categoryFilter || undefined,
        },
      });
      if (res.success) {
        setPickups(res.data);
      }
    } catch (err) {
      toast.error('Failed to load pickups list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, [statusFilter, categoryFilter]);

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">My Pickup History</h1>
        <p className="text-xs text-slate-400">Track and filter all your scheduled and completed e-waste pickups.</p>
      </div>

      {/* Filters bar */}
      <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <Filter className="h-4 w-4 text-emerald-400" />
          <span>Filters:</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-emerald-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="collected">Collected</option>
            <option value="recycled">Recycled</option>
            <option value="completed">Completed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-300 outline-none focus:border-emerald-500"
          >
            <option value="">All Categories</option>
            <option value="mobile">Mobile</option>
            <option value="laptop">Laptop</option>
            <option value="battery">Battery</option>
            <option value="charger">Charger</option>
            <option value="tv">TV</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Data Table / Cards */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : pickups.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-12 text-center text-xs text-slate-500 space-y-4">
          <Calendar className="h-8 w-8 text-slate-650 mx-auto" />
          <p>No pickup requests match the selected filters.</p>
          <Link to="/dashboard/pickup/new" className="inline-block text-emerald-400 font-semibold hover:underline">
            Schedule a new pickup request
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-5 py-4">Created</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Quantity</th>
                  <th className="px-5 py-4">Scheduled Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Green Points</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {pickups.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-800/10">
                    <td className="px-5 py-4 text-slate-400">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4 font-semibold text-white capitalize">
                      {p.category}
                    </td>
                    <td className="px-5 py-4">{p.quantity}</td>
                    <td className="px-5 py-4">
                      {new Date(p.pickupDate).toLocaleDateString()} at {p.pickupTime}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold border capitalize ${
                        p.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : p.status === 'pending'
                          ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          : p.status === 'assigned'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                      }`}>
                        {p.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-emerald-400">
                      {p.status === 'completed' ? `+${p.rewardPoints}` : '—'}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to={`/dashboard/pickups/${p._id}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs font-semibold text-slate-350 hover:bg-slate-800 transition-colors"
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
        </div>
      )}
    </div>
  );
};

export default MyPickups;
