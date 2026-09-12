import katex from 'katex';
import { useMemo } from 'react';
import type { Latex } from '../types/entry';

interface MathExprProps {
  tex: Latex;
  /** Centred block formula rather than inline. */
  display?: boolean;
  className?: string;
}

/**
 * KaTeX rendering.
 *
 * KaTeX is synchronous, so formulas are laid out in the same frame as the text
 * around them - no reflow as the reader scrolls through steps. Errors render in
 * place instead of throwing, which makes a malformed formula obvious while
 * authoring without taking the page down.
 */
export function MathExpr({ tex, display = false, className }: MathExprProps) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: display,
        throwOnError: false,
        strict: 'ignore',
        output: 'htmlAndMathml',
      }),
    [tex, display],
  );

  return (
    <span
      className={`math ${display ? 'math--block' : 'math--inline'} ${className ?? ''}`}
      // KaTeX output is generated from our own content, not from user input.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
