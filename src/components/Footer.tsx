'use client';

import { ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Absolute Offroad';

  return (
    <footer className="bg-white border-t border-[var(--border-light)] py-6">
      <div className="container-content flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-caption text-[var(--system-gray)]">
          © {new Date().getFullYear()} {siteName}. 4x4 Fitment Centre.
        </p>
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-[var(--athens-gray)] text-[var(--shark)] flex items-center justify-center hover:bg-[var(--fill)] transition-colors focus-ring"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
