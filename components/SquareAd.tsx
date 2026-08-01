'use client';

import { useEffect, useRef } from 'react';

export default function SquareAd() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current || adRef.current.innerHTML !== '') return;

    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : '58f792a62d4cb0f52a80f6dab3cc1041',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;
    adRef.current.appendChild(confScript);

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://blessingrecordpleasant.com/58f792a62d4cb0f52a80f6dab3cc1041/invoke.js';
    adRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div className="w-[300px] h-[250px] flex justify-center items-center bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
      <div ref={adRef} />
    </div>
  );
}