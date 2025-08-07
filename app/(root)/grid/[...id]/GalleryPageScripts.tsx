'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function GalleryPageScripts() {
  const [jqueryLoaded, setJqueryLoaded] = useState(false);
  const [fancyboxLoaded, setFancyboxLoaded] = useState(false);
  const [customLoaded, setCustomLoaded] = useState(false);

  useEffect(() => {
    // Only proceed when both jQuery and Fancybox are loaded
    if (jqueryLoaded && fancyboxLoaded && !customLoaded) {
      console.log('All dependencies loaded, initializing gallery...');
      
      // Make sure $ is globally available
      if (typeof window !== 'undefined' && (window as any).jQuery) {
        (window as any).$ = (window as any).jQuery;
        
        // Debug logging
        console.log('Gallery debug script executing');
        console.log('jQuery available:', typeof (window as any).jQuery !== 'undefined');
        console.log('$ available:', typeof (window as any).$ !== 'undefined');
        console.log('Fancybox available:', typeof (window as any).jQuery.fancybox !== 'undefined');
      }
    }
  }, [jqueryLoaded, fancyboxLoaded, customLoaded]);

  return (
    <>
      <Script 
        src="/assets/js/jquery.min.js" 
        strategy="afterInteractive"
        onLoad={() => {
          console.log('jQuery loaded successfully');
          setJqueryLoaded(true);
        }}
        onError={() => {
          console.error('Failed to load jQuery');
        }}
      />
      
      {jqueryLoaded && (
        <Script 
          src="/assets/js/jquery.fancybox.min.js" 
          strategy="afterInteractive"
          onLoad={() => {
            console.log('Fancybox loaded successfully');
            setFancyboxLoaded(true);
          }}
          onError={() => {
            console.error('Failed to load Fancybox');
          }}
        />
      )}
      
      {jqueryLoaded && fancyboxLoaded && (
        <Script 
          src="/assets/js/custom.js"
          strategy="afterInteractive"
          onLoad={() => {
            console.log('Custom.js loaded successfully');
            setCustomLoaded(true);
          }}
          onError={() => {
            console.error('Failed to load custom.js');
          }}
        />
      )}
    </>
  );
}
