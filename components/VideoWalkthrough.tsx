'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, ArrowRight, Volume2, VolumeX, Maximize2, ShieldAlert, Sparkles } from 'lucide-react';

interface SimulationStep {
  time: number; // in seconds
  stage: string;
  diameter: number;
  species: string;
  rootFlare: string;
  soil: string;
  access: string;
  basePrice: number;
  multipliers: number;
  wearBuffer: number;
  totalQuote: number;
  profitMargin: string;
  note: string;
}

const DEMO_STEPS: SimulationStep[] = [
  {
    time: 0,
    stage: 'Input Measurements',
    diameter: 0,
    species: 'Selecting species...',
    rootFlare: 'None measured',
    soil: 'Normal loam',
    access: 'Standard (> 36")',
    basePrice: 0,
    multipliers: 0,
    wearBuffer: 0,
    totalQuote: 0,
    profitMargin: '0%',
    note: 'Measuring stump core and surface root spread at lawn grade...',
  },
  {
    time: 5,
    stage: 'Measuring Stump Core',
    diameter: 24,
    species: 'White Oak (Dense Hardwood)',
    rootFlare: 'Checking for lateral flares...',
    soil: 'Normal loam',
    access: 'Standard gate',
    basePrice: 144,
    multipliers: 25,
    wearBuffer: 15,
    totalQuote: 184,
    profitMargin: '68%',
    note: 'Core diameter set: 24 inches. Hardwood density factor applied.',
  },
  {
    time: 12,
    stage: 'Adding Root Flare Chasing',
    diameter: 24,
    species: 'White Oak (Hardwood)',
    rootFlare: '8 ft Surface Roots (+$65)',
    soil: 'Normal loam',
    access: 'Backyard Gate (< 36")',
    basePrice: 144,
    multipliers: 90,
    wearBuffer: 25,
    totalQuote: 259,
    profitMargin: '71%',
    note: 'Root flare chasing added: avoids doing 45 mins of free grinding!',
  },
  {
    time: 20,
    stage: 'Detecting Rocky Soil & Gate',
    diameter: 24,
    species: 'White Oak (Hardwood)',
    rootFlare: '8 ft Surface Roots (+$65)',
    soil: 'Rock-Heavy River Soil (Tooth Risk)',
    access: 'Tight 34" Walk-Through Gate (+$35)',
    basePrice: 144,
    multipliers: 145,
    wearBuffer: 56,
    totalQuote: 345,
    profitMargin: '74%',
    note: 'Tooth wear replacement buffer and tight access fee automatically built in.',
  },
  {
    time: 28,
    stage: 'Generating Final Client Quote',
    diameter: 24,
    species: 'White Oak (Hardwood)',
    rootFlare: '8 ft Surface Roots',
    soil: 'Rocky Soil (Buffered)',
    access: 'Tight Gate Fee Included',
    basePrice: 144,
    multipliers: 145,
    wearBuffer: 56,
    totalQuote: 345,
    profitMargin: '74%',
    note: 'Quote ready: $345.00 minimum rate. Client SMS disclaimer generated.',
  },
];

export function VideoWalkthrough() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'demo' | 'embed'>('demo');
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const duration = 30; // 30-second condensed demo cycle

  // Find the step corresponding to current playback position
  const currentStep = [...DEMO_STEPS].reverse().find((s) => currentTime >= s.time) || DEMO_STEPS[0];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentTime(Number(e.target.value));
  };

  const handleRestart = () => {
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section className="py-20 bg-cream border-t border-bark/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-bold uppercase tracking-wider">
            <Play size={12} fill="#E8731A" />
            <span>Interactive Demo Preview</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bark tracking-tight">
            See the Quoting Engine in Action
          </h2>
          <p className="text-bark/80 text-base leading-relaxed">
            Press play below to watch how an 18–24&quot; White Oak with lateral surface roots gets quoted with full tooth protection in real time.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Simulated Screen Player */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-2 border-bark/20 bg-bark">
              {/* Window Title Bar */}
              <div className="bg-[#241A13] px-4 py-2.5 flex items-center justify-between border-b border-wood-dark/40 text-sand/70 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 font-mono text-[11px] text-sand/90">
                    Stump_Pricing_Calculator.xlsx ?" Live Replay
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-orange/20 text-orange text-[10px] font-bold uppercase tracking-wider">
                    {currentStep.stage}
                  </span>
                </div>
              </div>

              {/* Dynamic Video Stage Screen */}
              <div className="relative aspect-[16/10] bg-[#1A120B] p-4 sm:p-6 flex flex-col justify-between overflow-hidden">
                {/* Blueprint grid effect */}
                <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#E8731A_1px,transparent_1px),linear-gradient(to_bottom,#E8731A_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                {/* Top Active Status Bar */}
                <div className="relative z-10 flex items-center justify-between bg-bark/80 backdrop-blur-sm p-3 rounded-xl border border-sand/10">
                  <div className="flex items-center gap-2 text-xs text-sand">
                    <span className="w-2 h-2 rounded-full bg-orange animate-pulse" />
                    <span className="font-bold text-orange uppercase font-mono">Job Simulation:</span>
                    <span>24&quot; White Oak + Root Flare</span>
                  </div>
                  <div className="text-xs font-mono text-sand/80">
                    Status: <span className="text-green-400 font-bold">{isPlaying ? 'Running Calculation...' : 'Paused'}</span>
                  </div>
                </div>

                {/* Middle: Dynamic Quoting Cells */}
                <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
                  <div className="bg-[#291C13] border border-sand/15 rounded-xl p-3 text-sand">
                    <span className="text-[10px] uppercase font-mono text-sand/60">Core Diameter</span>
                    <div className="text-lg font-bold font-mono text-[#FBF6EC]">
                      {currentStep.diameter ? `${currentStep.diameter} inches` : 'Measuring...'}
                    </div>
                  </div>

                  <div className="bg-[#291C13] border border-sand/15 rounded-xl p-3 text-sand">
                    <span className="text-[10px] uppercase font-mono text-sand/60">Wood Hardness</span>
                    <div className="text-xs font-bold font-mono text-orange truncate">
                      {currentStep.species}
                    </div>
                  </div>

                  <div className="bg-[#291C13] border border-sand/15 rounded-xl p-3 text-sand">
                    <span className="text-[10px] uppercase font-mono text-sand/60">Surface Roots</span>
                    <div className="text-xs font-bold font-mono text-forest-light truncate">
                      {currentStep.rootFlare}
                    </div>
                  </div>

                  <div className="bg-[#291C13] border border-sand/15 rounded-xl p-3 text-sand">
                    <span className="text-[10px] uppercase font-mono text-sand/60">Soil &amp; Teeth</span>
                    <div className="text-xs font-bold font-mono text-amber-300 truncate">
                      {currentStep.soil}
                    </div>
                  </div>
                </div>

                {/* Center Dynamic Quote Output Result Box */}
                <div className="relative z-10 bg-[#251910] border-2 border-orange/40 rounded-2xl p-4 sm:p-5 text-sand shadow-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-sand/60 font-mono">
                        Instant Calculated Bid
                      </span>
                      <div className="flex items-baseline gap-3 mt-1">
                        <span className="font-serif text-3xl sm:text-4xl font-bold text-orange">
                          ${currentStep.totalQuote.toFixed(2)}
                        </span>
                        <span className="text-xs text-green-400 font-mono font-bold bg-forest/30 px-2 py-0.5 rounded">
                          Margin: {currentStep.profitMargin}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-sand/80 space-y-1 font-mono border-t sm:border-t-0 sm:border-l border-sand/10 pt-2 sm:pt-0 sm:pl-4">
                      <div>Base Grind Cost: <span className="text-[#FBF6EC] font-bold">${currentStep.basePrice}</span></div>
                      <div>Root &amp; Gate Fees: <span className="text-orange font-bold">+${currentStep.multipliers}</span></div>
                      <div>Tooth Wear Reserve: <span className="text-amber-400 font-bold">+${currentStep.wearBuffer}</span></div>
                    </div>
                  </div>

                  {/* Stage annotation note */}
                  <div className="mt-3 pt-3 border-t border-sand/10 flex items-center gap-2 text-xs text-sand/85 font-sans">
                    <Sparkles size={14} className="text-orange shrink-0" />
                    <span>{currentStep.note}</span>
                  </div>
                </div>

                {/* Big Center Play Prompt when Paused at Start */}
                {!isPlaying && currentTime === 0 && (
                  <div 
                    onClick={() => setIsPlaying(true)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer z-20 group"
                  >
                    <div className="w-20 h-20 rounded-full bg-orange text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                      <Play size={36} fill="#FFFFFF" className="ml-1" />
                    </div>
                    <span className="mt-4 text-sm font-bold text-white uppercase tracking-wider bg-bark/80 px-4 py-1.5 rounded-full border border-sand/20">
                      Click to Play 30-Second Quoting Demo
                    </span>
                  </div>
                )}

                {/* Bottom Custom Playback Controls Bar */}
                <div className="relative z-10 pt-3 border-t border-sand/15 flex items-center gap-3 text-sand text-xs">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-8 h-8 rounded-lg bg-orange text-white flex items-center justify-center hover:bg-orange-hover transition-colors shrink-0 cursor-pointer"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} fill="#FFFFFF" className="ml-0.5" />}
                  </button>

                  <button
                    onClick={handleRestart}
                    className="w-8 h-8 rounded-lg bg-sand/20 text-sand flex items-center justify-center hover:bg-sand/30 transition-colors shrink-0 cursor-pointer"
                    title="Restart from beginning"
                  >
                    <RotateCcw size={14} />
                  </button>

                  <span className="font-mono text-[11px] shrink-0 text-orange font-bold">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>

                  {/* Scrubber Range Input */}
                  <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 accent-orange h-1.5 bg-sand/20 rounded-lg cursor-pointer"
                  />

                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-sand/70 hover:text-sand transition-colors"
                  >
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Side Explanatory Column */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#FBF6EC] border border-bark/15 rounded-2xl p-6 space-y-4 shadow-sm">
              <h3 className="font-serif font-bold text-xl text-bark">
                What the Calculator Does
              </h3>
              <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                You enter the diameter and check boxes on your smartphone while standing in the customer&apos;s yard.
              </p>

              <div className="space-y-3 pt-2 text-xs text-bark/85">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
                  <span><strong>Automatic Diameter Math:</strong> Calculates base machine time from cubic volume.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
                  <span><strong>Surface Root Adder:</strong> Adds \$5–\$12 per linear foot so you never chase roots for free.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
                  <span><strong>Rock &amp; Tooth Buffer:</strong> Puts \$20–\$60 into a replacement tooth fund on rocky sites.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-forest shrink-0 mt-0.5" />
                  <span><strong>Tight Gate Surcharge:</strong> Factors in ramps, track mats, and labor for gates under 36&quot;.</span>
                </div>
              </div>

              <div className="pt-3 border-t border-bark/10">
                <a
                  href="#pricing"
                  className="w-full py-3.5 px-4 rounded-xl bg-orange hover:bg-orange-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow transition-all transform active:scale-95"
                >
                  <span>Download This Calculator &rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
