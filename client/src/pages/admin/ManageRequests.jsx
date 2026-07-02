import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, User, Phone, MapPin, Truck, RefreshCw, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const ManageRequests = () => {
  const [requests, setRequests] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, collRes] = await Promise.all([
        api.get('/pickups', {
          params: {
            status: statusFilter || undefined,
            category: categoryFilter || undefined,
            page,
            limit: 10,
          },
        }),
        api.get('/admin/collectors'),
      ]);

      if (reqRes.success) {
        setRequests(reqRes.data);
        setTotalPages(reqRes.pagination.pages);
      }
      if (collRes.success) {
        setCollectors(collRes.data);
      }
    } catch (err) {
      toast.error('Failed to load pickups requests list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [statusFilter, categoryFilter, page]);

  const handleAssign = async (requestId, collectorId) => {
    if (!collectorId) return;
    try {
      const res = await api.put(`/pickups/${requestId}/assign`, { collectorId });
      if (res.success) {
        toast.success('Collector assigned successfully!');
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to assign collector');
    }
  };

  const handleStatusChange = async (requestId, status) => {
    if (!status) return;
    if (status === 'completed' && !window.confirm('Marking as completed will award points to the citizen. Confirm?')) return;

    try {
      const res = await api.put(`/pickups/${requestId}/status`, {
        status,
        note: `Status updated by Admin to ${status}`,
      });
      if (res.success) {
        toast.success(`Status updated to ${status}!`);
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update request status');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div>
        <h1 className="text-2xl font-extrabold text-white">Manage Pickup Requests</h1>
        <p className="text-xs text-slate-400">Review user pickup schedules, assign waste collectors, and track lifecycle statuses.</p>
      </div>

      {/* Filter panel */}
      <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <Truck className="h-4 w-4 text-emerald-400" />
          <span>Filters:</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-350 outline-none focus:border-emerald-500"
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
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-350 outline-none focus:border-emerald-500"
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

      {/* Requests table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-12 text-center text-xs text-slate-500">
          No e-waste pickup requests found matching selected filters.
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-350">
                <thead className="bg-slate-950/40 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-5 py-4">Citizen</th>
                    <th className="px-5 py-4">E-Waste Item</th>
                    <th className="px-5 py-4">Address</th>
                    <th className="px-5 py-4">Date/Slot</th>
                    <th className="px-5 py-4">Collector</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Assign/Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {requests.map((r) => (
                    <tr key={r._id} className="hover:bg-slate-800/10">
                      <td className="px-5 py-4 font-medium text-white">{r.user?.name || 'Deleted User'}</td>
                      <td className="px-5 py-4 capitalize font-semibold text-slate-200">
                        {r.category} ({r.quantity} Units)
                      </td>
                      <td className="px-5 py-4 max-w-[150px] truncate">
                        {r.address.street}, {r.address.city}
                      </td>
                      <td className="px-5 py-4">
                        {new Date(r.pickupDate).toLocaleDateString()}
                        <p className="text-[10px] text-slate-500 mt-0.5">{r.pickupTime}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {r.status === 'pending' ? (
                          <select
                            onChange={(e) => handleAssign(r._id, e.target.value)}
                            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-[11px] text-emerald-400 font-semibold"
                          >
                            <option value="">Assign Collector</option>
                            {collectors.map((c) => (
                              <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                          </select>
                        ) : (
                          r.collector?.name || 'Unassigned'
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold border capitalize ${
                          r.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : r.status === 'pending'
                            ? 'bg-slate-500/10 text-slate-400 border-slate-500/20'
                            : r.status === 'assigned'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-teal-500/10 text-teal-400 border-teal-500/20'
                        }`}>
                          {r.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        {r.status !== 'completed' && (
                          <select
                            value={r.status}
                            onChange={(e) => handleStatusChange(r._id, e.target.value)}
                            className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-[11px] text-slate-350"
                          >
                            <option value="">Change Status</option>
                            <option value="pending">Pending</option>
                            <option value="assigned">Assigned</option>
                            <option value="in-progress">In Progress</option>
                            <option value="collected">Collected</option>
                            <option value="recycled">Recycled</option>
                            <option value="completed">Completed</option>
                          </select>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-900/60 pt-4 px-2">
              <span className="text-[10px] text-slate-500 font-medium">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-350 hover:bg-slate-800 disabled:opacity-40"
                >
                  Previous
                </button>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-[11px] font-semibold text-slate-350 hover:bg-slate-800 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageRequests;
