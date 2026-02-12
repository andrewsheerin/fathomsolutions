import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function MenuIcon({ open }) {
  return (
    <span className={open ? 'menu-icon is-open' : 'menu-icon'} aria-hidden="true">
      <span className="menu-line line-1" />
      <span className="menu-line line-2" />
      <span className="menu-line line-3" />
    </span>
  );
}

export default function Header({ visible, onNavigate, sectionIds }) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    document.body.classList.toggle('is-menu-open', open);
    return () => document.body.classList.remove('is-menu-open');
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    const onClickOutside = (e) => {
      const panel = panelRef.current;
      if (!panel) return;
      if (!panel.contains(e.target)) setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open]);

  const navItems = [
    { id: sectionIds.about, label: 'About' },
    { id: sectionIds.solutions, label: 'Solutions' },
    { id: sectionIds.projects, label: 'Projects' },
    { id: sectionIds.contact, label: 'Contact' },
  ];

  const go = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  const mobileMenu = open ? (
    <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Mobile menu">
      <div className="mobile-menu-panel" ref={panelRef}>
        <nav className="mobile-menu-nav" aria-label="Mobile">
          <ul className="mobile-menu-links">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  ) : null;

  return (
    <>
      <header className={`site-header ${visible ? 'is-visible' : ''}`} role="banner" aria-label="Site header">
        <a
          href="#top"
          className="compact-brand"
          aria-label="Fathom Solutions"
          onClick={(e) => {
            e.preventDefault();
            go('top');
          }}
        >
          <img src="/images/outside_logo_white.png" alt="Fathom Solutions Logo" />
        </a>

        <nav className="site-nav" aria-label="Primary">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    go(item.id);
                  }}
                >
                  {item.label.toUpperCase()}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="mobile-menu-btn"
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{ justifySelf: 'end' }}
        >
          <MenuIcon open={open} />
        </button>
      </header>

      {typeof document !== 'undefined' && createPortal(mobileMenu, document.body)}
    </>
  );
}
