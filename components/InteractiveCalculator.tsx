'use client';

import React, { useState } from 'react';
import { Calculator, Copy, Check, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { trackEvent } from './Analytics';

export const InteractiveCalculator: React.FC = () => {
  const [diameter, setDiameter] = useState<number>(20);
  const [stumpCount, setStumpCount] = useState<number>(1);
  const [woodType, setWoodType] = useState<'softwood' | 'medium' | 'hardwood'>('hardwood');
  const [rootFlare, setRootFlare] = useState<'none' | 'moderate' | 'heavy'>('moderate');
  const [access, setAccess] = useState<'easy' | 'tight'>('easy');
  const [distance, setDistance] = useState<number>(15);
  const [copied, setCopied] = useState<boolean>(false);

  // Math based on official formula
  const baseRatePerInch = 4.0;
  const woodMultiplier = woodType === 'softwood' ? 0.9 : woodType === 'hardwood' ? 1.15 : 1.0;
  const flareMultiplier = rootFlare === 'moderate' ? 1.1 : rootFlare === 'heavy' ? 1.25 : 1.0;
  const accessMultiplier = access === 'tight' ? 1.15 : 1.0;

  // Multi-stump discount
  const discountRate = stumpCount >= 6 ? 0.2 : stumpCount >= 4 ? 0.15 : stumpCount >= 2 ? 0.1 : 0.0;

  // Travel calculation
  const freeRadius = 15;
  const extraMiles = Math.max(0, distance - freeRadius);
  const travelCharge = extraMiles * 3.0;

  // Calculations
  const rawBase = diameter * baseRatePerInch * stumpCount;
  const adjustedStumpSubtotal = rawBase * woodMultiplier * flareMultiplier * accessMultiplier;
  const discountAmount = adjustedStumpSubtotal * discountRate;
  const totalBeforeMin = adjustedStumpSubtotal - discountAmount + travelCharge;
  const minimumFee = 150.0;
  const finalQuote = Math.max(minimumFee, Math.round(totalBeforeMin / 5) * 5);

  // Estimated job costs
  const estHours = Math.max(1.5, (diameter * stumpCount * 0.06) + 0.75);
  const fuelCost = estHours * 6.0;
  const toothWear = (diameter * stumpCount * 0.55);
  const vehicleCost = (distance * 2) * 0.70;
  const overheadShare = 25.0;
  const totalCost = Math.round((fuelCost + toothWear + vehicleCost + overheadShare) * 10) / 10;
  const netProfit = Math.max(0, Math.round((finalQuote - totalCost) * 10) / 10);
  const marginPercent = Math.round((netProfit / finalQuote) * 100);

  const handleCopyQuote = () => {
    trackEvent('copy_calculator_quote', { diameter, finalQuote });
    const breakdown = `STUMP GRINDING QUOTE ESTIMATE
Stump(s): ${stumpCount} stump(s) @ ${diameter}" diameter
Wood: ${woodType.toUpperCase()} (${woodMultiplier}x) | Root Flare: ${rootFlare.toUpperCase()} (${flareMultiplier}x)
Access: ${access.toUpperCase()} (${accessMultiplier}x)
-----------------------------
Recommended Quote: $${finalQuote}
Estimated Direct Costs: ~$${totalCost} (Fuel, Teeth, Travel)
Estimated Net Profit Kept: ~$${netProfit} (${marginPercent}% margin)
*Calculated using The Stump Grinding Playbook Formula*`;

    navigator.clipboard.writeText(breakdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="live-calculator" className="py-20 bg-sand/30 border-y border-bark/10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand border border-wood/30 text-bark text-xs font-bold uppercase tracking-wider">
            <Calculator size={15} className="text-orange" />
            <span>Interactive Quoting Engine</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
            Test the Pricing Formula Live
          </h2>
          <p className="text-bark/80 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Move the sliders to see how diameter, wood hardness, root flares, and gate access change your quote and your real take-home margin.
          </p>
        </div>

        <div className="bg-[#FBF6EC] border-2 border-bark/20 rounded-2xl p-6 sm:p-10 shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Controls (Left 7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Slider 1: Diameter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-bark">
                <label htmlFor="diameter-slider">Stump Diameter (Collar Base):</label>
                <span className="px-3 py-1 rounded-md bg-sand border border-wood/30 font-mono text-base text-orange">
                  {diameter} inches
                </span>
              </div>
              <input
                id="diameter-slider"
                type="range"
                min="6"
                max="48"
                step="1"
                value={diameter}
                onChange={(e) => setDiameter(Number(e.target.value))}
                className="w-full h-2.5 bg-sand rounded-lg appearance-none cursor-pointer accent-orange"
              />
              <div className="flex justify-between text-[11px] text-wood-dark font-medium">
                <span>6&quot; (Small shrub)</span>
                <span>24&quot; (Standard tree)</span>
                <span>48&quot; (Large oak)</span>
              </div>
            </div>

            {/* Stump Count & Distance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bark mb-1.5">
                  Number of Stumps
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setStumpCount(num)}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        stumpCount === num
                          ? 'bg-orange text-white border-orange shadow-sm'
                          : 'bg-white text-bark border-bark/20 hover:bg-sand'
                      }`}
                    >
                      {num} {num === 1 ? 'stump' : 'stumps'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bark mb-1.5">
                  Distance (One-way)
                </label>
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-bark/20 text-xs">
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    className="w-16 font-mono font-bold text-bark focus:outline-none"
                  />
                  <span className="text-wood">miles (free radius: 15 mi)</span>
                </div>
              </div>
            </div>

            {/* Wood Type Toggle */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-bark">
                Wood Hardness
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: 'softwood', label: 'Softwood', note: 'Pine, Poplar (0.9x)' },
                  { key: 'medium', label: 'Medium', note: 'Ash, Birch (1.0x)' },
                  { key: 'hardwood', label: 'Hardwood', note: 'Oak, Hickory (1.15x)' },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setWoodType(item.key as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      woodType === item.key
                        ? 'bg-wood-dark text-[#FBF6EC] border-wood-dark shadow-sm'
                        : 'bg-white text-bark border-bark/20 hover:bg-sand/60'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className="text-[10px] opacity-75">{item.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Root Flare & Gate Access */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bark mb-1.5">
                  Surface Root Flare
                </label>
                <select
                  value={rootFlare}
                  onChange={(e) => setRootFlare(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-bark/20 bg-white text-bark text-xs font-medium focus:ring-2 focus:ring-orange"
                >
                  <option value="none">None (Clean trunk)</option>
                  <option value="moderate">Moderate Flare (+10%)</option>
                  <option value="heavy">Heavy Surface Roots (+25%)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-bark mb-1.5">
                  Yard Access
                </label>
                <select
                  value={access}
                  onChange={(e) => setAccess(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-bark/20 bg-white text-bark text-xs font-medium focus:ring-2 focus:ring-orange"
                >
                  <option value="easy">Easy (Open lawn / wide gate)</option>
                  <option value="tight">Tight Gate &lt;36&quot; (+15%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Output Card (Right 5 cols) */}
          <div className="lg:col-span-5 bg-bark text-sand rounded-2xl p-6 sm:p-7 shadow-xl border border-wood-dark space-y-5">
            <div className="flex items-center justify-between border-b border-wood-dark/50 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange font-sans">
                Quote Breakdown
              </span>
              <span className="text-[11px] font-mono text-sand/60">6&quot; depth standard</span>
            </div>

            {/* Final Quote Display */}
            <div>
              <span className="text-xs text-sand/70 block uppercase font-medium">
                Recommended Quote
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-serif font-bold text-4xl sm:text-5xl text-[#FBF6EC]">
                  ${finalQuote}
                </span>
                <span className="text-xs text-sand/60 uppercase">gross quote</span>
              </div>
              {discountRate > 0 && (
                <span className="inline-block mt-1 text-[11px] text-forest-light bg-forest/20 px-2 py-0.5 rounded font-semibold">
                  Includes {discountRate * 100}% multi-stump discount
                </span>
              )}
            </div>

            {/* Cost & Margin metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-wood-dark/40 text-xs">
              <div className="bg-wood-dark/50 rounded-xl p-3 border border-sand/10">
                <span className="text-sand/60 block text-[10px] uppercase">Direct Costs</span>
                <span className="font-serif font-bold text-lg text-sand mt-0.5 block">
                  ~${totalCost}
                </span>
                <span className="text-[10px] text-sand/50">Fuel, teeth, transit</span>
              </div>

              <div className="bg-forest/25 rounded-xl p-3 border border-forest/30">
                <span className="text-forest-light block text-[10px] uppercase font-bold">You Keep</span>
                <span className="font-serif font-bold text-lg text-[#FBF6EC] mt-0.5 block">
                  ~${netProfit}
                </span>
                <span className="text-[10px] text-forest-light font-semibold">
                  {marginPercent}% profit margin
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleCopyQuote}
                className="w-full py-2.5 px-4 rounded-xl bg-wood-dark/70 hover:bg-wood-dark border border-sand/20 text-xs font-bold text-[#FBF6EC] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-forest-light" />
                    <span>Copied Breakdown to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy Quote Breakdown</span>
                  </>
                )}
              </button>

              <a
                href="#pricing"
                className="w-full py-3 px-4 rounded-xl bg-orange hover:bg-orange-hover text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all"
              >
                <span>Get Full Excel Quoter &amp; Playbook ($47)</span>
                <ArrowRight size={14} />
              </a>
            </div>

            <p className="text-[10px] text-sand/50 text-center leading-relaxed">
              *Numbers are generated using our proven baseline formula. Calibrate your own equipment and fuel rates in the Excel tool.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
