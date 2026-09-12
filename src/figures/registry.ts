import type { ComponentType } from 'react';
import type { FigureProps } from '../types/figure';
import { EpsilonDeltaFigure } from './EpsilonDeltaFigure';
import { PythagorasFigure } from './PythagorasFigure';
import { Sqrt2Figure } from './Sqrt2Figure';

/**
 * Figures are looked up by the id an entry declares. Entries stay plain data
 * and never import a component, so content and rendering can move separately.
 */
const FIGURES: Record<string, ComponentType<FigureProps>> = {
  pythagoras: PythagorasFigure,
  sqrt2: Sqrt2Figure,
  'epsilon-delta': EpsilonDeltaFigure,
};

export function getFigure(id: string | undefined): ComponentType<FigureProps> | undefined {
  return id ? FIGURES[id] : undefined;
}
