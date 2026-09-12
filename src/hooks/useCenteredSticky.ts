import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

/**
 * The offset a pinned panel should stick at to sit centred in the viewport.
 *
 * Centring inside a viewport-tall box does the same job while the reader is
 * scrolling, but that box also occupies a full screen of height where the
 * column begins - so before anything is scrolled the panel hangs low with a
 * band of nothing above it. Giving the panel its natural height and pinning it
 * at a computed offset removes that: it starts at the top of its column and
 * settles into the middle of the screen once it sticks.
 *
 * Measured rather than declared because the offset depends on the panel's own
 * height, which changes with the figure, the caption, and how many hypotheses
 * an entry has.
 */
export function useCenteredSticky(ref: RefObject<HTMLElement | null>): number {
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

    const update = () => {
      // Read the header height from the stylesheet rather than repeating it, so
      // the two cannot drift apart.
      const header =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue('--topbar-h'),
        ) || 0;
      const slack = window.innerHeight - header - element.offsetHeight;
      setTop(header + Math.max(0, slack / 2));
    };

    update();
    // The offset does not affect the height, so this cannot feed back on itself.
    const observer = new ResizeObserver(update);
    observer.observe(element);
    window.addEventListener('resize', update);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [ref]);

  return top;
}
