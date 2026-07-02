import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Smartphone,
  Laptop,
  Battery,
  Tv,
  Cpu,
  Plug,
  Calendar,
  MapPin,
  FileText,
  Camera,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const CreatePickup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: '',
    quantity: 1,
    description: '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      state: user?.address?.state || '',
      pincode: user?.address?.pincode || '',
    },
    pickupDate: '',
    pickupTime: '',
    estimatedWeight: 0,
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const categories = [
    { id: 'mobile', name: 'Mobile', icon: Smartphone, desc: 'Phones, tablets' },
    { id: 'laptop', name: 'Laptop', icon: Laptop, desc: 'Laptops, netbooks' },
    { id: 'battery', name: 'Battery', icon: Battery, desc: 'UPS, Lithium batteries' },
    { id: 'charger', name: 'Charger', icon: Plug, desc: 'Cables, adapter bricks' },
    { id: 'tv', name: 'TV', icon: Tv, desc: 'LEDs, monitors, CRTs' },
    { id: 'other', name: 'Other', icon: Cpu, desc: 'Keyboards, routers, etc' },
  ];

  const handleInputChange = (e) => {
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

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + files.length > 5) {
      toast.error('You can upload up to 5 images max');
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    const filePreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...filePreviews]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const nextStep = () => {
    if (step === 1 && !formData.category) {
      toast.error('Please select an e-waste category');
      return;
    }
    if (step === 3 && (!formData.address.street || !formData.address.city || !formData.address.pincode)) {
      toast.error('Please fill in complete address fields');
      return;
    }
    if (step === 4 && (!formData.pickupDate || !formData.pickupTime)) {
      toast.error('Please select date and time slot');
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Create Multi-part FormData for files + fields
    const data = new FormData();
    data.append('category', formData.category);
    data.append('quantity', formData.quantity);
    data.append('description', formData.description);
    data.append('estimatedWeight', formData.estimatedWeight);
    data.append('pickupDate', formData.pickupDate);
    data.append('pickupTime', formData.pickupTime);
    data.append('address[street]', formData.address.street);
    data.append('address[city]', formData.address.city);
    data.append('address[state]', formData.address.state);
    data.append('address[pincode]', formData.address.pincode);

    files.forEach((file) => {
      data.append('images', file);
    });

    try {
      const res = await api.post('/pickups', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.success) {
        toast.success('Pickup scheduled successfully!');
        navigate('/dashboard/pickups');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to schedule pickup');
    } finally {
      setLoading(false);
    }
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateString = tomorrow.toISOString().split('T')[0];

  return (
    <div className="mx-auto max-w-2xl py-2">
      <Toaster position="top-right" />
      
      {/* Progress Tracker */}
      <div className="mb-8 flex items-center justify-between px-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
        <span className={step >= 1 ? 'text-emerald-400 font-extrabold' : ''}>Category</span>
        <div className={`h-0.5 flex-1 mx-2 bg-slate-800 ${step >= 2 ? 'bg-emerald-500/30' : ''}`}></div>
        <span className={step >= 2 ? 'text-emerald-400 font-extrabold' : ''}>Details</span>
        <div className={`h-0.5 flex-1 mx-2 bg-slate-800 ${step >= 3 ? 'bg-emerald-500/30' : ''}`}></div>
        <span className={step >= 3 ? 'text-emerald-400 font-extrabold' : ''}>Address</span>
        <div className={`h-0.5 flex-1 mx-2 bg-slate-800 ${step >= 4 ? 'bg-emerald-500/30' : ''}`}></div>
        <span className={step >= 4 ? 'text-emerald-400 font-extrabold' : ''}>Schedule</span>
        <div className={`h-0.5 flex-1 mx-2 bg-slate-800 ${step >= 5 ? 'bg-emerald-500/30' : ''}`}></div>
        <span className={step >= 5 ? 'text-emerald-400 font-extrabold' : ''}>Review</span>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
        
        {/* Step 1: Category & Qty */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1">Select E-Waste Category</h2>
              <p className="text-xs text-slate-400">Choose the primary type of electronics you wish to recycle.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {categories.map((c) => {
                const Icon = c.icon;
                const isSelected = formData.category === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: c.id })}
                    className={`flex flex-col items-center p-4 rounded-2xl border text-center transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                        : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <Icon className="h-6 w-6 mb-2" />
                    <span className="text-xs font-bold text-slate-200">{c.name}</span>
                    <span className="text-[9px] text-slate-500 mt-0.5">{c.desc}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-350 mb-2">Quantity</label>
              <input
                type="number"
                name="quantity"
                min="1"
                required
                value={formData.quantity}
                onChange={handleInputChange}
                className="w-32 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Step 2: Description & Images */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <FileText className="h-5 w-5 text-emerald-400" />
                Describe E-Waste Items
              </h2>
              <p className="text-xs text-slate-400">Add detailed specs, model names, or condition remarks (e.g. broken screen, missing chargers).</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">Item Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  placeholder="E.g. Old MacBook Pro 2015, turns on but battery swollen. 1x charger included."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-350 mb-1.5">Estimated Weight (kg)</label>
                  <input
                    type="number"
                    name="estimatedWeight"
                    min="0"
                    step="0.5"
                    value={formData.estimatedWeight}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* File Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-2">Upload Device Images (Max 5)</label>
                <div className="flex flex-wrap gap-3">
                  <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/40 text-slate-500 hover:text-slate-350 hover:border-slate-650 transition-colors">
                    <Camera className="h-5 w-5 mb-1" />
                    <span className="text-[9px] font-semibold">Add Photo</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                  
                  {previews.map((preview, i) => (
                    <div key={i} className="relative h-20 w-20 rounded-xl overflow-hidden border border-slate-800">
                      <img src={preview} alt="waste" className="h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white hover:bg-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Address Form */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-400" />
                Pickup Location
              </h2>
              <p className="text-xs text-slate-400">Confirm the address where our waste collector should arrive.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  required
                  value={formData.address.street}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder-slate-550 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-350 mb-1.5">City</label>
                  <input
                    type="text"
                    name="address.city"
                    required
                    value={formData.address.city}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-350 mb-1.5">State</label>
                  <input
                    type="text"
                    name="address.state"
                    required
                    value={formData.address.state}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">Pincode</label>
                <input
                  type="text"
                  name="address.pincode"
                  required
                  value={formData.address.pincode}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Schedule */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-emerald-400" />
                Select Pickup Date & Time
              </h2>
              <p className="text-xs text-slate-400">Choose a convenient slot for our collector to coordinate the collection.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-1.5">Preferred Date</label>
                <input
                  type="date"
                  name="pickupDate"
                  min={minDateString}
                  required
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-350 mb-2">Preferred Time Slot</label>
                <div className="grid grid-cols-1 gap-2.5">
                  {['9:00 AM - 12:00 PM', '12:00 PM - 3:00 PM', '3:00 PM - 6:00 PM'].map((slot) => (
                    <label
                      key={slot}
                      className={`flex items-center gap-3 rounded-xl border p-3 text-xs font-semibold cursor-pointer transition-all ${
                        formData.pickupTime === slot
                          ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="pickupTime"
                        value={slot}
                        checked={formData.pickupTime === slot}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      {slot}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold text-white">Review Request</h2>
              <p className="text-xs text-slate-400">Confirm pickup request specifications before submission.</p>
            </div>

            <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-850 space-y-3.5 text-xs text-slate-300">
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-500">Category / Qty:</span>
                <span className="font-bold text-white capitalize">{formData.category} ({formData.quantity})</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-500">Scheduled Date:</span>
                <span className="font-semibold">{new Date(formData.pickupDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-500">Time Slot:</span>
                <span className="font-semibold">{formData.pickupTime}</span>
              </div>
              <div className="flex justify-between border-b border-slate-850 pb-2">
                <span className="text-slate-500">Estimated Weight:</span>
                <span className="font-semibold">{formData.estimatedWeight || 'Unspecified'} kg</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-1">Address Details:</span>
                <p className="font-medium text-slate-300">
                  {formData.address.street}, {formData.address.city}, {formData.address.state} - {formData.address.pincode}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="mt-8 flex justify-between border-t border-slate-850 pt-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          ) : (
            <div></div>
          )}

          {step < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors ml-auto"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors ml-auto"
            >
              {loading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-950 border-t-transparent"></span>
              ) : (
                'Schedule Now'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePickup;
