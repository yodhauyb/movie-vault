'use client';

export default function AdBanner() {
  // 🔥 300x250 वाला बैनर एड (यह Iframe में सेफ रहेगा)
  const adHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }
        </style>
      </head>
      <body>
        <script type="text/javascript">
          atOptions = {
            'key' : '58f792a62d4cb0f52a80f6dab3cc1041',
            'format' : 'iframe',
            'height' : 250,
            'width' : 300,
            'params' : {}
          };
        </script>
        <script type="text/javascript" src="https://www.highperformanceformat.com/58f792a62d4cb0f52a80f6dab3cc1041/invoke.js"></script>
      </body>
    </html>
  `;

  return (
    <div className="flex justify-center w-full my-8">
      <div className="border border-white/10 rounded-xl shadow-2xl bg-[#0b0f19] overflow-hidden flex items-center justify-center min-w-[300px] min-h-[250px]">
        <iframe 
          srcDoc={adHtml}
          width="300" 
          height="250" 
          className="border-0 bg-transparent"
          scrolling="no"
          frameBorder="0"
          sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
        />
      </div>
    </div>
  );
}