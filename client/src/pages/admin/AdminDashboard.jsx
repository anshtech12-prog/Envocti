import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Users,
  Truck,
  ShieldCheck,
  RefreshCw,
  Award,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.success) {
          setData(res.data);
        }
      } catch (err) {
        toast.error('Failed to load admin analytics dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const { stats, categoryStats, monthlyTrends, statusDistribution, recentRequests } = data;

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
    { label: 'Total Requests', value: stats.totalRequests, icon: RefreshCw, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
    { label: 'Collectors', value: stats.totalCollectors, icon: Truck, color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
    { label: 'Total Recycled', value: `${stats.totalWeight} kg`, icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  ];

  // Colors for Recharts Pie cells
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  // Map category stats for Recharts
  const barChartData = categoryStats.map((c) => ({
    name: c._id.charAt(0).toUpperCase() + c._id.slice(1),
    Requests: c.count,
  }));

  // Map monthly trends for Recharts
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const lineChartData = monthlyTrends.map((t) => ({
    name: `${monthNames[t._id.month - 1]} ${t._id.year}`,
    Requests: t.count,
    Weight: t.weight,
  }));

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Analytics Dashboard</h1>
        <p className="text-xs text-slate-400">Overview of users, collection volumes, and recycling category splits.</p>
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

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Bar Chart) */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-6">Requests by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: 11 }} />
                <Bar dataKey="Requests" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends (Line Chart) */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 shadow-xl">
          <h2 className="text-sm font-bold text-white mb-6">Collection Trends (Last 6 Months)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', fontSize: 11 }} />
                <Line type="monotone" dataKey="Weight" stroke="#10b981" strokeWidth={2.5} name="Weight (kg)" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Requests" stroke="#3b82f6" strokeWidth={2} name="Requests Count" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-850 pb-4 mb-4">
          <Calendar className="h-5 w-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">Recent Requests Activity</h2>
        </div>

        {recentRequests.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No recent pickup activity.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3 rounded-l-xl">User</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Scheduled Date</th>
                  <th className="px-4 py-3">Collector</th>
                  <th className="px-4 py-3 rounded-r-xl">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {recentRequests.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-800/10">
                    <td className="px-4 py-3 font-semibold text-white">{r.user?.name || 'Deleted User'}</td>
                    <td className="px-4 py-3 capitalize">{r.category}</td>
                    <td className="px-4 py-3">{r.quantity}</td>
                    <td className="px-4 py-3">{new Date(r.pickupDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-slate-400">{r.collector?.name || 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold border capitalize ${
                        r.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : r.status === 'pending'
                          ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {r.status.replace('-', ' ')}
                      </span>
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

export default AdminDashboard;
