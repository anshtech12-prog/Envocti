import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Package, MapPin, Calendar, Phone, UserCheck, AlertCircle, RefreshCw } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const categoryColors = {
  mobile: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  laptop: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  battery: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  charger: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  tv: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const AvailablePickups = () => {
  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [filterCategory, setFilterCategory] = useState('');

  const fetchAvailable = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterCategory) params.category = filterCategory;
      const res = await api.get('/collector/available', { params });
      if (res.success) {
        setPickups(res.data);
      }
    } catch (err) {
      toast.error('Failed to load available pickup requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailable();
  }, [filterCategory]);

  const handleClaim = async (id) => {
    setClaimingId(id);
    try {
      const res = await api.put(`/collector/${id}/self-assign`);
      if (res.success) {
        toast.success('Pickup request claimed successfully! It is now in your Assigned Pickups.');
        // Remove the claimed pickup from the list
        setPickups((prev) => prev.filter((p) => p._id !== id));
      }
    } catch (err) {
      toast.error(err.message || 'Failed to claim this pickup request');
    } finally {
      setClaimingId(null);
    }
  };

  const categories = ['', 'mobile', 'laptop', 'battery', 'charger', 'tv', 'other'];

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Available Pickup Requests</h1>
          <p className="text-xs text-slate-400">
            Browse and claim pickup requests submitted by citizens. Once claimed, they'll appear in your Assigned Pickups.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'All Categories'}
              </option>
            ))}
          </select>
          <button
            onClick={fetchAvailable}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent"></div>
        </div>
      ) : pickups.length === 0 ? (
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-12 text-center">
          <AlertCircle className="h-8 w-8 text-slate-600 mx-auto mb-3" />
          <p className="text-xs text-slate-500">No pending pickup requests available right now.</p>
          <p className="text-[10px] text-slate-600 mt-1">Check back later or try a different category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {pickups.map((p) => (
            <div
              key={p._id}
              className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 flex flex-col justify-between space-y-4 shadow-xl hover:border-slate-800 transition-all"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</span>
                    <h3 className="text-sm font-bold text-white capitalize">{p.category}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold border capitalize ${categoryColors[p.category] || categoryColors.other}`}>
                      {p.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="text-xs space-y-2 pt-2 border-t border-slate-850">
                  <div className="flex items-center gap-2 text-slate-200">
                    <Package className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>
                      <span className="text-slate-500 font-medium">Quantity:</span> {p.quantity} unit{p.quantity > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-slate-500 font-medium ml-5.5">Citizen:</span>
                    <span className="font-semibold">{p.user?.name || 'N/A'}</span>
                  </div>
                  {p.user?.phone && (
                    <div className="flex items-center gap-2 text-slate-200">
                      <Phone className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <a href={`tel:${p.user.phone}`} className="hover:underline">{p.user.phone}</a>
                    </div>
                  )}
                  <div className="flex items-start gap-2 text-slate-200 leading-relaxed">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{p.address.street}, {p.address.city} - {p.address.pincode}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-200">
                    <Calendar className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{new Date(p.pickupDate).toLocaleDateString()} ({p.pickupTime})</span>
                  </div>
                  {p.description && (
                    <div className="pt-1">
                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        <span className="font-semibold">Note:</span> {p.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Claim Button */}
              <div className="pt-3 border-t border-slate-850/60">
                <button
                  onClick={() => handleClaim(p._id)}
                  disabled={claimingId === p._id}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {claimingId === p._id ? (
                    <>
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></div>
                      Claiming...
                    </>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4" />
                      Claim This Pickup
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailablePickups;
