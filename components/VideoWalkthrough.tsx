'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  Volume2, 
  VolumeX, 
  ShieldAlert, 
  Video, 
  Camera, 
  Calculator, 
  Smartphone,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SimulationStep {
  time: number;
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
  terrainNote: string;
  depthInches: number;
  isGrinding: boolean;
  hasRockAlert: boolean;
  note: string;
}

const DEMO_STEPS: SimulationStep[] = [
  {
    time: 0,
    stage: '1. Measure Diameter (24" Oak)',
    diameter: 24,
    species: 'White Oak (Dense Hardwood)',
    rootFlare: 'Inspecting surface roots...',
    soil: 'Standard Lawn Loam',
    access: 'Standard Gate (>36")',
    basePrice: 144,
    multipliers: 0,
    wearBuffer: 0,
    totalQuote: 144,
    profitMargin: '65%',
    terrainNote: 'Lawn Grade Level',
    depthInches: 0,
    isGrinding: false,
    hasRockAlert: false,
    note: 'Measure flare-to-flare at ground level (24 inches). Base cut time calculated.',
  },
  {
    time: 4,
    stage: '2. Add Surface Roots (8 Ft)',
    diameter: 24,
    species: 'White Oak (Hardwood)',
    rootFlare: '8 ft Surface Roots (+$65)',
    soil: 'Standard Lawn Loam',
    access: 'Standard Gate (>36")',
    basePrice: 144,
    multipliers: 65,
    wearBuffer: 15,
    totalQuote: 224,
    profitMargin: '70%',
    terrainNote: 'Lateral Root Flare',
    depthInches: 4,
    isGrinding: true,
    hasRockAlert: false,
    note: 'Add 8 linear feet of surface roots ($5/ft) so you never chase roots for 45 mins for free.',
  },
  {
    time: 8,
    stage: '3. Rock Buffer & Tight Gate',
    diameter: 24,
    species: 'White Oak (Hardwood)',
    rootFlare: '8 ft Surface Roots (+$65)',
    soil: 'River Rock Inclusions (Tooth Risk)',
    access: 'Tight 34" Gate (+$35)',
    basePrice: 144,
    multipliers: 100,
    wearBuffer: 56,
    totalQuote: 300,
    profitMargin: '72%',
    terrainNote: 'Rock Hazard Buffer',
    depthInches: 8,
    isGrinding: true,
    hasRockAlert: true,
    note: 'Auto-add $56 carbide tooth wear fund for rocky soil plus $35 for track ramp labor.',
  },
  {
    time: 12,
    stage: '4. Final Bid to Client ($345)',
    diameter: 24,
    species: 'White Oak (Hardwood)',
    rootFlare: '8 ft Surface Roots (Included)',
    soil: 'Rocky Soil Buffer Applied',
    access: 'Tight Gate Surcharge Applied',
    basePrice: 144,
    multipliers: 145,
    wearBuffer: 56,
    totalQuote: 345,
    profitMargin: '74%',
    terrainNote: '12" Below Grade Finish',
    depthInches: 12,
    isGrinding: true,
    hasRockAlert: false,
    note: 'Total bid: $345.00 with 74% gross margin. Ready to text or hand to homeowner on the spot.',
  },
];

const INSPECTION_STEPS = [
  {
    step: 'STEP 1: MEASURE',
    badgeColor: 'text-orange',
    image: '/images/stump-wood.jpg',
    alt: '24 Inch White Oak Stump with Lateral Root Flares',
    title: 'Measure Root Flare to Root Flare',
    description: 'Never eyeball the cut trunk alone. Measure flare edge to flare edge at lawn grade. That 18" trunk is actually a 24" grind.',
  },
  {
    step: 'STEP 2: 10-12" DEPTH',
    badgeColor: 'text-green-400',
    image: '/images/wood-chips.jpg',
    alt: 'High volume wood chips from below grade grinding',
    title: 'Grind Below Lawn Grade',
    description: 'Reaching 10–12 inches deep ensures the customer can reseed grass or plant sod over the spot with zero surface regrowth.',
  },
  {
    step: 'STEP 3: PAID IN FULL',
    badgeColor: 'text-amber-300',
    image: '/images/tree-forest.jpg',
    alt: 'Clean property restoration after grinding',
    title: 'Collect $345 on the Spot',
    description: 'Customer signs the pre-job waiver, you complete the grind, and collect payment via cash or SMS invoice before leaving the driveway.',
  },
];

export function VideoWalkthrough() {
  const [activeTab, setActiveTab] = useState<'sim' | 'video' | 'photos'>('sim');
  const [selectedVideoId, setSelectedVideoId] = useState('fspc5_zXA6k');
  const [isVideoStarted, setIsVideoStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Photos tab mobile carousel state
  const photoScrollRef = useRef<HTMLDivElement>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const scrollPhotoTo = (index: number) => {
    if (!photoScrollRef.current) return;
    const container = photoScrollRef.current;
    const targetChild = container.children[index] as HTMLElement;
    if (targetChild) {
      container.scrollTo({
        left: targetChild.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      });
      setActivePhotoIndex(index);
    }
  };

  const handlePrevPhoto = () => {
    if (activePhotoIndex > 0) {
      scrollPhotoTo(activePhotoIndex - 1);
    }
  };

  const handleNextPhoto = () => {
    if (activePhotoIndex < INSPECTION_STEPS.length - 1) {
      scrollPhotoTo(activePhotoIndex + 1);
    }
  };

  const handlePhotoScroll = () => {
    if (!photoScrollRef.current) return;
    const container = photoScrollRef.current;
    const scrollPos = container.scrollLeft;
    let closestIndex = 0;
    let minDiff = Infinity;

    Array.from(container.children).forEach((child, idx) => {
      const el = child as HTMLElement;
      const diff = Math.abs(el.offsetLeft - container.offsetLeft - scrollPos);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setActivePhotoIndex(closestIndex);
  };

  const duration = 16; // 16-second snappy walkthrough

  // Get active step from time
  const currentStep = [...DEMO_STEPS].reverse().find((s) => currentTime >= s.time) || DEMO_STEPS[0];

  // Optional Web Audio feedback
  const playSoundEffect = (type: 'grind' | 'ding') => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'grind') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(190, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // Audio autoplay gracefully suppressed
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1000 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            playSoundEffect('ding');
            setIsPlaying(false);
            return duration;
          }
          if (currentStep.isGrinding && prev % 2 === 0) {
            playSoundEffect('grind');
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, isMuted, currentStep.isGrinding]);

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
    <section className="py-20 bg-gradient-to-b from-cream via-[#F5EDE0] to-cream border-t border-bark/10 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - Clean, Authoritative, Zero AI Buzzwords */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sand/80 border border-wood/30 text-wood-dark text-xs font-bold uppercase tracking-wider">
            <Calculator size={13} className="text-orange" />
            <span>Field Quoting Walkthrough</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-bark tracking-tight">
            How to Quote a $345 Stump in 16 Seconds on Your Phone
          </h2>
          <p className="text-bark/80 text-sm sm:text-base leading-relaxed">
            Watch how a 24&quot; White Oak with an 18&quot; trunk, 8 feet of surface roots, a tight gate, and rocky soil moves from a $144 raw base rate ($6/inch) to an accurate $345 total quote before you ever touch the machine.
          </p>

          {/* Mode Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-3">
            <button
              onClick={() => setActiveTab('sim')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'sim'
                  ? 'bg-bark text-[#FBF6EC] shadow-md scale-105'
                  : 'bg-sand/60 text-bark/80 hover:bg-sand hover:text-bark'
              }`}
            >
              <Smartphone size={14} className={activeTab === 'sim' ? 'text-orange' : ''} />
              <span>Field Calculator Walkthrough</span>
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'video'
                  ? 'bg-bark text-[#FBF6EC] shadow-md scale-105'
                  : 'bg-sand/60 text-bark/80 hover:bg-sand hover:text-bark'
              }`}
            >
              <Video size={14} className={activeTab === 'video' ? 'text-orange' : ''} />
              <span>Tracked Grinder in Field</span>
            </button>
            <button
              onClick={() => setActiveTab('photos')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'photos'
                  ? 'bg-bark text-[#FBF6EC] shadow-md scale-105'
                  : 'bg-sand/60 text-bark/80 hover:bg-sand hover:text-bark'
              }`}
            >
              <Camera size={14} className={activeTab === 'photos' ? 'text-orange' : ''} />
              <span>Job Inspection Steps</span>
            </button>
          </div>
        </div>

        {/* TAB 1: FIELD CALCULATOR WALKTHROUGH */}
        {activeTab === 'sim' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Rugged Field Screen */}
            <div className="lg:col-span-8">
              <div 
                className="rounded-2xl overflow-hidden shadow-2xl border-2 border-bark/30 bg-[#160E08]"
              >
                
                {/* Field Top Bar */}
                <div className="bg-[#24170E] px-4 py-2.5 flex items-center justify-between border-b border-sand/15 text-sand/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-forest inline-block" />
                    <span className="font-mono text-[11px] text-[#FBF6EC] font-semibold tracking-wide flex items-center gap-1.5">
                      <Smartphone size={13} className="text-orange" />
                      STUMP_PRICING_CALCULATOR.XLSX &bull; BACKYARD BID
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange/20 border border-orange/40 text-orange text-[10px] font-bold uppercase tracking-wider">
                      {currentStep.stage}
                    </span>
                  </div>
                </div>

                {/* Stage Screen with Wood Grain Texture */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9.5] bg-[#120B06] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none">
                  
                  {/* Photo Texture Backdrop (Wood Grain) */}
                  <div 
                    className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-luminosity filter blur-[1px]"
                    style={{ backgroundImage: "url('/images/stump-wood.jpg')" }}
                  />

                  {/* Top Field Job Specs Bar */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-[#20140B]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-sand/15 shadow">
                    <div className="flex items-center gap-2 text-xs text-sand">
                      <span className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-orange animate-ping' : 'bg-sand/40'}`} />
                      <span className="font-bold text-[#FBF6EC] font-mono text-[11px]">
                        SITE: <span className="text-orange font-bold">24&quot; WHITE OAK</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-sand/80">
                      <div>
                        TERRAIN: <span className="text-amber-300 font-bold">{currentStep.terrainNote}</span>
                      </div>
                      <div>
                        DEPTH: <span className="text-emerald-400 font-bold">-{currentStep.depthInches}&quot; GRADE</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Stage: Stump Cross-Section & Cutter Wheel */}
                  <div className="relative z-10 my-auto py-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    {/* Visual 1: Stump Cross Section with Ground Measurements */}
                    <div className="relative flex flex-col items-center justify-center">
                      <div className="relative w-44 sm:w-52 h-44 sm:h-52 flex items-center justify-center">
                        
                        {/* Root Flare Ring */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                          {/* Underground roots radiating out */}
                          <path
                            d="M 100 100 Q 150 160 190 180 M 100 100 Q 50 160 10 185 M 100 100 Q 160 50 185 20 M 100 100 Q 40 50 15 25"
                            stroke="#8A5A3B"
                            strokeWidth={currentStep.time >= 4 ? "4" : "2"}
                            strokeDasharray={currentStep.time >= 4 ? "none" : "3,3"}
                            fill="none"
                            className="transition-all duration-500 opacity-80"
                          />
                          {/* Outer Stump Wood Cross-Section */}
                          <circle cx="100" cy="100" r="70" fill="#3D2619" stroke="#E8731A" strokeWidth="3" opacity="0.9" />
                          {/* Inner growth rings */}
                          <circle cx="100" cy="100" r="54" fill="#523422" stroke="#8A5A3B" strokeWidth="1.5" strokeDasharray="4,2" />
                          <circle cx="100" cy="100" r="38" fill="#66412B" stroke="#D9C2B0" strokeWidth="1.2" opacity="0.6" />
                          <circle cx="100" cy="100" r="22" fill="#7D4F35" stroke="#EFE4CE" strokeWidth="1" opacity="0.8" />
                          <circle cx="100" cy="100" r="7" fill="#E8731A" />
                        </svg>

                        {/* Measurement Tape Line across stump */}
                        <div className="absolute w-36 h-0.5 bg-amber-400/80 shadow-[0_0_6px_#f59e0b] pointer-events-none" />

                        {/* Core Diameter Badge in Center */}
                        <div className="relative z-10 px-2.5 py-1 rounded bg-black/85 border border-orange text-orange font-mono text-[11px] font-bold shadow-lg">
                          &Oslash; 24.0&quot; GROUND MEASURE
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-sand/70 mt-1 uppercase">
                        Trunk Core + 8ft Lateral Roots
                      </span>
                    </div>

                    {/* Visual 2: Cutter Wheel with Flying Woodchips */}
                    <div className="relative flex flex-col items-center justify-center">
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                        
                        {/* Heavy-duty Cutter Wheel */}
                        <div 
                          className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#4A3222] bg-gradient-to-tr from-[#1A120B] to-[#362013] shadow-2xl flex items-center justify-center ${
                            currentStep.isGrinding && isPlaying ? 'animate-spin-fast' : 'animate-spin-slow'
                          }`}
                        >
                          {/* 8 Carbide Teeth */}
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                            <div
                              key={deg}
                              className="absolute w-3 h-5 bg-amber-400 rounded-sm border border-black shadow-md flex items-center justify-center"
                              style={{
                                transform: `rotate(${deg}deg) translate(0, -60px)`,
                              }}
                            >
                              <div className="w-1 h-1 bg-white rounded-full" />
                            </div>
                          ))}
                          
                          {/* Wheel center bolt hub */}
                          <div className="w-10 h-10 rounded-full bg-[#110A05] border-2 border-orange/80 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-orange" />
                          </div>
                        </div>

                        {/* Flying Woodchips during cut */}
                        {currentStep.isGrinding && (
                          <div className="absolute inset-0 pointer-events-none">
                            <span className="absolute left-1/2 top-1/2 w-3 h-2 rounded bg-amber-200 border border-amber-600 animate-chip-1" />
                            <span className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded bg-amber-400 border border-amber-800 animate-chip-2" />
                            <span className="absolute left-1/2 top-1/2 w-4 h-2 rounded bg-[#C49A6C] border border-[#7D4F35] animate-chip-3" />
                            <span className="absolute left-1/2 top-1/2 w-2 h-3 rounded bg-amber-300 animate-chip-4" />
                            
                            {/* Rock Strike Spark */}
                            {currentStep.hasRockAlert && (
                              <div className="absolute left-2/3 top-1/3 w-8 h-8 rounded-full bg-yellow-300 blur-sm animate-spark" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${currentStep.isGrinding ? 'bg-orange' : 'bg-sand/30'}`} />
                        <span className="text-[10px] font-mono text-sand/80 uppercase">
                          {currentStep.isGrinding ? 'Cutting 10-12" Below Grade' : 'Positioning Grinder'}
                        </span>
                      </div>
                    </div>

                    {/* Visual 3: Live Bid Calculation Box */}
                    <div className="bg-[#1C120B]/95 border-2 border-orange/60 rounded-2xl p-4 text-sand shadow-xl min-w-[210px] sm:min-w-[240px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sand/70">
                          INSTANT CALCULATED BID
                        </span>
                        <span className="text-[10px] text-green-400 font-mono font-bold bg-forest/40 px-1.5 py-0.5 rounded">
                          {currentStep.profitMargin} Margin
                        </span>
                      </div>

                      <div className="text-3xl sm:text-4xl font-serif font-bold text-orange tracking-tight my-1">
                        ${currentStep.totalQuote.toFixed(2)}
                      </div>

                      <div className="space-y-1 text-[11px] font-mono text-sand/80 pt-2 border-t border-sand/15">
                        <div className="flex justify-between">
                          <span>Base 24&quot; Grind:</span>
                          <span className="text-[#FBF6EC] font-bold">${currentStep.basePrice}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Root &amp; Gate Fees:</span>
                          <span className="text-orange font-bold">+${currentStep.multipliers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tooth Wear Buffer:</span>
                          <span className="text-amber-400 font-bold">+${currentStep.wearBuffer}</span>
                        </div>
                      </div>

                      {/* Rock Alert Badge */}
                      {currentStep.hasRockAlert && (
                        <div className="mt-2.5 px-2 py-1 rounded bg-amber-950/80 border border-amber-500/60 flex items-center gap-1.5 text-[10px] text-amber-200 font-mono">
                          <ShieldAlert size={12} className="text-amber-400 shrink-0" />
                          <span>ROCK BUFFER: +$56 TOOTH FUND</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stage Explanation */}
                  <div className="relative z-10 bg-[#1D130B]/90 border border-sand/15 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs text-[#FBF6EC]">
                    <CheckCircle2 size={14} className="text-forest shrink-0" />
                    <span className="font-sans font-medium">{currentStep.note}</span>
                  </div>

                  {/* Play Prompt when Paused */}
                  {!isPlaying && currentTime === 0 && (
                    <div 
                      onClick={() => {
                        setIsPlaying(true);
                        playSoundEffect('grind');
                      }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer z-30 group"
                    >
                      <div className="w-20 h-20 rounded-full bg-orange text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play size={36} fill="#FFFFFF" className="ml-1" />
                      </div>
                      <span className="mt-4 text-xs sm:text-sm font-bold text-white uppercase tracking-wider bg-bark/90 px-4 py-2 rounded-full border border-sand/20 shadow">
                        Click to Play 16-Second Quoting Walkthrough
                      </span>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="relative z-10 pt-3 border-t border-sand/15 flex items-center gap-3 text-sand text-xs">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-8 h-8 rounded-lg bg-orange text-white flex items-center justify-center hover:bg-orange-hover transition-colors shrink-0 shadow"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause size={15} /> : <Play size={15} fill="#FFFFFF" className="ml-0.5" />}
                    </button>

                    <button
                      onClick={handleRestart}
                      className="w-8 h-8 rounded-lg bg-sand/20 text-sand flex items-center justify-center hover:bg-sand/30 transition-colors shrink-0"
                      title="Restart walkthrough"
                    >
                      <RotateCcw size={13} />
                    </button>

                    <span className="font-mono text-[11px] shrink-0 text-orange font-bold">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* Scrubber */}
                    <input
                      type="range"
                      min={0}
                      max={duration}
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 accent-orange h-1.5 bg-sand/20 rounded-lg cursor-pointer"
                    />

                    {/* Speed Toggle */}
                    <button
                      onClick={() => setPlaybackSpeed((s) => (s === 1 ? 1.5 : s === 1.5 ? 2 : 1))}
                      className="px-2 py-1 rounded bg-sand/15 text-[10px] font-mono font-bold text-sand hover:bg-sand/30 transition-colors"
                      title="Change playback speed"
                    >
                      {playbackSpeed}x
                    </button>

                    {/* Mute/Sound Toggle */}
                    <button
                      onClick={() => {
                        setIsMuted(!isMuted);
                        if (isMuted) playSoundEffect('ding');
                      }}
                      className="text-sand/70 hover:text-sand transition-colors p-1"
                      title={isMuted ? 'Turn on sound' : 'Mute'}
                    >
                      {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="text-orange" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Practical Rules for Operators */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#FBF6EC] border border-bark/15 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 size={16} />
                  <span>The 3 Ground Rules</span>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-bark leading-tight">
                  Stop Eyeballing Stumps and Leaving Money in the Dirt
                </h3>
                <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                  The spreadsheet shown here runs directly in Excel on your phone. In this breakdown, the raw base is $144 (24 inches &times; $6/in). Adding 8 ft of lateral roots (+$65), a tight 34&quot; gate setup (+$35), and a rocky soil carbide tooth reserve (+$56) brings the total quote to $345. You check the boxes while standing with the customer and quote them with confidence.
                </p>

                <div className="space-y-3 pt-2 text-xs text-bark/85 border-t border-bark/10">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Rule 1: Never Measure Just the Trunk:</strong> Measure flare edge to flare edge at lawn grade. That 18&quot; cut top is actually a 24&quot; grind.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Rule 2: Bill Surface Roots ($5–$12/ft):</strong> Homeowners want lateral roots flush with the lawn. Never chase them for free.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Rule 3: Build a Tooth Fund ($20–$60):</strong> Auto-charge for rocky river soil so the customer buys your next set of carbide teeth, not you.</span>
                  </div>
                </div>

                <div className="pt-3">
                  <a
                    href="#pricing"
                    className="w-full py-3.5 px-4 rounded-xl bg-orange hover:bg-orange-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95"
                  >
                    <span>Get the Calculator &amp; Playbook Bundle &rarr;</span>
                  </a>
                </div>
              </div>

              {/* Step Quick-Jump Selector */}
              <div className="bg-[#24170E] border border-sand/15 rounded-2xl p-4 text-sand space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-sand/60 font-bold block">
                  Click to View Quoting Stage:
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  {DEMO_STEPS.map((step) => (
                    <button
                      key={step.time}
                      onClick={() => {
                        setCurrentTime(step.time);
                        setIsPlaying(true);
                      }}
                      className={`p-2 rounded-lg text-left transition-all border ${
                        currentTime >= step.time && currentTime < step.time + 4
                          ? 'bg-orange/20 border-orange text-orange font-bold'
                          : 'bg-sand/5 border-sand/10 text-sand/70 hover:bg-sand/10'
                      }`}
                    >
                      {step.stage.split('.')[1] || step.stage}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VERMEER TRACKED GRINDER ACTION VIDEO */}
        {activeTab === 'video' && (
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-bark/20 bg-bark">
            <div className="bg-[#24170E] px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-sand/15 text-sand text-xs">
              <div className="flex items-center gap-2 font-mono">
                <Video size={14} className="text-orange" />
                <span className="font-bold text-[#FBF6EC]">
                  {selectedVideoId === 'fspc5_zXA6k'
                    ? 'Commercial 35HP Vermeer SC362 Stump Cutter'
                    : 'Heavy-Duty Vermeer SC70TX in Field Action'}
                </span>
              </div>

              {/* Video Selector Switch */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-sand/10 text-[11px] font-mono">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVideoId('fspc5_zXA6k');
                      setIsVideoStarted(true);
                    }}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedVideoId === 'fspc5_zXA6k'
                        ? 'bg-orange text-white font-bold'
                        : 'text-sand/70 hover:text-sand'
                    }`}
                  >
                    35HP Cutter
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedVideoId('iXeglmIZTRU');
                      setIsVideoStarted(true);
                    }}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      selectedVideoId === 'iXeglmIZTRU'
                        ? 'bg-orange text-white font-bold'
                        : 'text-sand/70 hover:text-sand'
                    }`}
                  >
                    SC70TX Tracked
                  </button>
                </div>

                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded bg-sand/10 hover:bg-sand/20 text-orange font-mono text-[11px] font-semibold transition-colors"
                >
                  <span>Open YouTube</span>
                  <ArrowRight size={11} />
                </a>
              </div>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
              {isVideoStarted ? (
                <iframe
                  key={selectedVideoId}
                  className="w-full h-full"
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideoId}?autoplay=1&rel=0&playsinline=1`}
                  title="Commercial Stump Grinding Machine Field Operation"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div
                  onClick={() => setIsVideoStarted(true)}
                  className="relative w-full h-full cursor-pointer group flex items-center justify-center"
                >
                  {/* High-Res Video Poster Image */}
                  <img
                    src={`https://img.youtube.com/vi/${selectedVideoId}/maxresdefault.jpg`}
                    alt="Commercial Stump Grinding Machine Operation"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 filter brightness-90 group-hover:brightness-100"
                    onError={(e) => {
                      // Fallback to hqdefault if maxres isn't cached
                      (e.currentTarget as HTMLImageElement).src = `https://img.youtube.com/vi/${selectedVideoId}/hqdefault.jpg`;
                    }}
                  />
                  
                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 group-hover:via-black/20 transition-colors" />

                  {/* Pulsing Play Button Facade */}
                  <div className="relative z-10 flex flex-col items-center text-center p-4">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-orange/95 text-white flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-orange transition-all duration-300 border-4 border-white/20">
                      <Play size={40} fill="#FFFFFF" className="ml-1.5" />
                    </div>
                    <span className="mt-4 px-4 py-1.5 rounded-full bg-black/80 backdrop-blur-sm border border-sand/30 text-white font-mono text-xs sm:text-sm font-bold tracking-wide shadow-lg">
                      Click to Play Field Demo (1080p)
                    </span>
                    <span className="mt-1 text-sand/70 text-[11px] font-mono">
                      Vermeer Commercial Stump Cutter &bull; Real Operation
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 sm:p-6 bg-[#1A120B] text-sand space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h4 className="font-serif text-lg font-bold text-[#FBF6EC]">
                  How Machine Wear &amp; Operating Cost Tie Directly to Your Formula
                </h4>
                <a
                  href={`https://www.youtube.com/watch?v=${selectedVideoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-orange hover:underline font-mono"
                >
                  <span>Watch on YouTube</span>
                  <ArrowRight size={12} />
                </a>
              </div>
              <p className="text-xs sm:text-sm text-sand/80 leading-relaxed font-sans">
                Notice the flying woodchips and carbide teeth impact. A set of 16 Greenteeth or Vermeer teeth costs \$180–\$240 to replace. If you don&apos;t charge a tooth wear buffer on rocky soil or root flares, you are literally grinding away your profit. The Playbook teaches you the exact per-inch math to bill.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: FIELD JOB INSPECTION PHOTOS */}
        {activeTab === 'photos' && (
          <div className="relative">
            {/* Mobile Previous Button */}
            {activePhotoIndex > 0 && (
              <button
                onClick={handlePrevPhoto}
                className="md:hidden absolute -left-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-cream/95 backdrop-blur-sm border-2 border-bark/25 hover:border-orange hover:bg-orange hover:text-white text-bark shadow-xl flex items-center justify-center transition-all duration-200 active:scale-90 focus:outline-none cursor-pointer"
                aria-label="Previous inspection step"
                title="Previous step"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* Mobile Next Button */}
            {activePhotoIndex < INSPECTION_STEPS.length - 1 && (
              <button
                onClick={handleNextPhoto}
                className="md:hidden absolute -right-2 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-cream/95 backdrop-blur-sm border-2 border-bark/25 hover:border-orange hover:bg-orange hover:text-white text-bark shadow-xl flex items-center justify-center transition-all duration-200 active:scale-90 focus:outline-none cursor-pointer"
                aria-label="Next inspection step"
                title="Next step"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* Swipeable Track on Mobile, 3-Col Grid on Desktop */}
            <div
              ref={photoScrollRef}
              onScroll={handlePhotoScroll}
              className="flex md:grid md:grid-cols-3 gap-6 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none scroll-smooth pb-2 md:pb-0 no-scrollbar px-1"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {INSPECTION_STEPS.map((item) => (
                <div
                  key={item.step}
                  className="w-full flex-shrink-0 snap-center md:flex-shrink md:w-auto flex"
                >
                  <div className="w-full bg-[#24170E] rounded-2xl overflow-hidden border border-sand/20 shadow-lg space-y-3 p-4 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-sand/10">
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="w-full h-full object-cover"
                        />
                        <span className={`absolute top-2 left-2 px-2 py-1 rounded bg-black/80 ${item.badgeColor} font-mono text-[10px] font-bold`}>
                          {item.step}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#FBF6EC]">
                        {item.title}
                      </h4>
                      <p className="text-xs text-sand/80 leading-relaxed font-sans">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Navigation Dots */}
            <div className="flex md:hidden items-center justify-center gap-2 mt-5">
              {INSPECTION_STEPS.map((item, idx) => (
                <button
                  key={item.step}
                  onClick={() => scrollPhotoTo(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activePhotoIndex === idx
                      ? 'w-8 bg-orange'
                      : 'w-2.5 bg-bark/20 hover:bg-bark/40'
                  }`}
                  aria-label={`Jump to ${item.step}`}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
