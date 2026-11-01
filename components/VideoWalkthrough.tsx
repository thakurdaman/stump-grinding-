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
  Sparkles, 
  ShieldAlert, 
  Video, 
  Layers, 
  Camera, 
  Flame, 
  Gauge, 
  Maximize2 
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
  rpm: number;
  depthInches: number;
  isGrinding: boolean;
  hasRockAlert: boolean;
  note: string;
}

const DEMO_STEPS: SimulationStep[] = [
  {
    time: 0,
    stage: '1. Laser Caliper & Core Size',
    diameter: 24,
    species: 'White Oak (Hardwood)',
    rootFlare: 'Scanning root flares...',
    soil: 'Standard Loam',
    access: 'Standard Gate',
    basePrice: 144,
    multipliers: 0,
    wearBuffer: 0,
    totalQuote: 144,
    profitMargin: '65%',
    rpm: 1200,
    depthInches: 0,
    isGrinding: false,
    hasRockAlert: false,
    note: 'Laser caliper locks 24" core diameter. Machine baseline volume calculated.',
  },
  {
    time: 4,
    stage: '2. Root Flare Radar Detection',
    diameter: 24,
    species: 'White Oak (Hardwood)',
    rootFlare: '8 ft Lateral Flares (+$65)',
    soil: 'Standard Loam',
    access: 'Standard Gate',
    basePrice: 144,
    multipliers: 65,
    wearBuffer: 15,
    totalQuote: 224,
    profitMargin: '70%',
    rpm: 1850,
    depthInches: 4,
    isGrinding: true,
    hasRockAlert: false,
    note: 'Underground root flare detected: adds \$65 so you don\'t chase roots for free.',
  },
  {
    time: 8,
    stage: '3. Rock & Tooth Wear Defense',
    diameter: 24,
    species: 'White Oak (Hardwood)',
    rootFlare: '8 ft Lateral Flares (+$65)',
    soil: 'River Rock Inclusions (Tooth Risk)',
    access: '34" Tight Gate (+$35)',
    basePrice: 144,
    multipliers: 100,
    wearBuffer: 56,
    totalQuote: 300,
    profitMargin: '72%',
    rpm: 2200,
    depthInches: 8,
    isGrinding: true,
    hasRockAlert: true,
    note: 'Tooth Wear Reserve triggered: puts \$56 into your carbide tooth replacement fund.',
  },
  {
    time: 12,
    stage: '4. Final Client Bid & Profit Lock',
    diameter: 24,
    species: 'White Oak (Hardwood)',
    rootFlare: '8 ft Lateral Flares (Included)',
    soil: 'Rocky Soil Buffer Applied',
    access: 'Tight Gate Surcharge Applied',
    basePrice: 144,
    multipliers: 145,
    wearBuffer: 56,
    totalQuote: 345,
    profitMargin: '74%',
    rpm: 2400,
    depthInches: 12,
    isGrinding: true,
    hasRockAlert: false,
    note: 'Full \$345 quote calculated with 74% gross profit margin. SMS ready.',
  },
];

export function VideoWalkthrough() {
  const [activeTab, setActiveTab] = useState<'sim' | 'video' | 'photos'>('sim');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isMuted, setIsMuted] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const duration = 16; // 16-second snappy loop

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
        
        {/* Header with Badges */}
        <div className="max-w-3xl mx-auto text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange/15 border border-orange/30 text-orange text-xs font-bold uppercase tracking-wider shadow-sm">
            <Flame size={14} className="text-orange animate-pulse" />
            <span>Stump Grinding Telemetry &amp; Quoting Engine</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-bark tracking-tight">
            Watch the 16-Second Job Quoter in Action
          </h2>
          <p className="text-bark/80 text-sm sm:text-base leading-relaxed">
            See how the Excel engine turns a 24&quot; White Oak with subterranean root flares and rock hazards into a protected \$345 quote with 74% profit.
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
              <Layers size={14} className={activeTab === 'sim' ? 'text-orange' : ''} />
              <span>3D Machinery Simulator</span>
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
              <span>Commercial Tracked Grinder Video</span>
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
              <span>Field Job Inspection</span>
            </button>
          </div>
        </div>

        {/* TAB 1: 3D MACHINERY SIMULATOR */}
        {activeTab === 'sim' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left 8 Cols: Interactive 3D Screen Player */}
            <div className="lg:col-span-8">
              <div 
                className="rounded-2xl overflow-hidden shadow-2xl border-2 border-bark/30 bg-[#160E08] transition-transform duration-300"
                style={{ perspective: '1000px' }}
              >
                
                {/* HUD Header Bar */}
                <div className="bg-[#24170E] px-4 py-2.5 flex items-center justify-between border-b border-sand/15 text-sand/80 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-sm" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm" />
                    <span className="ml-2 font-mono text-[11px] text-[#FBF6EC] font-semibold tracking-wide flex items-center gap-1.5">
                      <Gauge size={13} className="text-orange" />
                      GRINDER_TELEMETRY_HUD // 24&quot; OAK JOB
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange/20 border border-orange/40 text-orange text-[10px] font-bold uppercase tracking-wider">
                      {currentStep.stage}
                    </span>
                  </div>
                </div>

                {/* 3D Visualizer Canvas Screen */}
                <div className="relative aspect-[16/10] sm:aspect-[16/9.5] bg-[#120B06] p-4 sm:p-6 flex flex-col justify-between overflow-hidden select-none">
                  
                  {/* Photo Texture Backdrop (Wood Grain + Ambient Forest) */}
                  <div 
                    className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-luminosity filter blur-[1px]"
                    style={{ backgroundImage: "url('/images/stump-wood.jpg')" }}
                  />

                  {/* Blueprint Grid Overlay */}
                  <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#E8731A_1px,transparent_1px),linear-gradient(to_bottom,#E8731A_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

                  {/* Top Status & Gauges Bar */}
                  <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-[#20140B]/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-sand/15 shadow">
                    <div className="flex items-center gap-2 text-xs text-sand">
                      <span className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-orange animate-ping' : 'bg-sand/40'}`} />
                      <span className="font-bold text-[#FBF6EC] font-mono text-[11px]">
                        ENGINE: <span className={isPlaying ? 'text-green-400 font-bold' : 'text-amber-400'}>{isPlaying ? 'ENGAGED' : 'STANDBY'}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-sand/80">
                      <div>
                        CUTTER: <span className="text-orange font-bold">{currentStep.rpm} RPM</span>
                      </div>
                      <div>
                        GRADE DEPTH: <span className="text-emerald-400 font-bold">-{currentStep.depthInches}&quot; SUB</span>
                      </div>
                    </div>
                  </div>

                  {/* Center Stage: 3D Stump Cross-Section & Spinning Cutter Wheel */}
                  <div className="relative z-10 my-auto py-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    {/* Visual 1: 3D Stump Cross Section with Root Flares */}
                    <div className="relative flex flex-col items-center justify-center">
                      
                      {/* Laser Caliper Dimension Line across stump */}
                      <div className="relative w-44 sm:w-52 h-44 sm:h-52 flex items-center justify-center">
                        
                        {/* Underground radar ping waves (expanding when scanning root flares) */}
                        {currentStep.time >= 4 && (
                          <div className="absolute inset-0 rounded-full border border-forest/40 animate-radar pointer-events-none" />
                        )}

                        {/* Outer Bark & Root Flare Tentacles */}
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

                        {/* Laser Scan Line moving up and down */}
                        <div className="absolute w-36 h-0.5 bg-red-500 shadow-[0_0_8px_#ff0000] animate-laser pointer-events-none" />

                        {/* Core Diameter Badge in Center */}
                        <div className="relative z-10 px-2.5 py-1 rounded bg-black/80 border border-orange text-orange font-mono text-[11px] font-bold shadow-lg">
                          &Oslash; 24.0&quot; OAK
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-sand/70 mt-1 uppercase">
                        Core Trunk + Lateral Roots
                      </span>
                    </div>

                    {/* Visual 2: Spinning 3D Carbide Cutter Wheel with Flying Woodchips & Sparks */}
                    <div className="relative flex flex-col items-center justify-center">
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
                        
                        {/* 3D Tilted Cutter Wheel Hub */}
                        <div 
                          className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-[#4A3222] bg-gradient-to-tr from-[#1A120B] to-[#362013] shadow-2xl flex items-center justify-center ${
                            currentStep.isGrinding && isPlaying ? 'animate-spin-fast' : 'animate-spin-slow'
                          }`}
                        >
                          {/* 8 Tungsten Carbide Teeth projecting outwards */}
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

                        {/* Flying Woodchips and Sawdust Particles (active during grinding) */}
                        {currentStep.isGrinding && (
                          <div className="absolute inset-0 pointer-events-none">
                            <span className="absolute left-1/2 top-1/2 w-3 h-2 rounded bg-amber-200 border border-amber-600 animate-chip-1" />
                            <span className="absolute left-1/2 top-1/2 w-2.5 h-2.5 rounded bg-amber-400 border border-amber-800 animate-chip-2" />
                            <span className="absolute left-1/2 top-1/2 w-4 h-2 rounded bg-[#C49A6C] border border-[#7D4F35] animate-chip-3" />
                            <span className="absolute left-1/2 top-1/2 w-2 h-3 rounded bg-amber-300 animate-chip-4" />
                            
                            {/* Rock Strike Spark Flash */}
                            {currentStep.hasRockAlert && (
                              <div className="absolute left-2/3 top-1/3 w-8 h-8 rounded-full bg-yellow-300 blur-sm animate-spark" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className={`w-2 h-2 rounded-full ${currentStep.isGrinding ? 'bg-orange animate-ping' : 'bg-sand/30'}`} />
                        <span className="text-[10px] font-mono text-sand/80 uppercase">
                          {currentStep.isGrinding ? 'Grinding -12" Grade' : 'Cutter Positioned'}
                        </span>
                      </div>
                    </div>

                    {/* Visual 3: Live Bid Calculation HUD */}
                    <div className="bg-[#1C120B]/95 border-2 border-orange/60 rounded-2xl p-4 text-sand shadow-xl min-w-[210px] sm:min-w-[240px]">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sand/70">
                          INSTANT FIELD QUOTE
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
                        <div className="mt-2.5 px-2 py-1 rounded bg-red-950/80 border border-red-500/60 flex items-center gap-1.5 text-[10px] text-red-200 font-mono animate-pulse">
                          <ShieldAlert size={12} className="text-red-400 shrink-0" />
                          <span>ROCK HAZARD: +$56 TOOTH FUND</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stage Explanation Ticker */}
                  <div className="relative z-10 bg-[#1D130B]/90 border border-sand/15 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs text-[#FBF6EC]">
                    <Sparkles size={14} className="text-orange shrink-0 animate-bounce" />
                    <span className="font-sans font-medium">{currentStep.note}</span>
                  </div>

                  {/* Big Center Play Prompt when Paused at Start */}
                  {!isPlaying && currentTime === 0 && (
                    <div 
                      onClick={() => {
                        setIsPlaying(true);
                        playSoundEffect('grind');
                      }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[3px] flex flex-col items-center justify-center cursor-pointer z-30 group"
                    >
                      <div className="w-20 h-20 rounded-full bg-orange text-white flex items-center justify-center shadow-[0_0_30px_#E8731A] group-hover:scale-110 transition-transform">
                        <Play size={36} fill="#FFFFFF" className="ml-1" />
                      </div>
                      <span className="mt-4 text-xs sm:text-sm font-bold text-white uppercase tracking-wider bg-bark/90 px-4 py-2 rounded-full border border-orange/40 shadow">
                        Click to Play 16-Second 3D Quoting Simulation
                      </span>
                    </div>
                  )}

                  {/* Playback Scrub & Speed Controls */}
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
                      title="Restart simulation"
                    >
                      <RotateCcw size={13} />
                    </button>

                    <span className="font-mono text-[11px] shrink-0 text-orange font-bold">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>

                    {/* Scrubber Range */}
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

            {/* Right 4 Cols: Playbook Value Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#FBF6EC] border border-bark/15 rounded-2xl p-6 space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-forest font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 size={16} />
                  <span>The Ground Rule</span>
                </div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-bark leading-tight">
                  Never Guess on a Stump Again
                </h3>
                <p className="text-xs sm:text-sm text-bark/80 leading-relaxed font-sans">
                  The spreadsheet shown in the simulator works directly on your iPhone or Android. You enter the diameter, check the boxes, and quote the homeowner with zero math anxiety.
                </p>

                <div className="space-y-3 pt-2 text-xs text-bark/85 border-t border-bark/10">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>No Underquoting:</strong> Calculates root flares so you never chase roots for 45 minutes for free.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Carbide Tooth Fund:</strong> Adds \$20–\$60 into a replacement wear reserve when rocky soil is present.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 size={15} className="text-forest shrink-0 mt-0.5" />
                    <span><strong>Tight Gate Surcharge:</strong> Automatically bills \$35–\$75 for gates under 36&quot; requiring track ramps.</span>
                  </div>
                </div>

                <div className="pt-3">
                  <a
                    href="#pricing"
                    className="w-full py-3.5 px-4 rounded-xl bg-orange hover:bg-orange-hover text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all transform active:scale-95"
                  >
                    <span>Download Calculator &amp; Playbook Bundle &rarr;</span>
                  </a>
                </div>
              </div>

              {/* Step Quick-Jump Selector */}
              <div className="bg-[#24170E] border border-sand/15 rounded-2xl p-4 text-sand space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-sand/60 font-bold block">
                  Jump to Simulation Phase:
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

        {/* TAB 2: COMMERCIAL TRACKED GRINDER ACTION VIDEO */}
        {activeTab === 'video' && (
          <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border-2 border-bark/20 bg-bark">
            <div className="bg-[#24170E] px-4 py-3 flex items-center justify-between border-b border-sand/15 text-sand text-xs">
              <div className="flex items-center gap-2 font-mono">
                <Video size={14} className="text-orange" />
                <span className="font-bold text-[#FBF6EC]">Commercial 35HP Tracked Stump Cutter in Action</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-forest/30 text-green-300 font-mono text-[10px] font-bold">
                1080P FIELD CAPTURE
              </span>
            </div>

            <div className="relative aspect-video bg-black flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/r1r2c5t0?autoplay=0&rel=0&modestbranding=1"
                title="Commercial Stump Grinding Machine Field Operation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 sm:p-6 bg-[#1A120B] text-sand space-y-2">
              <h4 className="font-serif text-lg font-bold text-[#FBF6EC]">
                How Machine Wear &amp; Operating Cost Tie Directly to Your Formula
              </h4>
              <p className="text-xs sm:text-sm text-sand/80 leading-relaxed font-sans">
                Notice the flying woodchips and carbide teeth impact. A set of 16 Greenteeth or Vermeer teeth costs \$180–\$240 to replace. If you don&apos;t charge a tooth wear buffer on rocky soil or root flares, you are literally grinding away your profit. The Playbook teaches you the exact per-inch math to bill.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: FIELD JOB INSPECTION PHOTOS */}
        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#24170E] rounded-2xl overflow-hidden border border-sand/20 shadow-lg space-y-3 p-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-sand/10">
                <img
                  src="/images/stump-wood.jpg"
                  alt="24 Inch White Oak Stump with Lateral Root Flares"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-1 rounded bg-black/80 text-orange font-mono text-[10px] font-bold">
                  STEP 1: INSPECTION
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#FBF6EC]">
                Measuring the True Diameter
              </h4>
              <p className="text-xs text-sand/80 leading-relaxed font-sans">
                Never measure just the cut trunk. Measure root flare edge to root flare edge at lawn grade. That 18&quot; trunk is actually a 28&quot; grind.
              </p>
            </div>

            <div className="bg-[#24170E] rounded-2xl overflow-hidden border border-sand/20 shadow-lg space-y-3 p-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-sand/10">
                <img
                  src="/images/wood-chips.jpg"
                  alt="High volume wood chips from below grade grinding"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-1 rounded bg-black/80 text-green-400 font-mono text-[10px] font-bold">
                  STEP 2: 12&quot; SUB-GRADE
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#FBF6EC]">
                Full Depth Tooth Churn
              </h4>
              <p className="text-xs text-sand/80 leading-relaxed font-sans">
                Reaching 10–12 inches below lawn grade produces 3x the mulch volume. The Playbook includes the cleanup &amp; backfill fee matrix.
              </p>
            </div>

            <div className="bg-[#24170E] rounded-2xl overflow-hidden border border-sand/20 shadow-lg space-y-3 p-4">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-sand/10">
                <img
                  src="/images/tree-forest.jpg"
                  alt="Clean property restoration after grinding"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 px-2 py-1 rounded bg-black/80 text-amber-300 font-mono text-[10px] font-bold">
                  STEP 3: JOB COMPLETION
                </span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#FBF6EC]">
                Clean Yard &amp; Paid In Full
              </h4>
              <p className="text-xs text-sand/80 leading-relaxed font-sans">
                Customer hands you \$345 cash or pays via SMS invoice on the spot. You net \$255+ after gas and tooth reserve in under 50 minutes.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
