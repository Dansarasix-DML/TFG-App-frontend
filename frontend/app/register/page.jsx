"use client";

import AuthCard from "@/components/auth/AuthCard";
import { useEffect, useRef, useState } from 'react';

const HCaptcha = ({ sitekey, onToken }) => {
  const captchaRef = useRef(null);

  useEffect(() => {
    const renderCaptcha = () => {
      window.hcaptcha.render(captchaRef.current, {
        sitekey,
        callback: (token) => {
          if (onToken) {
            onToken(token);
          }
        },
      });
    };

    if (!window.hcaptcha) {
      const script = document.createElement('script');
      script.src = 'https://js.hcaptcha.com/1/api.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        renderCaptcha();
      };

      return () => {
        document.body.removeChild(script);
      };
    } else {
      renderCaptcha();
    }
  }, [sitekey, onToken]);

  return <div ref={captchaRef} className="captcha"></div>;
};

export default function Page() {
  const [captchaSuccess, setCaptchaSuccess] = useState(false);

  const handleCaptchaToken = (token) => {
      // console.log('Received hCaptcha token:', token);
      // Puedes usar el token para validar con tu backend o algún otro proceso
      setCaptchaSuccess(true);
    };

  return (
  <>
      <AuthCard title="Registro" type="register" captchaStatus={captchaSuccess}>
          <HCaptcha
          sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
          onToken={handleCaptchaToken}
          />    
      </AuthCard>
  </>
  )
}


