import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * Back-to-top button.
 * - Fades in after ~600px of scroll.
 * - Fixed, bottom-right, 44×44px tap target.
 * - Smooth scroll; jumps instantly under prefers-reduced-motion.
 * - Keyboard-focusable with visible focus ring.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-lg
        bg-[var(--surface)] border border-[var(--hairline)]
        text-[var(--text-dim)] hover:text-[var(--text)] hover:border-[var(--cold)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--cold)]
        transition-all duration-200
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'}`}
      style={{ width: 44, height: 44 }}
      tabIndex={visible ? 0 : -1}
    >
      <ChevronUp size={20} />
    </button>
  );
}
