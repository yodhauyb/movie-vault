"use client";

import { useEffect, useRef } from "react";

export default function AdBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Agar ad pehle se load ho chuka hai, toh dobara load na kare
    if (!bannerRef.current || bannerRef.current.firstChild) return;

    // Ad Options script banana
    const conf = document.createElement("script");
    conf.type = "text/javascript";
    conf.innerHTML = `
      atOptions = {
        'key' : '58f792a62d4cb0f52a80f6dab3cc1041',
        'format' : 'iframe',
        'height' : 250,
        'width' : 300,
        'params' : {}
      };
    `;

    // Invoke script banana
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.highperformanceformat.com/58f792a62d4cb0f52a80f6dab3cc1041/invoke.js";
    script.async = true;

    // Dono scripts ko div ke andar daalna
    bannerRef.current.appendChild(conf);
    bannerRef.current.appendChild(script);
  }, []);

  return (
    <div className="flex justify-center items-center w-full py-4 bg-transparent overflow-hidden">
      <div ref={bannerRef} />
    </div>
  );
}