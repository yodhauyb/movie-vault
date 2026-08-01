'use client';

import { useEffect, useRef } from 'react';

export default function DoubleVerticalAds() {
  const ad1 = useRef<HTMLDivElement>(null);
  const ad2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 🔥 Type Error Fixed Here (HTMLDivElement | null)
    const loadAd = (containerRef: React.RefObject<HTMLDivElement | null>) => {
      if (!containerRef.current || containerRef.current.innerHTML !== '') return;
      
      const conf = document.createElement('script');
      conf.type = 'text/javascript';
      conf.innerHTML = `
        atOptions = {
          'key' : '63a805c34ccac77a613255e9f2148144',
          'format' : 'iframe',
          'height' : 600,
          'width' : 160,
          'params' : {}
        };
      `;
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://blessingrecordpleasant.com/63a805c34ccac77a613255e9f2148144/invoke.js';
      
      containerRef.current.appendChild(conf);
      containerRef.current.appendChild(script);
    };

    // पहला एड तुरंत लोड करो
    loadAd(ad1);

    // दूसरा एड आधा सेकंड (500ms) रुक कर लोड करो ताकि क्लैश ना हो
    const timer = setTimeout(() => {
      loadAd(ad2);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-8 md:gap-16 mt-16 mb-10">
      {/* 🚀 पहला 160x600 Ad */}
      <div 
        ref={ad1} 
        className="w-[160px] h-[600px] bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center" 
      />
      
      {/* 🚀 दूसरा 160x600 Ad */}
      <div 
        ref={ad2} 
        className="w-[160px] h-[600px] bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center" 
      />
    </div>
  );
}