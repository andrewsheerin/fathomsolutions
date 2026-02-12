import React, { useEffect, useState } from 'react';

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m22 8-10 6L2 8"
      />
    </svg>
  );
}

function PhoneIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"
      />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.22 8.74H4.7V24H.22V8.74zM8.34 8.74H12.6V10.5h.06c.6-1.14 2.07-2.34 4.28-2.34 4.58 0 5.43 3.02 5.43 6.94V24H17.9v-7.35c0-1.75-.03-4-2.44-4-2.44 0-2.81 1.9-2.81 3.87V24H8.34V8.74z"
      />
    </svg>
  );
}

export default function Footer({ id }) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1500);
    return () => clearTimeout(t);
  }, [toast]);

  const copy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const tmp = document.createElement('textarea');
      tmp.value = value;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      tmp.remove();
    }
    setToast(label);
  };

  const year = new Date().getFullYear();

  return (
    <footer id={id} className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand" aria-label="Fathom Solutions">
          <img src="/images/inset_O_logo_white.png" alt="Fathom Solutions Logo" />
        </div>

        <p className="footer-tagline">Technical solutions for environmental resilience.</p>

        <hr className="footer-sep" aria-hidden="true" />

        <div className="footer-grid">
          <div className="footer-contact" aria-label="Contact methods">
            <button
              type="button"
              className="footer-link"
              onClick={() => copy('401-626-6827', 'Phone number copied')}
              aria-label="Copy phone number"
              title="Copy phone"
            >
              <PhoneIcon className="footer-icon" />
            </button>

            <button
              type="button"
              className="footer-link"
              onClick={() => copy('support@fathomsolutions.dev', 'Email copied')}
              aria-label="Copy email address"
              title="Copy email"
            >
              <MailIcon className="footer-icon" />
            </button>

            <a
              href="https://www.linkedin.com/company/fathomsolutionsllc/"
              target="_blank"
              rel="noopener"
              className="footer-link"
              aria-label="Fathom Solutions on LinkedIn"
              title="LinkedIn"
            >
              <LinkedInIcon className="footer-icon" />
            </a>
          </div>

          <a
            href="https://calendly.com/asheerin97/30min"
            target="_blank"
            rel="noopener"
            className="btn-primary footer-cta"
          >
            Schedule a Meeting
          </a>
        </div>

        <div className="footer-bottom">
          <small>© {year} Fathom Solutions. All rights reserved.</small>
        </div>
      </div>

      {toast && (
        <div className="copy-toast visible" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </footer>
  );
}
