'use client';

import { useEffect, useRef } from 'react';

export default function BannerAd468() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current || bannerRef.current.innerHTML !== '') return;

    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.innerHTML = `
      atOptions = {
        'key' : 'acec1bdab9ddc3eb4606318ee13d7115',
        'format' : 'iframe',
        'height' : 60,
        'width' : 468,
        'params' : {}
      };
    `;
    bannerRef.current.appendChild(confScript);

    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = 'https://blessingrecordpleasant.com/acec1bdab9ddc3eb4606318ee13d7115/invoke.js';
    bannerRef.current.appendChild(invokeScript);
  }, []);

  return (
    <div className="w-full flex justify-center items-center overflow-hidden my-4">
      <div ref={bannerRef} />
    </div>
  );
}