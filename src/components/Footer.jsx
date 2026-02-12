import React, { useEffect, useId, useMemo, useState } from 'react';

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

export default function Footer({ id, onNavigate }) {
  const [toast, setToast] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const formId = useId();

  // NOTE: Replace with your real Formspree endpoint (or another form backend).
  // Example: https://formspree.io/f/xxxxxxx
  const formEndpoint = useMemo(() => 'https://formspree.io/f/REPLACE_ME', []);

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

  const submit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    const form = e.currentTarget;

    try {
      const fd = new FormData(form);
      // Honeypot field: bots will often fill it.
      const hp = fd.get('company');
      if (hp) {
        setStatus('success');
        form.reset();
        return;
      }

      const res = await fetch(formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: fd,
      });

      if (!res.ok) throw new Error('Request failed');

      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer id={id} className="site-footer">
      <div className="container footer-inner">
        <button
          type="button"
          className="footer-brand"
          aria-label="Back to top"
          onClick={() => onNavigate && onNavigate('top')}
        >
          <img src="/images/inset_O_logo_white.png" alt="Fathom Solutions Logo" />
        </button>

        <p className="footer-tagline">Technical solutions for environmental resilience.</p>

        <hr className="footer-sep" aria-hidden="true" />

        <div className="footer-grid">
          <form className="contact-form" onSubmit={submit} aria-label="Send a message">
            <div className="contact-form-grid">
              <div className="field">
                <label htmlFor={`${formId}-name`}>Name</label>
                <input id={`${formId}-name`} name="name" type="text" autoComplete="name" required />
              </div>

              <div className="field">
                <label htmlFor={`${formId}-email`}>Email</label>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>

              {/* Honeypot */}
              <div className="field hp" aria-hidden="true">
                <label htmlFor={`${formId}-company`}>Company</label>
                <input id={`${formId}-company`} name="company" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <div className="field field--full">
                <label htmlFor={`${formId}-message`}>Message</label>
                <textarea id={`${formId}-message`} name="message" rows={5} required />
              </div>
            </div>

            <div className="contact-actions">
              <button type="submit" className="btn-primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>

              <a
                href="https://calendly.com/asheerin97/30min"
                target="_blank"
                rel="noopener"
                className="btn-secondary"
              >
                Schedule a meeting
              </a>

              {status === 'success' && <p className="form-status ok">Message sent. I’ll get back to you soon.</p>}
              {status === 'error' && (
                <p className="form-status err">
                  Something went wrong. You can email{' '}
                  <a href="mailto:support@fathomsolutions.dev">support@fathomsolutions.dev</a>.
                </p>
              )}
            </div>
          </form>

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
        </div>

        <div className="footer-bottom">
          <small>© {year} Fathom Solutions. All rights reserved.</small>

          <button type="button" className="to-top" onClick={() => onNavigate && onNavigate('top')} aria-label="Back to top">
            ↑
          </button>
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
