import { useEffect } from 'react';
import { GA_ID, CLARITY_ID } from '../config';

/**
 * Analytics component to handle Google Analytics and Microsoft Clarity integration.
 * It reads the IDs from config.ts
 */
export const Analytics = () => {
    useEffect(() => {
        // 1. Google Analytics (GA4)
        if (GA_ID && !document.getElementById('google-analytics')) {
            // Add gtag script
            const script1 = document.createElement('script');
            script1.id = 'google-analytics';
            script1.async = true;
            script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
            document.head.appendChild(script1);

            // Initialize gtag
            const script2 = document.createElement('script');
            script2.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}');
      `;
            document.head.appendChild(script2);
        }

        // 2. Microsoft Clarity
        if (CLARITY_ID && !document.getElementById('ms-clarity')) {
            const scriptClarity = document.createElement('script');
            scriptClarity.id = 'ms-clarity';
            scriptClarity.type = 'text/javascript';
            scriptClarity.innerHTML = `
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `;
            document.head.appendChild(scriptClarity);
        }
    }, []);

    return null;
};
