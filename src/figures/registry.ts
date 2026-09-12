import type { ComponentType } from 'react';
import type { FigureProps } from '../types/figure';
import { ArchimedeanFigure } from './ArchimedeanFigure';
import { BisectionFigure } from './BisectionFigure';
import { CauchyCriterionFigure, CauchyFigure } from './CauchyFigure';
import { EpsilonDeltaFigure } from './EpsilonDeltaFigure';
import { ExtremeValueFigure } from './ExtremeValueFigure';
import { PythagorasFigure } from './PythagorasFigure';
import { QIncompleteFigure } from './QIncompleteFigure';
import { IntermediateValueFigure } from './IntermediateValueFigure';
import { MonotoneFigure } from './MonotoneFigure';
import { SequenceLimitFigure } from './SequenceLimitFigure';
import { Sqrt2Figure } from './Sqrt2Figure';
import { HeineCantorFigure, UniformContinuityFigure } from './UniformContinuityFigure';
import { SupremumFigure } from './SupremumFigure';

/**
 * Figures are looked up by the id an entry declares. Entries stay plain data
 * and never import a component, so content and rendering can move separately.
 */
const FIGURES: Record<string, ComponentType<FigureProps>> = {
  pythagoras: PythagorasFigure,
  sqrt2: Sqrt2Figure,
  'epsilon-delta': EpsilonDeltaFigure,
  supremum: SupremumFigure,
  'q-incomplete': QIncompleteFigure,
  archimedean: ArchimedeanFigure,
  'extreme-value': ExtremeValueFigure,
  'sequence-limit': SequenceLimitFigure,
  monotone: MonotoneFigure,
  bisection: BisectionFigure,
  'uniform-continuity': UniformContinuityFigure,
  'heine-cantor': HeineCantorFigure,
  cauchy: CauchyFigure,
  'cauchy-criterion': CauchyCriterionFigure,
  'intermediate-value': IntermediateValueFigure,
};

export function getFigure(id: string | undefined): ComponentType<FigureProps> | undefined {
  return id ? FIGURES[id] : undefined;
}
