import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Calendar, Filter, FileText, Download, ShieldCheck, Award, AlertCircle, TrendingUp } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reports', {
        params: {
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });
      if (res.success) {
        setReportData(res.data);
      }
    } catch (err) {
      toast.error('Failed to generate report audits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  const { summary, categoryBreakdown, statusBreakdown, topRecyclers } = reportData;

  return (
    <div className="space-y-6 print:space-y-4">
      <Toaster position="top-right" />

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Reports & Audits</h1>
          <p className="text-xs text-slate-400">Generate e-waste recycling summaries, view category splits, and export logs.</p>
        </div>
        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 border border-slate-800 px-4 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-all"
        >
          <Download className="h-4 w-4" />
          Export / Print Report
        </button>
      </div>

      {/* Date filter form */}
      <form onSubmit={handleFilter} className="rounded-xl border border-slate-900 bg-slate-900/20 p-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold">
          <Filter className="h-4 w-4 text-emerald-400" />
          <span>Date Range:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-white"
          />
          <span className="text-xs text-slate-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="rounded-lg border border-slate-800 bg-slate-950 px-2.5 py-1 text-xs text-white"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-4 py-1 text-xs font-bold text-slate-950 hover:bg-emerald-400"
          >
            Filter
          </button>
        </div>
      </form>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Requests Handled</p>
          <p className="text-xl font-extrabold text-white mt-1">{summary.totalRequests || 0}</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Weight Processed</p>
          <p className="text-xl font-extrabold text-emerald-400 mt-1">{(summary.totalWeight || 0).toFixed(1)} kg</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Avg Qty / Request</p>
          <p className="text-xl font-extrabold text-white mt-1">{(summary.avgQuantity || 0).toFixed(1)}</p>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Credits Awarded</p>
          <p className="text-xl font-extrabold text-teal-400 mt-1">{summary.totalRewardPoints || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category breakdown table */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white pl-1 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            Category Volume Splits
          </h2>
          {categoryBreakdown.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No categories logs recorded.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-900">
              <table className="w-full text-left text-xs text-slate-350">
                <thead className="bg-slate-950/40 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-2.5">Category</th>
                    <th className="px-4 py-2.5">Requests</th>
                    <th className="px-4 py-2.5">Total Qty</th>
                    <th className="px-4 py-2.5 text-right">Total Weight</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {categoryBreakdown.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-800/10">
                      <td className="px-4 py-2.5 capitalize font-semibold text-white">{item._id}</td>
                      <td className="px-4 py-2.5">{item.count}</td>
                      <td className="px-4 py-2.5">{item.totalQuantity}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-400 font-medium">
                        {(item.totalWeight || 0).toFixed(1)} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Top Recyclers leaderboard */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white pl-1 flex items-center gap-2">
            <Award className="h-4 w-4 text-emerald-400" />
            Top Environmental Contributors
          </h2>
          {topRecyclers.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No rankings calculated for this date range.</p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-900">
              <table className="w-full text-left text-xs text-slate-350">
                <thead className="bg-slate-950/40 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  <tr>
                    <th className="px-4 py-2.5">Citizen</th>
                    <th className="px-4 py-2.5">Collections</th>
                    <th className="px-4 py-2.5">Green Score</th>
                    <th className="px-4 py-2.5 text-right">Weight Recycled</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {topRecyclers.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-800/10">
                      <td className="px-4 py-2.5 font-semibold text-white">{item.name}</td>
                      <td className="px-4 py-2.5">{item.pickups}</td>
                      <td className="px-4 py-2.5 text-teal-400 font-bold">{item.greenScore}</td>
                      <td className="px-4 py-2.5 text-right text-emerald-400 font-semibold">
                        {(item.totalWeight || 0).toFixed(1)} kg
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
