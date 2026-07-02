import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Phone, MapPin, Truck, Check, Eye } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AssignedPickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [updateForm, setUpdateForm] = useState({
    status: '',
    estimatedWeight: '',
    note: '',
  });

  const fetchPickups = async () => {
    setLoading(true);
    try {
      const res = await api.get('/collector/assigned');
      if (res.success) {
        setPickups(res.data);
      }
    } catch (err) {
      toast.error('Failed to load assigned pickups list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickups();
  }, []);

  const startUpdate = (pickup) => {
    setUpdatingId(pickup._id);
    setUpdateForm({
      status: pickup.status,
      estimatedWeight: pickup.estimatedWeight || '',
      note: '',
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/collector/${updatingId}/update-status`, {
        status: updateForm.status,
        estimatedWeight: parseFloat(updateForm.estimatedWeight) || undefined,
        note: updateForm.note,
      });

      if (res.success) {
        toast.success('Collection status updated successfully!');
        setUpdatingId(null);
        fetchPickups();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update pickup status');
    }
  };

  const handleAccept = async (id) => {
    try {
      const res = await api.put(`/collector/${id}/accept`);
      if (res.success) {
        toast.success('Pickup request accepted!');
        fetchPickups();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to accept assignment');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div>
        <h1 className="text-2xl font-extrabold text-white">Assigned Collections</h1>
        <p className="text-xs text-slate-400">Manage and log the weights of e-waste pickups assigned to you.</p>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : pickups.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-12 text-center text-xs text-slate-500">
          <Truck className="h-8 w-8 text-slate-650 mx-auto mb-3" />
          No assigned collections found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pickups.map((p) => {
            const isEditing = updatingId === p._id;
            return (
              <div
                key={p._id}
                id={`action-${p._id}`}
                className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-800 transition-all"
              >
                <div className="space-y-3">
                  {/* Category and Qty Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</span>
                      <h3 className="text-sm font-bold text-white capitalize">{p.category} ({p.quantity} Units)</h3>
                    </div>
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold border capitalize ${
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
                  </div>

                  {/* Citizen details */}
                  <div className="text-xs space-y-2 pt-1 border-t border-slate-850">
                    <div className="flex items-center gap-2 text-slate-200">
                      <span className="text-slate-500 font-medium">Citizen:</span>
                      <span className="font-semibold">{p.user?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Phone className="h-3.5 w-3.5 text-emerald-400" />
                      <a href={`tel:${p.user?.phone}`} className="hover:underline">{p.user?.phone}</a>
                    </div>
                    <div className="flex items-start gap-2 text-slate-200 leading-relaxed">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{p.address.street}, {p.address.city} - {p.address.pincode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{new Date(p.pickupDate).toLocaleDateString()} ({p.pickupTime})</span>
                    </div>
                  </div>

                  {/* Action or Edit Form */}
                  {isEditing ? (
                    <form onSubmit={handleUpdateSubmit} className="space-y-3 pt-3 border-t border-slate-850">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Update Status</label>
                          <select
                            value={updateForm.status}
                            onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1.5 text-xs text-white"
                          >
                            <option value="in-progress">In Progress</option>
                            <option value="collected">Collected</option>
                            <option value="recycled">Recycled</option>
                            <option value="completed">Completed ✅</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Weight (kg)</label>
                          <input
                            type="number"
                            step="0.5"
                            required
                            value={updateForm.estimatedWeight}
                            onChange={(e) => setUpdateForm({ ...updateForm, estimatedWeight: e.target.value })}
                            className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-white"
                            placeholder="E.g. 3.5"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-400 uppercase mb-1">Remarks / Note</label>
                        <input
                          type="text"
                          value={updateForm.note}
                          onChange={(e) => setUpdateForm({ ...updateForm, note: e.target.value })}
                          className="w-full rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-white placeholder-slate-550"
                          placeholder="Collector note for validation..."
                        />
                      </div>
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => setUpdatingId(null)}
                          className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-[11px] font-semibold text-slate-400 hover:bg-slate-900"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-slate-950 hover:bg-emerald-400"
                        >
                          Save Update
                        </button>
                      </div>
                    </form>
                  ) : null}
                </div>

                {!isEditing && (
                  <div className="flex gap-2 justify-end pt-4 border-t border-slate-850/60">
                    {p.status === 'assigned' ? (
                      <button
                        onClick={() => handleAccept(p._id)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        Accept
                      </button>
                    ) : (
                      <button
                        onClick={() => startUpdate(p)}
                        className="rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-all"
                      >
                        Update Collection
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AssignedPickups;
