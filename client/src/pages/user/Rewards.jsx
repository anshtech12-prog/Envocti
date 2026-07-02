import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Award, Leaf, Trees, ShieldCheck, RefreshCw, Trophy, Calendar } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const Rewards = () => {
  const [rewardData, setRewardData] = useState({
    rewards: [],
    totalPoints: 0,
    greenScore: 0,
  });
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [rewardRes, leaderRes] = await Promise.all([
        api.get('/rewards/my-rewards'),
        api.get('/rewards/leaderboard'),
      ]);

      if (rewardRes.success) setRewardData(rewardRes.data);
      if (leaderRes.success) setLeaderboard(leaderRes.data);
    } catch (err) {
      toast.error('Failed to load green rewards data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  // Equivalents calculations
  const totalPoints = rewardData.greenScore;
  const estimatedWeight = Math.round(totalPoints / 25); // Roughly 25 points per kg
  const co2Saved = (estimatedWeight * 2.5).toFixed(1);
  const treesPlanted = Math.max(1, Math.round(parseFloat(co2Saved) / 20)); // Roughly 20kg CO2 per tree per year

  return (
    <div className="space-y-8">
      <Toaster position="top-right" />
      
      <div>
        <h1 className="text-2xl font-extrabold text-white">Green Rewards</h1>
        <p className="text-xs text-slate-400">Earn eco-credits for every pickup and monitor your environmental preservation index.</p>
      </div>

      {/* Grid of Scores and Environmental Equivalents */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Score */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex flex-col justify-between shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Green Score</span>
            <Award className="h-5 w-5 text-emerald-400 animate-bounce" />
          </div>
          <div className="mt-4">
            <h2 className="text-3xl font-extrabold text-white font-display">{totalPoints}</h2>
            <p className="text-[10px] text-slate-500 mt-1">Total points redeemable</p>
          </div>
        </div>

        {/* CO2 equivalents */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CO₂ Prevented</span>
            <Leaf className="h-5 w-5 text-teal-400" />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-extrabold text-white font-display">{co2Saved} kg</h2>
            <p className="text-[10px] text-slate-500 mt-1">Carbon offset equivalence</p>
          </div>
        </div>

        {/* Tree equivalents */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tree Absorption</span>
            <Trees className="h-5 w-5 text-emerald-400" />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-extrabold text-white font-display">{treesPlanted} Trees</h2>
            <p className="text-[10px] text-slate-500 mt-1">Annual tree absorption rate</p>
          </div>
        </div>

        {/* Landfill saving */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Landfill Diverted</span>
            <ShieldCheck className="h-5 w-5 text-blue-400" />
          </div>
          <div className="mt-4">
            <h2 className="text-2xl font-extrabold text-white font-display">{estimatedWeight} kg</h2>
            <p className="text-[10px] text-slate-500 mt-1">Heavy metals safely isolated</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Points Logs */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-base font-bold text-white pl-1 flex items-center gap-2">
            <RefreshCw className="h-4.5 w-4.5 text-emerald-400" />
            Points History
          </h2>

          {rewardData.rewards.length === 0 ? (
            <div className="rounded-2xl border border-slate-900 bg-slate-900/20 p-8 text-center text-xs text-slate-500">
              No reward transaction entries found. Points will credit on completed collections.
            </div>
          ) : (
            <div className="space-y-2.5">
              {rewardData.rewards.map((r) => (
                <div key={r._id} className="rounded-xl border border-slate-900 bg-slate-900/20 p-4 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 text-xs">
                    <p className="font-semibold text-slate-200 capitalize">{r.description || `Points awarded for ${r.pickup?.category}`}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-400">+{r.points}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Leaderboard */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-base font-bold text-white pl-1 flex items-center gap-2">
            <Trophy className="h-4.5 w-4.5 text-emerald-400" />
            Top Recyclers Leaderboard
          </h2>

          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-4 shadow-xl">
            {leaderboard.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">No leaderboard rankings available.</p>
            ) : (
              <div className="space-y-2.5">
                {leaderboard.map((item, index) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/40 border border-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Index */}
                      <span className={`h-6 w-6 flex items-center justify-center rounded-lg text-[10px] font-bold ${
                        index === 0
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : index === 1
                          ? 'bg-slate-300/10 text-slate-300'
                          : index === 2
                          ? 'bg-amber-700/10 text-amber-500'
                          : 'text-slate-500'
                      }`}>
                        #{index + 1}
                      </span>
                      <div className="text-xs">
                        <p className="font-semibold text-slate-200">{item.name}</p>
                        <p className="text-[10px] text-slate-500">{item.totalPickups} collections completed</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400">{item.greenScore} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
