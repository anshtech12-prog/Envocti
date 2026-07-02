import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, AlertCircle, ShieldAlert, CheckCircle2 } from 'lucide-react';

const Awareness = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'What exactly is E-Waste?',
      a: 'E-Waste (Electronic Waste) includes any broken, discarded, or obsolete electronic devices. Examples include computers, smartphones, televisions, tablets, batteries, chargers, and household appliances.',
    },
    {
      q: 'Why is standard garbage disposal dangerous for E-waste?',
      a: 'Electronics contain heavy metals like Lead, Mercury, Cadmium, and Beryllium, along with toxic flame retardants. If thrown in standard garbage, they leak into land fills, poison ground water, and contaminate the air if incinerated.',
    },
    {
      q: 'How does the Envocti reward points system work?',
      a: 'When you create a pickup request, you enter the category and quantity. Once the collector collects the items and updates the status to completed, points are instantly credited to your Green Score. You earn base points per item category (e.g., 100 pts per Laptop, 50 pts per Mobile).',
    },
    {
      q: 'Is my personal data safe on discarded devices?',
      a: 'We highly recommend doing a factory reset and wiping all personal data from your smartphones, laptops, and hard drives before handing them to the collector. Envocti and its certified recycling partners enforce secure data destruction, but pre-wiping is a best safety practice.',
    },
    {
      q: 'What happens to the e-waste after collection?',
      a: 'Collected items are sorted at regional stations. Working parts are salvaged for refurbishing. Non-working units are dismantled safely to extract precious resources like gold, copper, and rare-earth magnets, while hazardous chemicals are neutralised.',
    },
  ];

  const tips = [
    {
      title: 'E-Waste Auditing',
      text: 'Audit your drawers annually. If an electronic accessory or cable hasn\'t been touched for 12 months, it is a prime candidate for recycling.',
      icon: AlertCircle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
    {
      title: 'Data Destruction',
      text: 'Wipe all storage devices, sign out of cloud accounts, and perform a factory reset on smartphones before recycling.',
      icon: ShieldAlert,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    },
    {
      title: 'Separate Batteries',
      text: 'Batteries degrade and can cause fires if punctured. Store old lithium-ion batteries in cool areas and submit them for pickup separately.',
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-slate-950 text-slate-100 py-10">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Awareness Hub
          </h1>
          <p className="max-w-2xl mx-auto text-sm text-slate-400">
            Learn why recycling electronics is vital for our environment and how you can do it responsibly.
          </p>
        </div>

        {/* Environmental Impact Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-2">
            <p className="text-2xl font-extrabold text-emerald-400 font-display">50M+ Tons</p>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Annual E-Waste Globally</h3>
            <p className="text-[11px] text-slate-400">
              Only 20% of global e-waste is formally documented and recycled. The rest ends up in landfills.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-2">
            <p className="text-2xl font-extrabold text-amber-400 font-display">70% Toxics</p>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Landfill Heavy Metals</h3>
            <p className="text-[11px] text-slate-400">
              Electronic waste accounts for only 2% of solid waste in landfills but contributes 70% of toxic heavy metal pollutants.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-900 bg-slate-900/40 p-6 space-y-2">
            <p className="text-2xl font-extrabold text-teal-400 font-display">100x Gold</p>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Resource Extraction efficiency</h3>
            <p className="text-[11px] text-slate-400">
              There is 100 times more gold in a ton of smartphones than in a ton of gold ore, reducing mining demands.
            </p>
          </div>
        </div>

        {/* Recycling Best Practices (Tips) */}
        <div className="space-y-6">
          <h2 className="font-display text-xl font-bold tracking-tight text-white pl-1">
            Recycling Best Practices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tips.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className={`rounded-2xl border p-5 space-y-3 ${t.color}`}>
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-5 w-5" />
                    <h3 className="text-sm font-bold text-white">{t.title}</h3>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {t.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 pl-1">
            <HelpCircle className="h-5 w-5 text-emerald-400" />
            <h2 className="font-display text-xl font-bold tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-900 bg-slate-900/20 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-4 text-left font-semibold text-slate-200 hover:bg-slate-900/60 transition-colors"
                >
                  <span className="text-xs sm:text-sm">{faq.q}</span>
                  {openFaq === index ? (
                    <ChevronUp className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="border-t border-slate-900/60 bg-slate-950/40 p-4 text-xs text-slate-400 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Awareness;
