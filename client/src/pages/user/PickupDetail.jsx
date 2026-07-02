import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import { Calendar, User, Phone, MapPin, Trash2, ArrowLeft, Leaf, Shield, CheckCircle } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const PickupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pickup, setPickup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchPickup = async () => {
    try {
      const res = await api.get(`/pickups/${id}`);
      if (res.success) {
        setPickup(res.data);
      }
    } catch (err) {
      toast.error('Failed to load pickup request detail');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPickup();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this pickup request?')) return;
    setCancelLoading(true);
    try {
      const res = await api.delete(`/pickups/${id}`);
      if (res.success) {
        toast.success('Pickup request cancelled successfully');
        navigate('/dashboard/pickups');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel pickup');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!pickup) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-slate-400">Pickup request not found.</p>
        <Link to="/dashboard/pickups" className="text-emerald-400 hover:underline">
          Back to My Pickups
        </Link>
      </div>
    );
  }

  // Define full status flow to trace progress
  const statusFlow = [
    { key: 'pending', label: 'Pending', desc: 'Request submitted' },
    { key: 'assigned', label: 'Assigned', desc: 'Collector assigned' },
    { key: 'in-progress', label: 'In Progress', desc: 'Collector en route' },
    { key: 'collected', label: 'Collected', desc: 'Waste picked up' },
    { key: 'recycled', label: 'Recycled', desc: 'Dismantled & processed' },
    { key: 'completed', label: 'Completed', desc: 'Recycling complete' },
  ];

  // Helper to check status indices for timeline styling
  const getCurrentStatusIndex = () => {
    return statusFlow.findIndex((s) => s.key === pickup.status);
  };

  const currentIdx = getCurrentStatusIndex();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Toaster position="top-right" />
      
      <div className="flex items-center gap-2">
        <Link to="/dashboard/pickups" className="text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-extrabold text-white">Tracking Pickup</h1>
          <p className="text-[10px] text-slate-500">ID: {pickup._id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left column: Request Details */}
        <div className="md:col-span-7 space-y-6">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-4 shadow-xl">
            <div className="flex justify-between items-start border-b border-slate-850 pb-3">
              <div>
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Category</span>
                <h2 className="text-lg font-bold text-white capitalize">{pickup.category}</h2>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Quantity</span>
                <span className="text-lg font-bold text-white">{pickup.quantity}</span>
              </div>
            </div>

            {pickup.description && (
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Description</span>
                <p className="text-xs text-slate-300 bg-slate-950/40 p-3 rounded-xl border border-slate-900 leading-relaxed">
                  {pickup.description}
                </p>
              </div>
            )}

            {pickup.images && pickup.images.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Images</span>
                <div className="flex flex-wrap gap-2">
                  {pickup.images.map((img, i) => (
                    <a
                      key={i}
                      href={img}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-16 w-16 rounded-xl border border-slate-850 overflow-hidden hover:scale-105 transition-transform"
                    >
                      <img src={img} alt="e-waste upload" className="h-full w-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Schedule & Address cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3 rounded-xl bg-slate-950/40 p-3 border border-slate-900">
                <Calendar className="h-4.5 w-4.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Pickup Slot</span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5">
                    {new Date(pickup.pickupDate).toLocaleDateString()}
                  </p>
                  <p className="text-[11px] text-slate-400">{pickup.pickupTime}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-slate-950/40 p-3 border border-slate-900">
                <MapPin className="h-4.5 w-4.5 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <span className="text-[10px] font-semibold text-slate-500 uppercase">Address</span>
                  <p className="text-xs font-bold text-slate-200 mt-0.5 truncate">
                    {pickup.address.street}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {pickup.address.city}, {pickup.address.pincode}
                  </p>
                </div>
              </div>
            </div>

            {/* Collector info */}
            {pickup.collector && (
              <div className="flex flex-col gap-2 rounded-xl bg-emerald-500/5 p-4 border border-emerald-500/10">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Assigned Collector</span>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-slate-200 font-semibold">
                    <User className="h-4 w-4 text-emerald-400" />
                    <span>{pickup.collector.name}</span>
                  </div>
                  <a
                    href={`tel:${pickup.collector.phone}`}
                    className="flex items-center gap-1 text-emerald-400 font-semibold hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    {pickup.collector.phone}
                  </a>
                </div>
              </div>
            )}

            {/* Cancellation actions */}
            {pickup.status === 'pending' && (
              <div className="pt-4 border-t border-slate-850 flex justify-end">
                <button
                  onClick={handleCancel}
                  disabled={cancelLoading}
                  className="flex items-center gap-1.5 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                  Cancel Request
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Vertical Tracking Timeline */}
        <div className="md:col-span-5">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 shadow-xl space-y-6">
            <h2 className="text-base font-bold text-white border-b border-slate-850 pb-3 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-emerald-400" />
              Recycling Timeline
            </h2>

            <div className="relative pl-6 space-y-6">
              {/* Vertical line connector */}
              <div className="absolute left-[30px] top-2 bottom-2 w-0.5 bg-slate-800"></div>

              {statusFlow.map((flowItem, index) => {
                const isCompleted = index <= currentIdx;
                const isActive = index === currentIdx;
                
                // Retrieve timestamp if status matches history logs
                const historyLog = pickup.statusHistory.find((h) => h.status === flowItem.key);
                const timeString = historyLog
                  ? new Date(historyLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';
                const dateString = historyLog
                  ? new Date(historyLog.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })
                  : '';

                return (
                  <div key={flowItem.key} className="relative flex gap-4 text-xs">
                    {/* Circle indicators */}
                    <div className="absolute -left-[20px] flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border-2 border-slate-850 z-10">
                      {isCompleted ? (
                        <CheckCircle className={`h-4.5 w-4.5 ${isActive ? 'text-emerald-400 fill-emerald-500/10' : 'text-emerald-500/60'}`} />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-slate-700"></div>
                      )}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className={`font-bold ${isActive ? 'text-emerald-400' : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                          {flowItem.label}
                        </span>
                        {historyLog && (
                          <span className="text-[9px] text-slate-500 font-medium">
                            {dateString}, {timeString}
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] leading-relaxed ${isActive ? 'text-slate-350' : 'text-slate-500'}`}>
                        {flowItem.desc}
                      </p>
                      {isActive && historyLog?.note && (
                        <p className="text-[10px] text-emerald-500/80 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10 mt-1 italic leading-relaxed">
                          "{historyLog.note}"
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupDetail;
