import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, Award, Sparkles, ArrowRight, Smartphone, Laptop, Battery, Cpu, Tv, Globe, MapPin } from 'lucide-react';

const Landing = () => {
  const categories = [
    { name: 'Mobiles', icon: Smartphone, points: 50, color: 'text-blue-400 bg-blue-500/10' },
    { name: 'Laptops', icon: Laptop, points: 100, color: 'text-emerald-400 bg-emerald-500/10' },
    { name: 'Batteries', icon: Battery, points: 30, color: 'text-amber-400 bg-amber-500/10' },
    { name: 'TVs & Displays', icon: Tv, points: 150, color: 'text-purple-400 bg-purple-500/10' },
    { name: 'Other Electronics', icon: Cpu, points: 40, color: 'text-pink-400 bg-pink-500/10' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-slate-950 text-slate-100">
      {/* Background gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[120px]"></div>
        <div className="absolute top-[40%] -left-40 h-[500px] w-[500px] rounded-full bg-teal-500/5 blur-[100px]"></div>
        <div className="absolute bottom-0 right-[20%] h-[400px] w-[400px] rounded-full bg-cyan-500/5 blur-[120px]"></div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 animate-fade-in-up">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Responsible Recycling Made Rewarding</span>
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl animate-fade-in-up delay-100">
              Turn Your E-Waste Into <span className="text-gradient-primary">Green Rewards</span>
            </h1>
            <p className="max-w-2xl mx-auto lg:mx-0 text-base text-slate-400 sm:text-lg animate-fade-in-up delay-200">
              Schedule quick pickups for your old devices, track the recycling cycle, earn green points, and compete in the recycling leaderboard!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start animate-fade-in-up delay-300">
              <Link
                to="/register"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Recycling Now
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <Link
                to="/awareness"
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-6 py-3.5 text-sm font-bold hover:bg-slate-800 transition-all hover:border-slate-700"
              >
                Learn E-Waste Impact
              </Link>
            </div>
          </div>

          {/* Graphical floating panel */}
          <div className="lg:col-span-5 flex justify-center animate-fade-in-up delay-400">
            <div className="animate-float relative w-full max-w-[380px] rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-2xl backdrop-blur-md glow-border">
              <div className="flex items-center justify-between border-b border-slate-850 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500/60"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-500/60"></div>
                  <div className="h-3 w-3 rounded-full bg-green-500/60"></div>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live Tracker</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold">2x Laptop Pickup</p>
                      <p className="text-[10px] text-slate-500">Scheduled for 12:00 PM</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                    Pending
                  </span>
                </div>

                {/* Progress simulator */}
                <div className="space-y-1.5 px-1 py-1">
                  <div className="flex justify-between text-[10px] font-semibold text-slate-400">
                    <span>Recycled Status</span>
                    <span className="text-emerald-400">80% Reclaimed</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-850 overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3.5 border border-emerald-500/10">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-yellow-400 animate-pulse" />
                    <span className="text-xs font-bold text-slate-200">Green Score Earned</span>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-400">+200 Points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global E-Waste Map CTA Banner */}
      <section className="relative z-10 mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <Link
          to="/ewaste-map"
          className="group block rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-500/5 via-emerald-500/5 to-violet-500/5 p-6 md:p-8 hover:border-cyan-500/40 transition-all hover-glow animate-fade-in-up delay-500"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Explore Global E-Waste Map</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Interactive heatmap showing country-wise e-waste data from UN Global E-Waste Monitor 2024
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold group-hover:gap-3 transition-all">
              <span>View Map</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </Link>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 border-t border-slate-900 bg-slate-950/60 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 animate-fade-in-up">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl text-white">
              How Envocti Works
            </h2>
            <p className="text-sm text-slate-400">
              Our simple pickup model allows citizens, collectors, and recyclers to collaborate seamlessly for the environment.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-900 bg-slate-900/25 p-6 hover:border-emerald-500/20 transition-all group hover-glow text-center animate-scale-in delay-100">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform mx-auto">
                <Laptop className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">1. Schedule Pickup</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log in, choose categories, upload device images, and select your preferred pickup date/time slot.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-900/25 p-6 hover:border-emerald-500/20 transition-all group hover-glow text-center animate-scale-in delay-200">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform mx-auto">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">2. Secure Collection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                An authorized collector accepts the request, inspects the items, collects the e-waste, and routes it to certified recyclers.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-900/25 p-6 hover:border-emerald-500/20 transition-all group hover-glow text-center animate-scale-in delay-300">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform mx-auto">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">3. Claim Points</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earn Green Score points instantly on completion. View contribution stats like CO₂ emissions prevented.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Points Estimator */}
      <section className="relative z-10 py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-8 md:p-12 shadow-2xl glow-border animate-fade-in-up">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 text-center lg:text-left">
              <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl text-white">
                Eco Points Reference
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Different electronics require specialized recycling. We award green points matching their complexity and size.
              </p>
              <div className="rounded-xl bg-slate-950/60 p-4 border border-slate-850">
                <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1">Environmental Impact</p>
                <p className="text-xs text-slate-300">
                  Every 10 kg of recycled electronic items prevents roughly 25 kg of carbon emissions and filters out lead and mercury from soil.
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={c.name} className={`flex items-center gap-4 rounded-2xl bg-slate-950/40 p-4 border border-slate-900 hover:border-slate-800 transition-colors hover-glow animate-fade-in-up delay-${(i + 1) * 100}`}>
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{c.name}</p>
                      <p className="text-[11px] font-medium text-emerald-400">+{c.points} Points Base</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
