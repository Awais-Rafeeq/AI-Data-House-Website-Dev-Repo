import React, { useState, useEffect, useRef } from 'react';
import { SHOWCASE_FEATURES } from '../constants';
import { Check, ArrowRight } from 'lucide-react';

const FeatureShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const DURATION = 6000;

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const startTime = Date.now();
    
    intervalRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / DURATION) * 100;
      
      if (newProgress >= 100) {
        setActiveIndex((current) => (current + 1) % SHOWCASE_FEATURES.length);
        setProgress(0);
        startTimer();
      } else {
        setProgress(newProgress);
      }
    }, 50);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeIndex]);

  const handleTabClick = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  const activeFeature = SHOWCASE_FEATURES[activeIndex];

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-xs font-black tracking-[0.3em] text-emerald-600 uppercase mb-4">Core Ecosystem</h2>
          <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900">One Hub. All Your Automation.</h3>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-2 mb-12">
          {SHOWCASE_FEATURES.map((feature, idx) => (
            <button
              key={feature.id}
              onClick={() => handleTabClick(idx)}
              className={`relative flex-1 min-w-[150px] group px-6 py-4 rounded-2xl transition-all duration-300 text-left overflow-hidden ${activeIndex === idx ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
            >
              <div className="flex items-center gap-3 mb-2 relative z-10">
                <div className={`p-2 rounded-lg transition-colors ${activeIndex === idx ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500 group-hover:text-emerald-600'}`}>
                   {React.cloneElement(feature.icon as any, { size: 18 })}
                </div>
                <span className={`font-bold text-sm transition-colors ${activeIndex === idx ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                  {feature.title}
                </span>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100">
                {activeIndex === idx && (
                  <div 
                    className="h-full bg-emerald-600 transition-none"
                    style={{ width: `${progress}%` }}
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative min-h-[600px] flex flex-col lg:flex-row">
          <div className="p-10 lg:p-20 lg:w-1/2 flex flex-col justify-center text-white relative z-10 animate-in fade-in slide-in-from-left duration-700">
            <div className="inline-flex p-3 bg-emerald-600/20 text-emerald-400 rounded-2xl mb-8">
              {activeFeature.icon}
            </div>
            <h4 className="text-3xl md:text-4xl font-black mb-6 leading-tight">{activeFeature.title}</h4>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed">{activeFeature.description}</p>
            
            <ul className="space-y-4 mb-12">
              {activeFeature.features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 font-bold text-slate-300">
                  <div className="w-5 h-5 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                    <Check size={12} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <a 
              href={`#/services/${activeFeature.slug}`}
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = `#/services/${activeFeature.slug}`;
              }}
              className="inline-flex items-center gap-3 text-emerald-400 font-black uppercase tracking-widest text-sm hover:gap-5 transition-all cursor-pointer"
            >
              Learn about this solution <ArrowRight size={18} />
            </a>
          </div>

          <div className="lg:w-1/2 relative min-h-[400px] bg-slate-800">
            <img 
              key={activeFeature.id}
              src={activeFeature.image} 
              alt={activeFeature.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-luminosity animate-in fade-in zoom-in-110 duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-900"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;