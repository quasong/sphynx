import type { ReactNode } from 'react';

interface FigureFrameProps {
  /** SVG user-space viewBox, e.g. "0 0 400 300". */
  viewBox: string;
  /** Accessible description of what the drawing shows. */
  title: string;
  /** Optional caption rendered below the drawing. */
  caption?: ReactNode;
  children: ReactNode;
}

/**
 * Outer frame for every figure: sizing, accessible name, and the one place
 * where the drawing's aspect ratio is handled.
 */
export function FigureFrame({ viewBox, title, caption, children }: FigureFrameProps) {
  return (
    <div className="figure">
      <svg className="figure__svg" viewBox={viewBox} role="img" aria-label={title}>
        <title>{title}</title>
        {children}
      </svg>
      {caption ? <p className="figure__caption">{caption}</p> : null}
    </div>
  );
}
